import { openDB, type IDBPDatabase } from 'idb'
import type {
  School, Instructor, User, TheoryModule, UserTheoryProgress,
  Question, ExamSession, ExamAnswer, Lesson, Achievement,
  UserAchievement, Sign, SignBookmark, Payment
} from './types'
import {
  seedSchools, seedInstructors, seedModules, seedQuestions,
  seedAchievements, seedSigns
} from './seed'

const DB_NAME = 'avto-shkola'
const DB_VERSION = 1

type DB = IDBPDatabase<{
  schools: { key: number; value: School }
  instructors: { key: number; value: Instructor }
  users: { key: number; value: User }
  theory_modules: { key: number; value: TheoryModule }
  user_theory_progress: { key: number; value: UserTheoryProgress; indexes: { 'by-user': number } }
  questions: { key: number; value: Question; indexes: { 'by-module': number } }
  exam_sessions: { key: number; value: ExamSession; indexes: { 'by-user': number } }
  exam_answers: { key: number; value: ExamAnswer; indexes: { 'by-session': number } }
  lessons: { key: number; value: Lesson; indexes: { 'by-user': number } }
  achievements: { key: number; value: Achievement }
  user_achievements: { key: number; value: UserAchievement; indexes: { 'by-user': number } }
  signs: { key: number; value: Sign }
  sign_bookmarks: { key: number; value: SignBookmark; indexes: { 'by-user': number } }
  payments: { key: number; value: Payment; indexes: { 'by-user': number } }
}>

let dbPromise: Promise<DB> | null = null

export function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = openDB<{
      schools: { key: number; value: School }
      instructors: { key: number; value: Instructor }
      users: { key: number; value: User }
      theory_modules: { key: number; value: TheoryModule }
      user_theory_progress: { key: number; value: UserTheoryProgress; indexes: { 'by-user': number } }
      questions: { key: number; value: Question; indexes: { 'by-module': number } }
      exam_sessions: { key: number; value: ExamSession; indexes: { 'by-user': number } }
      exam_answers: { key: number; value: ExamAnswer; indexes: { 'by-session': number } }
      lessons: { key: number; value: Lesson; indexes: { 'by-user': number } }
      achievements: { key: number; value: Achievement }
      user_achievements: { key: number; value: UserAchievement; indexes: { 'by-user': number } }
      signs: { key: number; value: Sign }
      sign_bookmarks: { key: number; value: SignBookmark; indexes: { 'by-user': number } }
      payments: { key: number; value: Payment; indexes: { 'by-user': number } }
    }>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const stores = [
          'schools', 'instructors', 'users', 'theory_modules',
          'achievements', 'signs'
        ] as const
        for (const s of stores) {
          if (!db.objectStoreNames.contains(s)) {
            db.createObjectStore(s, { keyPath: 'id' })
          }
        }
        const withUser = [
          'user_theory_progress', 'exam_sessions', 'lessons',
          'user_achievements', 'sign_bookmarks', 'payments'
        ] as const
        for (const s of withUser) {
          if (!db.objectStoreNames.contains(s)) {
            const store = db.createObjectStore(s, { keyPath: 'id', autoIncrement: true })
            store.createIndex('by-user', 'user_id')
          }
        }
        if (!db.objectStoreNames.contains('questions')) {
          const q = db.createObjectStore('questions', { keyPath: 'id' })
          q.createIndex('by-module', 'module_id')
        }
        if (!db.objectStoreNames.contains('exam_answers')) {
          const a = db.createObjectStore('exam_answers', { keyPath: 'id', autoIncrement: true })
          a.createIndex('by-session', 'session_id')
        }
      }
    })
  }
  return dbPromise as Promise<DB>
}

export async function initSeedData() {
  const db = await getDB()
  const schools = await db.getAll('schools')
  if (schools.length > 0) return

  const tx = db.transaction([
    'schools', 'instructors', 'theory_modules', 'questions', 'achievements', 'signs'
  ], 'readwrite')

  for (const s of seedSchools) await tx.objectStore('schools').put(s)
  for (const i of seedInstructors) await tx.objectStore('instructors').put(i)
  for (const m of seedModules) await tx.objectStore('theory_modules').put(m)
  for (const q of seedQuestions) await tx.objectStore('questions').put(q)
  for (const a of seedAchievements) await tx.objectStore('achievements').put(a)
  for (const s of seedSigns) await tx.objectStore('signs').put(s)

  await tx.done
}
