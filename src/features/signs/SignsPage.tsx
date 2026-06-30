import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { signRepo } from '@/db/repositories'
import { useAuthStore } from '@/store/authStore'
import type { Sign } from '@/db/types'

const CATEGORIES = ['Все', 'Запрещающие', 'Предупреждающие', 'Предписывающие', 'Информационные', 'Приоритета']

export function SignsPage() {
  const { openMenu } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [signs, setSigns] = useState<Sign[]>([])
  const [category, setCategory] = useState('Все')
  const [saved, setSaved] = useState<Set<number>>(new Set())

  useEffect(() => {
    signRepo.getAll().then(setSigns)
    signRepo.getBookmarks(user.id).then(bks => setSaved(new Set(bks.map(b => b.sign_id))))
  }, [user.id])

  async function toggle(signId: number) {
    await signRepo.toggleBookmark(user.id, signId)
    setSaved(prev => {
      const s = new Set(prev)
      if (s.has(signId)) s.delete(signId); else s.add(signId)
      return s
    })
  }

  const filtered = category === 'Все' ? signs : signs.filter(s => s.category === category)

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#7A3CFF', color: '#fff', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 22 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', marginBottom: 10 }}>Справочник</div>
        <h1 style={{ fontSize: 44, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.3px', margin: 0 }}>Дорожные<br/>знаки</h1>
      </div>
      <div className="noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <div key={cat} onClick={() => setCategory(cat)} style={{ height: 36, padding: '0 16px', borderRadius: 999, background: category === cat ? '#fff' : 'transparent', color: category === cat ? '#7A3CFF' : '#fff', border: category === cat ? 'none' : '1.4px solid rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: category === cat ? 600 : 500, whiteSpace: 'nowrap', cursor: 'pointer' }}>{cat}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map(s => {
          const fav = saved.has(s.id)
          return (
            <div key={s.id} style={{ borderRadius: 18, background: 'rgba(255,255,255,.1)', padding: 16, position: 'relative' }}>
              <div onClick={() => toggle(s.id)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, cursor: 'pointer', color: fav ? '#fff' : 'rgba(255,255,255,.55)' }}>{fav ? '♥' : '♡'}</div>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'repeating-linear-gradient(45deg,rgba(255,255,255,.16) 0 8px,transparent 8px 16px)', border: '1px dashed rgba(255,255,255,.35)', marginBottom: 14 }}/>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-.3px' }}>{s.name}</div>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.6)', marginTop: 5 }}>{s.code}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
