export type AccountType = 'personal' | 'company'
export type Plan = 'free' | 'pro_individual' | 'pro_company'

export interface Profile {
  id: string
  user_id: string
  username: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  account_type: AccountType
  is_pro: boolean
  plan: Plan
  whatsapp: string | null
  created_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  icon: string | null
  display_order: number
  is_active: boolean
}

export interface Service {
  id: string
  user_id: string
  title: string
  description: string | null
  is_active: boolean
}

export interface ProfileView {
  id: string
  profile_id: string
  viewed_at: string
}

export interface ScannedCard {
  name: string | null
  phone: string | null
  email: string | null
  company: string | null
  title: string | null
  website: string | null
}
