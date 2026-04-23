import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anonKey) throw new Error('Supabase env vars are not set')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

// Public client — for browser/public reads
export const supabase = createClient(url, anonKey)

// Admin client — bypasses RLS, for server-side API routes only
export const supabaseAdmin = createClient(url, serviceKey)
