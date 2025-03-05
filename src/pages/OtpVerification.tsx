// src/pages/OtpVerification.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound } from 'lucide-react';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { sendSignUpOTP, verifyOTPAndSignUp } = useAuth();

  useEffect(() => {
    // Get email from location state or localStorage
    const storedEmail = localStorage.getItem('signupEmail');
    
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      setMessage('Verification code has been sent. Please check your inbox and spam folder.');
    } else if (storedEmail) {
      setEmail(storedEmail);
      setMessage('Please enter the verification code sent to your email.');
    } else {
      // No email found, redirect to signup
      navigate('/signup');
    }

    // Set up cooldown timer if active
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate, cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp) {
      setError('Email and verification code are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Verifying OTP for email: ${email}`);
      
      // Get stored signup data
      const signupDataStr = localStorage.getItem('signupData');
      if (!signupDataStr) {
        throw new Error('Signup data not found. Please try again.');
      }
      
      const signupData = JSON.parse(signupDataStr);
      
      // Verify OTP and create account
      await verifyOTPAndSignUp(
        email,
        otp,
        signupData.password,
        { name: signupData.name }
      );
      
      setMessage('Account created successfully! Redirecting to login...');
      
      // Clear stored data
      localStorage.removeItem('signupData');
      localStorage.removeItem('signupEmail');
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate('/login', { state: { accountCreated: true } });
      }, 2000);
      
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    
    if (!email) {
      setError('Email is required to resend verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Resending OTP to email: ${email}`);
      
      await sendSignUpOTP(email);
      
      setMessage('Verification code resent! Please check your inbox and spam folder.');
      setCooldown(60); // 60 second cooldown
      
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter the 6-digit code"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Verifying...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || loading}
              className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(cooldown > 0 || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend verification code'}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="text-sm text-green-600 hover:text-green-500"
            >
              Start over with a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;