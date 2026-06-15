export interface SolveAdResponse {
  success: boolean
  lives: number
  gold: number
  score: number
  highScore: number
  turn: number
  message: string
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
