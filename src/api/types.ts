export interface Game {
  gameId: string
  lives: number
  gold: number
  level: number
  score: number
  highScore: number
  turn: number
}

export interface Reputation {
  people: number
  state: number
  underworld: number
}

export interface Ad {
  adId: string
  message: string
  reward: number
  expiresIn: number
  encrypted: number | null
  probability: string
}

export interface SolveAdResponse {
  success: boolean
  lives: number
  gold: number
  score: number
  highScore: number
  turn: number
  message: string
}

export interface ShopItem {
  id: string
  name: string
  cost: number
}

export interface PurchaseItemResponse {
  shoppingSuccess: string
  gold: number
  lives: number
  level: number
  turn: number
}

export interface GameOverReason {
  reason: 'lost' | 'expired'
}

export interface ApiError {
  message: string
  status: number
  details?: unknown
}
