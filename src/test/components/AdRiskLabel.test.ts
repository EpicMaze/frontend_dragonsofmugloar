import { describe, it, expect } from 'vitest'
import { mountWithPinia } from '../wrappers'
import AdRiskLabel from '@/components/game/AdRiskLabel.vue'
import { MAX_RISK_SCORE } from '@/lib/const'

const baseBreakdown = { difficultyLevel: 0, isEncrypted: false }

describe('AdRiskLabel', () => {
  it('shows SAFE for score at 25% of max', () => {
    const score = MAX_RISK_SCORE * 0.1
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: { score, breakDown: baseBreakdown, notes: null },
    })
    expect(wrapper.text()).toContain('SAFE')
  })

  it('shows MODERATE for score at 50% of max', () => {
    const score = MAX_RISK_SCORE * 0.4
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: { score, breakDown: baseBreakdown, notes: null },
    })
    expect(wrapper.text()).toContain('MODERATE')
  })

  it('shows RISKY for score at 75% of max', () => {
    const score = MAX_RISK_SCORE * 0.6
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: { score, breakDown: baseBreakdown, notes: null },
    })
    expect(wrapper.text()).toContain('RISKY')
  })

  it('shows CRITICAL for max score', () => {
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: { score: MAX_RISK_SCORE, breakDown: baseBreakdown, notes: null },
    })
    expect(wrapper.text()).toContain('CRITICAL')
  })

  it('shows unknown note when difficultyLevel note present', () => {
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: {
        score: MAX_RISK_SCORE,
        breakDown: { difficultyLevel: 9, isEncrypted: false },
        notes: { difficultyLevel: 'unknown' },
      },
    })
    expect(wrapper.text()).toContain('unknown')
  })

  it('shows +1 for encrypted', () => {
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: {
        score: 1,
        breakDown: { difficultyLevel: 0, isEncrypted: true },
        notes: null,
      },
    })
    expect(wrapper.text()).toContain('+1')
  })

  it('shows +0 for not encrypted', () => {
    const { wrapper } = mountWithPinia(AdRiskLabel, {
      props: {
        score: 0,
        breakDown: { difficultyLevel: 0, isEncrypted: false },
        notes: null,
      },
    })
    expect(wrapper.text()).toContain('+0')
  })
})
