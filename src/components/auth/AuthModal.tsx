import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Sparkles, Instagram, ArrowRight } from 'lucide-react';
import { supabase } from '../../supabaseClient.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupabaseDocs: () => void;
  onOpenInstagramLogin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenSupabaseDocs,
  onOpenInstagramLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // 1) For Sign Up: Use supabase.auth.signUp({ fullName, email, password })
        const { data, error: signUpError } = await (supabase.auth.signUp as any)({
          fullName,
          email,
          password,
          options: {
            data: {
              fullName,
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          // 1) Do NOT auto-login.
          // 2) Switch to login mode, pre-fill email, show success message
          setMode('login');
          setPassword('');
          setInfoMessage(
            'Your account has been created. Please check your email and verify your address before logging in.'
          );
        }
      } else {
        // 2) For Login: Use supabase.auth.signInWithPassword({ email, password })
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          // 3) After successful login: Redirect the user to the Home page ("/")
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstagramLogin = async () => {
    if (onOpenInstagramLogin) {
      onOpenInstagramLogin();
      return;
    }
    window.location.href = '/instagram-login';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="auth-modal-dialog"
        className="w-full max-w-md glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(236,72,153,0.25)] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-purple-500/20 bg-[#120826]/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-none">
                {mode === 'login' ? 'Sign In to ALLORA' : 'Create ALLORA Account'}
              </h3>
              <p className="text-[11px] text-purple-300/80 mt-1">
                Powered by Supabase Auth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-500/20 bg-[#0e061e]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              mode === 'login'
                ? 'text-pink-400 border-b-2 border-pink-500 bg-pink-500/10'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              mode === 'signup'
                ? 'text-pink-400 border-b-2 border-pink-500 bg-pink-500/10'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5 bg-[#120826]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Elena Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a0f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1a0f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-purple-200">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset email instruction requested. Check your email.')}
                    className="text-[11px] text-pink-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1a0f33] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Continue to ALLORA'
                  : 'Create Profile'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Info message when session is null */}
            {infoMessage && (
              <p className="mt-3 text-xs text-pink-300 text-center font-medium bg-pink-950/40 border border-pink-500/40 p-2.5 rounded-lg">
                {infoMessage}
              </p>
            )}

            {/* Error message under the form */}
            {error && (
              <div className="mt-3 text-xs text-red-400 font-medium bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg text-center space-y-1">
                <p>{error}</p>
                {error.toLowerCase().includes('rate limit') && (
                  <p className="text-[11px] text-amber-300 font-normal mt-1 border-t border-red-500/20 pt-1">
                    💡 Supabase free tier limits confirmation emails to 3–4 per hour. To test freely, disable <strong>"Confirm email"</strong> in your Supabase Dashboard: <em>Authentication → Providers → Email</em>.
                  </p>
                )}
              </div>
            )}
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-purple-500/20"></div>
            <span className="absolute px-3 bg-[#120826] text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Instagram OAuth Button */}
          <button
            type="button"
            onClick={handleInstagramLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#1a0b33] border border-[#E4405F]/40 hover:border-[#E4405F] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all hover:bg-[#E4405F]/15 group cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform" />
            <span>Continue with Instagram</span>
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenSupabaseDocs}
              className="text-[11px] text-purple-400 hover:text-pink-300 underline"
            >
              How Supabase Auth & Instagram OAuth work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
