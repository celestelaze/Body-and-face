import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ── DB helpers ─────────────────────────────────────────

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories').select('*').order('sort_order')
  if (error) throw error
  return data
}

export async function fetchProducts(filters = {}) {
  let q = supabase.from('products').select('*, categories(name, icon, color)')
  if (filters.category) q = q.eq('category_slug', filters.category)
  if (filters.featured)  q = q.eq('featured', true)
  if (filters.search)    q = q.ilike('name', `%${filters.search}%`)
  q = q.eq('in_stock', true).order('created_at', { ascending: false })
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles').select('*').eq('id', userId).single()
  return data
}

// Cart
export async function fetchCart(userId) {
  const { data } = await supabase
    .from('cart')
    .select('*, products(id, name, price, original_price, image_url, variants)')
    .eq('user_id', userId)
  return data || []
}

export async function upsertCartItem(userId, productId, quantity, selectedVariants = []) {
  const { error } = await supabase.from('cart').upsert(
    { user_id: userId, product_id: productId, quantity, selected_variants: selectedVariants },
    { onConflict: 'user_id,product_id' }
  )
  if (error) throw error
}

export async function removeCartItem(userId, productId) {
  await supabase.from('cart').delete()
    .eq('user_id', userId).eq('product_id', productId)
}

export async function clearCart(userId) {
  await supabase.from('cart').delete().eq('user_id', userId)
}

// Wishlist
export async function fetchWishlist(userId) {
  const { data } = await supabase
    .from('wishlist')
    .select('*, products(id, name, price, original_price, image_url, badge)')
    .eq('user_id', userId)
  return data || []
}

export async function toggleWishlistItem(userId, productId) {
  const { data } = await supabase
    .from('wishlist').select('id').eq('user_id', userId).eq('product_id', productId).single()
  if (data) {
    await supabase.from('wishlist').delete().eq('id', data.id)
    return false
  } else {
    await supabase.from('wishlist').insert({ user_id: userId, product_id: productId })
    return true
  }
}
