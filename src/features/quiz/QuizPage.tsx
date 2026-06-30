import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLayoutCtx } from '@/app/LayoutContext'
import { useAuthStore } from '@/store/authStore'
import { useQuizStore } from '@/store/quizStore'
import { questionRepo, examRepo } from '@/db/repositories'
import type { Question } from '@/db/types'

export function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const { goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const { session, questions, currentIndex, setSession, setQuestions, answer, next, finish, reset } = useQuizStore()
  const [answered, setAnswered] = useState(false)
  const [sel, setSel] = useState<number | null>(null)
  const startedRef = useRef(false)

  const moduleId = id && id !== 'exam' && id !== 'marathon' && id !== 'random' && id !== 'errors' && !id.startsWith('ticket-') ? Number(id) : undefined
  const q: Question | undefined = questions[currentIndex]
  const opts = q ? [q.option_1, q.option_2, q.option_3] : []

  useEffect(() => {
    async function load() {
      reset()
      let qs: Question[]
      if (moduleId) qs = await questionRepo.getByModule(moduleId)
      else if (id?.startsWith('ticket-')) qs = await questionRepo.getTicket(Number(id.replace('ticket-', '')))
      else qs = await questionRepo.getRandom(20)
      const sess = await examRepo.startSession(user.id, 'ticket')
      setSession(sess)
      setQuestions(qs)
      setAnswered(false)
      setSel(null)
      startedRef.current = true
    }
    load()
  }, [id])

  if (!q) return (
    <div style={{ position: 'absolute', inset: 0, background: '#B4F000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, color: 'rgba(11,11,11,.5)' }}>Загрузка...</div>
    </div>
  )

  const total = questions.length
  const qNum = currentIndex + 1
  const qPct = `${(qNum / total) * 100}%`
  const correctChosen = answered && sel !== null && (sel + 1) === q.correct_option
  const isLast = currentIndex + 1 >= total

  function choose(idx: number) {
    if (answered) return
    setSel(idx)
    setAnswered(true)
    answer(q!.id, (idx + 1) as 1 | 2 | 3, (idx + 1) === q!.correct_option)
  }

  function handleNext() {
    if (isLast) { finish(); if (session) goToFill(`/result/${session.id}`); else goToFill('/tickets') }
    else { next(); setAnswered(false); setSel(null) }
  }

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#B4F000', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => goToFill('/tickets')} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 500, letterSpacing: .5 }}>ВОПРОС {qNum} / {total}</span>
        <span style={{ width: 26 }}/>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: 'rgba(11,11,11,.15)', overflow: 'hidden', marginBottom: 26 }}><div style={{ height: '100%', background: '#0B0B0B', borderRadius: 999, width: qPct, transition: 'width .4s' }}/></div>
      <div style={{ height: 170, borderRadius: 18, background: 'rgba(11,11,11,.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 22, gap: 8 }}>
        <span style={{ fontSize: 64 }}>
          {/перекрёст|перекрест/i.test(q.text) ? '🚦' :
           /обгон|опережен/i.test(q.text) ? '🏎️' :
           /пешеход/i.test(q.text) ? '🚶' :
           /знак/i.test(q.text) ? '🪧' :
           /скорост/i.test(q.text) ? '⚡' :
           /парков|стоянк/i.test(q.text) ? '🅿️' :
           /алкогол|опьян/i.test(q.text) ? '🚫' :
           /ремень|безопасност/i.test(q.text) ? '🔒' :
           /туман|видимост/i.test(q.text) ? '🌫️' :
           /дождь|гололед|скользк/i.test(q.text) ? '🌧️' :
           /велосипед/i.test(q.text) ? '🚲' :
           /трамвай/i.test(q.text) ? '🚃' :
           /мотоцикл/i.test(q.text) ? '🏍️' :
           /грузов/i.test(q.text) ? '🚚' :
           /автобус|маршрутк/i.test(q.text) ? '🚌' :
           '🛣️'}
        </span>
        {q.image_tag && <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(11,11,11,.4)' }}>{q.image_tag}</span>}
      </div>
      <h2 style={{ fontSize: 23, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-.5px', margin: '0 0 22px' }}>{q.text}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((text, idx) => {
          let bg = 'rgba(11,11,11,.05)', fg = '#0B0B0B', bd = 'rgba(11,11,11,.18)', mark = ''
          if (answered) {
            if (idx + 1 === q.correct_option) { bg = '#0B0B0B'; fg = '#B4F000'; bd = '#0B0B0B'; mark = '✓' }
            else if (idx === sel) { bg = 'rgba(255,58,45,.15)'; bd = '#FF3A2D'; fg = '#FF3A2D'; mark = '✕' }
            else { fg = 'rgba(11,11,11,.4)' }
          }
          return (
            <div key={idx} onClick={() => choose(idx)} style={{ borderRadius: 16, padding: '18px 20px', background: bg, color: fg, border: `1.6px solid ${bd}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>
              <span>{text}</span>
              <span style={{ fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{mark}</span>
            </div>
          )
        })}
      </div>
      {answered && (
        <div style={{ marginTop: 20, borderRadius: 18, background: '#0B0B0B', color: '#fff', padding: 20, animation: 'riseUpSm .4s both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: correctChosen ? '#B4F000' : '#FF6B5E', marginBottom: 8 }}>{correctChosen ? 'ВЕРНО' : 'ОШИБКА'}</div>
          <div style={{ fontSize: 14, lineHeight: 1.45, color: 'rgba(255,255,255,.85)' }}>{q.explanation}</div>
          <button onClick={handleNext} style={{ marginTop: 18, width: '100%', height: 50, borderRadius: 999, border: 'none', background: '#B4F000', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{isLast ? 'Завершить' : 'Следующий вопрос'}</button>
        </div>
      )}
    </div>
  )
}
