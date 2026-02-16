import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Lock, Mail, ArrowRight, Building2, Loader2 } from 'lucide-react';

// Access global PostHog safely
const posthog = (window as any).posthog;

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLoginSuccess(data.user);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Trigger PostHog event upon successful reset request
      posthog?.capture('password_reset_requested', { email });
      setIsEmailSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-xl border border-corporate-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        
        {isEmailSent ? (
          <div className="text-center py-4 space-y-6">
            <div className="inline-flex p-5 bg-corporate-50 text-corporate-900 rounded-full mb-2 ring-1 ring-corporate-200">
              <Mail size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-serif text-corporate-900">Check your inbox</h1>
              <p className="text-corporate-500 text-sm leading-relaxed">
                We have sent a secure recovery link to <span className="font-bold text-corporate-900">{email}</span>. Please check your email to continue.
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => setIsEmailSent(false)}
                className="w-full py-4 bg-corporate-900 text-white font-medium rounded-lg hover:bg-corporate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                Back to Login
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex p-3 bg-corporate-900 text-white rounded-lg mb-4">
                <Building2 size={24} />
              </div>
              <h1 className="text-2xl font-serif text-corporate-900">Admin Portal</h1>
              <p className="text-corporate-500 text-sm mt-2">Authorized Access Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-300" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-corporate-50 border border-corporate-200 rounded-lg focus:ring-1 focus:ring-corporate-900 outline-none transition-all" 
                    placeholder="name@facilities.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Password</label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold uppercase tracking-widest text-corporate-400 hover:text-corporate-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-300" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-corporate-50 border border-corporate-200 rounded-lg focus:ring-1 focus:ring-corporate-900 outline-none transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-corporate-900 text-white font-medium rounded-lg hover:bg-corporate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={onBack}
              className="w-full mt-6 text-sm text-corporate-400 hover:text-corporate-900 transition-colors"
            >
              Back to Public Site
            </button>
          </>
        )}
      </div>
    </div>
  );
};