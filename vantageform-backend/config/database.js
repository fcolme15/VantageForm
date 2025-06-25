const { createClient } = require('@supabase/supabase-js');

let supabase;

function initializeSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    console.error('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
    return null;
  }

  try {
    console.log('Initializing Supabase client...');
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

// Initialize on module load
supabase = initializeSupabase();

module.exports = { 
  supabase,
  initializeSupabase 
};