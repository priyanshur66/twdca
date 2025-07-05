import { supabase, User, Trade } from './supabase'

// User operations
export async function checkUserExists(walletAddress: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error checking user:', error)
    return null
  }
}

export async function createUser(walletAddress: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          investment_amount: 0
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUserInvestment(walletAddress: string, newInvestmentAmount: number): Promise<User | null> {
  try {
    // First get the current investment amount
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('investment_amount')
      .eq('wallet_address', walletAddress)
      .single()

    if (fetchError) {
      console.error('Error fetching current investment:', fetchError)
      return null
    }

    // Calculate new total investment
    const totalInvestment = (currentUser.investment_amount || 0) + newInvestmentAmount

    // Update the user's investment amount
    const { data, error } = await supabase
      .from('users')
      .update({ investment_amount: totalInvestment })
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (error) {
      console.error('Error updating user investment:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating user investment:', error)
    return null
  }
}

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Trade operations
export async function createTrade(walletAddress: string, investmentAmount: number): Promise<Trade | null> {
  try {
    // First get the user ID
    const user = await getUserByWalletAddress(walletAddress)
    if (!user) {
      console.error('User not found for wallet address:', walletAddress)
      return null
    }

    const { data, error } = await supabase
      .from('trades')
      .insert([
        {
          user_id: user.id,
          wallet_address: walletAddress,
          investment: investmentAmount,
          profit: 0
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating trade:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating trade:', error)
    return null
  }
}

export async function getUserTrades(walletAddress: string): Promise<Trade[]> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching trades:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching trades:', error)
    return []
  }
}

export async function updateTradeProfit(tradeId: number, profit: number): Promise<Trade | null> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .update({ profit })
      .eq('id', tradeId)
      .select()
      .single()

    if (error) {
      console.error('Error updating trade profit:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating trade profit:', error)
    return null
  }
} 