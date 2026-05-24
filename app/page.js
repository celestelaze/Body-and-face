'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { fetchCategories, fetchProducts } from '../lib/supabase'
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react'

const MARQUEE = ['Skincare Éclat','Soins Corps Luxueux','Protection Solaire','Compléments Beauté','Parfums Signature','Soin Capillaire','Routines Beauté','Ingrédients Premium']

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featured,   setFeatured]   = useState([])
  const [latest,     setLatest]     = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchProducts({ featured: true }),
      fetchProducts(),
    ]).then(([cats, feat, all]) => {
      setCategories(cats)
      setFeatured(feat)
      setLatest(all)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero-gradient min-h-[92vh] relative flex items-center overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30"
               style={{ background: 'radial-gradient(circle,var(--blush) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
               style={{ background: 'radial-gradient(circle,var(--gold-light) 0%,transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center py-24">
            <div className="relative z-10">
              <p className="section-label animate-fade-up opacity-0" style={{ animationFillMode:'forwards' }}>
                Nouvelle Collection
              </p>
              <h1 className="font-display mt-4 leading-[1.1] animate-fade-up opacity-0 delay-1"
                  style={{ fontSize:'clamp(3rem,6vw,5.5rem)', animationFillMode:'forwards' }}>
                La beauté,<br />
                <em className="not-italic shimmer-text">c'est un rituel.</em>
              </h1>
              <p className="mt-6 text-base leading-relaxed max-w-md animate-fade-up opacity-0 delay-2"
                 style={{ color:'var(--warm-gray)', animationFillMode:'forwards' }}>
                Découvrez notre sélection de soins premium — skincare, corps, solaire et compléments. Des formules d'exception pour révéler votre plus belle version.
              </p>
              <div className="flex flex-wrap gap-4 mt-10 animate-fade-up opacity-0 delay-3"
                   style={{ animationFillMode:'forwards' }}>
                <Link href="/shop" className="btn-primary">
                  Découvrir la boutique <ArrowRight size={14} />
                </Link>
                <Link href="/shop?featured=true" className="btn-outline">Nos Bestsellers</Link>
              </div>
              <div className="flex gap-10 mt-14 animate-fade-up opacity-0 delay-4"
                   style={{ animationFillMode:'forwards' }}>
                {[['2K+','Clientes'],['98%','Satisfaction'],['100%','Naturel']].map(([n,l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl font-semibold shimmer-text">{n}</p>
                    <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color:'var(--warm-gray)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:flex justify-center items-center animate-scale-in opacity-0"
                 style={{ animationFillMode:'forwards', animationDelay:'0.3s' }}>
              <div className="relative w-full max-w-sm">
                <div className="relative rounded-2xl overflow-hidden"
                     style={{ boxShadow:'0 32px 80px rgba(30,28,26,0.18)' }}>
                  <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&q=80"
                       alt="Skincare" className="w-full object-cover" style={{ height:'520px' }} />
                  <div className="absolute inset-0"
                       style={{ background:'linear-gradient(to top,rgba(30,28,26,0.3) 0%,transparent 60%)' }} />
                </div>
                {/* Floating review card */}
                <div className="absolute -left-16 top-20 bg-white p-4 rounded-xl shadow-lg w-44"
                     style={{ border:'1px solid var(--cream-dark)' }}>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_,i) => <Star key={i} size={10} fill="var(--gold)" stroke="none" />)}
                  </div>
                  <p className="font-display text-sm font-medium" style={{ color:'var(--charcoal)' }}>
                    "Ma peau n'a jamais été aussi belle !"
                  </p>
                  <p className="text-[10px] mt-2" style={{ color:'var(--warm-gray)' }}>— Salma R.</p>
                </div>
                {/* Floating product card */}
                <div className="absolute -right-10 bottom-24 bg-white p-3 rounded-xl shadow-lg"
                     style={{ border:'1px solid var(--cream-dark)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80"
                           className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium" style={{ color:'var(--charcoal)' }}>Sérum Vit. C</p>
                      <p className="text-[10px]" style={{ color:'var(--gold)' }}>890 FCFA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────── */}
        <div className="overflow-hidden py-4" style={{ background:'var(--charcoal)' }}>
          <div className="animate-marquee">
            {[...MARQUEE,...MARQUEE].map((item,i) => (
              <span key={i} className="inline-flex items-center gap-4 px-6"
                    style={{ color:'var(--gold-light)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase' }}>
                {item}<span style={{ color:'var(--gold)', opacity:0.5 }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── CATEGORIES ───────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="section-label">Explorer par catégorie</p>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color:'var(--charcoal)' }}>
              Votre rituel beauté complet
            </h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop?cat=${cat.slug}`}
                    className="group flex flex-col items-center text-center p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ background: cat.color || 'var(--cream-dark)' }}>
                <span className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                <p className="font-display text-sm font-medium leading-tight" style={{ color:'var(--charcoal)' }}>{cat.name}</p>
                <p className="text-[10px] mt-1.5 tracking-widest uppercase" style={{ color:'var(--gold)' }}>Voir tout →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED ─────────────────────────────────── */}
        {featured.length > 0 && (
          <section style={{ background:'white' }}>
            <div className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="section-label">Sélection du moment</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color:'var(--charcoal)' }}>
                    Nos coups de cœur
                  </h2>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-medium hover:gap-3 transition-all"
                      style={{ color:'var(--gold-dark)' }}>
                  Voir tout <ArrowRight size={13} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── BRAND STORY ──────────────────────────────── */}
        <section className="relative overflow-hidden py-28" style={{ background:'var(--charcoal)' }}>
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage:'radial-gradient(circle at 80% 50%,var(--gold) 0%,transparent 60%)' }} />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <p className="section-label" style={{ color:'var(--gold-light)' }}>Notre philosophie</p>
            <h2 className="font-display text-4xl md:text-6xl font-light mt-5 leading-tight" style={{ color:'white' }}>
              "La beauté authentique naît d'ingrédients{' '}
              <em className="not-italic shimmer-text">d'exception.</em>"
            </h2>
            <p className="mt-8 text-base leading-relaxed max-w-xl mx-auto"
               style={{ color:'rgba(255,255,255,0.6)' }}>
              Chaque produit Body & Face est soigneusement sélectionné pour ses formules cliniquement prouvées, ses ingrédients naturels de qualité premium et son impact visible sur votre peau.
            </p>
            <Link href="/shop" className="btn-gold mt-10 inline-flex">
              Découvrir nos formules <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── ALL PRODUCTS ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="section-label">Toute la gamme</p>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color:'var(--charcoal)' }}>
              Explorez notre univers
            </h2>
            <div className="gold-divider mt-5" />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[var(--cream-dark)]" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-[var(--cream-dark)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--cream-dark)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {latest.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary">
              Voir tous les produits <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── BENEFITS ─────────────────────────────────── */}
        <section style={{ background:'var(--cream-dark)' }}>
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon:<Truck size={22}/>,     title:'Livraison offerte', sub:"Dès 100 000 FCFA d'achat" },
              { icon:<Shield size={22}/>,    title:'100% Authentique',  sub:'Produits certifiés' },
              { icon:<RefreshCw size={22}/>, title:'Retours 3 jours',  sub:'Échange sous conditions' },
              { icon:<Star size={22}/>,      title:'Service Premium',   sub:'Support 7j/7' },
            ].map((b,i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full"
                     style={{ background:'var(--cream)', color:'var(--gold)' }}>{b.icon}</div>
                <p className="font-display text-base font-medium" style={{ color:'var(--charcoal)' }}>{b.title}</p>
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
