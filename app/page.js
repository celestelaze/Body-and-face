'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ALL_CATEGORIES } from '../lib/sheets'
import { useProducts, sheetErrorMessage } from '../lib/useProducts'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Hero slides — remplace les imageUrl par tes vraies photos
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80',
    label: 'Skincare & Beauté',
    title: 'Découvrez un fini\ndoux et lumineux !',
    cta: 'Acheter maintenant',
    link: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=1200&q=80',
    label: 'Maquillage',
    title: 'Sublimez votre\nregard avec éclat',
    cta: 'Explorer la gamme',
    link: '/shop?cat=Maquillage+yeux',
  },
  {
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80',
    label: 'Soins Premium',
    title: 'Votre peau mérite\nle meilleur',
    cta: 'Voir les soins',
    link: '/shop?cat=Soin+de+la+peau+%26+outils',
  },
]

// ── Hero Carousel
function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const timer = useRef(null)

  function goTo(idx) {
    setVisible(false)
    setTimeout(() => { setCurrent((idx + HERO_SLIDES.length) % HERO_SLIDES.length); setVisible(true) }, 220)
  }
  useEffect(() => {
    timer.current = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(timer.current)
  }, [current])

  const slide = HERO_SLIDES[current]
  return (
    <div className="relative overflow-hidden" style={{ height:'clamp(280px,52vw,500px)', background:'#2D1B2E' }}>
      <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: visible?1:0 }}>
        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-top"/>
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right,rgba(45,27,46,0.7) 0%,rgba(45,27,46,0.1) 60%,transparent 100%)' }}/>
      </div>
      <div className="relative z-10 h-full flex items-center px-6 md:px-14 max-w-7xl mx-auto"
           style={{ opacity:visible?1:0, transition:'all 0.3s' }}>
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                style={{ background:'var(--pink)', color:'white' }}>{slide.label}</span>
          <h1 className="font-display text-white font-bold leading-tight mb-5"
              style={{ fontSize:'clamp(1.6rem,4vw,3.2rem)', whiteSpace:'pre-line', textShadow:'0 2px 20px rgba(0,0,0,0.3)' }}>
            {slide.title}
          </h1>
          <Link href={slide.link} className="btn-pink inline-flex">{slide.cta} <ArrowRight size={14}/></Link>
        </div>
      </div>
      <button onClick={() => goTo(current-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-20"
              style={{ background:'rgba(255,255,255,0.22)', backdropFilter:'blur(4px)', color:'white' }}>
        <ChevronLeft size={18}/>
      </button>
      <button onClick={() => goTo(current+1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-20"
              style={{ background:'rgba(255,255,255,0.22)', backdropFilter:'blur(4px)', color:'white' }}>
        <ChevronRight size={18}/>
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_,i) => (
          <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
                  style={{ width:i===current?18:6, height:6, background:i===current?'var(--pink)':'rgba(255,255,255,0.45)' }}/>
        ))}
      </div>
    </div>
  )
}

