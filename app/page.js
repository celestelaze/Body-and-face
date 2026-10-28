'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { fetchSheetProducts, ALL_CATEGORIES } from '../lib/sheets'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Hero slides (Celeste peut changer les URLs ici)
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80',
    label: 'Skincare & Beauté',
    title: 'Découvrez un fini\ndoux et lumineux !',
    cta: 'Acheter maintenant',
    link: '/shop',
    bg: '#FFE0EE',
  },
  {
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=1200&q=80',
    label: 'Maquillage',
    title: 'Sublimez votre\nregard avec éclat',
    cta: 'Explorer la gamme',
    link: '/shop?cat=Maquillage+yeux',
    bg: '#E8D5FF',
  },
  {
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80',
    label: 'Soins Premium',
    title: 'Votre peau mérite\nle meilleur',
    cta: 'Voir les soins',
    link: '/shop?cat=Soin+de+la+peau+%26+outils',
    bg: '#D6F5E8',
  },
]

// ── Hero Carousel
function HeroCarousel() {
  const [current, setCurrent]     = useState(0)
  const [animDir, setAnimDir]     = useState('')
  const [visible, setVisible]     = useState(true)
  const timerRef                  = useRef(null)

  function goTo(idx, dir = '') {
    setVisible(false)
    setAnimDir(dir)
    setTimeout(() => {
      setCurrent((idx + HERO_SLIDES.length) % HERO_SLIDES.length)
      setVisible(true)
    }, 220)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1, 'left'), 5000)
    return () => clearInterval(timerRef.current)
  }, [current])

  const slide = HERO_SLIDES[current]

  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(300px, 55vw, 520px)', background: slide.bg, transition:'background 0.4s' }}>
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
        <img src={slide.image} alt={slide.title}
             className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0"
             style={{ background:'linear-gradient(to right, rgba(45,27,46,0.65) 0%, rgba(45,27,46,0.2) 55%, transparent 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-16 max-w-7xl mx-auto"
           style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-15px)', transition:'all 0.3s' }}>
        <div>
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                style={{ background:'rgba(255,107,157,0.85)', color:'white' }}>
            {slide.label}
          </span>
          <h1 className="font-display text-white font-bold leading-tight mb-6"
              style={{ fontSize:'clamp(1.8rem,4.5vw,3.5rem)', whiteSpace:'pre-line',
                       textShadow:'0 2px 20px rgba(0,0,0,0.3)' }}>
            {slide.title}
          </h1>
          <Link href={slide.link} className="btn-pink inline-flex">
            {slide.cta} <ArrowRight size={15}/>
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => goTo(current - 1, 'right')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20"
              style={{ background:'rgba(255,255,255,0.25)', backdropFilter:'blur(4px)', color:'white' }}>
        <ChevronLeft size={20}/>
      </button>
      <button onClick={() => goTo(current + 1, 'left')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20"
              style={{ background:'rgba(255,255,255,0.25)', backdropFilter:'blur(4px)', color:'white' }}>
        <ChevronRight size={20}/>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_,i) => (
          <button key={i} onClick={() => goTo(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{ width: i===current?20:7, height:7, background: i===current?'var(--pink)':'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </div>
  )
}

// ── Product tabs section
function ProductTabs({ products }) {
  const [activeTab, setActiveTab] = useState('tous')

  const hasBlackFriday = products.some(p => p.isBlackFriday)

  const TABS = [
    { id:'tous',        label:'Pour vous',     emoji:'✨' },
    { id:'tendance',    label:'Tendances',      emoji:'🔥' },
    { id:'bestseller',  label:'Bestsellers',    emoji:'⭐' },
    { id:'promo',       label:'Promotions',     emoji:'🏷️' },
    ...(hasBlackFriday ? [{ id:'blackfriday', label:'Black Friday', emoji:'🖤' }] : []),
  ]

  const filtered = products.filter(p => {
    if (activeTab === 'tous')       return true
    if (activeTab === 'tendance')   return p.isTendance
    if (activeTab === 'bestseller') return p.isBestseller
    if (activeTab === 'promo')      return p.isPromo
    if (activeTab === 'blackfriday')return p.isBlackFriday
    return true
  })

  const tab = TABS.find(t => t.id === activeTab)

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all"
                  style={activeTab === t.id
                    ? { background: t.id==='blackfriday'?'#111':'linear-gradient(135deg,var(--pink),var(--coral))', color:'white', boxShadow:'0 4px 15px rgba(255,107,157,0.3)' }
                    : { background:'white', color:'var(--warm-gray)', border:'2px solid var(--cream-dark)' }}>
            {t.emoji} {t.label}
            {activeTab===t.id && filtered.length > 0 && (
              <span className="ml-1 opacity-70 text-[10px]">({filtered.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Section header with "Voir tout" link */}
      {activeTab !== 'tous' && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold" style={{ color:'var(--charcoal)' }}>
            {tab?.emoji} {tab?.label}
          </h2>
          <Link href={`/shop?filter=${activeTab}`}
                className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase transition-all hover:gap-2"
                style={{ color:'var(--pink)' }}>
            Voir tout <ArrowRight size={12}/>
          </Link>
        </div>
      )}

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ background:'var(--pink-pale)', borderRadius:16 }}>
          <p className="text-4xl mb-3">🌸</p>
          <p className="text-sm" style={{ color:'var(--warm-gray)' }}>
            {activeTab === 'blackfriday' ? 'Black Friday bientôt disponible !' : 'Aucun produit dans cette section pour l\'instant.'}
          </p>
          <p className="text-xs mt-1" style={{ color:'var(--pink)' }}>
            Ajoute un tag dans la colonne I de ton Google Sheet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filtered.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {filtered.length > 10 && (
        <div className="text-center mt-6">
          <Link href={`/shop?filter=${activeTab}`} className="btn-outline-pink inline-flex">
            Voir tous les {filtered.length} produits <ArrowRight size={13}/>
          </Link>
        </div>
      )}
    </section>
  )
}

// ── Main page
export default function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchSheetProducts().then(setProducts).catch(() => {})
  }, [])

  return (
    <>
      <Header />
      <main>

        {/* ── HERO CAROUSEL ──────────────────────────────── */}
        <HeroCarousel />

        {/* ── CATEGORIES GRID (16) ───────────────────────── */}
        <section style={{ background:'white' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
              {ALL_CATEGORIES.map(cat => (
                <Link key={cat.name}
                      href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                      className="group flex flex-col items-center text-center gap-2">
                  {/* Circle icon */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                       style={{ background: cat.color }}>
                    {cat.emoji}
                  </div>
                  <p className="text-[9px] md:text-[10px] font-semibold leading-tight text-center"
                     style={{ color:'var(--charcoal)', maxWidth:72 }}>
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Thin divider */}
        <div style={{ height:6, background:'linear-gradient(90deg,var(--pink),var(--lavender),var(--coral))' }} />

        {/* ── PRODUCT TABS ────────────────────────────────── */}
        <div style={{ background:'var(--cream)' }}>
          <ProductTabs products={products} />
        </div>

        {/* ── BRAND BANNER ─────────────────────────────────── */}
        <section className="py-16 text-center"
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

        {/* ── BENEFITS ─────────────────────────────────────── */}
        <section style={{ background:'var(--pink-pale)' }}>
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon:'🚚', title:'Livraison offerte', sub:"Dès 100 000 FCFA" },
              { icon:'✅', title:'100% Authentique',  sub:'Produits certifiés' },
              { icon:'↩', title:'Retours 3 jours',   sub:'Échange sous conditions' },
              { icon:'💬', title:'Support WhatsApp',  sub:'Réponse sous 24h' },
            ].map((b,i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                     style={{ background:'white', boxShadow:'0 4px 16px rgba(255,107,157,0.1)' }}>
                  {b.icon}
                </div>
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
