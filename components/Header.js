'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useApp } from '../lib/context'
import { fetchCategories } from '../lib/supabase'

export default function Header() {
  const { user, profile, cartCount, wishlist, setCartOpen, setWishlistOpen, setAuthModal, signOut } = useApp()
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [userMenu,   setUserMenu]   = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Promo bar ── */}
      <div style={{ background: 'var(--charcoal)', color: 'var(--gold-light)' }}
           className="text-center py-2 text-xs tracking-widest uppercase hidden md:block">
        Livraison gratuite dès 100 000 FCFA &nbsp;·&nbsp; Retours sous 3 jours &nbsp;·&nbsp; Paiement sécurisé
      </div>

      <header className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250,246,241,0.97)' : 'var(--cream)',
          borderBottom: scrolled ? '1px solid #E8DACE' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(30,28,26,0.06)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none">
            <span className="font-display text-2xl font-light tracking-[0.12em]" style={{ color: 'var(--charcoal)' }}>
              BODY <span style={{ color: 'var(--gold)' }}>&</span> FACE
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase mt-0.5" style={{ color: 'var(--warm-gray)' }}>Luxe Beauty</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs tracking-widest uppercase font-medium hover:opacity-60 transition-opacity" style={{ color: 'var(--warm-gray)' }}>
              Accueil
            </Link>
            <div className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
              <button className="flex items-center gap-1 text-xs tracking-widest uppercase font-medium hover:opacity-60 transition-opacity" style={{ color: 'var(--warm-gray)' }}>
                Boutique <ChevronDown size={13} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white shadow-xl py-4" style={{ borderTop: '2px solid var(--gold)' }}>
                  <Link href="/shop" className="block px-6 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-[var(--cream)]" style={{ color: 'var(--charcoal)' }}>Tout voir</Link>
                  <div style={{ borderBottom: '1px solid var(--cream-dark)', margin: '4px 24px' }} />
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/shop?cat=${cat.slug}`} className="block px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-[var(--cream)]" style={{ color: 'var(--warm-gray)' }}>
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/notre-histoire" className="text-xs tracking-widest uppercase font-medium hover:opacity-60 transition-opacity" style={{ color: 'var(--warm-gray)' }}>Notre Histoire</Link>
            <Link href="/contact" className="text-xs tracking-widest uppercase font-medium hover:opacity-60 transition-opacity" style={{ color: 'var(--warm-gray)' }}>Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => user ? setWishlistOpen(true) : setAuthModal('login')}
                    className="relative p-2.5 hover:opacity-60 transition-opacity" style={{ color: 'var(--charcoal)' }}>
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: 'var(--gold)' }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2.5 hover:opacity-60 transition-opacity" style={{ color: 'var(--charcoal)' }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: 'var(--charcoal)' }}>
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)} className="flex items-center gap-2 px-3 py-2 hover:opacity-70" style={{ color: 'var(--charcoal)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ background: 'var(--gold)' }}>
                    {(profile?.full_name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{profile?.full_name?.split(' ')[0] || 'Mon compte'}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg py-2 z-50" style={{ border: '1px solid var(--cream-dark)' }}>
                    <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--cream-dark)' }}>
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--charcoal)' }}>{profile?.full_name}</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--warm-gray)' }}>{user.email}</p>
                    </div>
                    <button onClick={() => { signOut(); setUserMenu(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--cream)]" style={{ color: 'var(--warm-gray)' }}>
                      <LogOut size={13} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModal('login')} className="hidden md:flex items-center gap-1.5 text-xs tracking-widest uppercase font-medium px-4 py-2 border transition-all hover:bg-[var(--charcoal)] hover:text-white hover:border-[var(--charcoal)]" style={{ color: 'var(--charcoal)', borderColor: 'var(--cream-dark)' }}>
                <User size={13} /> Connexion
              </button>
            )}
            <button className="p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: 'var(--charcoal)' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid var(--cream-dark)', background: 'white' }}>
            <div className="px-6 py-6 flex flex-col gap-5">
              <Link href="/" className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--charcoal)' }} onClick={() => setMenuOpen(false)}>Accueil</Link>
              <Link href="/shop" className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--charcoal)' }} onClick={() => setMenuOpen(false)}>Boutique</Link>
              <div style={{ borderBottom: '1px solid var(--cream-dark)' }} />
              {categories.map(cat => (
                <Link key={cat.id} href={`/shop?cat=${cat.slug}`} className="text-xs tracking-widest uppercase" style={{ color: 'var(--warm-gray)' }} onClick={() => setMenuOpen(false)}>
                  {cat.icon} {cat.name}
                </Link>
              ))}
              <div style={{ borderBottom: '1px solid var(--cream-dark)' }} />
              <Link href="/notre-histoire" className="text-xs tracking-widest uppercase" style={{ color: 'var(--warm-gray)' }} onClick={() => setMenuOpen(false)}>Notre Histoire</Link>
              <Link href="/contact" className="text-xs tracking-widest uppercase" style={{ color: 'var(--warm-gray)' }} onClick={() => setMenuOpen(false)}>Contact</Link>
              {!user && (
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }} className="text-xs tracking-widest uppercase font-medium text-left" style={{ color: 'var(--gold-dark)' }}>
                  Connexion / Inscription
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
