import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Layout } from './Layout'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { HomePage } from '@/features/home/HomePage'
import { TheoryPage } from '@/features/theory/TheoryPage'
import { ModulePage } from '@/features/theory/ModulePage'
import { SignsPage } from '@/features/signs/SignsPage'
import { TicketsPage } from '@/features/tickets/TicketsPage'
import { QuizPage } from '@/features/quiz/QuizPage'
import { ResultPage } from '@/features/quiz/ResultPage'
import { ExamPage } from '@/features/exam/ExamPage'
import { SchedulePage } from '@/features/schedule/SchedulePage'
import { BookingPage } from '@/features/schedule/BookingPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { AchievementsPage } from '@/features/achievements/AchievementsPage'
import { PaymentPage } from '@/features/payment/PaymentPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export function AppRouter() {
  const user = useAuthStore(s => s.user)
  return (
    <Routes>
      <Route path="/onboarding" element={user ? <Navigate to="/" replace /> : <OnboardingPage />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/theory/:id" element={<ModulePage />} />
        <Route path="/signs" element={<SignsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
