'use client'
import { X, Heart, ShoppingBag } from 'lucide-react'
import { useApp } from '../lib/context'

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useApp()

  if (!wishlistOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={() => setWishlistOpen(false)} />
      <div className="drawer">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom: '1px solid var(--cream-dark)' }}>
          <div className="flex items-center gap-3">
            <Heart size={18} style={{ color: 'var(--gold)' }} />
            <h2 className="font-display text-xl font-medium" style={{ color: 'var(--charcoal)' }}>
              Ma Wishlist
            </h2>
            {wishlist.length > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                    style={{ background: 'var(--gold)' }}>
                {wishlist.length}
              </span>
            )}
          </div>
          <button onClick={() => setWishlistOpen(false)} className="p-1.5 hover:opacity-60"
                  style={{ color: 'var(--warm-gray)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <Heart size={40} style={{ color: 'var(--cream-dark)' }} strokeWidth={1} />
              <p className="font-display text-xl font-light" style={{ color: 'var(--warm-gray)' }}>
                Votre wishlist est vide
              </p>
              <button className="btn-outline text-xs" onClick={() => setWishlistOpen(false)}>
                Découvrir la boutique
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {wishlist.map(item => {
                const p = item.products
                return (
                  <div key={item.id} className="flex gap-4 pb-4"
                       style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden"
                         style={{ background: 'var(--cream-dark)' }}>
                      {p?.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight"
                         style={{ color: 'var(--charcoal)' }}>{p?.name}</p>
                      <p className="font-display text-sm font-medium mt-1"
                         style={{ color: 'var(--gold-dark)' }}>
                        {p?.price?.toLocaleString()} FCFA
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => addToCart(p)}
                                className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium px-3 py-1.5 transition-all"
                                style={{ background: 'var(--charcoal)', color: 'white' }}>
                          <ShoppingBag size={10} /> Ajouter
                        </button>
                        <button onClick={() => toggleWishlist(p)}
                                className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium px-3 py-1.5 border transition-all hover:bg-red-50"
                                style={{ color: '#C94E4E', borderColor: '#C94E4E' }}>
                          <X size={10} /> Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
