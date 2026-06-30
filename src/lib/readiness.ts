export interface ReadinessInput {
  completedModules: number
  totalModules: number
  passedTickets: number
  drivingHours: number
}

export function calcReadiness(input: ReadinessInput): number {
  const theory = input.totalModules > 0 ? input.completedModules / input.totalModules : 0
  const tickets = input.passedTickets / 40
  const driving = Math.min(input.drivingHours / 56, 1)
  const raw = 0.40 * theory + 0.35 * tickets + 0.25 * driving
  return Math.round(raw * 100)
}
