import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../../supabaseClient.js';

interface SignUpProps {
  onSuccess?: (email?: string) => void;
  onSwitchToSignIn?: (email?: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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
        // Basic error handling: display message under the form
        setError(signUpError.message);
      } else {
        // 1) Do NOT auto-login.
        // 2) Keep the email they used and mark signup as successful in session
        sessionStorage.setItem('allora_auth_email', email);
        sessionStorage.setItem('allora_signup_success', 'true');

        // Redirect to Sign In or Login view with pre-filled email
        if (onSwitchToSignIn) {
          onSwitchToSignIn(email);
        } else if (onSuccess) {
          onSuccess(email);
        } else {
          window.location.href = `/login?registered=true&email=${encodeURIComponent(email)}`;
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSignUp} className="space-y-4">
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
          <label className="block text-xs font-semibold text-purple-200 mb-1.5">Password</label>
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
          <span>{loading ? 'Creating account...' : 'Create Profile'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Error message under the form */}
        {error && (
          <p className="mt-2 text-xs text-red-400 text-center font-medium bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
