import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Lock, CheckCircle, ArrowRight, Building2, Loader2, AlertCircle } from 'lucide-react';

interface ResetPasswordPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setIsSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-xl border border-corporate-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        
        {isSuccess ? (
          <div className="text-center py-4 space-y-6">
            <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full mb-2">
              <CheckCircle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-serif text-corporate-900">Password Updated</h1>
              <p className="text-corporate-500 text-sm leading-relaxed">
                Your credentials have been successfully reset. You can now access the management portal with your new password.
              </p>
            </div>
            <button 
              onClick={onSuccess}
              className="w-full py-4 bg-corporate-900 text-white font-medium rounded-lg hover:bg-corporate-800 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Return to Login
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex p-3 bg-corporate-900 text-white rounded-lg mb-4">
                <Building2 size={24} />
              </div>
              <h1 className="text-2xl font-serif text-corporate-900">Set New Password</h1>
              <p className="text-corporate-500 text-sm mt-2">Enter your new secure access key below</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-300" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-corporate-50 border border-corporate-200 rounded-lg focus:ring-1 focus:ring-corporate-900 outline-none transition-all" 
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-300" size={18} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-corporate-50 border border-corporate-200 rounded-lg focus:ring-1 focus:ring-corporate-900 outline-none transition-all" 
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-corporate-900 text-white font-medium rounded-lg hover:bg-corporate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Access Password
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={onBack}
              className="w-full mt-6 text-sm text-corporate-400 hover:text-corporate-900 transition-colors"
            >
              Cancel and Return
            </button>
          </>
        )}
      </div>
    </div>
  );
};