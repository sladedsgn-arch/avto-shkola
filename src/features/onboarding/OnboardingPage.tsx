import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userRepo, lessonRepo, paymentRepo } from '@/db/repositories'
import { useAuthStore } from '@/store/authStore'
import { seedLessons, seedPayment } from '@/db/seed'

type Screen = 'ob1' | 'ob2' | 'ob3' | 'form'

const Dot = ({ active }: { active: boolean }) => (
  <div style={{ width: active ? 24 : 8, height: 8, borderRadius: 999, background: active ? '#fff' : 'rgba(255,255,255,.3)', transition: 'all .3s' }} />
)

export function OnboardingPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)
  const [screen, setScreen] = useState<Screen>('ob1')
  const [fullName, setFullName] = useState('Овчаренко А.К.')
  const [phone, setPhone] = useState('+7 900 123-45-67')
  const [kpp, setKpp] = useState<'МКПП' | 'АКПП'>('МКПП')
  const [loading, setLoading] = useState(false)

  async function enterApp() {
    setLoading(true)
    const user = await userRepo.create({
      school_id: 1, instructor_id: 1,
      full_name: fullName, phone,
      password_hash: '1234', category: 'B' as const, gearbox: kpp,
      driving_hours: 24, streak_count: 7,
      created_at: new Date().toISOString(),
      notifications: true, biometrics: false,
    })
    await lessonRepo.bulkAdd(seedLessons(user.id))
    await paymentRepo.add({ ...seedPayment(user.id), user_id: user.id })
    setUser(user)
    navigate('/')
  }

  const arrowBtn = (onClick: () => void) => (
    <button onClick={onClick} style={{ width: 60, height: 60, borderRadius: 999, border: '1.4px solid rgba(255,255,255,.85)', background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </button>
  )

  const illBox = (accent: string) => (
    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 24, background: `repeating-linear-gradient(45deg,${accent} 0 11px,transparent 11px 22px)`, border: '1px dashed rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6 }}>
        {screen === 'ob1' && 'илл. — открытая книга\n+ дорожный знак'}
        {screen === 'ob2' && 'илл. — чек-лист\n+ секундомер'}
        {screen === 'ob3' && 'илл. — машина\n+ календарь'}
      </div>
    </div>
  )

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', padding: '64px 24px 30px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 15, fontWeight: 500, letterSpacing: '-.3px', marginBottom: 0 }}>.auto</div>

      {/* OB1 */}
      {screen === 'ob1' && <>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {illBox('rgba(255,255,255,.07)')}
        </div>
        <div style={{ animation: 'riseUp .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', marginBottom: 14 }}>01 — 03</div>
          <h1 style={{ fontSize: 44, lineHeight: .98, fontWeight: 600, letterSpacing: '-1.2px', margin: 0 }}>Вся теория ПДД в кармане</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34 }}>
          <div style={{ display: 'flex', gap: 8 }}><Dot active={true}/><Dot active={false}/><Dot active={false}/></div>
          {arrowBtn(() => setScreen('ob2'))}
        </div>
      </>}

      {/* OB2 */}
      {screen === 'ob2' && <>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {illBox('rgba(31,43,255,.18)')}
        </div>
        <div style={{ animation: 'riseUp .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', marginBottom: 14 }}>02 — 03</div>
          <h1 style={{ fontSize: 44, lineHeight: .98, fontWeight: 600, letterSpacing: '-1.2px', margin: 0 }}>Билеты и пробный экзамен ГИБДД</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34 }}>
          <div style={{ display: 'flex', gap: 8 }}><Dot active={false}/><Dot active={true}/><Dot active={false}/></div>
          {arrowBtn(() => setScreen('ob3'))}
        </div>
      </>}

      {/* OB3 */}
      {screen === 'ob3' && <>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {illBox('rgba(244,212,0,.18)')}
        </div>
        <div style={{ animation: 'riseUp .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', marginBottom: 14 }}>03 — 03</div>
          <h1 style={{ fontSize: 44, lineHeight: .98, fontWeight: 600, letterSpacing: '-1.2px', margin: 0 }}>Расписание и прогресс в одном месте</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34, gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}><Dot active={false}/><Dot active={false}/><Dot active={true}/></div>
          <button onClick={() => setScreen('form')} style={{ flex: 1, height: 60, borderRadius: 999, border: 'none', background: '#EDE9DC', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: '-.2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            Начать
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </>}

      {/* FORM */}
      {screen === 'form' && <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#000', color: '#fff', overflowY: 'auto', padding: '62px 24px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <button onClick={() => setScreen('ob3')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
        </div>
        <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', marginBottom: 14 }}>Шаг 1</div>
          <h1 style={{ fontSize: 42, lineHeight: .98, fontWeight: 600, letterSpacing: '-1.2px', margin: '0 0 36px' }}>Создайте<br/>профиль</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, animation: 'fadeIn .6s .15s both' }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>Имя и фамилия</div>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.4px solid rgba(255,255,255,.25)', color: '#fff', fontFamily: "'Geist',sans-serif", fontSize: 24, fontWeight: 500, padding: '0 0 10px', outline: 'none', boxSizing: 'border-box' }} />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>Телефон — это логин</div>
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.4px solid rgba(255,255,255,.25)', color: '#fff', fontFamily: "'Geist',sans-serif", fontSize: 24, fontWeight: 500, padding: '0 0 10px', outline: 'none', boxSizing: 'border-box' }} />
          </label>
          <div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>Категория</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['B', 'A', 'C', 'D'] as const).map(c => (
                <div key={c} style={{ flex: 1, height: 54, borderRadius: 999, background: c === 'B' ? '#EDE9DC' : 'transparent', color: c === 'B' ? '#000' : 'rgba(255,255,255,.55)', border: c === 'B' ? 'none' : '1.4px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: c === 'B' ? 600 : 500 }}>{c}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>Коробка передач</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['МКПП', 'АКПП'] as const).map(g => (
                <div key={g} onClick={() => setKpp(g)}
                  style={{ flex: 1, height: 54, borderRadius: 999, background: kpp === g ? '#EDE9DC' : 'transparent', color: kpp === g ? '#000' : 'rgba(255,255,255,.55)', border: '1.4px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={enterApp} disabled={loading}
          style={{ width: '100%', height: 60, marginTop: 40, borderRadius: 999, border: 'none', background: '#EDE9DC', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading ? 'Создаём профиль...' : 'Войти в приложение'}
          {!loading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
        </button>
      </div>}
    </div>
  )
}
