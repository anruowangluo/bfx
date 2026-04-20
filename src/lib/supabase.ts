import { createClient } from '@supabase/supabase-js'

// For now, using placeholder values - these should be replaced with actual Supabase project credentials
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)