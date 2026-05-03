import { createClient } from "@supabase/supabase-js";

function cleanSupabaseUrl(value = "") {
  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "")
    .replace(/\/rest\/v1\/rest\/v1$/i, "");
}

const supabaseUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || "");
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
