import { createClient } from "@supabase/supabase-js";

// NOTE: This file should ONLY be imported in Server Components or API Routes.
// It requires the Service Role Key which must NEVER be exposed to the client.

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Warn but don't crash the build. Runtime will fail if keys are missing.
  console.warn(
    "Missing Supabase Service Role Key - Admin operations will fail."
  );
}

// Create a client with the Service Role Key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
