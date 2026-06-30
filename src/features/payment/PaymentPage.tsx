import { useLayoutCtx } from '@/app/LayoutContext'

export function PaymentPage() {
  const { openMenu } = useLayoutCtx()

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#D8F3E3', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 28 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(11,11,11,.5)', marginBottom: 10 }}>Курс категории B</div>
        <h1 style={{ fontSize: 46, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.4px', margin: 0 }}>Оплата<br/>курса</h1>
      </div>
      <div style={{ borderRadius: 24, background: '#0B0B0B', color: '#fff', padding: 26, marginBottom: 18 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Оплачено</div>
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1px', marginTop: 8 }}>28 000 ₽ <span style={{ fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,.5)' }}>/ 42 000 ₽</span></div>
        <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.18)', marginTop: 18, overflow: 'hidden' }}><div style={{ height: '100%', width: '66%', background: '#D8F3E3', borderRadius: 999 }}/></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,.6)' }}><span>осталось 14 000 ₽</span><span>66%</span></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden', background: 'rgba(11,11,11,.05)', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(11,11,11,.08)' }}><span style={{ fontSize: 14, color: 'rgba(11,11,11,.6)' }}>Последний платёж</span><span style={{ fontSize: 14, fontWeight: 600 }}>12 июня · 7 000 ₽</span></div>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 14, color: 'rgba(11,11,11,.6)' }}>Статус</span><span style={{ height: 28, lineHeight: '28px', padding: '0 12px', borderRadius: 999, background: '#0B0B0B', color: '#D8F3E3', fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: .5 }}>ПО ГРАФИКУ</span></div>
      </div>
      <button style={{ width: '100%', height: 62, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#fff', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, cursor: 'pointer' }}>Оплатить 7 000 ₽</button>
    </div>
  )
}
