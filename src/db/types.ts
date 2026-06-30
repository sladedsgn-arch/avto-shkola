export interface School {
  id: number
  name: string
  address: string
  phone: string
}

export interface Instructor {
  id: number
  school_id: number
  full_name: string
  phone: string
  car_model: string
  gear_type: 'МКПП' | 'АКПП'
  rating: number
  photo?: string
}

export interface User {
  id: number
  school_id: number
  instructor_id?: number
  full_name: string
  phone: string
  password_hash: string
  category: 'B'
  gearbox: 'МКПП' | 'АКПП'
  driving_hours: number
  streak_count: number
  created_at: string
  notifications: boolean
  biometrics: boolean
}

export interface TheoryModule {
  id: number
  title: string
  total_lessons: number
  estimated_time: string
  tag: string
  sort_order: number
  description: string
}

export interface UserTheoryProgress {
  id: number
  user_id: number
  module_id: number
  done: boolean
  completed_at?: string
}

export interface Question {
  id: number
  module_id: number
  text: string
  image_tag?: string
  option_1: string
  option_2: string
  option_3: string
  correct_option: 1 | 2 | 3
  explanation: string
}

export type ExamMode = 'ticket' | 'exam' | 'marathon' | 'random' | 'errors'

export interface ExamSession {
  id: number
  user_id: number
  mode: ExamMode
  score: number
  total: number
  passed: boolean
  started_at: string
  finished_at?: string
  ticket_number?: number
}

export interface ExamAnswer {
  id: number
  session_id: number
  question_id: number
  chosen_option: 1 | 2 | 3
  is_correct: boolean
}

export type LessonType = 'driving' | 'theory'
export type LessonStatus = 'soon' | 'done' | 'cancelled'

export interface Lesson {
  id: number
  user_id: number
  instructor_id: number
  lesson_type: LessonType
  scheduled_at: string
  duration_min: number
  place: string
  status: LessonStatus
}

export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  condition_key: string
}

export interface UserAchievement {
  id: number
  user_id: number
  achievement_id: number
  unlocked_at: string
}

export interface Sign {
  id: number
  category: string
  name: string
  code: string
  description: string
  image_url: string
}

export interface SignBookmark {
  id: number
  user_id: number
  sign_id: number
  created_at: string
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue'

export interface Payment {
  id: number
  user_id: number
  amount: number
  total_cost: number
  paid_at?: string
  status: PaymentStatus
  description: string
}
