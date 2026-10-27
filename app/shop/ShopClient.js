'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { fetchSheetProducts } from '../../lib/sheets'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ShopInner() {
  const searchParams = useSearchParams()
  const catParam     = searchParams.get('cat') || ''

  const [products,  setProducts]  = useState([])
  const [activeCat, setActiveCat] = useState(catParam || 'all')
  const [search,    setSearch]    = useState('')
  const [sortBy,    setSortBy]    = useState('default')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchSheetProducts().then(p => { setProducts(p); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { if (catParam) setActiveCat(catParam) }, [catParam])

  const allCats = useMemo(() => {
    const s = new Set(products.map(p => p.subcategory).filter(Boolean))
    return ['all', ...Array.from(s)]
  }, [products])

  const filtered = useMemo(() => {
    let res = [...products]
    if (activeCat !== 'all') res = res.filter(p => p.subcategory === activeCat || p.category === activeCat)
    if (search) res = res.filter(p => (p.name + p.fullDescription).toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'price-asc')  res.sort((a,b) => a.priceFCFA - b.priceFCFA)
    if (sortBy === 'price-desc') res.sort((a,b) => b.priceFCFA - a.priceFCFA)
    if (sortBy === 'name')       res.sort((a,b) => a.name.localeCompare(b.name, 'fr'))
    return res
  }, [products, activeCat, search, sortBy])

  return (
    <>
      {/* Page header */}
      <div className="py-16 text-center"
           style={{ background:'linear-gradient(135deg,#FFF0F8,#F8F0FF,#FFF5FB)' }}>
        <p className="font-script text-3xl" style={{ color:'var(--pink)' }}>Toute la boutique ✨</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2" style={{ color:'var(--charcoal)' }}>
          {activeCat === 'all' ? 'Tous nos produits' : activeCat}
        </h1>
        <p className="mt-2 text-sm" style={{ color:'var(--warm-gray)' }}>{filtered.length} produit{filtered.length > 1 ? 's' : ''}</p>
        <div className="pink-divider mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Search */}
        <div className="relative mb-5 max-w-md mx-auto">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'var(--pink-light)' }} />
          <input className="input-field pl-10" placeholder="🔍 Rechercher un produit..."
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {allCats.map(cat => (
            <button key={cat} className={`cat-pill ${activeCat === cat ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat)}>
              {cat === 'all' ? '✨ Tout' : cat}
            </button>
          ))}
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6 pb-4"
             style={{ borderBottom:'1px solid var(--cream-dark)' }}>
          <p className="text-sm" style={{ color:'var(--warm-gray)' }}>
            <strong style={{ color:'var(--charcoal)' }}>{filtered.length}</strong> produits
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={13} style={{ color:'var(--warm-gray)' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-xs border rounded-full px-3 py-2 outline-none cursor-pointer"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="aspect-[3/4]" style={{ background:'var(--cream-dark)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded-full w-3/4" style={{ background:'var(--cream-dark)' }} />
                  <div className="h-3 rounded-full w-1/2" style={{ background:'var(--cream-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">🌸</p>
            <p className="font-display text-2xl font-light" style={{ color:'var(--warm-gray)' }}>Aucun produit trouvé</p>
            <button className="btn-outline-pink mt-6 inline-flex" onClick={() => { setActiveCat('all'); setSearch('') }}>
              Voir tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Image tip */}
        <div className="mt-12 p-5 rounded-2xl text-center" style={{ background:'var(--pink-pale)', border:'1px dashed var(--pink-light)' }}>
          <p className="text-xs" style={{ color:'var(--warm-gray)' }}>
            💡 <strong style={{ color:'var(--pink)' }}>Pour afficher les photos :</strong> ajoute une colonne <strong>H "Image URL"</strong> dans ton Google Sheet avec l'URL directe de l'image de chaque produit. Le site se met à jour automatiquement ! 🌸
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
