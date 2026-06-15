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

export interface ShopItem {
  id: string
  name: string
  cost: number
}
