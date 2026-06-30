import { useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { sectionTheme, type SectionId } from '@/theme/sectionTheme'
import { useAuthStore } from '@/store/authStore'

const ROUTE_TO_SECTION: Record<string, SectionId> = {
  '/':                'home',
  '/theory':          'theory',
  '/signs':           'signs',
  '/tickets':         'tickets',
  '/quiz':            'quiz',
  '/exam':            'exam',
  '/schedule':        'schedule',
  '/booking':         'booking',
  '/profile':         'profile',
  '/achievements':    'achievements',
  '/payment':         'payment',
  '/settings':        'settings',
}

function routeSection(pathname: string): SectionId {
  if (pathname.startsWith('/theory/')) return 'module'
  if (pathname.startsWith('/quiz/'))   return 'quiz'
  if (pathname.startsWith('/result/')) return 'result'
  return ROUTE_TO_SECTION[pathname] ?? 'home'
}

const MENU_ITEMS = [
  { label: 'Главная',      path: '/' },
  { label: 'Теория',       path: '/theory' },
  { label: 'Билеты',       path: '/tickets' },
  { label: 'Экзамен',      path: '/exam' },
  { label: 'Расписание',   path: '/schedule' },
  { label: 'Достижения',   path: '/achievements' },
  { label: 'Знаки',        path: '/signs' },
  { label: 'Профиль',      path: '/profile' },
  { label: 'Оплата',       path: '/payment' },
  { label: 'Настройки',    path: '/settings' },
]

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const [menuOpen, setMenuOpen] = useState(false)

  const sectionId = routeSection(location.pathname)
  const theme = sectionTheme[sectionId] ?? sectionTheme.home

  // Fill-circle transition
  const screenRef = useRef<HTMLDivElement>(null)
  const ovRef = useRef<HTMLDivElement>(null)

  const goToFill = useCallback((path: string, e?: React.MouseEvent) => {
    const targetSection = routeSection(path)
    const targetTheme = sectionTheme[targetSection] ?? sectionTheme.home
    const ov = ovRef.current
    const screen = screenRef.current
    if (!ov || !screen || !e) {
      setMenuOpen(false)
      navigate(path)
      return
    }
    const rect = screen.getBoundingClientRect()
    const x = (e.clientX - rect.left)
    const y = (e.clientY - rect.top)
    ov.style.background = targetTheme.bg
    ov.style.display = 'block'
    ov.style.transition = 'none'
    ov.style.clipPath = `circle(0px at ${x}px ${y}px)`
    void ov.offsetWidth
    ov.style.transition = 'clip-path 640ms cubic-bezier(.7,0,.25,1)'
    ov.style.clipPath = `circle(1050px at ${x}px ${y}px)`
    const done = () => {
      ov.removeEventListener('transitionend', done)
      ov.style.display = 'none'
      ov.style.transition = 'none'
      ov.style.clipPath = 'circle(0px at 50% 50%)'
      setMenuOpen(false)
      navigate(path)
    }
    ov.addEventListener('transitionend', done)
  }, [navigate])

  if (!user) return <Outlet context={{ goToFill }} />

  const isLight = theme.fg === '#0B0B0B'

  return (
    <div
      ref={screenRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: theme.bg,
        transition: 'background 0.1s',
        overflow: 'hidden',
        fontFamily: "'Geist', sans-serif",
      }}
    >
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 50,
        zIndex: 60, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', padding: '0 28px 8px',
        pointerEvents: 'none', color: theme.fg, fontWeight: 600,
        fontSize: 15, letterSpacing: '.2px',
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="4" width="3" height="7" rx="1"/><rect x="10" y="1.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1" opacity=".35"/></svg>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.4c2 0 3.8.8 5.1 2l1.3-1.4A9.4 9.4 0 0 0 8.5.4 9.4 9.4 0 0 0 2 3l1.4 1.4A7.4 7.4 0 0 1 8.5 2.4Z"/><path d="M8.5 6c1 0 1.9.4 2.6 1l1.3-1.4A6 6 0 0 0 8.5 4 6 6 0 0 0 4.6 5.6L6 7a3.7 3.7 0 0 1 2.5-1Z"/><circle cx="8.5" cy="9.6" r="1.8"/></svg>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <span style={{ width: 22, height: 11, border: '1.4px solid currentColor', borderRadius: 3, display: 'inline-block', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: '1.5px', width: 14, background: 'currentColor', borderRadius: 1 }}/>
            </span>
            <span style={{ width: 1.6, height: 4, background: 'currentColor', borderRadius: 1 }}/>
          </span>
        </span>
      </div>

      {/* Page content */}
      <div
        className="noscroll"
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', color: theme.fg }}
      >
        <Outlet context={{ goToFill, openMenu: () => setMenuOpen(true) }} />
      </div>

      {/* Menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'absolute', inset: 0, background: '#000', color: '#fff',
          zIndex: 80, padding: '62px 24px 40px', display: 'flex', flexDirection: 'column',
          animation: 'menuDrop .42s cubic-bezier(.5,0,.1,1) both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 30 }}>
            {MENU_ITEMS.map((item, i) => (
              <div
                key={item.path}
                onClick={(e) => goToFill(item.path, e)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', color: location.pathname === item.path ? '#fff' : '#6E6E6E',
                  animation: `menuItemIn .5s both`, animationDelay: `${i * 40}ms`,
                }}
              >
                <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: -1, lineHeight: 1.18 }}>{item.label}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: location.pathname === item.path ? 1 : 0 }}><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 128, height: 5, borderRadius: 999,
        background: isLight ? 'rgba(11,11,11,.3)' : 'rgba(255,255,255,.35)',
        zIndex: 70, pointerEvents: 'none',
      }}/>

      {/* Fill overlay */}
      <div ref={ovRef} style={{
        position: 'absolute', inset: 0, zIndex: 120,
        display: 'none', pointerEvents: 'none',
        clipPath: 'circle(0px at 50% 50%)',
      }}/>
    </div>
  )
}

// Helper hook for child screens to access openMenu and goToFill
export { useOutletContext as useLayout } from 'react-router-dom'
