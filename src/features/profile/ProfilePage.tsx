import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { useAuthStore } from '@/store/authStore'
import { theoryRepo, examRepo } from '@/db/repositories'

export function ProfilePage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [passedTickets, setPassedTickets] = useState(0)
  const [completedModules, setCompletedModules] = useState(0)
  const [totalModules, setTotalModules] = useState(6)

  useEffect(() => {
    examRepo.getPassedTickets(user.id).then(setPassedTickets)
    theoryRepo.getModules().then(mods => setTotalModules(mods.length))
    theoryRepo.getProgress(user.id).then(prog => setCompletedModules(prog.filter(p => p.done).length))
  }, [user.id])

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#FF49C0', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: 'rgba(11,11,11,.08)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
        <h1 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-.8px', margin: 0 }}>{user.full_name}</h1>
        <div style={{ fontSize: 15, color: 'rgba(11,11,11,.6)', marginTop: 6 }}>{user.phone}</div>
        <div style={{ display: 'inline-block', marginTop: 12, height: 34, lineHeight: '34px', padding: '0 16px', borderRadius: 999, background: '#0B0B0B', color: '#fff', fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1 }}>КАТЕГОРИЯ {user.category} · {user.gearbox}</div>
      </div>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 12 }}>Мой прогресс</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          [`${user.driving_hours}/56`, 'часов вождения'],
          [`${passedTickets}/40`, 'билетов сдано'],
          [`${completedModules}/${totalModules}`, 'модулей']
        ].map(([v, l]) => (
          <div key={l} style={{ flex: 1, borderRadius: 18, background: 'rgba(11,11,11,.1)', padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 11, color: 'rgba(11,11,11,.6)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden', background: 'rgba(11,11,11,.06)' }}>
        <div onClick={e => goToFill('/achievements', e)} style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid rgba(11,11,11,.1)' }}><span style={{ fontSize: 16, fontWeight: 500 }}>Достижения</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg></div>
        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(11,11,11,.1)' }}><span style={{ fontSize: 16, fontWeight: 500 }}>Документы</span><span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: 'rgba(11,11,11,.55)' }}>3 / 4</span></div>
        <div onClick={e => goToFill('/payment', e)} style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid rgba(11,11,11,.1)' }}><span style={{ fontSize: 16, fontWeight: 500 }}>Оплата курса</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg></div>
        <div onClick={e => goToFill('/settings', e)} style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ fontSize: 16, fontWeight: 500 }}>Настройки</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg></div>
      </div>
    </div>
  )
}
