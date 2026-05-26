import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle } from 'lucide-react';
import { User } from '../../types';
import { mockDB } from '../../services/database';
import {
  sendOTPToPhone,
  verifyOTP,
  generateDemoOTP,
  isFirebaseConfigured,
  setupRecaptcha,
} from '../../services/firebaseAuth';
import {
  sendOTPViaMsg91,
  verifyOTPViaMsg91,
  isMsg91Configured,
} from '../../services/msg91Auth';

interface LoginScreenProps {
  onUserCreated: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onUserCreated }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [shopName, setShopName] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firebaseConfigured, setFirebaseConfigured] = useState(false);
  const [msg91Configured, setMsg91Configured] = useState(false);
  const [useDemoMode, setUseDemoMode] = useState(false);

  // Initialize auth mode and setup required services on mount
  useEffect(() => {
    const msg91Enabled = isMsg91Configured();
    setMsg91Configured(msg91Enabled);

    if (msg91Enabled) {
      setUseDemoMode(false);
      setFirebaseConfigured(false);
      return;
    }

    const isConfigured = isFirebaseConfigured();
    setFirebaseConfigured(isConfigured);

    if (isConfigured) {
      try {
        const recaptchaSetup = setupRecaptcha();
        if (!recaptchaSetup.success) {
          console.warn('Recaptcha setup warning:', recaptchaSetup.message);
          setUseDemoMode(true);
        }
      } catch (err) {
        console.warn('Recaptcha setup failed, will use demo mode:', err);
        setUseDemoMode(true);
      }
    } else {
      setUseDemoMode(true);
      setDemoOtp(generateDemoOTP());
    }
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (useDemoMode) {
        // Demo mode - just proceed to OTP step
        setDemoOtp(generateDemoOTP());
        setStep('otp');
        setError('ℹ️ Demo Mode: OTP shown below');
      } else if (msg91Configured) {
        const result = await sendOTPViaMsg91(phone);
        if (result.success) {
          setStep('otp');
          setError('✅ OTP sent to your phone via MSG91!');
        } else {
          setError(result.message || 'Failed to send OTP');
        }
      } else if (firebaseConfigured) {
        const result = await sendOTPToPhone(phone);
        if (result.success) {
          setStep('otp');
          setError('✅ OTP sent to your phone!');
        } else {
          setError(result.message || 'Failed to send OTP');
        }
      } else {
        setDemoOtp(generateDemoOTP());
        setStep('otp');
        setError('ℹ️ Demo Mode: OTP shown below');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      if (useDemoMode) {
        // Demo mode - verify against generated OTP
        if (otp === demoOtp) {
          setStep('name');
          setError('');
        } else {
          setError(`❌ Invalid OTP. Correct OTP is: ${demoOtp}`);
        }
      } else if (msg91Configured) {
        const result = await verifyOTPViaMsg91(phone, otp);
        if (result.success) {
          setStep('name');
          setError('');
        } else {
          setError(result.message || 'Failed to verify OTP');
        }
      } else if (firebaseConfigured) {
        const result = await verifyOTP(otp);
        if (result.success) {
          setStep('name');
          setError('');
        } else {
          setError(result.message || 'Failed to verify OTP');
        }
      } else {
        if (otp === demoOtp) {
          setStep('name');
          setError('');
        } else {
          setError(`❌ Invalid OTP. Correct OTP is: ${demoOtp}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!shopName.trim()) {
      setError('Please enter shop name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user exists
      let user = mockDB.getUserByPhone(phone);
      if (!user) {
        user = mockDB.createUser(phone, shopName);
      } else {
        user = mockDB.updateUser(user.id, { shopName });
      }
      setLoading(false);
      onUserCreated(user);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🏪</div>
          <h1 className="text-3xl font-bold text-gray-800">Smart Kirana</h1>
          <p className="text-gray-600 text-sm mt-2">AI-powered Inventory Management</p>
        </div>

        {/* Firebase/Demo Mode Status */}
        <div className={`mb-6 p-3 rounded-lg border ${
          (msg91Configured && !useDemoMode) || (firebaseConfigured && !useDemoMode)
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start space-x-2">
            <span className="text-lg mt-1">{msg91Configured ? '📲' : firebaseConfigured && !useDemoMode ? '🔐' : '📱'}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {msg91Configured
                  ? 'MSG91 OTP Mode'
                  : firebaseConfigured && !useDemoMode
                  ? 'Firebase OTP Mode'
                  : 'Demo Mode'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {msg91Configured
                  ? '✅ OTP will be sent via MSG91 SMS'
                  : firebaseConfigured && !useDemoMode
                  ? '✅ Real OTP will be sent to your phone'
                  : '⚠️ Testing mode - OTP shown on screen'}
              </p>
            </div>
          </div>
          {!msg91Configured && !firebaseConfigured && (
            <p className="text-xs text-gray-500 mt-2 italic">
              💡 To enable a real OTP service, configure MSG91 or Firebase environment variables
            </p>
          )}
          {useDemoMode && demoOtp && (
            <p className="text-xs text-blue-600 mt-2 font-semibold">
              Demo OTP: <span className="font-bold text-lg text-blue-700">{demoOtp}</span>
            </p>
          )}
        </div>

        {/* Error/Info Message */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg border ${
            error.includes('✅')
              ? 'bg-green-100 border-green-400 text-green-700'
              : error.includes('ℹ️')
              ? 'bg-blue-100 border-blue-400 text-blue-700'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Recaptcha Container */}
        {firebaseConfigured && <div id="recaptcha-container"></div>}

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Welcome! Enter Your Phone
            </h2>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-blue-500" size={24} />
              <input
                type="tel"
                placeholder="Enter 10-digit phone"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={phone.length !== 10 || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-lg text-lg transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Enter OTP
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              OTP sent to <span className="font-bold">{phone}</span>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="w-full px-4 py-4 text-lg tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center"
            />
            {useDemoMode && demoOtp && (
              <p className="text-center text-blue-600 text-xs font-semibold">
                📱 Demo OTP: <span className="text-blue-700 text-base">{demoOtp}</span>
              </p>
            )}
            {!useDemoMode && msg91Configured && (
              <p className="text-center text-green-600 text-xs font-semibold">
                ✅ Check your phone for the OTP sent via MSG91
              </p>
            )}
            {!useDemoMode && !msg91Configured && firebaseConfigured && (
              <p className="text-center text-green-600 text-xs font-semibold">
                ✅ Check your phone for the OTP
              </p>
            )}
            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-lg text-lg transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
            >
              Back
            </button>
          </div>
        )}

        {/* Shop Name Step */}
        {step === 'name' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle className="text-green-500 mx-auto" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              Enter your shop name
            </p>
            <input
              type="text"
              placeholder="Your Shop Name"
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleCreateUser}
              disabled={!shopName.trim() || loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-lg text-lg transition"
            >
              {loading ? 'Creating Account...' : 'Continue to App'}
            </button>
            <button
              onClick={() => {
                setStep('otp');
                setShopName('');
                setError('');
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
