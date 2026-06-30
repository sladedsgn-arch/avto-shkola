import { useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { useAuthStore } from '@/store/authStore'

export function SettingsPage() {
  const { openMenu, goToFill } = useLayoutCtx()
  const logout = useAuthStore(s => s.logout)
  const [notif, setNotif] = useState(true)
  const [bio, setBio] = useState(false)

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <div onClick={onClick} style={{ width: 46, height: 28, borderRadius: 999, background: on ? '#EDE9DC' : 'rgba(255,255,255,.2)', position: 'relative', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: on ? '#000' : '#fff', transition: 'left .2s' }}/>
    </div>
  )

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#000', color: '#fff', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 30 }}>
        <h1 style={{ fontSize: 46, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.4px', margin: 0 }}>Настройки</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div onClick={e => goToFill('/profile', e)} style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.1)', cursor: 'pointer' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px' }}>Профиль</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.6"><path d="M9 6l6 6-6 6"/></svg></div>
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.1)' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px' }}>Уведомления</span><Toggle on={notif} onClick={() => setNotif(v => !v)} /></div>
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.1)' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px' }}>Биометрический вход</span><Toggle on={bio} onClick={() => setBio(v => !v)} /></div>
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.1)' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px' }}>Тема</span><span style={{ fontSize: 15, color: 'rgba(255,255,255,.5)' }}>Тёмная</span></div>
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.1)' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px' }}>Язык</span><span style={{ fontSize: 15, color: 'rgba(255,255,255,.5)' }}>Русский</span></div>
        <div onClick={logout} style={{ padding: '20px 0', cursor: 'pointer' }}><span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.3px', color: '#FF3A2D' }}>Выйти</span></div>
      </div>
    </div>
  )
}
