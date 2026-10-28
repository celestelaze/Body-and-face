'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Menu, X, User, LogOut, Search } from 'lucide-react'
import { useApp } from '../lib/context'

const SUBCATEGORIES = [
  'Outil de Beauté','Kits faux cils et adhésifs','Soins des ongles, des mains et des pieds',
  'Produits capillaires et outils','Soins du corps et outils','Vernis à ongles en gel',
  'Maquillage','Maquillage yeux','Soin de la peau & outils','Pinceaux à maquillage',
  'Parfums & Aromathérapie','Maquillage visage','Maquillage bouche',
  'Appareils de soins personnels','Outils & Soins à la personne','Soins des cheveux et coiffure',
]

export default function Header() {
  const { user, profile, cartCount, wishlist, setCartOpen, setWishlistOpen, setAuthModal, signOut } = useApp()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const [userMenu,  setUserMenu]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      {/* Promo bar — scrolling on mobile */}
      <div style={{ background: 'linear-gradient(90deg, var(--pink), var(--lavender), var(--coral), var(--pink))', backgroundSize:'300% auto', animation:'gradient-shift 6s ease infinite' }}
           className="py-1.5 overflow-hidden">
        {/* Desktop */}
        <p className="hidden sm:block text-center text-white text-[11px] tracking-widest uppercase font-medium">
          🚚 Livraison offerte dès 100 000 FCFA &nbsp;·&nbsp; ↩ Retours sous 3 jours &nbsp;·&nbsp; 🔒 Paiement sécurisé
        </p>
        {/* Mobile marquee */}
        <div className="sm:hidden animate-marquee">
          {[...Array(4)].map((_,i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 text-white text-[10px] tracking-widest uppercase font-medium flex-shrink-0">
              🚚 Livraison offerte dès 100 000 FCFA
              <span className="opacity-50">♡</span>
              ↩ Retours 3 jours
              <span className="opacity-50">♡</span>
              🔒 Paiement sécurisé
              <span className="opacity-50">♡</span>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,249,252,0.96)' : 'var(--cream)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,107,157,0.15)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(255,107,157,0.08)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none">
            <span className="font-display text-xl md:text-2xl font-bold" style={{ color: 'var(--pink)' }}>
              Body <span style={{ fontStyle:'italic', color:'var(--lavender)' }}>&</span> Face
            </span>
            <span className="font-script text-xs" style={{ color: 'var(--warm-gray)' }}>Luxe Beauty</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs tracking-widest uppercase font-medium transition-colors hover:text-pink-500"
                  style={{ color: 'var(--warm-gray)' }}>
              Accueil
            </Link>
            <div className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
              <button className="text-xs tracking-widest uppercase font-medium transition-colors hover:text-pink-500 flex items-center gap-1"
                      style={{ color: 'var(--warm-gray)' }}>
                Boutique ♡
              </button>
              {dropOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white shadow-xl py-3 rounded-2xl"
                     style={{ border: '2px solid var(--pink-light)', boxShadow: '0 8px 32px rgba(255,107,157,0.15)' }}>
                  <Link href="/shop" className="block px-5 py-2.5 text-xs tracking-wider uppercase font-semibold hover:text-pink-500 hover:bg-pink-50 transition-all"
                        style={{ color: 'var(--charcoal)' }}>✨ Tout voir</Link>
                  <div className="my-1" style={{ borderBottom: '1px solid var(--cream-dark)', margin: '4px 16px' }} />
                  {SUBCATEGORIES.map(s => (
                    <Link key={s} href={`/shop?cat=${encodeURIComponent(s)}`}
                          className="block px-5 py-2 text-xs tracking-wider uppercase hover:bg-pink-50 transition-colors"
                          style={{ color: 'var(--warm-gray)' }}>
                      {s}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/notre-histoire" className="text-xs tracking-widest uppercase font-medium transition-colors hover:text-pink-500"
                  style={{ color: 'var(--warm-gray)' }}>Notre Histoire</Link>
            <Link href="/contact" className="text-xs tracking-widest uppercase font-medium transition-colors hover:text-pink-500"
                  style={{ color: 'var(--warm-gray)' }}>Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <button onClick={() => user ? setWishlistOpen(true) : setAuthModal('login')}
                    className="relative p-2.5 rounded-full transition-all hover:bg-pink-50"
                    style={{ color: 'var(--pink)' }}>
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white font-bold"
                      style={{ background: 'var(--pink)' }}>{wishlist.length}</span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)}
                    className="relative p-2.5 rounded-full transition-all hover:bg-pink-50"
                    style={{ color: 'var(--charcoal)' }}>
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg,var(--pink),var(--coral))' }}>{cartCount}</span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-pink-50 transition-all">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                       style={{ background: 'linear-gradient(135deg,var(--pink),var(--lavender))' }}>
                    {(profile?.full_name || user.email || '?')[0].toUpperCase()}
                  </div>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl py-2 z-50 rounded-2xl"
                       style={{ border: '2px solid var(--cream-dark)', boxShadow: '0 8px 32px rgba(255,107,157,0.12)' }}>
                    <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                      <p className="text-xs font-semibold truncate" style={{ color:'var(--charcoal)' }}>{profile?.full_name || 'Mon compte'}</p>
                      <p className="text-[10px] truncate" style={{ color:'var(--warm-gray)' }}>{user.email}</p>
                    </div>
                    <button onClick={() => { signOut(); setUserMenu(false) }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-pink-50 transition-colors rounded-b-xl"
                            style={{ color: 'var(--warm-gray)' }}>
                      <LogOut size={13} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModal('login')}
                      className="hidden md:flex items-center gap-1.5 text-xs tracking-widest uppercase font-semibold px-4 py-2.5 rounded-full transition-all"
                      style={{ background:'var(--pink-pale)', color:'var(--pink)', border:'2px solid var(--pink-light)' }}>
                <User size={13} /> Connexion
              </button>
            )}

            {/* Mobile toggle */}
            <button className="p-2 md:hidden rounded-full hover:bg-pink-50"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ color: 'var(--charcoal)' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid var(--cream-dark)', background: 'white' }}>
            <div className="px-6 py-6 flex flex-col gap-5">
              <Link href="/" className="text-sm tracking-widest uppercase font-semibold" style={{ color:'var(--charcoal)' }} onClick={() => setMenuOpen(false)}>Accueil</Link>
              <Link href="/shop" className="text-sm tracking-widest uppercase font-semibold" style={{ color:'var(--pink)' }} onClick={() => setMenuOpen(false)}>✨ Boutique</Link>
              <div style={{ borderBottom: '1px solid var(--cream-dark)' }} />
              {SUBCATEGORIES.map(s => (
                <Link key={s} href={`/shop?cat=${encodeURIComponent(s)}`}
                      className="text-xs tracking-widest uppercase" style={{ color:'var(--warm-gray)' }}
                      onClick={() => setMenuOpen(false)}>{s}</Link>
              ))}
              <div style={{ borderBottom: '1px solid var(--cream-dark)' }} />
              <Link href="/notre-histoire" className="text-xs tracking-widest uppercase" style={{ color:'var(--warm-gray)' }} onClick={() => setMenuOpen(false)}>Notre Histoire</Link>
              <Link href="/contact" className="text-xs tracking-widest uppercase" style={{ color:'var(--warm-gray)' }} onClick={() => setMenuOpen(false)}>Contact</Link>
              {!user && (
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }}
                        className="btn-pink justify-center text-xs">Connexion / Inscription</button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
