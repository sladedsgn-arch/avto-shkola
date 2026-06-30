import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { instructorRepo, lessonRepo } from '@/db/repositories'
import { useAuthStore } from '@/store/authStore'
import type { Instructor } from '@/db/types'

const SLOTS = ['09:00', '11:00', '13:30', '15:00', '17:00', '18:30']
const DURATION_MIN = 90
const DAY_NAMES = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']

function getUpcomingDays(count: number) {
  const days: Date[] = []
  const today = new Date()
  for (let i = 1; days.length < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) days.push(d)
  }
  return days
}

function formatICSDate(date: Date, timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
}

function downloadICS(date: Date, timeStr: string, instr: Instructor) {
  const [h, m] = timeStr.split(':').map(Number)
  const start = new Date(date)
  start.setHours(h, m, 0, 0)
  const end = new Date(start.getTime() + DURATION_MIN * 60000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const endStr = `${end.getFullYear()}${pad(end.getMonth()+1)}${end.getDate()}T${pad(end.getHours())}${pad(end.getMinutes())}00`

  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Автошкола//.auto//RU',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(date, timeStr)}`,
    `DTEND:${endStr}`,
    `SUMMARY:Вождение · ${instr.full_name}`,
    `DESCRIPTION:Занятие по вождению ${DURATION_MIN} мин.\\n${instr.car_model} · ${instr.gear_type}`,
    'STATUS:CONFIRMED',
    `UID:avto-${Date.now()}@avto-shkola`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'lesson.ics'; a.click()
  URL.revokeObjectURL(url)
}

export function BookingPage() {
  const { goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const days = getUpcomingDays(7)

  const [pickedInstr, setPickedInstr] = useState<Instructor | null>(null)
  const [pickedSlot, setPickedSlot] = useState(1)
  const [pickedDay, setPickedDay] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    instructorRepo.getAll().then(list => {
      setInstructors(list)
      if (list.length) setPickedInstr(list[0])
    })
  }, [])

  async function handleConfirm() {
    if (!pickedInstr) return
    const [h, m] = SLOTS[pickedSlot].split(':').map(Number)
    const date = new Date(days[pickedDay])
    date.setHours(h, m, 0, 0)
    await lessonRepo.add({
      user_id: user.id,
      instructor_id: pickedInstr.id,
      lesson_type: 'driving',
      scheduled_at: date.toISOString(),
      duration_min: DURATION_MIN,
      place: 'Городской маршрут',
      status: 'soon',
    })
    setConfirmed(true)
  }

  const selectedDate = days[pickedDay]
  const dateShort = selectedDate
    ? `${DAY_NAMES[selectedDate.getDay()].charAt(0).toUpperCase() + DAY_NAMES[selectedDate.getDay()].slice(1)}, ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`
    : ''
  const dateLabel = selectedDate
    ? `${DAY_NAMES[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`
    : ''

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#F4D400', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <button onClick={() => goToFill('/schedule')} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>

      {confirmed && pickedInstr ? (
        <div style={{ textAlign: 'center', marginTop: 40, animation: 'fadeIn .5s both' }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: '#0B0B0B', color: '#F4D400', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', animation: 'popIn .5s both' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-1px', margin: '0 0 12px', lineHeight: 1 }}>Запись<br/>подтверждена</h1>
          <div style={{ fontSize: 16, color: 'rgba(11,11,11,.65)', lineHeight: 1.6 }}>
            {pickedInstr.full_name}<br/>{dateShort} · {SLOTS[pickedSlot]}<br/>
            <span style={{ fontSize: 13 }}>{pickedInstr.car_model} · {pickedInstr.gear_type}</span>
          </div>
          <button onClick={() => downloadICS(selectedDate, SLOTS[pickedSlot], pickedInstr)}
            style={{ marginTop: 28, width: '100%', height: 58, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
            Добавить в Календарь
          </button>
          <button onClick={() => goToFill('/schedule')}
            style={{ marginTop: 10, width: '100%', height: 52, borderRadius: 999, border: '1.4px solid rgba(11,11,11,.3)', background: 'transparent', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            В расписание
          </button>
        </div>
      ) : (
        <>
          <div style={{ animation: 'riseUp .5s both', marginBottom: 22 }}>
            <h1 style={{ fontSize: 38, lineHeight: .95, fontWeight: 600, letterSpacing: '-1.1px', margin: 0 }}>Запись на<br/>вождение</h1>
          </div>

          {/* Дата */}
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 12 }}>Дата</div>
          <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {days.map((d, idx) => {
              const active = idx === pickedDay
              return (
                <div key={idx} onClick={() => setPickedDay(idx)} style={{ flexShrink: 0, width: 58, borderRadius: 16, background: active ? '#0B0B0B' : 'rgba(11,11,11,.06)', color: active ? '#F4D400' : '#0B0B0B', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', cursor: 'pointer', border: `1.4px solid ${active ? '#0B0B0B' : 'rgba(11,11,11,.15)'}` }}>
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, textTransform: 'uppercase', opacity: .7 }}>{DAY_NAMES[d.getDay()]}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{d.getDate()}</div>
                </div>
              )
            })}
          </div>

          {/* Инструктор */}
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 12 }}>Инструктор</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {instructors.map(i => {
              const active = i.id === pickedInstr?.id
              return (
                <div key={i.id} onClick={() => setPickedInstr(i)} style={{ borderRadius: 20, background: active ? '#0B0B0B' : 'rgba(11,11,11,.05)', color: active ? '#fff' : '#0B0B0B', padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', border: `1.4px solid ${active ? '#0B0B0B' : 'rgba(11,11,11,.15)'}` }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: active ? 'rgba(255,255,255,.12)' : 'rgba(11,11,11,.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                    {i.full_name.includes('Наталья') ? '👩' : '👨'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.3px' }}>{i.full_name}</div>
                    <div style={{ fontSize: 12, opacity: .7, marginTop: 2 }}>{i.car_model}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>★ {i.rating}</div>
                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, opacity: .6 }}>{i.gear_type}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Время */}
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 12 }}>Время · {dateLabel}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
            {SLOTS.map((t, idx) => {
              const active = idx === pickedSlot
              return (
                <div key={t} onClick={() => setPickedSlot(idx)} style={{ height: 50, borderRadius: 14, background: active ? '#0B0B0B' : 'transparent', color: active ? '#F4D400' : '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, cursor: 'pointer', border: `1.4px solid ${active ? '#0B0B0B' : 'rgba(11,11,11,.3)'}` }}>{t}</div>
              )
            })}
          </div>

          <button onClick={handleConfirm} disabled={!pickedInstr}
            style={{ width: '100%', height: 58, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#F4D400', fontFamily: "'Geist',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            Подтвердить запись
          </button>
        </>
      )}
    </div>
  )
}
