export const ADS_DECODERS: Record<number, (s: string) => string> = {
  1: (s: string) => atob(s),
  2: (s: string) => {
    return s.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65
      return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base)
    })
  },
}

export const DIFFICULTIES = {
  WALK_IN_THE_PARK: 'Walk in the park',
  PIECE_OF_CAKE: 'Piece of cake',
  SURE_THING: 'Sure thing',
  QUITE_LIKELY: 'Quite likely',
  HMMM: 'Hmmm....',
  GAMBLE: 'Gamble',
  RISKY: 'Risky',
  PLAYING_WITH_FIRE: 'Playing with fire',
  RATHER_DETRIMENTAL: 'Rather detrimental',
  SUICIDE_MISSION: 'Suicide mission',
} as const

export const DIFFICULTY_ORDER: string[] = [
  DIFFICULTIES.WALK_IN_THE_PARK,
  DIFFICULTIES.PIECE_OF_CAKE,
  DIFFICULTIES.SURE_THING,
  DIFFICULTIES.QUITE_LIKELY,
  DIFFICULTIES.HMMM,
  DIFFICULTIES.GAMBLE,
  DIFFICULTIES.RISKY,
  DIFFICULTIES.PLAYING_WITH_FIRE,
  DIFFICULTIES.RATHER_DETRIMENTAL,
  DIFFICULTIES.SUICIDE_MISSION,
]

export const MAX_DIFFICULTY = DIFFICULTY_ORDER.length - 1

export const RISK_WEIGHTS = {
  difficulty: 1,
  encrypted: 1,
}
