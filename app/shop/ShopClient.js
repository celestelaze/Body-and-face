'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { ALL_CATEGORIES } from '../../lib/sheets'
import { useProducts, sheetErrorMessage } from '../../lib/useProducts'

const FILTERS = {
  tendance:    { label:'Tendances',    emoji:'🔥', test: p => p.isTendance },
  bestseller:  { label:'Bestsellers',  emoji:'⭐', test: p => p.isBestseller },
  coeur:       { label:'Coup de cœur', emoji:'💕', test: p => p.isCoupDeCoeur },
  promo:       { label:'Promotions',   emoji:'🏷️', test: p => p.isPromo },
  blackfriday: { label:'Black Friday', emoji:'🖤', test: p => p.isBlackFriday },
}
const price = p => (p.promoPriceFCFA > 0 ? p.promoPriceFCFA : p.priceFCFA)

function ShopInner() {
  const params      = useSearchParams()
  const catParam    = params.get('cat') || ''
  const filterParam = params.get('filter') || ''
  const { products, loading, error } = useProducts()

  const [activeCat, setActiveCat] = useState(catParam || 'all')
  const [search, setSearch]       = useState('')
  const [sortBy, setSortBy]       = useState('default')
  useEffect(() => { setActiveCat(catParam || 'all') }, [catParam])

  const presentCats = useMemo(
    () => ALL_CATEGORIES.filter(c => products.some(p => p.categoryName === c.name)), [products])

  const filtered = useMemo(() => {
    let res = [...products]
    if (FILTERS[filterParam]) res = res.filter(FILTERS[filterParam].test)
    if (activeCat !== 'all')  res = res.filter(p => p.categoryName === activeCat)
    if (search) res = res.filter(p => p.fullDescription.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'price-asc')  res.sort((a, b) => price(a) - price(b))
    if (sortBy === 'price-desc') res.sort((a, b) => price(b) - price(a))
    if (sortBy === 'name')       res.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    return res
  }, [products, activeCat, search, sortBy, filterParam])

  const info = FILTERS[filterParam]
  const dark = filterParam === 'blackfriday'

  return (
    <>
      <div className="py-12 md:py-16 text-center"
           style={{ background: dark ? 'linear-gradient(135deg,#111,#333)' : 'linear-gradient(135deg,#FFF0F8,#F8F0FF,#FFF5FB)' }}>
        {info ? (<>
          <p className="text-3xl mb-2">{info.emoji}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: dark ? 'white' : 'var(--charcoal)' }}>{info.label}</h1>
        </>) : (<>
          <p className="font-script text-2xl md:text-3xl" style={{ color:'var(--pink)' }}>Toute la boutique ✨</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1" style={{ color:'var(--charcoal)' }}>
            {activeCat === 'all' ? 'Tous nos produits' : activeCat}
          </h1>
        </>)}
        <p className="mt-2 text-xs" style={{ color: dark ? 'rgba(255,255,255,0.6)' : 'var(--warm-gray)' }}>
          {filtered.length} produit{filtered.length > 1 ? 's' : ''}
        </p>
        <div className="pink-divider mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {filterParam && (
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 hover:opacity-70"
                style={{ color:'var(--warm-gray)' }}><ArrowLeft size={13}/> Retour à la boutique</Link>
        )}

        <div className="relative mb-4 max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'var(--pink-light)' }}/>
          <input className="input-field pl-10 py-2.5 text-sm" placeholder="Rechercher..."
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {!filterParam && presentCats.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            <button className={`cat-pill ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>✨ Tout</button>
            {presentCats.map(c => (
              <button key={c.name} className={`cat-pill ${activeCat === c.name ? 'active' : ''}`}
                      onClick={() => setActiveCat(c.name)}>{c.name}</button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-5 pb-3" style={{ borderBottom:'1px solid var(--cream-dark)' }}>
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
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
            <p className="font-display text-xl font-light" style={{ color:'var(--warm-gray)' }}>
              {error ? sheetErrorMessage(error) : 'Aucun produit trouvé'}
            </p>
            {!error && (
              <button className="btn-outline-pink mt-5 inline-flex" onClick={() => { setActiveCat('all'); setSearch('') }}>Tout voir</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        )}
      </div>
    </>
  )
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <p className="font-script text-3xl animate-sparkle" style={{ color:'var(--pink)' }}>Chargement... 🌸</p></div>}>
          <ShopInner />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