// ── Mini section card (2 produits) — style image soumise
function SectionCard({ title, emoji, color, textColor, filter, products, tag }) {
  const items = products.filter(p => {
    if (tag === 'tendance')    return p.isTendance
    if (tag === 'bestseller')  return p.isBestseller
    if (tag === 'promo')       return p.isPromo
    if (tag === 'coeur')       return p.isCoupDeCoeur
    return false
  }).slice(0, 2)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'white', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:'1px solid #F5F5F5' }}>
        <h3 className="font-display font-bold text-base flex items-center gap-1.5" style={{ color:'var(--charcoal)' }}>
          <span>{emoji}</span>
          <span style={{ color: tag==='promo' ? '#E53535' : tag==='bestseller' ? 'var(--coral)' : 'var(--charcoal)' }}>
            {title}
          </span>
        </h3>
        <Link href={`/shop?filter=${filter}`}
              className="text-xs font-bold flex items-center gap-0.5 hover:opacity-70 transition-opacity"
              style={{ color:'var(--warm-gray)' }}>
          Tout voir <ArrowRight size={12}/>
        </Link>
      </div>

      {/* Products */}
      {items.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-2xl mb-2">{emoji}</p>
          <p className="text-xs" style={{ color:'var(--warm-gray)' }}>Bientôt disponible 🌸</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-0">
          {items.map((p, i) => {
            const hasPromo  = p.promoPriceFCFA && p.promoPriceFCFA < p.priceFCFA
            const showPrice = hasPromo ? p.promoPriceFCFA : p.priceFCFA
            return (
              <div key={p.id} className="p-3 flex flex-col gap-2 group cursor-pointer"
                   style={{ borderRight: i===0?'1px solid #F5F5F5':'none' }}>
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio:'1', background: p.style?.color || '#FFE4EE' }}>
                  {p.imageUrl ? (
                    <img referrerPolicy="no-referrer" src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{p.style?.emoji || '🛍️'}</div>
                  )}
                  {p.isPromo && hasPromo && (
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background:'#E53535' }}>PROMO</span>
                  )}
                </div>
                {/* Price */}
                <div>
                  {hasPromo ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-sm leading-tight" style={{ color:'#E53535' }}>
                        {showPrice.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                      </span>
                      <span className="text-[10px] line-through" style={{ color:'#999' }}>
                        {p.priceFCFA.toLocaleString('fr-FR')}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-sm" style={{ color:'var(--charcoal)' }}>
                      {showPrice.toLocaleString('fr-FR')} <span className="text-[10px]" style={{ color:'var(--warm-gray)' }}>FCFA</span>
                    </span>
                  )}
                  <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color:'var(--warm-gray)' }}>{p.name}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Page
