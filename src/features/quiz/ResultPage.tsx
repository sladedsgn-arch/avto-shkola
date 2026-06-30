import { useLayoutCtx } from '@/app/LayoutContext'
import { useQuizStore } from '@/store/quizStore'

export function ResultPage() {
  const { goToFill } = useLayoutCtx()
  const { answers, questions } = useQuizStore()

  const answeredCount = Object.keys(answers).length
  const correct = Object.values(answers).filter(a => a.correct).length
  // если реальной сессии нет (переход с экзамена) — демо-значения макета
  const hasReal = answeredCount > 0
  const total = hasReal ? (questions.length || 20) : 20
  const score = hasReal ? correct : 18
  const errors = total - score
  const percent = Math.round((score / total) * 100)
  const passed = score >= Math.ceil(total * 0.9)

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#FF3A2D', color: '#fff', overflowY: 'auto', padding: '60px 24px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={() => goToFill('/exam')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14, animation: 'fadeIn .5s both' }}>
        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 18, position: 'absolute', left: 34, top: 120, animation: 'twinkle 3s infinite' }}>✦</span>
        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, position: 'absolute', right: 42, top: 160, animation: 'twinkle 2.4s infinite .6s' }}>✦</span>
        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 15, position: 'absolute', right: 30, top: 300, animation: 'twinkle 2.8s infinite 1s' }}>✦</span>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>Результат экзамена</div>
        <div style={{ fontSize: 150, lineHeight: .86, fontWeight: 800, letterSpacing: '-6px', margin: '12px 0 0', animation: 'popIn .55s cubic-bezier(.2,.8,.2,1) both' }}>{score}<span style={{ fontSize: 64, fontWeight: 600, opacity: .6 }}>/{total}</span></div>
        <div style={{ display: 'inline-block', marginTop: 14, height: 48, lineHeight: '48px', padding: '0 28px', borderRadius: 999, background: '#0B0B0B', color: '#fff', fontSize: 18, fontWeight: 600, letterSpacing: .5 }}>{passed ? 'СДАНО ✓' : 'НЕ СДАНО ✕'}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
        {[[`${percent}%`, 'Верно'], [`${errors}`, 'Ошибки'], ['12:40', 'Время']].map(([v, l]) => (
          <div key={l} style={{ flex: 1, borderRadius: 18, background: 'rgba(11,11,11,.22)', padding: 18, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700 }}>{v}</div><div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,.75)', marginTop: 4 }}>{l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        <button style={{ width: '100%', height: 56, borderRadius: 999, border: 'none', background: '#EDE9DC', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>Поделиться</button>
        <button onClick={e => goToFill('/tickets', e)} style={{ width: '100%', height: 56, borderRadius: 999, border: '1.4px solid rgba(255,255,255,.6)', background: 'transparent', color: '#fff', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Работа над ошибками</button>
      </div>
    </div>
  )
}
