// src/components/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uuudirolkzitnsxhoscf.supabase.co"
const supabaseKey = "sb_publishable_J7U82cIpygN6o1-j45rngA_WLMBOX78"

export const supabase = createClient(supabaseUrl, supabaseKey);