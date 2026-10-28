'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { fetchSheetProducts, ALL_CATEGORIES } from '../../lib/sheets'
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

const FILTER_LABELS = {
  tendance:    { label:'Tendances',   emoji:'🔥', color:'var(--pink)' },
  bestseller:  { label:'Bestsellers', emoji:'⭐', color:'var(--coral)' },
  promo:       { label:'Promotions',  emoji:'🏷️', color:'#E53535' },
  blackfriday: { label:'Black Friday',emoji:'🖤', color:'#111' },
}

function ShopInner() {
  const searchParams = useSearchParams()
  const catParam     = searchParams.get('cat')    || ''
  const filterParam  = searchParams.get('filter') || ''

  const [products,  setProducts]  = useState([])
  const [activeCat, setActiveCat] = useState(catParam || 'all')
  const [search,    setSearch]    = useState('')
  const [sortBy,    setSortBy]    = useState('default')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchSheetProducts().then(p => { setProducts(p); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { if (catParam) setActiveCat(catParam) }, [catParam])

  // All unique subcategories actually in the sheet
  const sheetCats = useMemo(() => {
    const s = new Set(products.map(p => p.subcategory).filter(Boolean))
    return Array.from(s)
  }, [products])

  const filtered = useMemo(() => {
    let res = [...products]
    // Filter by tag (filter param)
    if (filterParam === 'tendance')    res = res.filter(p => p.isTendance)
    if (filterParam === 'bestseller')  res = res.filter(p => p.isBestseller)
    if (filterParam === 'promo')       res = res.filter(p => p.isPromo)
    if (filterParam === 'blackfriday') res = res.filter(p => p.isBlackFriday)
    // Filter by category
    if (activeCat !== 'all') res = res.filter(p => p.subcategory === activeCat || p.category === activeCat)
    // Search
    if (search) res = res.filter(p => (p.name + ' ' + p.fullDescription).toLowerCase().includes(search.toLowerCase()))
    // Sort
    if (sortBy === 'price-asc')  res.sort((a,b) => (a.promoPriceFCFA||a.priceFCFA) - (b.promoPriceFCFA||b.priceFCFA))
    if (sortBy === 'price-desc') res.sort((a,b) => (b.promoPriceFCFA||b.priceFCFA) - (a.promoPriceFCFA||a.priceFCFA))
    if (sortBy === 'name')       res.sort((a,b) => a.name.localeCompare(b.name,'fr'))
    return res
  }, [products, activeCat, search, sortBy, filterParam])

  const filterInfo = filterParam ? FILTER_LABELS[filterParam] : null

  return (
    <>
      {/* Page header */}
      <div className="py-12 md:py-16 text-center"
           style={{ background: filterParam==='blackfriday'
             ? 'linear-gradient(135deg,#111,#333)'
             : 'linear-gradient(135deg,#FFF0F8,#F8F0FF,#FFF5FB)' }}>
        {filterInfo ? (
          <>
            <p className="text-3xl mb-2">{filterInfo.emoji}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold"
                style={{ color: filterParam==='blackfriday'?'white':'var(--charcoal)' }}>
              {filterInfo.label}
            </h1>
          </>
        ) : (
          <>
            <p className="font-script text-2xl md:text-3xl" style={{ color:'var(--pink)' }}>Toute la boutique ✨</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-1" style={{ color:'var(--charcoal)' }}>
              {activeCat === 'all' ? 'Tous nos produits' : activeCat}
            </h1>
          </>
        )}
        <p className="mt-2 text-xs" style={{ color: filterParam==='blackfriday'?'rgba(255,255,255,0.6)':'var(--warm-gray)' }}>
          {filtered.length} produit{filtered.length > 1 ? 's' : ''}
        </p>
        <div className="pink-divider mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back link if filtered */}
        {filterParam && (
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 hover:opacity-70 transition-opacity"
                style={{ color:'var(--warm-gray)' }}>
            <ArrowLeft size={13}/> Retour à la boutique
          </Link>
        )}

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'var(--pink-light)' }}/>
          <input className="input-field pl-10 py-2.5 text-sm" placeholder="🔍 Rechercher..."
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category pills — only show if no filter */}
        {!filterParam && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
            <button className={`cat-pill ${activeCat==='all'?'active':''}`} onClick={() => setActiveCat('all')}>
              ✨ Tout
            </button>
            {sheetCats.map(cat => (
              <button key={cat} className={`cat-pill ${activeCat===cat?'active':''}`}
                      onClick={() => setActiveCat(cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-5 pb-3"
             style={{ borderBottom:'1px solid var(--cream-dark)' }}>
          <p className="text-xs" style={{ color:'var(--warm-gray)' }}>
            <strong style={{ color:'var(--charcoal)' }}>{filtered.length}</strong> produits
          </p>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} style={{ color:'var(--warm-gray)' }}/>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-xs border rounded-full px-3 py-1.5 outline-none cursor-pointer"
                    style={{ borderColor:'var(--pink-light)', color:'var(--charcoal)', background:'white' }}>
              <option value="default">Par défaut</option>
              <option value="price-asc">Prix ↑</option>
              <option value="price-desc">Prix ↓</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="aspect-[3/4]" style={{ background:'var(--cream-dark)' }}/>
                <div className="p-3 space-y-2">
                  <div className="h-2.5 rounded-full w-3/4" style={{ background:'var(--cream-dark)' }}/>
                  <div className="h-2.5 rounded-full w-1/2" style={{ background:'var(--cream-dark)' }}/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🌸</p>
            <p className="font-display text-xl font-light" style={{ color:'var(--warm-gray)' }}>Aucun produit trouvé</p>
            <button className="btn-outline-pink mt-5 inline-flex"
                    onClick={() => { setActiveCat('all'); setSearch('') }}>
              Tout voir
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        )}

        {/* Sheet tip */}
        <div className="mt-10 p-4 rounded-2xl text-center"
             style={{ background:'var(--pink-pale)', border:'1px dashed var(--pink-light)' }}>
          <p className="text-xs" style={{ color:'var(--warm-gray)' }}>
            💡 <strong style={{ color:'var(--pink)' }}>Astuce :</strong> Ajoute une colonne <strong>I "Tag"</strong> dans ton Google Sheet
            avec les valeurs <em>Tendance</em>, <em>Bestseller</em>, <em>Promo</em> ou <em>BlackFriday</em> pour chaque produit.
            Et une colonne <strong>J "Prix Promo FCFA"</strong> pour afficher les prix barrés. 🌸
          </p>
        </div>
      </div>
    </>
  )
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <p className="font-script text-3xl animate-sparkle" style={{ color:'var(--pink)' }}>Chargement... 🌸</p>
          </div>
        }>
          <ShopInner />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
