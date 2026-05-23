'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { fetchCategories, fetchProducts } from '../../lib/supabase'
import { Search } from 'lucide-react'

function ShopContent() {
  const searchParams = useSearchParams()
  const catParam     = searchParams.get('cat')

  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [activeCat,  setActiveCat]  = useState(catParam || 'all')
  const [sortBy,     setSortBy]     = useState('default')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const filters = {}
    if (activeCat !== 'all') filters.category = activeCat
    if (search)              filters.search   = search
    fetchProducts(filters).then(data => {
      let sorted = [...data]
      if (sortBy === 'price-asc')  sorted.sort((a,b) => a.price - b.price)
      if (sortBy === 'price-desc') sorted.sort((a,b) => b.price - a.price)
      if (sortBy === 'name')       sorted.sort((a,b) => a.name.localeCompare(b.name))
      setProducts(sorted)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [activeCat, sortBy, search])

  useEffect(() => { if (catParam) setActiveCat(catParam) }, [catParam])

  const activeCatObj = categories.find(c => c.slug === activeCat)

  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <div className="py-16 text-center"
             style={{ background: activeCatObj?.color || 'var(--cream-dark)' }}>
          <p className="section-label">{products.length} produits</p>
          <h1 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color:'var(--charcoal)' }}>
            {activeCatObj ? activeCatObj.name : 'Toute la Boutique'}
          </h1>
          {activeCatObj?.description && (
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color:'var(--warm-gray)' }}>
              {activeCatObj.description}
            </p>
          )}
          <div className="gold-divider mt-5" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Search bar */}
          <div className="relative mb-6 max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'var(--warm-gray)' }} />
            <input className="input-field pl-10" placeholder="Rechercher un produit..."
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            <button className={`category-pill ${activeCat === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCat('all')}>
              Tout ({products.length})
            </button>
            {categories.map(cat => (
              <button key={cat.id}
                      className={`category-pill ${activeCat === cat.slug ? 'active' : ''}`}
                      onClick={() => setActiveCat(cat.slug)}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-8 pb-4"
               style={{ borderBottom:'1px solid var(--cream-dark)' }}>
            <p className="text-sm" style={{ color:'var(--warm-gray)' }}>
              <span className="font-medium" style={{ color:'var(--charcoal)' }}>{products.length}</span> produits
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-xs tracking-wider border px-3 py-2 outline-none cursor-pointer"
                    style={{ borderColor:'#E0D8D0', color:'var(--charcoal)', background:'white' }}>
              <option value="default">Trier par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-display text-2xl font-light" style={{ color:'var(--warm-gray)' }}>
                Aucun produit trouvé.
              </p>
              <button className="btn-outline mt-6" onClick={() => { setActiveCat('all'); setSearch('') }}>
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--cream)' }}>
        <p className="font-display text-2xl font-light shimmer-text">Chargement...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
