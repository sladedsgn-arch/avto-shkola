import { create } from 'zustand'
import type { Question, ExamSession } from '@/db/types'

interface QuizState {
  session: ExamSession | null
  questions: Question[]
  currentIndex: number
  answers: Record<number, { chosen: 1 | 2 | 3; correct: boolean }>
  timeLeft: number
  isFinished: boolean
  setSession: (s: ExamSession) => void
  setQuestions: (q: Question[]) => void
  answer: (questionId: number, chosen: 1 | 2 | 3, correct: boolean) => void
  next: () => void
  finish: () => void
  setTimeLeft: (t: number) => void
  reset: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  session: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timeLeft: 20 * 60,
  isFinished: false,
  setSession: (session) => set({ session }),
  setQuestions: (questions) => set({ questions, currentIndex: 0, answers: {}, isFinished: false }),
  answer: (questionId, chosen, correct) =>
    set(state => ({ answers: { ...state.answers, [questionId]: { chosen, correct } } })),
  next: () => set(state => ({ currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1) })),
  finish: () => set({ isFinished: true }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  reset: () => set({ session: null, questions: [], currentIndex: 0, answers: {}, timeLeft: 20 * 60, isFinished: false })
}))
