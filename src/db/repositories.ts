import { getDB } from './storage'
import type {
  User, TheoryModule, UserTheoryProgress, Question,
  ExamSession, ExamAnswer, Lesson, Achievement, UserAchievement,
  Sign, SignBookmark, Payment, Instructor, ExamMode
} from './types'

// ─── Users ───────────────────────────────────────────────────────────────────
export const userRepo = {
  async findByPhone(phone: string) {
    const db = await getDB()
    const all = await db.getAll('users')
    return all.find(u => u.phone === phone) ?? null
  },
  async create(data: Omit<User, 'id'>) {
    const db = await getDB()
    const all = await db.getAll('users')
    const id = (all.reduce((m, u) => Math.max(m, u.id), 0)) + 1
    const user: User = { ...data, id }
    await db.put('users', user)
    return user
  },
  async get(id: number) {
    const db = await getDB()
    return db.get('users', id)
  },
  async update(user: User) {
    const db = await getDB()
    await db.put('users', user)
    return user
  }
}

// ─── Theory ──────────────────────────────────────────────────────────────────
export const theoryRepo = {
  async getModules(): Promise<TheoryModule[]> {
    const db = await getDB()
    const mods = await db.getAll('theory_modules')
    return mods.sort((a, b) => a.sort_order - b.sort_order)
  },
  async getProgress(userId: number): Promise<UserTheoryProgress[]> {
    const db = await getDB()
    return db.getAllFromIndex('user_theory_progress', 'by-user', userId)
  },
  async setProgress(userId: number, moduleId: number, done: boolean) {
    const db = await getDB()
    const all = await db.getAllFromIndex('user_theory_progress', 'by-user', userId)
    const existing = all.find(p => p.module_id === moduleId)
    if (existing) {
      const updated = { ...existing, done, completed_at: done ? new Date().toISOString() : undefined }
      await db.put('user_theory_progress', updated)
    } else {
      await db.add('user_theory_progress', {
        id: 0,
        user_id: userId,
        module_id: moduleId,
        done,
        completed_at: done ? new Date().toISOString() : undefined
      })
    }
  }
}

