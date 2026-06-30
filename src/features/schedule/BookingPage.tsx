import { useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'

const INSTRUCTORS = [
  { name: 'Игорь Семёнов', car: 'Kia Rio · седан', rate: '4.9', kpp: 'МКПП' },
  { name: 'Марина Лебедева', car: 'VW Polo · седан', rate: '4.8', kpp: 'АКПП' },
  { name: 'Алексей Гром', car: 'Hyundai Solaris', rate: '4.7', kpp: 'МКПП' },
]
const SLOTS = ['09:00', '11:00', '13:30', '15:00', '17:00', '18:30']

export function BookingPage() {
  const { goToFill } = useLayoutCtx()
  const [pickedInstr, setPickedInstr] = useState('Игорь Семёнов')
  const [pickedSlot, setPickedSlot] = useState(1)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#F4D400', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <button onClick={() => goToFill('/schedule')} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>

      {confirmed ? (
        <div style={{ textAlign: 'center', marginTop: 70, animation: 'fadeIn .5s both' }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: '#0B0B0B', color: '#F4D400', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', animation: 'popIn .5s both' }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg></div>
          <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-1px', margin: '0 0 12px', lineHeight: 1 }}>Запись<br/>подтверждена</h1>
          <div style={{ fontSize: 16, color: 'rgba(11,11,11,.65)' }}>{pickedInstr} · Пт, 4 июля · {SLOTS[pickedSlot]}</div>
          <button onClick={() => goToFill('/schedule')} style={{ marginTop: 36, height: 56, padding: '0 34px', borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>В расписание</button>
        </div>
      ) : (
        <>
          <div style={{ animation: 'riseUp .5s both', marginBottom: 22 }}>
            <h1 style={{ fontSize: 38, lineHeight: .95, fontWeight: 600, letterSpacing: '-1.1px', margin: 0 }}>Выберите<br/>инструктора</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INSTRUCTORS.map(i => {
              const active = i.name === pickedInstr
              return (
                <div key={i.name} onClick={() => setPickedInstr(i.name)} style={{ borderRadius: 20, background: active ? '#0B0B0B' : 'rgba(11,11,11,.05)', color: active ? '#fff' : '#0B0B0B', padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', border: `1.4px solid ${active ? '#0B0B0B' : 'rgba(11,11,11,.15)'}` }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: 'repeating-linear-gradient(45deg,rgba(11,11,11,.14) 0 8px,transparent 8px 16px)', border: `1px dashed ${active ? 'rgba(255,255,255,.4)' : 'rgba(11,11,11,.35)'}`, flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.3px' }}>{i.name}</div>
                    <div style={{ fontSize: 13, opacity: .7, marginTop: 3 }}>{i.car}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}><div style={{ fontSize: 15, fontWeight: 600 }}>★ {i.rate}</div><div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, opacity: .6, letterSpacing: .5 }}>{i.kpp}</div></div>
                </div>
              )
            })}
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', margin: '26px 0 12px' }}>Свободные слоты · {pickedInstr}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {SLOTS.map((t, idx) => {
              const active = idx === pickedSlot
              return (
                <div key={t} onClick={() => setPickedSlot(idx)} style={{ height: 50, borderRadius: 14, background: active ? '#0B0B0B' : 'transparent', color: active ? '#F4D400' : '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, cursor: 'pointer', border: `1.4px solid ${active ? '#0B0B0B' : 'rgba(11,11,11,.3)'}` }}>{t}</div>
              )
            })}
          </div>
          <button onClick={() => setConfirmed(true)} style={{ width: '100%', height: 58, marginTop: 24, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Подтвердить запись</button>
        </>
      )}
    </div>
  )
}
