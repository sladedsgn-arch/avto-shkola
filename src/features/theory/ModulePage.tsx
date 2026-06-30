import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLayoutCtx } from '@/app/LayoutContext'
import { theoryRepo } from '@/db/repositories'
import type { TheoryModule } from '@/db/types'

const LESSONS = [
  { n: '01', title: 'Виды перекрёстков', sub: 'Регулируемые и нерегулируемые, равнозначные и неравнозначные.', video: true },
  { n: '02', title: 'Очерёдность проезда', sub: 'Правило правой руки и приоритет.', video: false },
  { n: '03', title: 'Светофор и регулировщик', sub: 'Сигналы и их приоритет над знаками.', video: false },
  { n: '04', title: 'Круговое движение', sub: 'Въезд, перестроение и выезд.', video: false },
]

export function ModulePage() {
  const { id } = useParams<{ id: string }>()
  const { goToFill } = useLayoutCtx()
  const [mod, setMod] = useState<TheoryModule | null>(null)
  const [tab, setTab] = useState<'preview' | 'details'>('preview')

  useEffect(() => {
    const mid = Number(id)
    theoryRepo.getModules().then(mods => {
      const found = mods.find(m => m.id === mid)
      if (found) setMod(found)
    })
  }, [id])

  const title = mod?.title ?? 'Проезд перекрёстков'

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#1F2BFF', color: '#fff', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={() => goToFill('/theory')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both' }}>
        <h1 style={{ fontSize: 40, lineHeight: .95, fontWeight: 600, letterSpacing: '-1.2px', margin: '0 0 20px' }}>{title}</h1>
        <button onClick={e => goToFill(`/quiz/${mod?.id ?? id}`, e)} style={{ height: 48, padding: '0 26px', borderRadius: 999, border: 'none', background: '#EDE9DC', color: '#0B0B0B', fontFamily: "'Geist',sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Начать модуль</button>
      </div>
      <div style={{ display: 'flex', gap: 26, margin: '30px 0 4px', borderBottom: '1px solid rgba(255,255,255,.18)' }}>
        <div onClick={() => setTab('preview')} style={{ paddingBottom: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', color: tab === 'preview' ? '#fff' : 'rgba(255,255,255,.5)', borderBottom: `2px solid ${tab === 'preview' ? '#fff' : 'transparent'}`, marginBottom: -1 }}>Превью</div>
        <div onClick={() => setTab('details')} style={{ paddingBottom: 12, fontSize: 16, fontWeight: 500, cursor: 'pointer', color: tab === 'details' ? '#fff' : 'rgba(255,255,255,.5)', borderBottom: `2px solid ${tab === 'details' ? '#fff' : 'transparent'}`, marginBottom: -1 }}>Детали</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 16, padding: '4px 0 22px', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, color: 'rgba(255,255,255,.6)', paddingTop: 2 }}>01</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{LESSONS[0].title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 5, lineHeight: 1.4 }}>{LESSONS[0].sub}</div>
            <div style={{ marginTop: 14, height: 150, borderRadius: 16, background: 'repeating-linear-gradient(45deg,rgba(255,255,255,.12) 0 11px,transparent 11px 22px)', border: '1px dashed rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 52, height: 52, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="#1F2BFF"><path d="M8 5v14l11-7z"/></svg></div>
              <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase' }}>видео 4:20</div>
            </div>
          </div>
        </div>
        {LESSONS.slice(1).map((l, i) => (
          <div key={l.n} style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.12)' : 'none' }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{l.n}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 600 }}>{l.title}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 5 }}>{l.sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
