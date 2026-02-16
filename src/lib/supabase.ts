import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
const supabaseKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ??
  import.meta.env.PUBLIC_SUPABASE_KEY ??
  import.meta.env.SUPABASE_ANON_KEY ??
  import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY (or PUBLIC_SUPABASE_KEY).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
