import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { examRepo, questionRepo } from '@/db/repositories'
import { useQuizStore } from '@/store/quizStore'
import { sectionTheme } from '@/theme/sectionTheme'

export function TicketSelectPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)!
  const theme = sectionTheme.tickets
  const { setSession, setQuestions, reset } = useQuizStore()
  const tickets = Array.from({ length: 3 }, (_, i) => i + 1)

  async function startTicket(num: number) {
    reset()
    const questions = await questionRepo.getTicket(num)
    if (questions.length === 0) {
      alert('Недостаточно вопросов для этого билета')
      return
    }
    const session = await examRepo.startSession(user.id, 'ticket', num)
    setSession(session)
    setQuestions(questions)
    navigate(`/quiz/${session.id}`)
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <button onClick={() => navigate('/tickets')} style={{ color: theme.accent, fontSize: 15, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Билеты
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Выберите билет</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>20 вопросов в каждом</div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {tickets.map((n, i) => (
          <motion.button key={n} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            onClick={() => startTicket(n)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#fff' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Билет</span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>{n}</span>
          </motion.button>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
        Всего 3 билета (45 вопросов добавлено)
      </div>
    </div>
  )
}
