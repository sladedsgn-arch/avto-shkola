import { useLayoutCtx } from '@/app/LayoutContext'

export function ExamPage() {
  const { openMenu, goToFill } = useLayoutCtx()

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#FF3A2D', color: '#fff', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 30 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginBottom: 10 }}>Пробный экзамен</div>
        <h1 style={{ fontSize: 48, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.5px', margin: 0 }}>Экзамен<br/>ГИБДД</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,.18)', marginBottom: 30 }}>
        {[['Вопросов', '20'], ['Лимит ошибок', '2 (+5 вопр.)'], ['Время', '20 минут']].map(([l, v]) => (
          <div key={l} style={{ background: '#FF3A2D', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 16, fontWeight: 500 }}>{l}</span><span style={{ fontSize: 20, fontWeight: 600 }}>{v}</span></div>
        ))}
      </div>
      <button onClick={e => goToFill('/result/0', e)} style={{ width: '100%', height: 62, borderRadius: 999, border: 'none', background: '#EDE9DC', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        Начать экзамен
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  )
}
