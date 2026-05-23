'use client'
import { ShoppingBag, Heart } from 'lucide-react'
import { useApp } from '../lib/context'

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const wished = isWishlisted(p.id)

  const badgeClass = p.badge === 'Nouveau' ? 'badge-new'
                   : p.badge === 'Bestseller' ? 'badge-best'
                   : p.badge === 'Promo' ? 'badge-sale' : ''

  return (
    <div className="product-card group">
      <div className="card-img relative aspect-[3/4]" style={{ background: 'var(--cream-dark)' }}>
        {p.image_url ? (
          <img src={p.image_url} alt={p.name}
               style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🧴</div>
        )}

        {p.badge && <span className={`badge ${badgeClass} absolute top-3 left-3`}>{p.badge}</span>}

        {/* Wishlist btn */}
        <button onClick={() => toggleWishlist(p)}
                className="absolute top-3 right-3 w-9 h-9 bg-white flex items-center justify-center shadow-md transition-all"
                style={{
                  color: wished ? '#C94E4E' : 'var(--charcoal)',
                  opacity: wished ? 1 : 0,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => { if (!wished) e.currentTarget.style.opacity = 0 }}>
          <Heart size={15} fill={wished ? '#C94E4E' : 'none'} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full btn-primary justify-center py-3" onClick={() => addToCart(p)}>
            <ShoppingBag size={14} /> Ajouter au panier
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {(p.variants || []).slice(0, 4).length > 0 && (
          <div className="flex gap-1.5 mb-2.5 flex-wrap">
            {(p.variants || []).slice(0, 4).map((v, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 border"
                    style={{ color: 'var(--warm-gray)', borderColor: '#E0D8D0' }}>
                {v.value}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-display text-base font-medium leading-tight" style={{ color: 'var(--charcoal)' }}>
          {p.name}
        </h3>
        <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
          {p.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-medium" style={{ color: 'var(--charcoal)' }}>
              {Number(p.price).toLocaleString()} FCFA
            </span>
            {p.original_price && (
              <span className="text-xs line-through" style={{ color: 'var(--warm-gray)' }}>
                {Number(p.original_price).toLocaleString()} FCFA
              </span>
            )}
          </div>
          <button onClick={() => toggleWishlist(p)}
                  style={{ color: wished ? '#C94E4E' : 'var(--cream-dark)' }}
                  className="transition-colors hover:text-red-400">
            <Heart size={15} fill={wished ? '#C94E4E' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}
