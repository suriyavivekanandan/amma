import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Sign in anonymously to enable RLS policies
export const signInAnonymously = async () => {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: 'anonymous@example.com',
    password: 'anonymous123'
  });
  
  if (error) {
    console.error('Error signing in:', error);
    return null;
  }
  
  return session;
};