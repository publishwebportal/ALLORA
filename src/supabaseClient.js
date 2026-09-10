import { createClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE CONFIGURATION
// Replace the values below with your Supabase Project credentials
// ============================================================================

// 1. PASTE YOUR SUPABASE PROJECT URL HERE:
// NOTE: Must be the base project URL (e.g. https://xxxx.supabase.co), NOT ending with /rest/v1/
const RAW_SUPABASE_URL = "https://auykmosezgcqgnwdecpr.supabase.co";

// 2. PASTE YOUR SUPABASE PUBLIC KEY (ANON KEY) HERE:
const SUPABASE_PUBLIC_KEY = "sb_publishable_zKTcTYXaZh26_7qzczfX4Q_urWht1J3";

// Clean URL function: strips accidental "/rest/v1" or trailing slashes
const sanitizeUrl = (url) => {
  if (!url) return url;
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
};

const SUPABASE_URL = sanitizeUrl(RAW_SUPABASE_URL);

// ============================================================================
// INITIALIZE & EXPORT SUPABASE CLIENT
// ============================================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
