'use client'
import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard, Tag, Package, Plus, Pencil, Trash2,
  LogOut, X, Check, ChevronRight, AlertTriangle, Loader,
  ShoppingCart, Phone, Upload, Image as ImageIcon, Eye, Menu
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import VariantSelector from '../../components/VariantSelector'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// ─── AUTH GUARD ────────────────────────────────────────────
function useAdminGuard() {
  const [state, setState]       = useState('loading')
  const [adminUser, setAdminUser] = useState(null)
  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setState('denied'); return }
      const { data: profile } = await supabase.from('profiles').select('role,full_name,email,phone').eq('id', session.user.id).single()
      if (profile?.role === 'admin') { setAdminUser({ ...session.user, ...profile }); setState('authorized') }
      else setState('denied')
    }
    check()
  }, [])
  return { state, adminUser }
}

// ─── IMAGE UPLOADER ────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const inputRef   = useRef()
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image trop lourde (max 5 Mo)'); return }
    setError(''); setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from('products').upload(path, file, { upsert: false })
    if (upErr) { setError('Erreur upload: ' + upErr.message); setUploading(false); return }
    const url = `${SUPABASE_URL}/storage/v1/object/public/products/${path}`
    onChange(url)
    setUploading(false)
  }

  return (
    <div>
      {/* Preview + actions */}
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center overflow-hidden"
             style={{ background: 'var(--cream-dark)', border: '1px solid var(--cream-dark)' }}>
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <ImageIcon size={28} style={{ color: '#C0B8B0' }} />}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {/* Upload button */}
          <button type="button" onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium tracking-widest uppercase transition-all"
                  style={{ background: 'var(--charcoal)', color: 'white', opacity: uploading ? 0.6 : 1 }}>
            {uploading
              ? <><Loader size={13} className="animate-spin" /> Upload...</>
              : <><Upload size={13} /> Choisir une photo</>}
          </button>
          <p className="text-[10px]" style={{ color: 'var(--warm-gray)' }}>
            JPG, PNG, WEBP · Max 5 Mo
          </p>

          {/* OR URL */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px" style={{ background: 'var(--cream-dark)' }} />
            <span className="text-[10px]" style={{ color: 'var(--warm-gray)' }}>ou coller une URL</span>
            <div className="flex-1 h-px" style={{ background: 'var(--cream-dark)' }} />
          </div>
          <input className="input-field text-xs py-2" value={value} onChange={e => onChange(e.target.value)}
                 placeholder="https://images.unsplash.com/..." />
        </div>
      </div>
      {error && <p className="text-xs mt-2 px-3 py-2" style={{ background: '#FEF2F2', color: '#B91C1C' }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ─── MODAL ─────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
         style={{ background: 'rgba(30,28,26,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto"
           style={{ background: 'var(--cream)', borderRadius: '16px 16px 0 0', border: '1px solid var(--cream-dark)' }}
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
             style={{ background: 'var(--cream)', borderBottom: '1px solid var(--cream-dark)' }}>
          <h3 className="font-display text-lg font-medium" style={{ color: 'var(--charcoal)' }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:opacity-60"><X size={18} /></button>
        </div>
        <div className="p-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

// ─── CATEGORY FORM ─────────────────────────────────────────
function CategoryForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name:'', slug:'', description:'', icon:'✨', color:'#F0E8DF', sort_order:0 })
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))
  const autoSlug = n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
  const ICONS  = ['✨','🌿','☀️','💊','🌸','💆','💅','🫧','🧴','🌺','🍃','💎','🌙','🌊']
  const COLORS = ['#F0E8DF','#DFF0E8','#F0F0DF','#EFE0F0','#F0DFE8','#DFE8F0','#F0DFDF','#DFDFF0']

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Nom *</label>
        <input className="input-field" value={form.name}
               onChange={e => { set('name',e.target.value); if(!initial) set('slug',autoSlug(e.target.value)) }}
               placeholder="Ex: Soins du Corps" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Slug (URL)</label>
        <input className="input-field" value={form.slug} onChange={e => set('slug',e.target.value)} placeholder="soins-du-corps" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Description</label>
        <textarea className="input-field" value={form.description} onChange={e => set('description',e.target.value)}
                  placeholder="Description..." style={{ minHeight:70 }} />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Icône</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => set('icon',ic)}
                    className="w-10 h-10 text-xl flex items-center justify-center"
                    style={{ border:`2px solid ${form.icon===ic?'var(--gold)':'var(--cream-dark)'}`, background:form.icon===ic?'var(--cream-dark)':'white' }}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Couleur</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => set('color',c)}
                    className="w-9 h-9 rounded-full"
                    style={{ background:c, border:`3px solid ${form.color===c?'var(--gold)':'transparent'}`, boxShadow:form.color===c?'0 0 0 2px var(--cream)':'none' }} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => onSave(form)} className="btn-primary flex-1 justify-center">
          <Check size={14} /> Enregistrer
        </button>
        <button type="button" onClick={onClose} className="btn-outline px-5">Annuler</button>
      </div>
    </div>
  )
}

