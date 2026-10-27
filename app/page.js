'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { fetchSheetProducts } from '../lib/sheets'
import { ArrowRight, Star, Sparkles } from 'lucide-react'

const MARQUEE = ['Skincare ✨','Maquillage 💄','Parfums 🌸','Corps 🌿','Solaire ☀️','Capillaire 💆','Beauté & Santé 🫧','Routines Beauté 💅']
const CATEGORIES = [
  { name:'Soins de la peau',    emoji:'✨', color:'#FFE4E8', text:'#C94070' },
  { name:'Maquillage',          emoji:'💄', color:'#EDE0FF', text:'#7B4FA6' },
  { name:'Parfums',             emoji:'🌸', color:'#FFE8D6', text:'#C4622D' },
  { name:'Corps',               emoji:'🌿', color:'#D6F5E8', text:'#2A8A5A' },
  { name:'Soins capillaires',   emoji:'💆', color:'#D6EFF8', text:'#2A7FA8' },
  { name:'Solaire',             emoji:'☀️', color:'#FFF5CC', text:'#B8860B' },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [count,    setCount]    = useState(0)

  useEffect(() => {
    fetchSheetProducts().then(p => { setProducts(p.slice(0,8)); setCount(p.length) }).catch(() => {})
  }, [])

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="hero-gradient min-h-[90vh] flex items-center overflow-hidden relative">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
               style={{ background:'radial-gradient(circle,var(--pink-light) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
               style={{ background:'radial-gradient(circle,var(--lavender) 0%,transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-up opacity-0"
                   style={{ background:'var(--blush)', animationFillMode:'forwards' }}>
                <Sparkles size={14} style={{ color:'var(--pink)' }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color:'var(--pink)' }}>Nouvelle collection</span>
              </div>

              <h1 className="font-display leading-[1.05] animate-fade-up opacity-0 delay-1"
                  style={{ fontSize:'clamp(2.6rem,5vw,4.8rem)', animationFillMode:'forwards', color:'var(--charcoal)' }}>
                La beauté qui<br/>te ressemble,<br/>
                <em className="not-italic shimmer-text">livrée chez toi.</em>
              </h1>

              <p className="mt-6 text-base leading-relaxed max-w-md animate-fade-up opacity-0 delay-2"
                 style={{ color:'var(--warm-gray)', animationFillMode:'forwards' }}>
                Skincare, maquillage, parfums et compléments — une sélection premium pour prendre soin de toi au quotidien.
              </p>

              <div className="flex flex-wrap gap-4 mt-10 animate-fade-up opacity-0 delay-3"
                   style={{ animationFillMode:'forwards' }}>
                <Link href="/shop" className="btn-pink">Découvrir la boutique <ArrowRight size={15}/></Link>
                <Link href="/shop" className="btn-outline-pink">Nos produits ♡</Link>
              </div>

              <div className="flex items-center gap-3 mt-10 animate-fade-up opacity-0 delay-4"
                   style={{ animationFillMode:'forwards' }}>
                <div className="flex">{[...Array(5)].map((_,i) => <Star key={i} size={14} fill="var(--gold)" style={{ color:'var(--gold)' }} />)}</div>
                <p className="text-xs" style={{ color:'var(--warm-gray)' }}>
                  <strong style={{ color:'var(--charcoal)' }}>4.9/5</strong> · Adorées par nos clientes 💕
                </p>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:flex justify-center items-center animate-scale-in opacity-0"
                 style={{ animationFillMode:'forwards', animationDelay:'0.3s' }}>
              <div className="relative">
                <div className="relative rounded-[32px] overflow-hidden"
                     style={{ boxShadow:'0 32px 80px rgba(255,107,157,0.25)', width:320, height:460 }}>
                  <img src="https://images.unsplash.com/photo-1617897903246-719242758050?w=700&q=80"
                       alt="Skincare" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -left-16 top-16 glass-card p-4 w-44 animate-float"
                     style={{ boxShadow:'0 8px 32px rgba(255,107,157,0.15)' }}>
                  <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_,i) => <Star key={i} size={10} fill="var(--gold)" style={{ color:'var(--gold)' }} />)}</div>
                  <p className="text-xs font-bold leading-tight" style={{ color:'var(--charcoal)' }}>"Ma peau brille comme jamais !"</p>
                  <p className="text-[10px] mt-1.5" style={{ color:'var(--warm-gray)' }}>— Aminata K.</p>
                </div>
                <div className="absolute -right-8 bottom-20 px-4 py-3 rounded-2xl"
                     style={{ background:'linear-gradient(135deg,var(--pink),var(--coral))', boxShadow:'0 8px 24px rgba(255,107,157,0.4)' }}>
                  <p className="text-white text-xs font-bold">🌸 100% Authentique</p>
                  <p className="text-white text-[10px] opacity-80 mt-0.5">Sélection premium</p>
                </div>
                {count > 0 && (
                  <div className="absolute -right-4 top-8 w-16 h-16 rounded-full flex flex-col items-center justify-center"
                       style={{ background:'white', boxShadow:'0 4px 20px rgba(255,107,157,0.2)', border:'3px solid var(--pink-pale)' }}>
                    <p className="font-display text-lg font-bold leading-none" style={{ color:'var(--pink)' }}>{count}</p>
                    <p className="text-[8px] tracking-wide uppercase" style={{ color:'var(--warm-gray)' }}>Produits</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden py-3" style={{ background:'var(--charcoal)' }}>
          <div className="animate-marquee">
            {[...MARQUEE,...MARQUEE].map((item,i) => (
              <span key={i} className="inline-flex items-center gap-5 px-6 text-xs tracking-widest uppercase flex-shrink-0 font-medium"
                    style={{ color:'var(--pink-light)' }}>
                {item}<span style={{ color:'var(--pink)', opacity:0.5 }}>♡</span>
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Nos catégories</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color:'var(--charcoal)' }}>Votre routine beauté</h2>
            <div className="pink-divider mt-4" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                    className="group flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    style={{ background: cat.color }}>
                <span className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125">{cat.emoji}</span>
                <p className="text-xs font-bold leading-tight" style={{ color: cat.text }}>{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Products */}
        {products.length > 0 && (
          <section style={{ background:'white' }}>
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="section-label mb-2">Sélection du moment</p>
                  <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color:'var(--charcoal)' }}>Nos coups de cœur 💕</h2>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-bold hover:gap-3 transition-all" style={{ color:'var(--pink)' }}>
                  Voir tout <ArrowRight size={13}/>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div className="text-center mt-10 md:hidden">
                <Link href="/shop" className="btn-pink inline-flex">Voir tous les produits</Link>
              </div>
            </div>
          </section>
        )}

        {/* Banner */}
        <section className="py-24 text-center relative overflow-hidden"
                 style={{ background:'linear-gradient(135deg,#2D1B2E 0%,#4A2050 50%,#2D1B2E 100%)' }}>
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <p className="font-script text-4xl mb-4" style={{ color:'var(--pink-light)' }}>Notre promesse</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color:'white' }}>
              "Chaque femme mérite des soins <span className="shimmer-text">d'exception.</span>"
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color:'rgba(255,255,255,0.6)' }}>
              Chez Body & Face, nous sélectionnons chaque produit avec soin — des formules prouvées, des ingrédients de qualité, pour une beauté qui te ressemble.
            </p>
            <Link href="/notre-histoire" className="btn-outline-pink inline-flex"
                  style={{ borderColor:'var(--pink-light)', color:'var(--pink-light)' }}>
              Notre histoire ♡
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ background:'var(--pink-pale)' }}>
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon:'🚚', title:'Livraison offerte', sub:"Dès 100 000 FCFA" },
              { icon:'✅', title:'100% Authentique',  sub:'Produits certifiés' },
              { icon:'↩', title:'Retours 3 jours',   sub:'Échange sous conditions' },
              { icon:'💬', title:'Support WhatsApp',  sub:'Réponse sous 24h' },
            ].map((b,i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 flex items-center justify-center rounded-full text-2xl"
                     style={{ background:'white', boxShadow:'0 4px 20px rgba(255,107,157,0.12)' }}>{b.icon}</div>
                <p className="font-display text-base font-bold" style={{ color:'var(--charcoal)' }}>{b.title}</p>
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
