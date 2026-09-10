import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as clientFromClientFile } from '../supabaseClient.js';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are provided either via environment variables or in src/supabaseClient.js
const hasClientFileConfig = Boolean(
  (clientFromClientFile as any)?.supabaseUrl &&
  (clientFromClientFile as any).supabaseUrl.startsWith('https://') &&
  !(clientFromClientFile as any).supabaseUrl.includes('placeholder') &&
  (clientFromClientFile as any)?.supabaseKey &&
  !(clientFromClientFile as any).supabaseKey.includes('placeholder')
);

const hasEnvConfig = Boolean(
  envUrl &&
  envAnonKey &&
  envUrl.startsWith('https://') &&
  envUrl !== 'https://your-project.supabase.co'
);

export const isSupabaseConfigured = hasClientFileConfig || hasEnvConfig;

// Export the active Supabase client instance
export const supabase: SupabaseClient = clientFromClientFile as SupabaseClient;
