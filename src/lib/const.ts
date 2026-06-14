export const MESSAGE_DECODERS: Record<number, (s: string) => string> = {
  1: (s: string) => atob(s),
  2: (s: string) => {
    return s.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65
      return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base)
    })
  },
}

export const DIFFICULTIES: string[] = [
  'Walk in the park',
  'Piece of cake',
  'Sure thing',
  'Quite likely',
  'Hmmm....',
  'Gamble',
  'Risky',
  'Playing with fire',
  'Rather detrimental',
  'Suicide mission',
] as const

export const MAX_DIFFICULTY = DIFFICULTIES.length - 1

export const RISK_WEIGHTS = {
  difficulty: 1,
  encrypted: 1,
}
