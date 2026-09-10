-- ==============================================================================
-- ALLORA - Supabase Database Schema & Authentication Configuration
-- ==============================================================================
--
-- This script sets up the public.profiles table with Row Level Security (RLS)
-- and an automated trigger to create a profile when a new user signs up in auth.users.
--
-- To execute this in Supabase:
-- 1. Open your Supabase Dashboard: https://app.supabase.com
-- 2. Select your project -> SQL Editor -> Click 'New query'
-- 3. Paste this entire script and click 'Run'
-- ==============================================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Note: Passwords are NEVER stored in the profiles table.
-- Passwords are encrypted and managed exclusively inside Supabase auth.users.

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Automatically create profile upon auth.users signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INSTAGRAM OAUTH CONFIGURATION IN SUPABASE
-- ==============================================================================
-- To enable Instagram Login for ALLORA:
-- 1. Go to Meta for Developers (https://developers.facebook.com)
-- 2. Create an App -> Type: Consumer / Other
-- 3. Add Instagram Basic Display or Instagram Graph API
-- 4. Add OAuth Redirect URI from Supabase:
--    https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback
-- 5. In your Supabase Dashboard:
--    Navigate to: Authentication -> Providers -> Instagram
--    - Toggle Instagram to "Enabled"
--    - Enter your Client ID
--    - Enter your Client Secret
--    - Save changes
-- 6. Add your Supabase credentials to .env:
--    VITE_SUPABASE_URL=https://<your-project>.supabase.co
--    VITE_SUPABASE_ANON_KEY=<your-anon-key>
-- ==============================================================================
