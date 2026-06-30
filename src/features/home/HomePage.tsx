import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useLayoutCtx } from '@/app/LayoutContext'
import { theoryRepo, examRepo, lessonRepo, instructorRepo } from '@/db/repositories'
import { calcReadiness } from '@/lib/readiness'
import type { Lesson, Instructor } from '@/db/types'

const MONTH_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек']
const DAY_SHORT = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']

function fmtTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
function fmtEnd(iso: string, min: number) {
  const d = new Date(new Date(iso).getTime() + min * 60000)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function HomePage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [readiness, setReadiness] = useState(0)
  const [remainingModules, setRemainingModules] = useState(0)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [instructors, setInstructors] = useState<Record<number, Instructor>>({})

  useEffect(() => {
    async function load() {
      const [mods, progList, passed, allLessons, allInstructors] = await Promise.all([
        theoryRepo.getModules(),
        theoryRepo.getProgress(user.id),
        examRepo.getPassedTickets(user.id),
        lessonRepo.getUserLessons(user.id),
        instructorRepo.getAll(),
      ])
      const completed = progList.filter(p => p.done).length
      setRemainingModules(Math.max(0, mods.length - completed))
      setReadiness(calcReadiness({ completedModules: completed, totalModules: mods.length, passedTickets: passed, drivingHours: user.driving_hours }))

      const instrMap: Record<number, Instructor> = {}
      for (const i of allInstructors) instrMap[i.id] = i
      setInstructors(instrMap)

      const now = Date.now()
      const upcoming = allLessons
        .filter(l => l.status === 'soon' && new Date(l.scheduled_at).getTime() > now - 3600000)
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
        .slice(0, 3)
      setLessons(upcoming)
    }
    load()
  }, [user])

  const circ = 502
  const dashoffset = circ - circ * (readiness / 100)

  const today = new Date()
  const dayStrip = [-1, 0, 1].map(offset => {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    return { label: `${DAY_SHORT[d.getDay()]} ${d.getDate()}`, isToday: offset === 0 }
  })

  const CARD_COLORS = ['#93A8C7', '#EDE9DC', '#C7B8A8']

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
          <div style={{ height: 42, padding: '0 16px', borderRadius: 999, background: '#171717', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            Эта неделя
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
          </div>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.6)', fontSize: 22, letterSpacing: 1 }}>⋮</div>
        </div>
      </div>

      {/* Readiness ring */}
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

      {/* Lesson cards from DB */}
      {lessons.length > 0 ? (
        <div className="noscroll" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '18px 24px 8px', scrollSnapType: 'x mandatory' }}>
          {lessons.map((l, i) => {
            const instr = instructors[l.instructor_id]
            const d = new Date(l.scheduled_at)
            const typeLabel = l.lesson_type === 'driving' ? 'ИНСТРУКТОР · ВОЖДЕНИЕ' : 'ИНСТРУКТОР · ТЕОРИЯ'
            return (
              <div key={l.id} style={{ flex: '0 0 210px', height: 230, borderRadius: 22, background: CARD_COLORS[i % CARD_COLORS.length], color: '#0B0B0B', padding: 22, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{instr?.full_name ?? 'Инструктор'}</div>
                <div style={{ fontSize: 11, color: 'rgba(11,11,11,.55)', fontFamily: "'Geist Mono',monospace", letterSpacing: .5, marginTop: 3 }}>{typeLabel}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-.6px' }}>
                    {DAY_SHORT[d.getDay()]}, {d.getDate()} {MONTH_SHORT[d.getMonth()]}<br/>{l.place}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 14 }}>{fmtTime(l.scheduled_at)} — {fmtEnd(l.scheduled_at, l.duration_min)}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ margin: '18px 24px 8px', borderRadius: 22, background: '#171717', padding: 22 }}>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.5)' }}>Нет предстоящих занятий</div>
          <div onClick={e => goToFill('/booking', e)} style={{ marginTop: 10, fontSize: 15, color: '#EDE9DC', cursor: 'pointer', fontWeight: 600 }}>Записаться на вождение →</div>
        </div>
      )}

      {/* Day strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)', margin: '14px 0', color: 'rgba(255,255,255,.55)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        {dayStrip.map(({ label, isToday }) => (
          <span key={label} style={{ fontSize: 15, color: isToday ? '#fff' : 'rgba(255,255,255,.55)', fontWeight: isToday ? 600 : 400 }}>{label}</span>
        ))}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg>
      </div>

      {/* Continue + streak */}
      <div style={{ padding: '6px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div onClick={e => goToFill('/theory', e)} style={{ borderRadius: 22, background: '#171717', padding: 22, cursor: 'pointer' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Продолжить</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-.4px' }}>Теория ПДД</div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 4 }}>{remainingModules} модулей осталось</div>
          <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,.14)', marginTop: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${readiness}%`, background: '#EDE9DC', borderRadius: 999, transition: 'width 1s' }}/>
          </div>
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