export default function HomePage() {
  const { products, loading, error } = useProducts()

  const hasBlackFriday = products.some(p => p.isBlackFriday)

  return (
    <>
      <Header />
      <main>

        {/* ── HERO CAROUSEL ─────────────────────────────── */}
        <HeroCarousel />

        {/* ── 16 CATEGORIES (cercles / photos) ─────────── */}
        <section style={{ background:'white', borderBottom:'1px solid #F0F0F0' }}>
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4">
              {ALL_CATEGORIES.map(cat => (
                <Link key={cat.name} href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                      className="group flex flex-col items-center text-center gap-1.5">
                  {/* Circle — photo ou emoji */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md flex-shrink-0"
                       style={{ background: cat.imageUrl ? 'transparent' : cat.color }}>
                    {cat.imageUrl
                      ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover"/>
                      : <span>{cat.emoji}</span>
                    }
                  </div>
                  <p className="text-[9px] md:text-[10px] font-semibold leading-tight"
                     style={{ color:'var(--charcoal)', maxWidth:68 }}>
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2×2 SECTIONS GRID ─────────────────────────── */}
        <section style={{ background:'#FAFAFA' }}>
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

            {/* Row 1: Tendances + Bestsellers */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
              <SectionCard title="Tendances"   emoji="🔥" tag="tendance"   filter="tendance"   products={products}/>
              <SectionCard title="Bestsellers" emoji="⭐" tag="bestseller" filter="bestseller" products={products}/>
            </div>

            {/* Row 2: Coup de cœur + Promos */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <SectionCard title="Coup de cœur" emoji="💕" tag="coeur" filter="coeur" products={products}/>
              <SectionCard title="Promotions"   emoji="🏷️" tag="promo" filter="promo" products={products}/>
            </div>

            {/* Black Friday — conditionnel */}
            {hasBlackFriday && (
              <div className="mt-3 md:mt-4 rounded-2xl overflow-hidden"
                   style={{ background:'#111', border:'2px solid #333' }}>
                <div className="flex items-center justify-between px-5 py-3">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    🖤 <span style={{ color:'#FFF' }}>BLACK FRIDAY</span>
                  </h3>
                  <Link href="/shop?filter=blackfriday"
                        className="text-xs font-bold flex items-center gap-0.5"
                        style={{ color:'rgba(255,255,255,0.5)' }}>
                    Tout voir <ArrowRight size={12}/>
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-0 px-3 pb-3">
                  {products.filter(p => p.isBlackFriday).slice(0,4).map((p, i) => {
                    const showPrice = p.promoPriceFCFA && p.promoPriceFCFA < p.priceFCFA ? p.promoPriceFCFA : p.priceFCFA
                    const hasPromo  = p.promoPriceFCFA && p.promoPriceFCFA < p.priceFCFA
                    return (
                      <div key={p.id} className="p-2 flex flex-col gap-2 cursor-pointer group">
                        <div className="rounded-xl overflow-hidden" style={{ aspectRatio:'1', background:'#222' }}>
                          {p.imageUrl
                            ? <img referrerPolicy="no-referrer" src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                            : <div className="w-full h-full flex items-center justify-center text-3xl">{p.style?.emoji}</div>
                          }
                        </div>
                        <div>
                          {hasPromo ? (
                            <>
                              <p className="font-bold text-sm" style={{ color:'#FF4444' }}>{showPrice.toLocaleString('fr-FR')} <span className="text-[9px]">FCFA</span></p>
                              <p className="text-[9px] line-through" style={{ color:'#666' }}>{p.priceFCFA.toLocaleString('fr-FR')}</p>
                            </>
                          ) : (
                            <p className="font-bold text-sm text-white">{showPrice.toLocaleString('fr-FR')} <span className="text-[9px]" style={{ color:'#888' }}>FCFA</span></p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── POUR VOUS — tous les produits ─────────────── */}
        <section style={{ background:'white' }}>
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-script text-xl md:text-2xl" style={{ color:'var(--pink)' }}>Pour vous ✨</p>
                <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                  {loading ? 'Chargement...' : `${products.length} produits`}
                </p>
              </div>
              <Link href="/shop" className="flex items-center gap-1 text-xs font-bold tracking-wider uppercase hover:gap-2 transition-all"
                    style={{ color:'var(--pink)' }}>
                Tout voir <ArrowRight size={12}/>
              </Link>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(10)].map((_,i) => (
                  <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                    <div className="aspect-[3/4]" style={{ background:'var(--cream-dark)' }}/>
                    <div className="p-3 space-y-2">
                      <div className="h-2.5 rounded-full w-3/4" style={{ background:'var(--cream-dark)' }}/>
                      <div className="h-2.5 rounded-full w-1/2" style={{ background:'var(--cream-dark)' }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20" style={{ background:'var(--pink-pale)', borderRadius:16 }}>
                <p className="text-5xl mb-3">🌸</p>
                <p className="font-display text-xl font-light" style={{ color:'var(--warm-gray)' }}>
                  {error ? sheetErrorMessage(error) : 'Les produits arrivent bientôt !'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map(p => <ProductCard key={p.id} product={p}/>)}
              </div>
            )}
          </div>
        </section>

        {/* ── BANNER ──────────────────────────────────────── */}
        <section className="py-14 text-center"
                 style={{ background:'linear-gradient(135deg,#2D1B2E,#4A2050)' }}>
          <div className="max-w-2xl mx-auto px-6">
            <p className="font-script text-3xl mb-3" style={{ color:'var(--pink-light)' }}>Notre promesse ♡</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
              "Chaque femme mérite des soins <span className="shimmer-text">d'exception.</span>"
            </h2>
            <Link href="/notre-histoire" className="btn-outline-pink inline-flex"
                  style={{ borderColor:'var(--pink-light)', color:'var(--pink-light)' }}>
              Notre histoire ♡
            </Link>
          </div>
        </section>

        {/* ── BENEFITS ────────────────────────────────────── */}
        <section style={{ background:'var(--pink-pale)' }}>
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon:'🚚', title:'Livraison offerte', sub:"Dès 100 000 FCFA" },
              { icon:'✅', title:'100% Authentique',  sub:'Produits certifiés' },
              { icon:'↩', title:'Retours 3 jours',   sub:'Échange sous conditions' },
              { icon:'💬', title:'Support WhatsApp',  sub:'Réponse sous 24h' },
            ].map((b,i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                     style={{ background:'white', boxShadow:'0 4px 16px rgba(255,107,157,0.1)' }}>{b.icon}</div>
                <p className="font-display text-sm font-bold" style={{ color:'var(--charcoal)' }}>{b.title}</p>
                <p className="text-xs" style={{ color:'var(--warm-gray)' }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
