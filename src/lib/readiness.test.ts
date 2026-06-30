import { describe, it, expect } from 'vitest'
import { calcReadiness } from './readiness'

describe('calcReadiness', () => {
  it('returns 0 when nothing is done', () => {
    expect(calcReadiness({ completedModules: 0, totalModules: 6, passedTickets: 0, drivingHours: 0 })).toBe(0)
  })

  it('returns 100 when everything is complete', () => {
    expect(calcReadiness({ completedModules: 6, totalModules: 6, passedTickets: 40, drivingHours: 56 })).toBe(100)
  })

  it('caps driving hours at 56 (returns same as 56 for 100 hours)', () => {
    const a = calcReadiness({ completedModules: 6, totalModules: 6, passedTickets: 40, drivingHours: 100 })
    const b = calcReadiness({ completedModules: 6, totalModules: 6, passedTickets: 40, drivingHours: 56 })
    expect(a).toBe(b)
  })

  it('weights theory at 40%', () => {
    // Only theory done, rest 0
    const r = calcReadiness({ completedModules: 6, totalModules: 6, passedTickets: 0, drivingHours: 0 })
    expect(r).toBe(40)
  })

  it('weights tickets at 35%', () => {
    const r = calcReadiness({ completedModules: 0, totalModules: 6, passedTickets: 40, drivingHours: 0 })
    expect(r).toBe(35)
  })

  it('weights driving at 25%', () => {
    const r = calcReadiness({ completedModules: 0, totalModules: 6, passedTickets: 0, drivingHours: 56 })
    expect(r).toBe(25)
  })

  it('handles partial progress correctly', () => {
    // 3/6 modules (50%), 20/40 tickets (50%), 28/56 hours (50%)
    const r = calcReadiness({ completedModules: 3, totalModules: 6, passedTickets: 20, drivingHours: 28 })
    expect(r).toBe(50)
  })

  it('rounds to integer', () => {
    const r = calcReadiness({ completedModules: 1, totalModules: 6, passedTickets: 0, drivingHours: 0 })
    expect(Number.isInteger(r)).toBe(true)
  })

  it('handles zero totalModules gracefully', () => {
    const r = calcReadiness({ completedModules: 0, totalModules: 0, passedTickets: 0, drivingHours: 0 })
    expect(r).toBe(0)
  })
})
