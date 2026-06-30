import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { achievementRepo } from '@/db/repositories'
import { useAuthStore } from '@/store/authStore'
import type { Achievement, UserAchievement } from '@/db/types'

export function AchievementsPage() {
  const { openMenu } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [all, setAll] = useState<Achievement[]>([])
  const [earned, setEarned] = useState<UserAchievement[]>([])

  useEffect(() => {
    achievementRepo.getAll().then(setAll)
    achievementRepo.getUserAchievements(user.id).then(setEarned)
  }, [user.id])

  const earnedIds = new Set(earned.map(e => e.achievement_id))
  const unlockedCount = earnedIds.size

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#FF7A00', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 24, position: 'relative' }}>
        <span style={{ fontFamily: "'Geist Mono',monospace", position: 'absolute', right: 6, top: -6, fontSize: 20, animation: 'twinkle 3s infinite' }}>✦</span>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(11,11,11,.55)', marginBottom: 10 }}>{unlockedCount} из {all.length} открыто</div>
        <h1 style={{ fontSize: 46, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.4px', margin: 0 }}>Достижения</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {all.map(a => {
          const locked = !earnedIds.has(a.id)
          const ua = earned.find(e => e.achievement_id === a.id)
          const sub = locked ? 'заблокировано' : ua ? new Date(ua.unlocked_at).toLocaleDateString('ru', { day: 'numeric', month: 'long' }) : ''
          return (
            <div key={a.id} style={{ aspectRatio: '1/1.05', borderRadius: 20, background: locked ? 'rgba(11,11,11,.08)' : '#0B0B0B', color: locked ? 'rgba(11,11,11,.5)' : '#FF7A00', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: locked ? .55 : 1 }}>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 18 }}>{a.icon ?? '★'}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1, letterSpacing: '-.4px' }}>{a.title}</div>
                <div style={{ fontSize: 11, opacity: .7, marginTop: 6 }}>{sub}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
