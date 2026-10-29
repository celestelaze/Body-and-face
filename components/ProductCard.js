'use client'
import { ShoppingBag, Heart } from 'lucide-react'
import { useApp } from '../lib/context'

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const wished = isWishlisted(p.id)
  const style  = p.style || { emoji:'🛍️', color:'#FFE4EE', text:'#C94070' }
  const hasPromo = p.promoPriceFCFA > 0 && p.promoPriceFCFA < p.priceFCFA
  const price    = hasPromo ? p.promoPriceFCFA : p.priceFCFA
  const cartProduct = { id:p.id, name:p.name, price, image_url:p.imageUrl || '' }

  const badge = p.isBlackFriday ? { t:'🖤 BLACK FRIDAY', bg:'#111' }
    : p.isTendance   ? { t:'🔥 TENDANCE',   bg:'linear-gradient(135deg,#FF6B9D,#C4A8E8)' }
    : p.isBestseller ? { t:'⭐ BESTSELLER', bg:'linear-gradient(135deg,#E8A87C,#C4622D)' }
    : p.isCoupDeCoeur? { t:'💕 COUP DE CŒUR', bg:'linear-gradient(135deg,#FF6B9D,#FF8C69)' }
    : hasPromo       ? { t:'🏷️ PROMO',      bg:'linear-gradient(135deg,#FF4444,#FF8C69)' }
    : p.isNouveau    ? { t:'✨ NOUVEAU',    bg:'linear-gradient(135deg,#7ECBA1,#4A8A2A)' }
    : null

  return (
    <div className="product-card group relative flex flex-col bg-white">
      <div className="card-img relative overflow-hidden" style={{ aspectRatio:'3/4' }}>
        {p.imageUrl ? (
          <img referrerPolicy="no-referrer" src={p.imageUrl} alt={p.name} loading="lazy"
               style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', opacity: p.soldOut ? 0.55 : 1 }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3"
               style={{ background: style.color }}>
            <span className="text-5xl animate-float">{style.emoji}</span>
          </div>
        )}

        {badge && (
          <span className="absolute top-2 left-2 text-white text-[9px] px-2 py-1 rounded-full font-bold"
                style={{ background: badge.bg }}>{badge.t}</span>
        )}
        {p.soldOut && (
          <span className="absolute bottom-2 left-2 text-[10px] px-2.5 py-1 rounded-full font-bold bg-white"
                style={{ color:'#999' }}>ÉPUISÉ</span>
        )}

        <button onClick={() => toggleWishlist(cartProduct)} aria-label="Wishlist"
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all hover:scale-110"
                style={{ background: wished ? 'var(--pink)' : 'rgba(255,255,255,0.9)', color: wished ? 'white' : 'var(--pink)' }}>
          <Heart size={13} fill={wished ? 'white' : 'none'} />
        </button>

        {!p.soldOut && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
            <button onClick={() => addToCart(cartProduct)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-white text-[11px] font-bold tracking-widest uppercase"
                    style={{ background:'linear-gradient(135deg,rgba(255,107,157,0.95),rgba(255,140,105,0.95))' }}>
              <ShoppingBag size={13}/> Ajouter
            </button>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        {p.categoryName && (
          <span className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: style.text, opacity:0.7 }}>
            {p.categoryName}
          </span>
        )}
        <h3 className="font-display font-semibold leading-tight line-clamp-2 flex-1"
            style={{ color:'var(--charcoal)', fontSize:'12px' }}>{p.name}</h3>

        <div className="mt-2 flex items-center gap-2">
          {hasPromo ? (<>
            <span className="font-bold text-sm" style={{ color:'#E53535' }}>{price.toLocaleString('fr-FR')} FCFA</span>
            <span className="text-xs line-through" style={{ color:'#999' }}>{p.priceFCFA.toLocaleString('fr-FR')}</span>
          </>) : (
            <span className="font-bold text-sm" style={{ color:'var(--pink)' }}>{price.toLocaleString('fr-FR')} FCFA</span>
          )}
        </div>

        <button disabled={p.soldOut} onClick={() => addToCart(cartProduct)}
                className="mt-2 w-full py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95 md:hidden"
                style={{ background: p.soldOut ? '#CCC' : 'linear-gradient(135deg,var(--pink),var(--coral))' }}>
          {p.soldOut ? 'Épuisé' : '+ Panier'}
        </button>
      </div>
    </div>
  )
}
