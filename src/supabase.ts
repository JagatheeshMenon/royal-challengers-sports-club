import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration in .env file');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
}
