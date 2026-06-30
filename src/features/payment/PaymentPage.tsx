import { useEffect, useState } from 'react'
import { useLayoutCtx } from '@/app/LayoutContext'
import { useAuthStore } from '@/store/authStore'
import { paymentRepo } from '@/db/repositories'
import type { Payment } from '@/db/types'

export function PaymentPage() {
  const { openMenu } = useLayoutCtx()
  const user = useAuthStore(s => s.user)!
  const [payment, setPayment] = useState<Payment | null>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    paymentRepo.getUserPayments(user.id).then(ps => {
      if (ps.length) setPayment(ps[0])
    })
  }, [user.id])

  const total = payment?.total_cost ?? 42000
  const paid = payment?.amount ?? 28000
  const remaining = total - paid
  const pct = Math.round((paid / total) * 100)

  async function handlePay() {
    if (!payment) return
    const nextPaid = Math.min(paid + 7000, total)
    const updated: Payment = { ...payment, amount: nextPaid, paid_at: new Date().toISOString() }
    await paymentRepo.update(updated)
    setPayment(updated)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const lastDate = payment?.paid_at
    ? new Date(payment.paid_at).toLocaleDateString('ru', { day: 'numeric', month: 'long' })
    : '12 июня'

  return (
    <div className="noscroll" style={{ position: 'absolute', inset: 0, background: '#D8F3E3', color: '#0B0B0B', overflowY: 'auto', padding: '62px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={openMenu} style={{ background: 'none', border: 'none', color: '#0B0B0B', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="28" height="14" viewBox="0 0 28 14" stroke="currentColor" strokeWidth="1.4"><line x1="0" y1="3" x2="20" y2="3"/><line x1="0" y1="10" x2="28" y2="10"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' }}>.auto</span>
      </div>
      <div style={{ animation: 'riseUp .55s cubic-bezier(.2,.7,.2,1) both', marginBottom: 28 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(11,11,11,.5)', marginBottom: 10 }}>Курс категории {user.category}</div>
        <h1 style={{ fontSize: 46, lineHeight: .92, fontWeight: 600, letterSpacing: '-1.4px', margin: 0 }}>Оплата<br/>курса</h1>
      </div>
      <div style={{ borderRadius: 24, background: '#0B0B0B', color: '#fff', padding: 26, marginBottom: 18 }}>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Оплачено</div>
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1px', marginTop: 8 }}>{paid.toLocaleString('ru')} ₽ <span style={{ fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,.5)' }}>/ {total.toLocaleString('ru')} ₽</span></div>
        <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.18)', marginTop: 18, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: '#D8F3E3', borderRadius: 999, transition: 'width .6s cubic-bezier(.3,1,.3,1)' }}/></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,.6)' }}><span>осталось {remaining.toLocaleString('ru')} ₽</span><span>{pct}%</span></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden', background: 'rgba(11,11,11,.05)', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(11,11,11,.08)' }}><span style={{ fontSize: 14, color: 'rgba(11,11,11,.6)' }}>Последний платёж</span><span style={{ fontSize: 14, fontWeight: 600 }}>{lastDate} · 7 000 ₽</span></div>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 14, color: 'rgba(11,11,11,.6)' }}>Статус</span><span style={{ height: 28, lineHeight: '28px', padding: '0 12px', borderRadius: 999, background: '#0B0B0B', color: '#D8F3E3', fontFamily: "'Geist Mono',monospace", fontSize: 11, letterSpacing: .5 }}>ПО ГРАФИКУ</span></div>
      </div>
      {remaining > 0 ? (
        <button onClick={handlePay} style={{ width: '100%', height: 62, borderRadius: 999, border: 'none', background: '#0B0B0B', color: '#fff', fontFamily: "'Geist',sans-serif", fontSize: 17, fontWeight: 600, cursor: 'pointer' }}>
          Оплатить {Math.min(remaining, 7000).toLocaleString('ru')} ₽
        </button>
      ) : (
        <div style={{ width: '100%', height: 62, borderRadius: 999, background: 'rgba(11,11,11,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, color: 'rgba(11,11,11,.5)' }}>Курс полностью оплачен ✓</div>
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', background: '#0B0B0B', color: '#D8F3E3', padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: "'Geist',sans-serif", animation: 'riseUpSm .3s both', zIndex: 999, whiteSpace: 'nowrap' }}>
          Платёж проведён ✓
        </div>
      )}
    </div>
  )
}
