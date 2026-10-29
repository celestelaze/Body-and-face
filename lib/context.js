'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, fetchCart, upsertCartItem, removeCartItem, clearCart, fetchWishlist, toggleWishlistItem, fetchProfile } from './supabase'

const AppContext = createContext({})

export function AppProvider({ children }) {
  const [user,          setUser]          = useState(null)
  const [profile,       setProfile]       = useState(null)
  const [cart,          setCart]          = useState([])   // [{product, quantity, selected_variants}]
  const [wishlist,      setWishlist]       = useState([])
  const [cartOpen,      setCartOpen]       = useState(false)
  const [wishlistOpen,  setWishlistOpen]   = useState(false)
  const [authModal,     setAuthModal]      = useState(false) // false | 'login' | 'signup'
  const [loading,       setLoading]        = useState(true)

  // ── Auth ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then(p => setProfile(p))
      fetchCart(user.id).then(setCart)
      fetchWishlist(user.id).then(setWishlist)
    } else {
      setProfile(null)
      setCart([])
      setWishlist([])
    }
  }, [user])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setCart([])
    setWishlist([])
  }, [])

  // ── Cart ──────────────────────────────────────────────
  const addToCart = useCallback(async (product, selectedVariants = [], qty = 1) => {
    if (!user) { setAuthModal('login'); return }
    try {
      const existing = cart.find(i => i.product_id === String(product.id))
      const newQty   = (existing?.quantity || 0) + qty
      await upsertCartItem(user.id, product.id, newQty, selectedVariants, product)
      const updated  = await fetchCart(user.id)
      setCart(updated)
      setCartOpen(true)
    } catch (e) {
      console.error(e)
      alert("Impossible d'ajouter ce produit au panier pour le moment. Réessaie dans un instant.")
    }
  }, [user, cart])

  const updateCartQty = useCallback(async (productId, quantity) => {
    if (!user) return
    if (quantity <= 0) {
      await removeCartItem(user.id, productId)
    } else {
      const item = cart.find(i => i.product_id === productId)
      await upsertCartItem(user.id, productId, quantity, item?.selected_variants || [], item?.products)
    }
    const updated = await fetchCart(user.id)
    setCart(updated)
  }, [user, cart])

  const removeFromCart = useCallback(async (productId) => {
    if (!user) return
    await removeCartItem(user.id, productId)
    setCart(c => c.filter(i => i.product_id !== productId))
  }, [user])

  const emptyCart = useCallback(async () => {
    if (!user) return
    await clearCart(user.id)
    setCart([])
  }, [user])

  const cartTotal  = cart.reduce((s, i) => s + (i.products?.price || 0) * i.quantity, 0)
  const cartCount  = cart.reduce((s, i) => s + i.quantity, 0)

  // ── Wishlist ──────────────────────────────────────────
  const toggleWishlist = useCallback(async (product) => {
    if (!user) { setAuthModal('login'); return }
    await toggleWishlistItem(user.id, product.id, product)
    const updated = await fetchWishlist(user.id)
    setWishlist(updated)
  }, [user])

  const isWishlisted = useCallback((productId) => {
    return wishlist.some(w => w.product_id === String(productId))
  }, [wishlist])

  return (
    <AppContext.Provider value={{
      user, profile, loading,
      signOut,
      cart, cartTotal, cartCount, addToCart, updateCartQty, removeFromCart, emptyCart,
      wishlist,
      cartOpen,     setCartOpen,
      wishlistOpen, setWishlistOpen,
      authModal,    setAuthModal,
      toggleWishlist, isWishlisted,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
