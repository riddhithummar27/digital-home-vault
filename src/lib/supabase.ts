import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyknwltoaropmdvhazlg.supabase.co';
const supabaseAnonKey = 'sb_publishable_61JSZqWWI0Wp59O_VC6pXg_cM9lEFFx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
