'use client'
import { X, Minus, Plus, ShoppingBag, MessageCircle, Trash2 } from 'lucide-react'
import { useApp } from '../lib/context'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '242064731996'

function buildWhatsAppMessage(cart, profile) {
  const name  = profile?.full_name || 'Client'
  const phone = profile?.phone     || ''
  let msg = `Bonjour Body & Face ! 👋\n\nJe souhaite passer une commande :\n\n`
  cart.forEach(item => {
    const p  = item.products
    const vs = (item.selected_variants || []).map(v => `${v.type}: ${v.value}`).join(', ')
    msg += `📦 *${p.name}*\n`
    if (vs) msg += `   ${vs}\n`
    msg += `   Qté: ${item.quantity} | Prix: ${(p.price * item.quantity).toLocaleString()} FCFA\n\n`
  })
  const total = cart.reduce((s, i) => s + i.products.price * i.quantity, 0)
  msg += `💰 *Total: ${total.toLocaleString()} FCFA*\n\n`
  msg += `👤 Nom: ${name}\n`
  if (phone) msg += `📞 Téléphone: ${phone}\n`
  msg += `\nMerci ! 🌸`
  return encodeURIComponent(msg)
}

export default function CartDrawer() {
  const { cart, cartTotal, cartCount, cartOpen, setCartOpen, updateCartQty, removeFromCart, profile } = useApp()

  if (!cartOpen) return null

  function checkout() {
    const msg = buildWhatsAppMessage(cart, profile)
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
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
            <h2 className="font-display text-xl font-medium" style={{ color: 'var(--charcoal)' }}>
              Mon Panier
            </h2>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                    style={{ background: 'var(--charcoal)' }}>
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1.5 hover:opacity-60"
                  style={{ color: 'var(--warm-gray)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ShoppingBag size={40} style={{ color: 'var(--cream-dark)' }} strokeWidth={1} />
              <p className="font-display text-xl font-light" style={{ color: 'var(--warm-gray)' }}>
                Votre panier est vide
              </p>
              <button className="btn-outline text-xs" onClick={() => setCartOpen(false)}>
                Découvrir la boutique
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => {
                const p  = item.products
                const vs = (item.selected_variants || [])
                return (
                  <div key={item.id} className="flex gap-4 pb-4"
                       style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden"
                         style={{ background: 'var(--cream-dark)' }}>
                      {p?.image_url && (
                        <img src={p.image_url} alt={p.name}
                             className="w-full h-full object-cover" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight"
                         style={{ color: 'var(--charcoal)' }}>{p?.name}</p>
                      {vs.length > 0 && (
                        <p className="text-xs mt-1" style={{ color: 'var(--warm-gray)' }}>
                          {vs.map(v => v.value).join(' · ')}
                        </p>
                      )}
                      <p className="font-display text-sm font-medium mt-1.5"
                         style={{ color: 'var(--gold-dark)' }}>
                        {(p?.price * item.quantity).toLocaleString()} FCFA
                      </p>
                      {/* Qty stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button className="qty-btn"
                                onClick={() => updateCartQty(item.product_id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center"
                              style={{ color: 'var(--charcoal)' }}>
                          {item.quantity}
                        </span>
                        <button className="qty-btn"
                                onClick={() => updateCartQty(item.product_id, item.quantity + 1)}>
                          +
                        </button>
                        <button className="ml-2 hover:opacity-60 transition-opacity"
                                onClick={() => removeFromCart(item.product_id)}
                                style={{ color: '#C94E4E' }}>
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
              <span className="text-xs tracking-widest uppercase font-medium"
                    style={{ color: 'var(--warm-gray)' }}>Total</span>
              <span className="font-display text-2xl font-medium" style={{ color: 'var(--charcoal)' }}>
                {cartTotal.toLocaleString()} FCFA
              </span>
            </div>
            <button onClick={checkout}
                    className="w-full flex items-center justify-center gap-2 py-4 font-dm text-sm font-medium tracking-widest uppercase text-white transition-all hover:-translate-y-0.5"
                    style={{ background: '#25D366', letterSpacing: '0.1em' }}>
              <MessageCircle size={17} />
              Commander via WhatsApp
            </button>
            <p className="text-center text-[10px] mt-2.5" style={{ color: 'var(--warm-gray)' }}>
              Vous serez redirigé vers WhatsApp pour finaliser
            </p>
          </div>
        )}
      </div>
    </>
  )
}
