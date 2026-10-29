import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
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
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

// Copie du produit (les produits viennent du Google Sheet, pas de la base)
function snapshot(p = {}) {
  const promo = p.promoPriceFCFA > 0 && p.promoPriceFCFA < p.priceFCFA
  return {
    id: p.id,
    name: p.name,
    price: promo ? p.promoPriceFCFA : (p.priceFCFA ?? p.price ?? 0),
    image_url: p.imageUrl || p.image_url || '',
  }
}

export async function fetchCart(userId) {
  const { data } = await supabase.from('cart').select('*').eq('user_id', userId)
  return (data || []).map(r => ({ ...r, products: r.product }))
}

export async function upsertCartItem(userId, productId, quantity, selectedVariants = [], product = null) {
  const row = { user_id: userId, product_id: String(productId), quantity, selected_variants: selectedVariants }
  if (product) row.product = snapshot(product)
  const { error } = await supabase.from('cart').upsert(row, { onConflict: 'user_id,product_id' })
  if (error) throw error
}

export async function removeCartItem(userId, productId) {
  await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', String(productId))
}

export async function clearCart(userId) {
  await supabase.from('cart').delete().eq('user_id', userId)
}

export async function fetchWishlist(userId) {
  const { data } = await supabase.from('wishlist').select('*').eq('user_id', userId)
  return (data || []).map(r => ({ ...r, products: r.product }))
}

export async function toggleWishlistItem(userId, productId, product = null) {
  const pid = String(productId)
  const { data } = await supabase.from('wishlist').select('id')
    .eq('user_id', userId).eq('product_id', pid).maybeSingle()
  if (data) {
    await supabase.from('wishlist').delete().eq('id', data.id)
    return false
  }
  const { error } = await supabase.from('wishlist')
    .insert({ user_id: userId, product_id: pid, product: snapshot(product) })
  if (error) throw error
  return true
}
