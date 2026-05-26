// MSG91 Authentication Service for Smart Kirana
// Handles sending and verifying OTP over MSG91

const msg91AuthKey = import.meta.env.VITE_MSG91_AUTH_KEY;
const msg91TemplateId = import.meta.env.VITE_MSG91_TEMPLATE_ID;
const msg91CountryCode = import.meta.env.VITE_MSG91_COUNTRY_CODE || '91';

const isMsg91ConfigValid = (): boolean => {
  return !!(
    msg91AuthKey &&
    !msg91AuthKey.includes('YOUR_') &&
    msg91TemplateId &&
    !msg91TemplateId.includes('YOUR_')
  );
};

const formatPhoneNumber = (phoneNumber: string): string => {
  let formatted = phoneNumber.trim().replace(/\D/g, '');
  if (!formatted.startsWith(msg91CountryCode)) {
    formatted = `${msg91CountryCode}${formatted}`;
  }
  return formatted;
};

const buildErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as any).message || defaultMessage;
  }
  return defaultMessage;
};

export const isMsg91Configured = (): boolean => {
  return isMsg91ConfigValid();
};

export const sendOTPViaMsg91 = async (
  phoneNumber: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isMsg91ConfigValid()) {
      return {
        success: false,
        message: 'MSG91 is not configured. Please provide VITE_MSG91_AUTH_KEY and VITE_MSG91_TEMPLATE_ID.',
      };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const url = 'https://api.msg91.com/api/v5/otp';
    const payload = {
      mobile: formattedPhone,
      template_id: msg91TemplateId,
      otp_length: '6',
      otp_expiry: '5',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: msg91AuthKey as string,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data && data.type && data.type !== 'success')) {
      return {
        success: false,
        message: data.message || data.error || 'Failed to send OTP via MSG91',
      };
    }

    return {
      success: true,
      message: data.message || 'OTP sent successfully via MSG91',
    };
  } catch (error) {
    return {
      success: false,
      message: buildErrorMessage(error, 'Failed to send OTP via MSG91'),
    };
  }
};

export const verifyOTPViaMsg91 = async (
  phoneNumber: string,
  otp: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isMsg91ConfigValid()) {
      return {
        success: false,
        message: 'MSG91 is not configured. Please provide VITE_MSG91_AUTH_KEY and VITE_MSG91_TEMPLATE_ID.',
      };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const url = new URL('https://api.msg91.com/api/v5/otp/verify');
    url.searchParams.set('mobile', formattedPhone);
    url.searchParams.set('otp', otp);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        authkey: msg91AuthKey as string,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data && data.type && data.type !== 'success')) {
      return {
        success: false,
        message: data.message || data.error || 'Failed to verify OTP via MSG91',
      };
    }

    return {
      success: true,
      message: data.message || 'OTP verified successfully via MSG91',
    };
  } catch (error) {
    return {
      success: false,
      message: buildErrorMessage(error, 'Failed to verify OTP via MSG91'),
    };
  }
};
