import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  // Provide a fallback for development
  window.location.href = '/auth/error?message=missing_config';
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  // Provide a fallback for development
  window.location.href = '/auth/error?message=missing_config';
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);