import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://malcggmelsviujxawpwr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbGNnZ21lbHN2aXVqeGF3cHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NzQzNzUsImV4cCI6MjA4MDE1MDM3NX0.JUiDWNPycu7_Oauj7Xfx70TM5x8CvrD087q4N8RRjbQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});
