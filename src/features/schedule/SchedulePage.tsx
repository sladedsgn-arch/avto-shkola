import { useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'

export function SchedulePage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const [tab, setTab] = useState<'list' | 'week' | 'month'>('list')

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#F4D400', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 22 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 10 }}>Раздел</div>
        <h1 style={{ fontSize: 46, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.4px', margin: 0 }}>Расписание</h1>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['list', 'Список'], ['week', 'Неделя'], ['month', 'Месяц']] as const).map(([t, label]) => (
          <div key={t} onClick={() => setTab(t)} style={{ height: 40, padding: '0 20px', borderRadius: 999, background: tab === t ? '#0B0B0B' : 'transparent', color: tab === t ? '#F4D400' : '#0B0B0B', border: tab === t ? 'none' : '1.4px solid rgba(11,11,11,.3)', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: tab === t ? 600 : 500, cursor: 'pointer' }}>{label}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <div style={{ borderRadius: 20, background: '#0B0B0B', color: '#fff', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, color: '#F4D400', textTransform: 'uppercase' }}>Вождение · город</span><span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>90 мин</span></div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 10, letterSpacing: '-.4px' }}>Пн, 30 июня · 10:00</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>Игорь Семёнов · ул. Лесная, 12</div>
        </div>
        <div style={{ borderRadius: 20, background: 'rgba(11,11,11,.08)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, color: 'rgba(11,11,11,.55)', textTransform: 'uppercase' }}>Теория · группа</span><span style={{ fontSize: 13, color: 'rgba(11,11,11,.55)' }}>60 мин</span></div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 10, letterSpacing: '-.4px' }}>Ср, 2 июля · 18:30</div>
          <div style={{ fontSize: 14, color: 'rgba(11,11,11,.6)', marginTop: 4 }}>Аудитория 3 · онлайн-трансляция</div>
        </div>
      </div>
      <button onClick={e => goToFill('/booking', e)} style={{ width: '100%', height: 60, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        Записаться на вождение
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  )
}
