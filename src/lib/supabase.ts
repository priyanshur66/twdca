import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: number
  wallet_address: string
  investment_amount: number
  created_at: string
  updated_at: string
}

export interface Trade {
  id: number
  user_id: number
  wallet_address: string
  investment: number
  profit: number
  created_at: string
  updated_at: string
} 