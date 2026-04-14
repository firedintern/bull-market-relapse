export type Outcome = 'waiting' | 'rekt' | 'right' | 'early'

export interface Call {
  id: string
  user_id: string
  asset: string
  date: string
  price: string | null
  quote: string | null
  outcome: Outcome
  created_at: string
}

export interface Profile {
  id: string
  username: string
  email: string | null
  twitter_handle: string | null
  twitter_image: string | null
  is_public: boolean
  created_at: string
}