// ─── Questions ────────────────────────────────────────────────────────────────
export const questionRepo = {
  async getAll(): Promise<Question[]> {
    const db = await getDB()
    return db.getAll('questions')
  },
  async getByModule(moduleId: number): Promise<Question[]> {
    const db = await getDB()
    return db.getAllFromIndex('questions', 'by-module', moduleId)
  },
  async getTicket(ticketNumber: number): Promise<Question[]> {
    const all = await questionRepo.getAll()
    const start = (ticketNumber - 1) * 20
    return all.slice(start, start + 20)
  },
  async getRandom(count: number): Promise<Question[]> {
    const all = await questionRepo.getAll()
    const shuffled = [...all].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
}

// ─── Exam Sessions ────────────────────────────────────────────────────────────
export const examRepo = {
  async createSession(data: Omit<ExamSession, 'id'>): Promise<ExamSession> {
    const db = await getDB()
    const id = await db.add('exam_sessions', data as ExamSession)
    return { ...data, id: id as number }
  },
  async updateSession(session: ExamSession) {
    const db = await getDB()
    await db.put('exam_sessions', session)
  },
  async getUserSessions(userId: number): Promise<ExamSession[]> {
    const db = await getDB()
    return db.getAllFromIndex('exam_sessions', 'by-user', userId)
  },
  async addAnswer(answer: Omit<ExamAnswer, 'id'>) {
    const db = await getDB()
    await db.add('exam_answers', answer as ExamAnswer)
  },
  async getSessionAnswers(sessionId: number): Promise<ExamAnswer[]> {
    const db = await getDB()
    return db.getAllFromIndex('exam_answers', 'by-session', sessionId)
  },
  async getErrorQuestionIds(userId: number): Promise<number[]> {
    const db = await getDB()
    const sessions = await db.getAllFromIndex('exam_sessions', 'by-user', userId)
    const errorIds = new Set<number>()
    for (const s of sessions) {
      const answers = await db.getAllFromIndex('exam_answers', 'by-session', s.id)
      for (const a of answers) {
        if (!a.is_correct) errorIds.add(a.question_id)
      }
    }
    return [...errorIds]
  },
  async getTotalAnswered(userId: number): Promise<number> {
    const db = await getDB()
    const sessions = await db.getAllFromIndex('exam_sessions', 'by-user', userId)
    let total = 0
    for (const s of sessions) {
      const answers = await db.getAllFromIndex('exam_answers', 'by-session', s.id)
      total += answers.length
    }
    return total
  },
  async getPassedTickets(userId: number): Promise<number> {
    const sessions = await examRepo.getUserSessions(userId)
    return sessions.filter(s => s.mode === 'ticket' && s.passed).length
  },
  async getSessionById(id: number): Promise<ExamSession | undefined> {
    const db = await getDB()
    return db.get('exam_sessions', id)
  },
  async startSession(userId: number, mode: ExamMode, ticketNumber?: number): Promise<ExamSession> {
    return examRepo.createSession({
      user_id: userId,
      mode,
      score: 0,
      total: 0,
      passed: false,
      started_at: new Date().toISOString(),
      ticket_number: ticketNumber
    })
  }
}

// ─── Lessons ──────────────────────────────────────────────────────────────────
export const lessonRepo = {
  async getUserLessons(userId: number): Promise<Lesson[]> {
    const db = await getDB()
    return db.getAllFromIndex('lessons', 'by-user', userId)
  },
  async add(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    const db = await getDB()
    const id = await db.add('lessons', lesson as Lesson)
    return { ...lesson, id: id as number }
  },
  async update(lesson: Lesson) {
    const db = await getDB()
    await db.put('lessons', lesson)
  },
  async bulkAdd(lessons: Lesson[]) {
    const db = await getDB()
    const tx = db.transaction('lessons', 'readwrite')
    for (const l of lessons) await tx.store.put(l)
    await tx.done
  }
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export const achievementRepo = {
  async getAll(): Promise<Achievement[]> {
    const db = await getDB()
    return db.getAll('achievements')
  },
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    const db = await getDB()
    return db.getAllFromIndex('user_achievements', 'by-user', userId)
  },
  async unlock(userId: number, achievementId: number) {
    const db = await getDB()
    const existing = await db.getAllFromIndex('user_achievements', 'by-user', userId)
    if (existing.some(a => a.achievement_id === achievementId)) return
    await db.add('user_achievements', {
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString()
    } as UserAchievement)
  }
}

// ─── Signs ────────────────────────────────────────────────────────────────────
export const signRepo = {
  async getAll(): Promise<Sign[]> {
    const db = await getDB()
    return db.getAll('signs')
  },
  async getBookmarks(userId: number): Promise<SignBookmark[]> {
    const db = await getDB()
    return db.getAllFromIndex('sign_bookmarks', 'by-user', userId)
  },
  async toggleBookmark(userId: number, signId: number) {
    const db = await getDB()
    const all = await db.getAllFromIndex('sign_bookmarks', 'by-user', userId)
    const existing = all.find(b => b.sign_id === signId)
    if (existing) {
      await db.delete('sign_bookmarks', existing.id)
    } else {
      await db.add('sign_bookmarks', {
        user_id: userId, sign_id: signId, created_at: new Date().toISOString()
      } as SignBookmark)
    }
  }
}

// ─── Instructors ──────────────────────────────────────────────────────────────
export const instructorRepo = {
  async getAll(): Promise<Instructor[]> {
    const db = await getDB()
    return db.getAll('instructors')
  }
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentRepo = {
  async getUserPayments(userId: number): Promise<Payment[]> {
    const db = await getDB()
    return db.getAllFromIndex('payments', 'by-user', userId)
  },
  async add(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const db = await getDB()
    const id = await db.add('payments', payment as Payment)
    return { ...payment, id: id as number }
  },
  async update(payment: Payment) {
    const db = await getDB()
    await db.put('payments', payment)
  }
}
