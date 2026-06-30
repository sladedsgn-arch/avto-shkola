import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { theoryRepo } from '@/db/repositories'
import { useAuthStore } from '@/store/authStore'
import type { TheoryModule, UserTheoryProgress } from '@/db/types'

// pct хранится для прогресса; в макете показаны фиксированные значения,
// здесь подмешиваем реальный прогресс пользователя поверх дизайна.
const FALLBACK_PCT: Record<number, string> = { 1: '44%', 2: '100%', 3: '20%', 4: '0%', 5: '60%', 6: '0%' }

export function TheoryPage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [modules, setModules] = useState<TheoryModule[]>([])
  const [progress, setProgress] = useState<UserTheoryProgress[]>([])

  useEffect(() => {
    theoryRepo.getModules().then(setModules)
    theoryRepo.getProgress(user.id).then(setProgress)
  }, [user.id])

  function pctFor(m: TheoryModule) {
    const p = progress.find(x => x.module_id === m.id)
    if (p?.done) return '100%'
    return FALLBACK_PCT[m.id] ?? '0%'
  }

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#1F2BFF', color: '#fff', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 26 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>Раздел</div>
        <h1 style={{ fontSize: 52, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.6px', margin: 0 }}>Теория</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.map(m => (
          <div key={m.id} onClick={e => goToFill(`/theory/${m.id}`, e)} style={{ borderRadius: 20, background: 'rgba(255,255,255,.1)', padding: 20, cursor: 'pointer', animation: 'riseUpSm .5s both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.5px', maxWidth: '78%', lineHeight: 1.05 }}>{m.title}</div>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase' }}>{m.tag}</div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 8 }}>{m.total_lessons} уроков · {m.estimated_time}</div>
            <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,.18)', marginTop: 16, overflow: 'hidden' }}><div style={{ height: '100%', background: '#fff', borderRadius: 999, width: pctFor(m) }}/></div>
          </div>
        ))}
      </div>
    </div>
  )
}
