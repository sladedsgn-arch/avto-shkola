import { achievementRepo } from '@/db/repositories'

export interface AchievementCheckContext {
  userId: number
  examPassed?: boolean
  streak?: number
  bookmarkCount?: number
  totalAnswered?: number
  perfectExam?: boolean
  readiness?: number
}

const CONDITIONS: Record<string, (ctx: AchievementCheckContext) => boolean> = {
  first_exam_passed: ctx => ctx.examPassed === true,
  streak_7:          ctx => (ctx.streak ?? 0) >= 7,
  bookmarks_20:      ctx => (ctx.bookmarkCount ?? 0) >= 20,
  questions_100:     ctx => (ctx.totalAnswered ?? 0) >= 100,
  perfect_exam:      ctx => ctx.perfectExam === true,
  readiness_90:      ctx => (ctx.readiness ?? 0) >= 90
}

export async function checkAndUnlockAchievements(ctx: AchievementCheckContext) {
  const all = await achievementRepo.getAll()
  const userAchs = await achievementRepo.getUserAchievements(ctx.userId)
  const unlockedIds = new Set(userAchs.map(a => a.achievement_id))

  for (const ach of all) {
    if (unlockedIds.has(ach.id)) continue
    const check = CONDITIONS[ach.condition_key]
    if (check && check(ctx)) {
      await achievementRepo.unlock(ctx.userId, ach.id)
    }
  }
}
