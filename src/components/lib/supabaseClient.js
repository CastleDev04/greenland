import { createClient } from '@supabase/supabase-js'
import 'dotenv'

// const supabaseUrl =  
// const supabaseKey = 'TU_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)