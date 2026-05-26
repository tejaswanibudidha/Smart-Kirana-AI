// Firebase Authentication Service for Smart Kirana
// Handles phone number OTP verification using Firebase Authentication

import {
  initializeApp,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  Auth,
  ConfirmationResult,
  User,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

// Service state
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is valid (not all demo keys)
const isFirebaseConfigValid = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('DemoKey') &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('your-project')
  );
};

/**
 * Initialize Firebase with proper error handling
 */
export const initializeFirebase = (): { success: boolean; message: string; configured: boolean } => {
  try {
    if (firebaseApp) {
      return { success: true, message: 'Firebase already initialized', configured: isFirebaseConfigValid() };
    }

    // Check if config is valid
    if (!isFirebaseConfigValid()) {
      console.warn('⚠️ Firebase config not properly configured. Using demo mode.');
      return {
        success: false,
        message: 'Firebase not configured. Please set environment variables.',
        configured: false,
      };
    }

    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    auth.languageCode = 'en';

    console.log('✅ Firebase initialized successfully');
    return { success: true, message: 'Firebase initialized', configured: true };
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error);
    return {
      success: false,
      message: `Firebase error: ${error.message}`,
      configured: false,
    };
  }
};

/**
 * Setup Recaptcha verifier for phone auth
 */
export const setupRecaptcha = (): { success: boolean; message: string } => {
  try {
    const initResult = initializeFirebase();
    if (!initResult.configured) {
      return {
        success: false,
        message: 'Firebase not configured',
      };
    }

    if (!auth) {
      throw new Error('Auth not initialized');
    }

    // Create invisible reCAPTCHA verifier
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (_response: string) => {
        console.log('Recaptcha verified');
      },
    } as any);

    recaptchaVerifier = verifier;

    console.log('✅ Recaptcha setup complete');
    return { success: true, message: 'Recaptcha ready' };
  } catch (error: any) {
    console.error('❌ Recaptcha setup error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send OTP to phone number
 */
export const sendOTPToPhone = async (
  phoneNumber: string
): Promise<{ success: boolean; message: string; verificationId?: string; requiresRecaptcha?: boolean }> => {
  try {
    const initResult = initializeFirebase();
    if (!initResult.configured) {
      return {
        success: false,
        message: 'Firebase not configured. Using demo mode. Please configure .env file.',
      };
    }

    if (!auth) {
      throw new Error('Auth not initialized');
    }

    // Ensure recaptcha is set up
    if (!recaptchaVerifier) {
      const recaptchaSetup = setupRecaptcha();
      if (!recaptchaSetup.success) {
        return {
          success: false,
          message: recaptchaSetup.message,
          requiresRecaptcha: true,
        };
      }
    }

    // Format phone number with country code
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone; // India country code
    }

    console.log(`📱 Sending OTP to ${formattedPhone}...`);

    // Send OTP
    if (!recaptchaVerifier) {
      throw new Error('Recaptcha verifier not initialized');
    }
    const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    confirmationResult = result;

    console.log('✅ OTP sent successfully');
    return {
      success: true,
      message: `OTP sent to ${phoneNumber}. Check your phone.`,
      verificationId: 'firebase_' + Date.now(),
    };
  } catch (error: any) {
    console.error('❌ OTP send error:', error);

    let userMessage = 'Failed to send OTP';

    if (error.code === 'auth/too-many-requests') {
      userMessage = 'Too many attempts. Please try again later.';
    } else if (error.code === 'auth/invalid-phone-number') {
      userMessage = 'Invalid phone number. Please check and try again.';
    } else if (error.message?.includes('recaptcha')) {
      userMessage = 'Recaptcha verification failed. Please try again.';
    } else {
      userMessage = error.message || userMessage;
    }

    return {
      success: false,
      message: userMessage,
    };
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  otp: string
): Promise<{ success: boolean; message: string; uid?: string; user?: User }> => {
  try {
    if (!confirmationResult) {
      return {
        success: false,
        message: 'Please send OTP first',
      };
    }

    console.log('🔐 Verifying OTP...');

    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    console.log('✅ Phone verified successfully, UID:', user.uid);

    return {
      success: true,
      message: 'Phone verified successfully',
      uid: user.uid,
      user: user,
    };
  } catch (error: any) {
    console.error('❌ OTP verification error:', error);

    let userMessage = 'Invalid OTP';

    if (error.code === 'auth/invalid-verification-code') {
      userMessage = 'Invalid or expired OTP. Please try again.';
    } else if (error.code === 'auth/code-expired') {
      userMessage = 'OTP expired. Please request a new one.';
    } else {
      userMessage = error.message || userMessage;
    }

    return {
      success: false,
      message: userMessage,
    };
  }
};

/**
 * Sign out current user
 */
export const firebaseSignOut = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const initResult = initializeFirebase();
    if (!initResult.configured) {
      return { success: true, message: 'Demo mode' };
    }

    if (!auth) {
      throw new Error('Auth not initialized');
    }

    await signOut(auth);
    confirmationResult = null;
    recaptchaVerifier = null;

    console.log('✅ Signed out successfully');
    return { success: true, message: 'Signed out successfully' };
  } catch (error: any) {
    console.error('❌ Sign out error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get current auth state
 */
export const getCurrentAuthState = (callback: (uid: string | null) => void) => {
  const initResult = initializeFirebase();
  if (!initResult.configured || !auth) {
    callback(null);
    return () => {}; // Return no-op unsubscribe
  }

  return onAuthStateChanged(auth, (user: User | null) => {
    callback(user ? user.uid : null);
  });
};

/**
 * Get configured status
 */
export const isFirebaseConfigured = (): boolean => {
  return isFirebaseConfigValid();
};

/**
 * Generate demo OTP for testing
 */
export const generateDemoOTP = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};
