'use client'
import { ShoppingBag, Heart, ExternalLink } from 'lucide-react'
import { useApp } from '../lib/context'

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const wished = isWishlisted(p.id)
  const style  = p.style || { bg:'linear-gradient(135deg,#FFE4E8,#FFCDD6)', emoji:'🛍️', color:'#C94070' }

  // Build a product-like object for the cart (Sheet products have different shape)
  const cartProduct = {
    id:        p.id,
    name:      p.name,
    price:     p.priceFCFA,
    image_url: p.imageUrl || '',
    variants:  [],
  }

  return (
    <div className="product-card group relative flex flex-col">
      {/* Image / gradient card */}
      <div className="card-img relative overflow-hidden" style={{ aspectRatio:'3/4' }}>
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name}
               style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        ) : (
          /* Beautiful gradient placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3"
               style={{ background: style.bg }}>
            <span className="text-6xl animate-float">{style.emoji}</span>
            <span className="text-[10px] tracking-widest uppercase font-bold opacity-50"
                  style={{ color: style.color }}>{p.subcategory}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
             style={{ background:'linear-gradient(to top, rgba(45,27,46,0.6) 0%, transparent 60%)' }}>
          <button onClick={() => addToCart(cartProduct)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-white text-xs font-bold tracking-widest uppercase"
                  style={{ background:'linear-gradient(135deg,rgba(255,107,157,0.9),rgba(255,140,105,0.9))' }}>
            <ShoppingBag size={14} /> Ajouter au panier
          </button>
        </div>

        {/* Wishlist btn */}
        <button onClick={() => toggleWishlist(p)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                style={{ background: wished ? 'var(--pink)' : 'rgba(255,255,255,0.9)', color: wished ? 'white' : 'var(--pink)' }}>
          <Heart size={15} fill={wished ? 'white' : 'none'} />
        </button>

        {/* Subcategory badge */}
        {p.subcategory && (
          <span className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ background:'rgba(255,255,255,0.9)', color: style.color }}>
            {p.subcategory}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2 flex-1"
            style={{ color:'var(--charcoal)' }}>
          {p.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-display text-lg font-bold" style={{ color:'var(--pink)' }}>
              {p.priceFCFA?.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          {/* Add to cart small btn */}
          <button onClick={() => addToCart(cartProduct)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 md:hidden"
                  style={{ background:'linear-gradient(135deg,var(--pink),var(--coral))', color:'white' }}>
            <ShoppingBag size={14} />
          </button>
        </div>

        {/* Shein link */}
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer"
             className="mt-2 flex items-center gap-1 text-[10px] tracking-wide opacity-40 hover:opacity-70 transition-opacity"
             style={{ color:'var(--warm-gray)' }}>
            <ExternalLink size={9} /> Voir la source
          </a>
        )}
      </div>
    </div>
  )
}
