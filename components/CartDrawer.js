'use client'
import { X, Minus, Plus, ShoppingBag, MessageCircle, Trash2 } from 'lucide-react'
import { useApp } from '../lib/context'
import { supabase } from '../lib/supabase'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '242064731996'

// ── Generate order reference BF-DDMM-NNN ──────────────────
function generateOrderRef() {
  const now  = new Date()
  const dd   = String(now.getDate()).padStart(2, '0')
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const key  = `bf_counter_${dd}${mm}`
  const prev = parseInt(localStorage.getItem(key) || '0', 10)
  const next = prev + 1
  localStorage.setItem(key, String(next))
  // Clean other day keys
  Object.keys(localStorage).filter(k => k.startsWith('bf_counter_') && k !== key)
    .forEach(k => localStorage.removeItem(k))
  return `BF-${dd}${mm}-${String(next).padStart(3, '0')}`
}

function buildWhatsAppMessage(cart, profile, ref) {
  const name  = profile?.full_name || 'Client'
  const phone = profile?.phone     || ''
  let msg = `🛍️ *NOUVELLE COMMANDE — ${ref}*\n\n`
  msg += `Bonjour Body & Face !\n\n`
  cart.forEach(item => {
    const p  = item.products
    const vs = (item.selected_variants || []).map(v => `${v.type}: ${v.value}`).join(', ')
    msg += `📦 *${p.name}*\n`
    if (vs) msg += `   ↳ ${vs}\n`
    msg += `   Qté: ${item.quantity} × ${Number(p.price).toLocaleString()} FCFA = *${(p.price * item.quantity).toLocaleString()} FCFA*\n\n`
  })
  const total = cart.reduce((s, i) => s + i.products.price * i.quantity, 0)
  msg += `━━━━━━━━━━━━━━━\n`
  msg += `💰 *TOTAL : ${total.toLocaleString()} FCFA*\n`
  msg += `🔖 *Référence : ${ref}*\n\n`
  msg += `👤 Nom : ${name}\n`
  if (phone) msg += `📞 Téléphone : ${phone}\n`
  msg += `\n_Merci de confirmer ma commande_ 🌸`
  return encodeURIComponent(msg)
}

export default function CartDrawer() {
  const { cart, cartTotal, cartCount, cartOpen, setCartOpen, updateCartQty, removeFromCart, emptyCart, profile, user } = useApp()

  if (!cartOpen) return null

  async function checkout() {
    const ref = generateOrderRef()
    const msg = buildWhatsAppMessage(cart, profile, ref)

    // Save order to Supabase
    if (user) {
      await supabase.from('orders').insert({
        user_id:        user.id,
        reference:      ref,
        items:          cart.map(i => ({ product_id: i.product_id, name: i.products?.name, price: i.products?.price, quantity: i.quantity, variants: i.selected_variants })),
        total_amount:   cartTotal,
        customer_name:  profile?.full_name || '',
        customer_phone: profile?.phone     || '',
        status:         'pending',
        whatsapp_sent:  true,
      })
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    emptyCart()
    setCartOpen(false)
  }

  return (
    <>
      <div className="drawer-overlay" onClick={() => setCartOpen(false)} />
      <div className="drawer">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom: '1px solid var(--cream-dark)' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} style={{ color: 'var(--gold)' }} />
            <h2 className="font-display text-xl font-medium" style={{ color: 'var(--charcoal)' }}>Mon Panier</h2>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                    style={{ background: 'var(--charcoal)' }}>{cartCount}</span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1.5 hover:opacity-60" style={{ color: 'var(--warm-gray)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ShoppingBag size={40} style={{ color: 'var(--cream-dark)' }} strokeWidth={1} />
              <p className="font-display text-xl font-light" style={{ color: 'var(--warm-gray)' }}>Votre panier est vide</p>
              <button className="btn-outline text-xs" onClick={() => setCartOpen(false)}>Découvrir la boutique</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => {
                const p  = item.products
                const vs = item.selected_variants || []
                return (
                  <div key={item.id} className="flex gap-4 pb-4" style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
                      {p?.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight" style={{ color: 'var(--charcoal)' }}>{p?.name}</p>
                      {vs.length > 0 && (
                        <p className="text-xs mt-1" style={{ color: 'var(--warm-gray)' }}>{vs.map(v => v.value).join(' · ')}</p>
                      )}
                      <p className="font-display text-sm font-medium mt-1.5" style={{ color: 'var(--gold-dark)' }}>
                        {(p?.price * item.quantity).toLocaleString()} FCFA
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="qty-btn" onClick={() => updateCartQty(item.product_id, item.quantity - 1)}>−</button>
                        <span className="text-sm font-medium w-6 text-center" style={{ color: 'var(--charcoal)' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.product_id, item.quantity + 1)}>+</button>
                        <button className="ml-2 hover:opacity-60 transition-opacity" onClick={() => removeFromCart(item.product_id)} style={{ color: '#C94E4E' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid var(--cream-dark)', background: 'white' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--warm-gray)' }}>Total</span>
              <span className="font-display text-2xl font-medium" style={{ color: 'var(--charcoal)' }}>{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <button onClick={checkout}
                    className="w-full flex items-center justify-center gap-2 py-4 font-dm text-sm font-medium tracking-widest uppercase text-white transition-all hover:-translate-y-0.5"
                    style={{ background: '#25D366', letterSpacing: '0.1em' }}>
              <MessageCircle size={17} />
              Commander via WhatsApp
            </button>
            <p className="text-center text-[10px] mt-2.5" style={{ color: 'var(--warm-gray)' }}>
              Une référence de commande sera générée automatiquement
            </p>
          </div>
        )}
      </div>
    </>
  )
}
