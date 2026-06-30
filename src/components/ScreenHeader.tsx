interface Props {
  onMenu?: () => void
  onBack?: () => void
  color?: string
}

export function ScreenHeader({ onMenu, onBack, color = 'currentColor' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
      {onBack ? (
        <button onClick={onBack} style={{ background: 'none', border: 'none', color, cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      ) : onMenu ? (
        <button onClick={onMenu} style={{ background: 'none', border: 'none', color, cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
      ) : <span />}
      <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px', color }}>.auto</span>
    </div>
  )
}
