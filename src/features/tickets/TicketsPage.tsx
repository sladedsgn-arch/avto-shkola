import { useLayoutCtx } from '@/app/LayoutContext'

export function TicketsPage() {
  const { openMenu, goToFill } = useLayoutCtx()

  // расцветка сетки билетов по логике макета
  const tickets = []
  for (let i = 1; i <= 40; i++) {
    let bg = 'rgba(11,11,11,.07)', fg = '#0B0B0B', border = 'none'
    const mod = i % 7
    if (i <= 12 && mod !== 3) { bg = '#0B0B0B'; fg = '#B4F000' }       // решён
    else if (mod === 3) { bg = '#FF3A2D'; fg = '#fff' }                // с ошибками
    else { border = '1.4px solid rgba(11,11,11,.18)' }                 // не тронут
    tickets.push({ n: i, bg, fg, border })
  }

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#B4F000', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 22 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 10 }}>Тренировка</div>
        <h1 style={{ fontSize: 52, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.6px', margin: 0 }}>Билеты</h1>
      </div>
      <div style={{ height: 52, borderRadius: 999, background: 'rgba(11,11,11,.08)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', marginBottom: 22 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        <span style={{ color: 'rgba(11,11,11,.5)', fontSize: 15 }}>Поиск билета</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        <div onClick={e => goToFill('/quiz/ticket-1', e)} style={{ height: 64, borderRadius: 18, background: '#0B0B0B', color: '#B4F000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', cursor: 'pointer' }}><span style={{ fontSize: 18, fontWeight: 600 }}>Билеты 1 — 40</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
        <div onClick={e => goToFill('/exam', e)} style={{ height: 64, borderRadius: 18, background: '#0B0B0B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', cursor: 'pointer' }}><span style={{ fontSize: 18, fontWeight: 600 }}>Экзамен ГИБДД</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3A2D" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div onClick={e => goToFill('/quiz/marathon', e)} style={{ flex: 1, height: 64, borderRadius: 18, border: '1.4px solid rgba(11,11,11,.3)', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Марафон</div>
          <div onClick={e => goToFill('/quiz/random', e)} style={{ flex: 1, height: 64, borderRadius: 18, border: '1.4px solid rgba(11,11,11,.3)', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Случайные</div>
        </div>
        <div onClick={e => goToFill('/quiz/errors', e)} style={{ height: 64, borderRadius: 18, border: '1.4px solid rgba(11,11,11,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', cursor: 'pointer' }}><span style={{ fontSize: 16, fontWeight: 600 }}>Работа над ошибками</span><span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, color: 'rgba(11,11,11,.55)' }}>6 ВОПР.</span></div>
      </div>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 14 }}>Все 40 билетов</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
        {tickets.map(t => (
          <div key={t.n} onClick={e => goToFill(`/quiz/ticket-${t.n}`, e)} style={{ aspectRatio: '1/1', borderRadius: 14, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, cursor: 'pointer', border: t.border }}>{t.n}</div>
        ))}
      </div>
    </div>
  )
}
