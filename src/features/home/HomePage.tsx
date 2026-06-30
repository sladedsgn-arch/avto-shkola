import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useLayoutCtx } from '@/app/LayoutContext'
import { theoryRepo, examRepo, lessonRepo } from '@/db/repositories'
import { calcReadiness } from '@/lib/readiness'

export function HomePage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [readiness, setReadiness] = useState(72)
  const [remainingModules, setRemainingModules] = useState(8)

  useEffect(() => {
    async function load() {
      const mods = await theoryRepo.getModules()
      const progList = await theoryRepo.getProgress(user.id)
      const completed = progList.filter(p => p.done).length
      const passed = await examRepo.getPassedTickets(user.id)
      await lessonRepo.getUserLessons(user.id)
      // Пока студент ещё не начал — показываем демо-состояние из макета (72%).
      // Как только есть реальный прогресс — пересчитываем по формуле готовности.
      const hasProgress = completed > 0 || passed > 0
      if (hasProgress) {
        setRemainingModules(Math.max(0, mods.length - completed))
        setReadiness(calcReadiness({
          completedModules: completed,
          totalModules: mods.length,
          passedTickets: passed,
          drivingHours: user.driving_hours,
        }))
      }
    }
    load()
  }, [user])

  // ring: viewBox 180, r=80, circumference ~502
  const circ = 502
  const dashoffset = circ - circ * (readiness / 100)

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#000', color: '#fff', overflowY: 'auto' }}>
      <div style={{ padding: '62px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
          <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
        </div>
        <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, letterSpacing: 1, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', marginBottom: 8 }}>Привет, {user.full_name}</div>
          <h1 style={{ fontSize: 52, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.6px', margin: 0 }}>Сегодня</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
          <div style={{ height: 42, padding: '0 16px', borderRadius: 999, background: '#171717', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>Эта неделя
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
          </div>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.6)', fontSize: 22, letterSpacing: 1 }}>⋮</div>
        </div>
      </div>

      {/* readiness ring */}
      <div style={{ padding: '14px 24px 8px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
          <svg width="128" height="128" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="11"/>
            <circle cx="90" cy="90" r="80" fill="none" stroke="#EDE9DC" strokeWidth="11" strokeLinecap="round" strokeDasharray="502" strokeDashoffset={dashoffset} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.3,1,.3,1)' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-1px' }}>{readiness}%</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.4px', lineHeight: 1.1 }}>Готовность<br/>к экзамену</div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: .5, color: 'rgba(255,255,255,.5)', marginTop: 10, textTransform: 'uppercase' }}>осталось {remainingModules} модулей</div>
        </div>
      </div>

      {/* lesson cards */}
      <div className="noscroll" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '18px 24px 8px', scrollSnapType: 'x mandatory' }}>
        <div style={{ flex: '0 0 210px', height: 230, borderRadius: 22, background: '#93A8C7', color: '#0B0B0B', padding: 22, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Игорь Семёнов</div>
          <div style={{ fontSize: 11, color: 'rgba(11,11,11,.55)', fontFamily: "'Geist Mono',monospace", letterSpacing: .5, marginTop: 3 }}>ИНСТРУКТОР · ВОЖДЕНИЕ</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}><div style={{ fontSize: 30, fontWeight: 600, lineHeight: .98, letterSpacing: '-.8px' }}>Город:<br/>левые<br/>повороты</div></div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 14 }}>10:00 — 11:30</div>
        </div>
        <div style={{ flex: '0 0 210px', height: 230, borderRadius: 22, background: '#EDE9DC', color: '#0B0B0B', padding: 22, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Марина Лебедева</div>
          <div style={{ fontSize: 11, color: 'rgba(11,11,11,.55)', fontFamily: "'Geist Mono',monospace", letterSpacing: .5, marginTop: 3 }}>ИНСТРУКТОР · ПЛОЩАДКА</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}><div style={{ fontSize: 30, fontWeight: 600, lineHeight: .98, letterSpacing: '-.8px' }}>Парковка<br/>задним<br/>ходом</div></div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 14 }}>14:45 — 16:15</div>
        </div>
      </div>

      {/* day strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)', margin: '14px 0', color: 'rgba(255,255,255,.55)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Пн 30</span>
        <span style={{ fontSize: 15 }}>Вт 1</span>
        <span style={{ fontSize: 15 }}>Ср 2</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg>
      </div>

      {/* continue + streak */}
      <div style={{ padding: '6px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div onClick={e => goToFill('/theory', e)} style={{ borderRadius: 22, background: '#171717', padding: 22, cursor: 'pointer' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Продолжить</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-.4px' }}>Дорожные знаки</div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 4 }}>Урок 4 из 9 · теория</div>
          <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,.14)', marginTop: 16, overflow: 'hidden' }}><div style={{ height: '100%', width: '44%', background: '#EDE9DC', borderRadius: 999 }}/></div>
        </div>
        <div style={{ borderRadius: 22, background: '#171717', padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-.4px' }}>{user.streak_count} дней подряд</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>так держать — не теряй стрик</div>
          </div>
          <div style={{ fontSize: 30 }}>🔥</div>
        </div>
      </div>
    </div>
  )
}
