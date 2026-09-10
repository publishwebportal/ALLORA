import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Instagram } from 'lucide-react';
import { supabase } from '../../supabaseClient.js';

interface SignInProps {
  initialEmail?: string;
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onOpenInstagramLogin?: () => void;
}

/**
 * Protect private pages with supabase.auth.getSession()
 * If no session exists, redirects to /login.
 */
export const protectPrivatePage = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/login';
    return null;
  }
  return session;
};

/**
 * Higher-order component / wrapper to protect private views
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/login';
      } else {
        setIsAuthenticated(true);
      }
    });
  }, []);

  if (!isAuthenticated) return null;
  return <>{children}</>;
};

export const SignIn: React.FC<SignInProps> = ({
  initialEmail,
  onSuccess,
  onSwitchToSignUp,
  onOpenInstagramLogin,
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if the user comes from a successful signup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get('email');
    const isRegistered = params.get('registered') === 'true';

    const storedEmail = sessionStorage.getItem('allora_auth_email');
    const storedRegistered = sessionStorage.getItem('allora_signup_success') === 'true';

    const resolvedEmail = initialEmail || queryEmail || storedEmail || '';

    if (resolvedEmail) {
      setEmail(resolvedEmail);
    }

    if (isRegistered || storedRegistered) {
      setSuccessMessage(
        'Your account has been created. Please check your email and verify your address before logging in.'
      );
      sessionStorage.removeItem('allora_signup_success');
    }
  }, [initialEmail]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 2) For Login: Use supabase.auth.signInWithPassword({ email, password })
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Simple error handling under the form
        setError(signInError.message);
      } else {
        // Clear stored signup email on successful sign in
        sessionStorage.removeItem('allora_auth_email');
        if (onSuccess) onSuccess();
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in.');
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
    <div className="w-full">
      {/* Success message above the form when arriving from signup */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
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
            <button
              type="button"
              onClick={() => alert('Password reset email instruction requested. Check your email.')}
              className="text-[11px] text-pink-400 hover:underline"
            >
              Forgot password?
            </button>
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
          <span>{loading ? 'Signing in...' : 'Continue to ALLORA'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Error message under the form */}
        {error && (
          <div className="mt-2 text-xs text-red-400 font-medium bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg text-center space-y-1">
            <p>{error}</p>
            {error.toLowerCase().includes('provider') && (
              <p className="text-[11px] text-amber-300 font-normal mt-1 border-t border-red-500/20 pt-1">
                💡 Make sure Instagram provider is enabled in your Supabase Dashboard: <em>Authentication → Providers → Instagram</em>.
              </p>
            )}
          </div>
        )}
      </form>

      {/* Social Divider */}
      <div className="relative flex items-center justify-center my-4">
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
        className="w-full py-2.5 rounded-xl bg-[#1a0b33] border border-[#E4405F]/40 hover:border-[#E4405F] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all hover:bg-[#E4405F]/15 group cursor-pointer disabled:opacity-50"
      >
        <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform" />
        <span>Continue with Instagram</span>
      </button>

      {onSwitchToSignUp && (
        <div className="mt-4 text-center">
          <p className="text-xs text-purple-300/70">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-pink-400 hover:underline font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