// ─── PRODUCT FORM ───────────────────────────────────────────
function ProductForm({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState(initial
    ? { ...initial, price: String(initial.price), original_price: String(initial.original_price || '') }
    : { name:'', category_slug: categories[0]?.slug||'', price:'', original_price:'',
        description:'', image_url:'', badge:'', featured:false, in_stock:true, variants:[] })
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))

  return (
    <div className="flex flex-col gap-4">
      {/* Image upload - TOP of form */}
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>
          Photo du produit
        </label>
        <ImageUploader value={form.image_url} onChange={v => set('image_url', v)} />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Nom *</label>
        <input className="input-field" value={form.name} onChange={e => set('name',e.target.value)} placeholder="Ex: Sérum Éclat" />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Catégorie *</label>
        <select className="input-field" value={form.category_slug} onChange={e => set('category_slug',e.target.value)}>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Prix (FCFA) *</label>
          <input className="input-field" type="number" value={form.price} onChange={e => set('price',e.target.value)} placeholder="45000" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Prix barré</label>
          <input className="input-field" type="number" value={form.original_price} onChange={e => set('original_price',e.target.value)} placeholder="60000" />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Description</label>
        <textarea className="input-field" value={form.description} onChange={e => set('description',e.target.value)}
                  placeholder="Description du produit..." style={{ minHeight: 80 }} />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Badge</label>
        <div className="flex gap-2">
          {['', 'Nouveau', 'Bestseller', 'Promo'].map(b => (
            <button key={b} type="button" onClick={() => set('badge', b)}
                    className="flex-1 py-2 text-xs font-medium tracking-wide transition-all"
                    style={{
                      background: form.badge === b ? 'var(--charcoal)' : 'white',
                      color: form.badge === b ? 'white' : 'var(--warm-gray)',
                      border: `1px solid ${form.badge === b ? 'var(--charcoal)' : 'var(--cream-dark)'}`,
                    }}>
              {b || 'Aucun'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2.5 cursor-pointer flex-1 p-3"
               style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)' }}>
          <div onClick={() => set('featured',!form.featured)}
               className="w-11 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0"
               style={{ background: form.featured ? 'var(--charcoal)' : '#D0C8C0' }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                 style={{ left: form.featured ? '26px' : '4px' }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--charcoal)' }}>Produit vedette</p>
            <p className="text-[10px]" style={{ color: 'var(--warm-gray)' }}>Affiché en page d'accueil</p>
          </div>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer flex-1 p-3"
               style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)' }}>
          <div onClick={() => set('in_stock',!form.in_stock)}
               className="w-11 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0"
               style={{ background: form.in_stock ? '#6B9B7A' : '#D0C8C0' }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                 style={{ left: form.in_stock ? '26px' : '4px' }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--charcoal)' }}>En stock</p>
            <p className="text-[10px]" style={{ color: 'var(--warm-gray)' }}>Visible en boutique</p>
          </div>
        </label>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>
          Variantes du produit
        </label>
        <VariantSelector variants={form.variants||[]} onChange={vals => set('variants', vals)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => onSave(form)} className="btn-primary flex-1 justify-center">
          <Check size={14} /> Enregistrer
        </button>
        <button type="button" onClick={onClose} className="btn-outline px-4">Annuler</button>
      </div>
    </div>
  )
}

// ─── MAIN ADMIN ─────────────────────────────────────────────
export default function AdminPage() {
  const { state, adminUser } = useAdminGuard()
  const [tab,        setTab]        = useState('dashboard')
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [orders,     setOrders]     = useState([])
  const [modal,      setModal]      = useState(null)
  const [toast,      setToast]      = useState(null)
  const [sidebarOpen,setSidebarOpen]= useState(false)

  useEffect(() => { if (state === 'authorized') loadData() }, [state])

  async function loadData() {
    const [{ data: cats }, { data: prods }, { data: ords }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('created_at', { ascending:false }),
      supabase.from('orders').select('*').order('created_at', { ascending:false }).limit(30),
    ])
    setCategories(cats || [])
    setProducts(prods || [])
    setOrders(ords || [])
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function saveCategory(data) {
    const payload = { name:data.name, slug:data.slug, description:data.description, icon:data.icon, color:data.color, sort_order:data.sort_order||0 }
    if (data.id) await supabase.from('categories').update(payload).eq('id', data.id)
    else await supabase.from('categories').insert(payload)
    await loadData(); setModal(null); showToast('Catégorie enregistrée ✓')
  }

  async function deleteCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await supabase.from('categories').delete().eq('id', id)
    await loadData(); showToast('Supprimée.')
  }

  async function saveProduct(data) {
    const payload = {
      name: data.name, category_slug: data.category_slug,
      price: parseFloat(data.price) || 0,
      original_price: data.original_price ? parseFloat(data.original_price) : null,
      description: data.description, image_url: data.image_url,
      badge: data.badge || null, featured: data.featured, in_stock: data.in_stock,
      variants: data.variants || [],
    }
    if (data.id) await supabase.from('products').update(payload).eq('id', data.id)
    else await supabase.from('products').insert(payload)
    await loadData(); setModal(null); showToast('Produit enregistré ✓')
  }

  async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('products').delete().eq('id', id)
    await loadData(); showToast('Supprimé.')
  }

  // ── LOGIN SCREEN ──
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw,    setLoginPw]    = useState('')
  const [loginErr,   setLoginErr]   = useState('')
  const [loginLoad,  setLoginLoad]  = useState(false)

  async function handleAdminLogin(e) {
    e.preventDefault(); setLoginErr(''); setLoginLoad(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw })
    if (error) { setLoginErr('Email ou mot de passe incorrect.'); setLoginLoad(false); return }
    window.location.reload()
  }

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--charcoal)' }}>
      <Loader size={32} className="animate-spin" style={{ color:'var(--gold)' }} />
    </div>
  )

  if (state === 'denied') return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:'var(--charcoal)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-light tracking-widest" style={{ color:'white' }}>
            BODY <span style={{ color:'var(--gold)' }}>&</span> FACE
          </p>
          <p className="text-[10px] tracking-widest uppercase mt-2" style={{ color:'rgba(255,255,255,0.4)' }}>Administration</p>
        </div>
        <div className="p-6" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4 }}>
          <h2 className="font-display text-xl font-light mb-5" style={{ color:'white' }}>Connexion Admin</h2>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>E-mail</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
                     className="w-full px-4 py-3 text-sm outline-none"
                     style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white' }}
                     placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>Mot de passe</label>
              <input type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} required
                     className="w-full px-4 py-3 text-sm outline-none"
                     style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white' }}
                     placeholder="••••••••" />
            </div>
            {loginErr && <p className="text-xs px-3 py-2" style={{ background:'rgba(201,78,78,0.2)', color:'#E87070' }}>{loginErr}</p>}
            <button type="submit" disabled={loginLoad}
                    className="btn-gold justify-center mt-1" style={{ opacity:loginLoad?0.7:1 }}>
              {loginLoad ? 'Connexion...' : 'Accéder au tableau de bord'}
            </button>
          </form>
          <a href="/" className="block text-center mt-5 text-xs hover:underline" style={{ color:'rgba(255,255,255,0.3)' }}>
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  )

  const NAV = [
    { id:'dashboard', label:'Accueil', icon:<LayoutDashboard size={20}/> },
    { id:'categories',label:'Catégories', icon:<Tag size={20}/> },
    { id:'products',  label:'Produits', icon:<Package size={20}/> },
    { id:'orders',    label:'Commandes', icon:<ShoppingCart size={20}/> },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background:'var(--cream)' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 admin-sidebar flex-col min-h-screen">
        <div className="px-6 py-7" style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-display text-lg font-light tracking-widest" style={{ color:'white' }}>
            BODY <span style={{ color:'var(--gold)' }}>&</span> FACE
          </p>
          <p className="text-[10px] tracking-widest uppercase mt-1" style={{ color:'rgba(255,255,255,0.35)' }}>Administration</p>
        </div>
        <nav className="flex-1 px-3 py-4">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 mb-1 text-xs tracking-widest uppercase font-medium rounded transition-all"
                    style={{ background:tab===n.id?'rgba(201,149,106,0.2)':'transparent', color:tab===n.id?'var(--gold-light)':'rgba(255,255,255,0.5)' }}>
              {n.icon}{n.label}{tab===n.id&&<ChevronRight size={11} className="ml-auto"/>}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
             className="w-full flex items-center gap-3 px-4 py-3 mb-1 text-xs tracking-widest uppercase rounded"
             style={{ color:'rgba(255,255,255,0.4)' }}>
            <Eye size={15}/>Voir le site
          </a>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase rounded"
                  style={{ color:'rgba(255,255,255,0.4)' }}>
            <LogOut size={15}/>Déconnexion
          </button>
          <p className="px-4 mt-3 text-[10px] truncate" style={{ color:'rgba(255,255,255,0.3)' }}>{adminUser?.email}</p>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
           style={{ background:'var(--charcoal)' }}>
        <p className="font-display text-base font-light tracking-widest" style={{ color:'white' }}>
          BODY <span style={{ color:'var(--gold)' }}>&</span> FACE <span className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>Admin</span>
        </p>
        <div className="flex gap-2">
          <a href="/" className="p-2" style={{ color:'rgba(255,255,255,0.5)' }}><Eye size={18}/></a>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/')}
                  className="p-2" style={{ color:'rgba(255,255,255,0.5)' }}>
            <LogOut size={18}/>
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
           style={{ background:'var(--charcoal)', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
                  style={{ color: tab===n.id ? 'var(--gold-light)' : 'rgba(255,255,255,0.4)' }}>
            {n.icon}
            <span style={{ fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-auto pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* DASHBOARD */}
          {tab==='dashboard' && (
            <div>
              <p className="section-label">Vue d'ensemble</p>
              <h1 className="font-display text-2xl md:text-3xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
                Bonjour {adminUser?.full_name?.split(' ')[0] || 'Admin'} 👋
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {[
                  { label:'Produits',   value:products.length,                       color:'var(--charcoal)' },
                  { label:'Catégories', value:categories.length,                     color:'var(--gold)' },
                  { label:'Vedettes',   value:products.filter(p=>p.featured).length, color:'#6B9B7A' },
                  { label:'Commandes',  value:orders.length,                         color:'#9B6B6B' },
                ].map(stat => (
                  <div key={stat.label} className="p-4 md:p-6" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                    <p className="font-display text-3xl md:text-4xl font-light" style={{ color:stat.color }}>{stat.value}</p>
                    <p className="text-[10px] tracking-widest uppercase mt-2 font-medium" style={{ color:'var(--warm-gray)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button onClick={() => { setTab('products'); setModal({ type:'product', data:null }) }} className="btn-primary justify-center sm:justify-start">
                  <Plus size={14}/> Nouveau produit
                </button>
                <button onClick={() => { setTab('categories'); setModal({ type:'category', data:null }) }} className="btn-outline justify-center sm:justify-start">
                  <Plus size={14}/> Nouvelle catégorie
                </button>
              </div>
              {/* Recent */}
              <div className="mt-8">
                <p className="text-xs tracking-widest uppercase font-medium mb-3" style={{ color:'var(--warm-gray)' }}>Produits récents</p>
                <div style={{ border:'1px solid var(--cream-dark)', background:'white' }}>
                  {products.slice(0,5).map((p,i) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3"
                         style={{ borderBottom:i<4?'1px solid var(--cream-dark)':'none' }}>
                      <div className="w-10 h-10 flex-shrink-0 overflow-hidden" style={{ background:'var(--cream-dark)' }}>
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color:'var(--charcoal)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color:'var(--warm-gray)' }}>
                          {categories.find(c=>c.slug===p.category_slug)?.name}
                        </p>
                      </div>
                      <p className="font-display text-sm font-medium flex-shrink-0" style={{ color:'var(--gold-dark)' }}>
                        {Number(p.price).toLocaleString()} FCFA
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {tab==='categories' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="section-label">Gestion</p>
                  <h1 className="font-display text-2xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
                    Catégories <span className="text-lg font-light ml-1" style={{ color:'var(--warm-gray)' }}>({categories.length})</span>
                  </h1>
                </div>
                <button onClick={() => setModal({ type:'category', data:null })} className="btn-primary text-xs px-4">
                  <Plus size={13}/> <span className="hidden sm:inline">Nouvelle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 p-4"
                       style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                    <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 rounded-lg"
                         style={{ background:cat.color||'var(--cream-dark)' }}>{cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color:'var(--charcoal)' }}>{cat.name}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                        {products.filter(p=>p.category_slug===cat.slug).length} produits
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setModal({ type:'category', data:cat })}
                              className="w-8 h-8 flex items-center justify-center" style={{ color:'var(--warm-gray)' }}>
                        <Pencil size={14}/>
                      </button>
                      <button onClick={() => deleteCategory(cat.id)}
                              className="w-8 h-8 flex items-center justify-center" style={{ color:'#C94E4E' }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab==='products' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="section-label">Gestion</p>
                  <h1 className="font-display text-2xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
                    Produits <span className="text-lg font-light ml-1" style={{ color:'var(--warm-gray)' }}>({products.length})</span>
                  </h1>
                </div>
                <button onClick={() => setModal({ type:'product', data:null })} className="btn-primary text-xs px-4">
                  <Plus size={13}/> <span className="hidden sm:inline">Nouveau</span>
                </button>
              </div>
              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {products.map(p => (
                  <div key={p.id} className="flex gap-3 p-4" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ background:'var(--cream-dark)' }}>
                      {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight" style={{ color:'var(--charcoal)' }}>{p.name}</p>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => setModal({ type:'product', data:p })} className="w-7 h-7 flex items-center justify-center" style={{ color:'var(--warm-gray)' }}><Pencil size={13}/></button>
                          <button onClick={() => deleteProduct(p.id)} className="w-7 h-7 flex items-center justify-center" style={{ color:'#C94E4E' }}><Trash2 size={13}/></button>
                        </div>
                      </div>
                      <p className="text-xs mt-1" style={{ color:'var(--warm-gray)' }}>
                        {categories.find(c=>c.slug===p.category_slug)?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="font-display text-sm font-medium" style={{ color:'var(--gold-dark)' }}>{Number(p.price).toLocaleString()} FCFA</p>
                        {p.badge && <span className={`badge ${p.badge==='Nouveau'?'badge-new':p.badge==='Bestseller'?'badge-best':'badge-sale'}`}>{p.badge}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <div className="hidden md:block" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                <div className="grid grid-cols-12 gap-4 px-5 py-3"
                     style={{ borderBottom:'2px solid var(--cream-dark)', background:'var(--cream)' }}>
                  {['','Produit','Catégorie','Prix','Badge',''].map((h,i) => (
                    <p key={i} className={`text-[10px] tracking-widest uppercase font-medium col-span-${[1,4,3,2,1,1][i]}`}
                       style={{ color:'var(--warm-gray)' }}>{h}</p>
                  ))}
                </div>
                {products.map((p,i) => (
                  <div key={p.id} className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-[var(--cream)]"
                       style={{ borderBottom:i<products.length-1?'1px solid var(--cream-dark)':'none' }}>
                    <div className="col-span-1">
                      <div className="w-10 h-10 overflow-hidden" style={{ background:'var(--cream-dark)' }}>
                        {p.image_url?<img src={p.image_url} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center">🧴</div>}
                      </div>
                    </div>
                    <div className="col-span-4 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color:'var(--charcoal)' }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>{(p.variants||[]).map(v=>v.value).join(' · ')||'—'}</p>
                    </div>
                    <p className="col-span-3 text-xs" style={{ color:'var(--warm-gray)' }}>{categories.find(c=>c.slug===p.category_slug)?.name}</p>
                    <p className="col-span-2 font-display text-sm" style={{ color:'var(--charcoal)' }}>{Number(p.price).toLocaleString()} FCFA</p>
                    <div className="col-span-1">
                      {p.badge&&<span className={`badge ${p.badge==='Nouveau'?'badge-new':p.badge==='Bestseller'?'badge-best':'badge-sale'}`}>{p.badge}</span>}
                    </div>
                    <div className="col-span-1 flex gap-1 justify-end">
                      <button onClick={() => setModal({ type:'product', data:p })} className="w-7 h-7 flex items-center justify-center" style={{ color:'var(--warm-gray)' }}><Pencil size={13}/></button>
                      <button onClick={() => deleteProduct(p.id)} className="w-7 h-7 flex items-center justify-center" style={{ color:'#C94E4E' }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab==='orders' && (
            <div>
              <p className="section-label">Suivi</p>
              <h1 className="font-display text-2xl font-light mt-1 mb-5" style={{ color:'var(--charcoal)' }}>Commandes</h1>
              {orders.length === 0 ? (
                <div className="text-center py-20" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                  <ShoppingCart size={36} strokeWidth={1} className="mx-auto mb-4" style={{ color:'var(--cream-dark)'}}/>
                  <p className="font-display text-lg font-light" style={{ color:'var(--warm-gray)' }}>Aucune commande pour l'instant</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map(o => (
                    <div key={o.id} className="p-4" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="font-mono text-xs font-bold px-2 py-1"
                              style={{ background:'var(--cream-dark)', color:'var(--gold-dark)' }}>
                          {o.reference || '—'}
                        </span>
                        <span className="text-[9px] tracking-widest uppercase px-2 py-1 font-medium flex-shrink-0"
                              style={{
                                background: o.status==='pending'?'#FEF3C7':o.status==='confirmed'?'#D1FAE5':'#F3F4F6',
                                color: o.status==='pending'?'#92400E':o.status==='confirmed'?'#065F46':'#374151'
                              }}>
                          {o.status==='pending'?'En attente':o.status==='confirmed'?'Confirmé':'Livré'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest" style={{ color:'var(--warm-gray)' }}>Client</p>
                          <p className="text-sm font-medium" style={{ color:'var(--charcoal)' }}>{o.customer_name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest" style={{ color:'var(--warm-gray)' }}>Téléphone</p>
                          <p className="text-sm" style={{ color:'var(--charcoal)' }}>{o.customer_phone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest" style={{ color:'var(--warm-gray)' }}>Montant</p>
                          <p className="font-display text-base font-medium" style={{ color:'var(--gold-dark)' }}>
                            {Number(o.total_amount).toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest" style={{ color:'var(--warm-gray)' }}>Date</p>
                          <p className="text-sm" style={{ color:'var(--charcoal)' }}>
                            {new Date(o.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}
      {modal?.type==='category' && (
        <Modal title={modal.data ? 'Modifier' : 'Nouvelle catégorie'} onClose={() => setModal(null)}>
          <CategoryForm initial={modal.data} onSave={saveCategory} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type==='product' && (
        <Modal title={modal.data ? 'Modifier le produit' : 'Nouveau produit'} onClose={() => setModal(null)}>
          <ProductForm initial={modal.data} categories={categories} onSave={saveProduct} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
          <Check size={15} style={{ color:'var(--gold-light)', flexShrink:0 }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
