import { decodeAd } from '@/lib/riskAnalysis'
import { describe, expect, it } from 'vitest'
import { DIFFICULTIES } from '@/lib/const'

describe('decodeAd', () => {
  it('returns message and probability as-is when not encrypted', () => {
    const result = decodeAd({
      message: 'Hello',
      probability: DIFFICULTIES.SURE_THING,
      encrypted: null,
    })
    expect(result).toEqual({
      decryptedMessage: 'Hello',
      decryptedProbability: DIFFICULTIES.SURE_THING,
    })
  })

  it('returns null fields when encrypted type has no decoder', () => {
    const result = decodeAd({
      message: 'Hello',
      probability: DIFFICULTIES.SURE_THING,
      encrypted: 99,
    })
    expect(result).toEqual({ decryptedMessage: null, decryptedProbability: null })
  })

  it('decodes type 1 (base64)', () => {
    const message = btoa('Hello')
    const probability = btoa(DIFFICULTIES.SURE_THING)
    const result = decodeAd({ message, probability, encrypted: 1 })
    expect(result).toEqual({
      decryptedMessage: 'Hello',
      decryptedProbability: DIFFICULTIES.SURE_THING,
    })
  })

  it('decodes type 2 (ROT13)', () => {
    const result = decodeAd({ message: 'Uryyb', probability: 'Fher guvat', encrypted: 2 })
    expect(result).toEqual({
      decryptedMessage: 'Hello',
      decryptedProbability: DIFFICULTIES.SURE_THING,
    })
  })

  it('returns null fields when decoder throws', () => {
    // invalid base64 will throw in atob
    const result = decodeAd({ message: '!!!invalid!!!', probability: '!!!', encrypted: 1 })
    expect(result).toEqual({ decryptedMessage: null, decryptedProbability: null })
  })

  it('handles encrypted: 0 as falsy - treats as unencrypted', () => {
    const result = decodeAd({
      message: 'Hello',
      probability: DIFFICULTIES.SURE_THING,
      encrypted: 0,
    })
    expect(result).toEqual({
      decryptedMessage: 'Hello',
      decryptedProbability: DIFFICULTIES.SURE_THING,
    })
  })
})
