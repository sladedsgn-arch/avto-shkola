export type SectionId =
  | 'home' | 'theory' | 'module' | 'tickets' | 'quiz'
  | 'exam' | 'result' | 'schedule' | 'booking'
  | 'achievements' | 'signs' | 'profile' | 'payment' | 'settings'
  | 'ob1' | 'ob2' | 'ob3' | 'form'

export interface SectionTheme {
  bg: string
  fg: string   // primary text on bg
  accent: string // accent color (opposite)
}

export const sectionTheme: Record<SectionId, SectionTheme> = {
  ob1:          { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
  ob2:          { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
  ob3:          { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
  form:         { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
  home:         { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
  theory:       { bg: '#1F2BFF', fg: '#FFFFFF', accent: '#EDE9DC' },
  module:       { bg: '#1F2BFF', fg: '#FFFFFF', accent: '#EDE9DC' },
  tickets:      { bg: '#B4F000', fg: '#0B0B0B', accent: '#0B0B0B' },
  quiz:         { bg: '#B4F000', fg: '#0B0B0B', accent: '#0B0B0B' },
  exam:         { bg: '#FF3A2D', fg: '#FFFFFF', accent: '#EDE9DC' },
  result:       { bg: '#FF3A2D', fg: '#FFFFFF', accent: '#EDE9DC' },
  schedule:     { bg: '#F4D400', fg: '#0B0B0B', accent: '#0B0B0B' },
  booking:      { bg: '#F4D400', fg: '#0B0B0B', accent: '#0B0B0B' },
  achievements: { bg: '#FF7A00', fg: '#0B0B0B', accent: '#0B0B0B' },
  signs:        { bg: '#7A3CFF', fg: '#FFFFFF', accent: '#FFFFFF' },
  profile:      { bg: '#FF49C0', fg: '#0B0B0B', accent: '#0B0B0B' },
  payment:      { bg: '#D8F3E3', fg: '#0B0B0B', accent: '#0B0B0B' },
  settings:     { bg: '#000000', fg: '#FFFFFF', accent: '#EDE9DC' },
}
