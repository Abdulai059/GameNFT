// Web3 Types
export interface MintResult {
  success: boolean
  transaction?: string
  account?: string
  error?: string
}

// NFT Types
export interface NFT {
  id: number
  name: string
  image: string
  price: number
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic"
  traits: string[]
  xp?: number
  level?: number
  isBorrowed?: boolean
  lender?: string
  borrower?: string
  borrowExpiration?: Date
}

// Auth Types
export interface User {
  id: string
  email: string
}

export interface AuthResult {
  error: any | null
}

// Referral Types
export interface ReferralInfo {
  referrer: string
  rewards: number
}

