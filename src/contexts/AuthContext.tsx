// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // Two-step registration process
  sendSignUpOTP: (email: string) => Promise<void>;
  verifyOTPAndSignUp: (email: string, token: string, password: string, userData: any) => Promise<void>;
  // Original methods
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event);
          setSession(session);
          setUser(session?.user || null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkUser();
  }, []);

  // Original signUp method (kept for backward compatibility)
  const signUp = async (email: string, password: string, name: string) => {
    console.log("Signing up user with email:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/verify`
      }
    });

    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
    console.log("Signup successful, verification email should be sent");
    return data;
  };

  // Step 1: Send OTP to email
  const sendSignUpOTP = async (email: string) => {
    console.log("Sending signup OTP to:", email);
    
    try {
      // Store email in localStorage for verification step
      localStorage.setItem('signupEmail', email);
      
      // Send OTP to email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Don't create a session yet, just send the OTP
          shouldCreateUser: false
        }
      });
      
      if (error) {
        console.error("Error sending OTP:", error);
        throw error;
      }
      
      console.log("OTP sent successfully to:", email);
    } catch (error) {
      console.error("Exception sending OTP:", error);
      throw error;
    }
  };

  // Step 2: Verify OTP and create account
  const verifyOTPAndSignUp = async (email: string, token: string, password: string, userData: any) => {
    console.log("Verifying OTP and creating account for:", email);
    
    try {
      // First verify the OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      
      if (verifyError) {
        console.error("OTP verification error:", verifyError);
        throw verifyError;
      }
      
      console.log("OTP verified successfully, creating account");
      
      // Now create the account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (signUpError) {
        console.error("Account creation error:", signUpError);
        throw signUpError;
      }
      
      console.log("Account created successfully:", data);
      
      // Clear the stored email
      localStorage.removeItem('signupEmail');
      
      return data;
    } catch (error) {
      console.error("Exception in verification and signup:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Signing in user with email:", email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }
    
    console.log("Sign in successful");
  };

  const signOut = async () => {
    console.log("Signing out user");
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    
    console.log("Sign out successful");
  };

  const resetPassword = async (email: string) => {
    console.log("Resetting password for email:", email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error("Reset password error:", error);
      throw error;
    }
    
    console.log("Password reset email sent");
  };

  const verifyOtp = async (email: string, token: string) => {
    console.log(`Verifying OTP for email: ${email}`);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });

    if (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
    
    console.log("OTP verification successful");
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    verifyOtp,
    sendSignUpOTP,
    verifyOTPAndSignUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}