import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { useAuthStore } from '@/store/authStore'
import { lessonRepo, instructorRepo } from '@/db/repositories'
import type { Lesson, Instructor } from '@/db/types'

const DAY_SHORT = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
const MONTH_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек']

function fmtDate(iso: string) {
  const d = new Date(iso)
  return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function SchedulePage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [tab, setTab] = useState<'list' | 'week' | 'month'>('list')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [instructors, setInstructors] = useState<Record<number, Instructor>>({})

  useEffect(() => {
    async function load() {
      const [allLessons, allInstructors] = await Promise.all([
        lessonRepo.getUserLessons(user.id),
        instructorRepo.getAll(),
      ])
      const instrMap: Record<number, Instructor> = {}
      for (const i of allInstructors) instrMap[i.id] = i
      setInstructors(instrMap)
      const sorted = [...allLessons].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
      setLessons(sorted)
    }
    load()
  }, [user.id])

  const now = Date.now()
  const upcoming = lessons.filter(l => new Date(l.scheduled_at).getTime() >= now - 3600000)
  const past = lessons.filter(l => new Date(l.scheduled_at).getTime() < now - 3600000)
  const displayed = tab === 'list' ? upcoming : lessons

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
        {([['list', 'Предстоящие'], ['week', 'Все']] as const).map(([t, label]) => (
          <div key={t} onClick={() => setTab(t)} style={{ height: 40, padding: '0 20px', borderRadius: 999, background: tab === t ? '#0B0B0B' : 'transparent', color: tab === t ? '#F4D400' : '#0B0B0B', border: tab === t ? 'none' : '1.4px solid rgba(11,11,11,.3)', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: tab === t ? 600 : 500, cursor: 'pointer' }}>{label}</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {displayed.length === 0 && (
          <div style={{ padding: 20, borderRadius: 20, background: 'rgba(11,11,11,.08)', fontSize: 15, color: 'rgba(11,11,11,.5)' }}>Занятий нет</div>
        )}
        {displayed.map(l => {
          const instr = instructors[l.instructor_id]
          const isPast = new Date(l.scheduled_at).getTime() < now
          const typeLabel = l.lesson_type === 'driving' ? 'Вождение' : 'Теория'
          return (
            <div key={l.id} style={{ borderRadius: 20, background: isPast ? 'rgba(11,11,11,.08)' : '#0B0B0B', color: isPast ? '#0B0B0B' : '#fff', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, color: isPast ? 'rgba(11,11,11,.55)' : '#F4D400', textTransform: 'uppercase' }}>{typeLabel} · {l.duration_min} мин</span>
                {isPast && <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: 'rgba(11,11,11,.4)' }}>ПРОШЛО</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, marginTop: 10, letterSpacing: '-.4px' }}>{fmtDate(l.scheduled_at)}</div>
              <div style={{ fontSize: 14, color: isPast ? 'rgba(11,11,11,.6)' : 'rgba(255,255,255,.65)', marginTop: 4 }}>{instr?.full_name ?? 'Инструктор'} · {l.place}</div>
            </div>
          )
        })}
        {tab === 'list' && past.length > 0 && (
          <div onClick={() => setTab('week')} style={{ textAlign: 'center', fontSize: 13, color: 'rgba(11,11,11,.5)', cursor: 'pointer', padding: '8px 0' }}>
            + {past.length} прошедших занятий
          </div>
        )}
      </div>

      <button onClick={e => goToFill('/booking', e)} style={{ width: '100%', height: 60, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        Записаться на вождение
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  )
}
