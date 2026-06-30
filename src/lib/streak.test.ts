import { describe, it, expect, vi, afterEach } from 'vitest'
import { updateStreak } from './streak'

// Use noon local time to avoid timezone edge cases
const FAKE_NOW = new Date(2026, 5, 29, 12, 0, 0) // 2026-06-29 12:00 local
const TODAY = '2026-06-29'
const YESTERDAY = '2026-06-28'
const TWO_DAYS_AGO = '2026-06-27'

vi.useFakeTimers()
vi.setSystemTime(FAKE_NOW)

afterEach(() => { vi.clearAllTimers() })

describe('updateStreak', () => {
  it('starts streak at 1 for first-time user', () => {
    const r = updateStreak(null, 0)
    expect(r.streak).toBe(1)
    expect(r.lastActive).toBe(TODAY)
  })

  it('keeps streak unchanged if already active today', () => {
    const r = updateStreak(TODAY, 5)
    expect(r.streak).toBe(5)
    expect(r.lastActive).toBe(TODAY)
  })

  it('increments streak when active on consecutive day', () => {
    const r = updateStreak(YESTERDAY, 4)
    expect(r.streak).toBe(5)
    expect(r.lastActive).toBe(TODAY)
  })

  it('resets streak to 1 when gap is more than 1 day', () => {
    const r = updateStreak(TWO_DAYS_AGO, 10)
    expect(r.streak).toBe(1)
    expect(r.lastActive).toBe(TODAY)
  })

  it('resets streak for very old last active date', () => {
    const r = updateStreak('2026-01-01', 30)
    expect(r.streak).toBe(1)
  })
})
