import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Missing Supabase environment variables - using placeholders");
}

// Public client - Safe for browser usage
export const supabase = createClient(supabaseUrl, supabaseKey);
