'use client'
import { ShoppingBag, Heart } from 'lucide-react'
import { useApp } from '../lib/context'

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const wished = isWishlisted(p.id)
  const style  = p.style || { bg:'linear-gradient(135deg,#FFE4E8,#FFCDD6)', emoji:'🛍️', text:'#C94070', color:'#FFE4E8' }

  const cartProduct = {
    id: p.id, name: p.name,
    price: p.promoPriceFCFA || p.priceFCFA,
    image_url: p.imageUrl || '',
    variants: [],
  }

  const displayPrice = p.promoPriceFCFA && p.promoPriceFCFA < p.priceFCFA ? p.promoPriceFCFA : p.priceFCFA
  const hasPromo     = p.promoPriceFCFA && p.promoPriceFCFA < p.priceFCFA

  return (
    <div className="product-card group relative flex flex-col bg-white">
      {/* Image */}
      <div className="card-img relative overflow-hidden" style={{ aspectRatio:'3/4' }}>
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name}
               style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3"
               style={{ background: `linear-gradient(135deg, ${style.color}, ${style.color}88)` }}>
            <span className="text-5xl animate-float">{style.emoji}</span>
            <span className="text-[10px] tracking-widest uppercase font-bold opacity-60 text-center px-2"
                  style={{ color: style.text }}>{p.subcategory}</span>
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {p.isBlackFriday && (
            <span className="badge text-white text-[9px] px-2 py-1 rounded-full font-bold"
                  style={{ background:'#111' }}>🖤 BLACK FRIDAY</span>
          )}
          {p.isTendance && (
            <span className="badge text-white text-[9px] px-2 py-1 rounded-full font-bold"
                  style={{ background:'linear-gradient(135deg,#FF6B9D,#C4A8E8)' }}>🔥 TENDANCE</span>
          )}
          {p.isBestseller && (
            <span className="badge text-white text-[9px] px-2 py-1 rounded-full font-bold"
                  style={{ background:'linear-gradient(135deg,#E8A87C,#C4622D)' }}>⭐ BESTSELLER</span>
          )}
          {p.isPromo && !p.isBestseller && !p.isTendance && (
            <span className="badge text-white text-[9px] px-2 py-1 rounded-full font-bold"
                  style={{ background:'linear-gradient(135deg,#FF4444,#FF8C69)' }}>🏷️ PROMO</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => toggleWishlist(p)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all hover:scale-110"
                style={{ background: wished ? 'var(--pink)' : 'rgba(255,255,255,0.9)', color: wished ? 'white' : 'var(--pink)' }}>
          <Heart size={13} fill={wished ? 'white' : 'none'} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={() => addToCart(cartProduct)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-white text-[11px] font-bold tracking-widest uppercase"
                  style={{ background:'linear-gradient(135deg,rgba(255,107,157,0.95),rgba(255,140,105,0.95))' }}>
            <ShoppingBag size={13}/> Ajouter
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Subcategory tag */}
        {p.subcategory && (
          <span className="text-[9px] font-bold tracking-widest uppercase mb-1"
                style={{ color: style.text, opacity:0.7 }}>{p.subcategory}</span>
        )}

        <h3 className="font-display text-xs font-semibold leading-tight line-clamp-2 flex-1"
            style={{ color:'var(--charcoal)', fontSize:'12px' }}>
          {p.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {hasPromo ? (
            <>
              <span className="font-bold text-sm" style={{ color:'#E53535' }}>
                {displayPrice.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-xs line-through opacity-50" style={{ color:'var(--warm-gray)' }}>
                {p.priceFCFA.toLocaleString('fr-FR')}
              </span>
            </>
          ) : (
            <span className="font-bold text-sm" style={{ color:'var(--pink)' }}>
              {displayPrice.toLocaleString('fr-FR')} FCFA
            </span>
          )}
        </div>

        {/* Mobile add btn */}
        <button onClick={() => addToCart(cartProduct)}
                className="mt-2 w-full py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95 md:hidden"
                style={{ background:'linear-gradient(135deg,var(--pink),var(--coral))' }}>
          + Panier
        </button>
      </div>
    </div>
  )
}
