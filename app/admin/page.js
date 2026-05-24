'use client'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Tag, Package, Plus, Pencil, Trash2,
  LogOut, X, Check, Eye, ChevronRight, AlertTriangle, Loader,
  ShoppingCart
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ─── AUTH GUARD ────────────────────────────────────────────
function useAdminGuard() {
  const [state, setState] = useState('loading') // loading | denied | authorized
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setState('denied'); return }
      const { data: profile } = await supabase
        .from('profiles').select('role, full_name, email').eq('id', session.user.id).single()
      if (profile?.role === 'admin') {
        setAdminUser({ ...session.user, ...profile })
        setState('authorized')
      } else {
        setState('denied')
      }
    }
    check()
  }, [])

  return { state, adminUser }
}

// ─── MODAL ─────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background:'rgba(30,28,26,0.7)', backdropFilter:'blur(6px)' }}>
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
           style={{ background:'var(--cream)', border:'1px solid var(--cream-dark)' }}>
        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom:'1px solid var(--cream-dark)' }}>
          <h3 className="font-display text-xl font-medium" style={{ color:'var(--charcoal)' }}>{title}</h3>
          <button onClick={onClose} className="p-1 hover:opacity-60"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
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
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Nom *</label>
          <input className="input-field" value={form.name}
                 onChange={e => { set('name',e.target.value); if(!initial) set('slug',autoSlug(e.target.value)) }}
                 placeholder="Soins du Corps" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Slug</label>
          <input className="input-field" value={form.slug} onChange={e => set('slug',e.target.value)} placeholder="soins-du-corps" />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Description</label>
        <textarea className="input-field" value={form.description} onChange={e => set('description',e.target.value)}
                  placeholder="Description de la catégorie..." style={{ minHeight:80 }} />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-3 font-medium" style={{ color:'var(--warm-gray)' }}>Icône</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(ic => (
            <button key={ic} onClick={() => set('icon',ic)}
                    className="w-10 h-10 text-xl flex items-center justify-center transition-all"
                    style={{ border:`2px solid ${form.icon===ic?'var(--gold)':'var(--cream-dark)'}`, background:form.icon===ic?'var(--cream-dark)':'white' }}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-3 font-medium" style={{ color:'var(--warm-gray)' }}>Couleur</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} onClick={() => set('color',c)}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{ background:c, border:`2px solid ${form.color===c?'var(--gold)':'transparent'}`, boxShadow:form.color===c?'0 0 0 2px var(--cream)':'none' }} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 justify-center">
          <Check size={14} /> Enregistrer
        </button>
        <button onClick={onClose} className="btn-outline px-5">Annuler</button>
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
  const [varType,  setVarType]  = useState('volume')
  const [varValue, setVarValue] = useState('')
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))

  function addVariant() {
    if (!varValue.trim()) return
    set('variants', [...(form.variants||[]), { type:varType, value:varValue.trim() }])
    setVarValue('')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Nom *</label>
          <input className="input-field" value={form.name} onChange={e => set('name',e.target.value)} placeholder="Sérum Éclat" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Catégorie *</label>
          <select className="input-field" value={form.category_slug} onChange={e => set('category_slug',e.target.value)}>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Prix (FCFA) *</label>
          <input className="input-field" type="number" value={form.price} onChange={e => set('price',e.target.value)} placeholder="890" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Prix barré</label>
          <input className="input-field" type="number" value={form.original_price} onChange={e => set('original_price',e.target.value)} placeholder="1100" />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Description</label>
        <textarea className="input-field" value={form.description} onChange={e => set('description',e.target.value)} placeholder="Description du produit..." />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>URL Image</label>
        <input className="input-field" value={form.image_url} onChange={e => set('image_url',e.target.value)} placeholder="https://images.unsplash.com/..." />
        {form.image_url && (
          <div className="mt-2 w-16 h-16 overflow-hidden" style={{ border:'1px solid var(--cream-dark)' }}>
            <img src={form.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color:'var(--warm-gray)' }}>Badge</label>
          <select className="input-field" value={form.badge||''} onChange={e => set('badge',e.target.value)}>
            {['','Nouveau','Bestseller','Promo'].map(b => <option key={b} value={b}>{b||'Aucun'}</option>)}
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set('featured',!form.featured)}
                 className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                 style={{ background:form.featured?'var(--charcoal)':'#D0C8C0' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                   style={{ left:form.featured?'26px':'4px' }} />
            </div>
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color:'var(--warm-gray)' }}>Vedette</span>
          </label>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set('in_stock',!form.in_stock)}
                 className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                 style={{ background:form.in_stock?'#6B9B7A':'#D0C8C0' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                   style={{ left:form.in_stock?'26px':'4px' }} />
            </div>
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color:'var(--warm-gray)' }}>En stock</span>
          </label>
        </div>
      </div>
      {/* Variants */}
      <div>
        <label className="block text-xs tracking-widest uppercase mb-3 font-medium" style={{ color:'var(--warm-gray)' }}>
          Variantes
        </label>
        {(form.variants||[]).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.variants.map((v,i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                    style={{ background:'var(--cream-dark)', color:'var(--charcoal)' }}>
                <span style={{ color:'var(--warm-gray)' }}>{v.type}:</span> {v.value}
                <button onClick={() => set('variants',form.variants.filter((_,idx)=>idx!==i))} className="ml-1 hover:opacity-60"><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <select value={varType} onChange={e => setVarType(e.target.value)} className="input-field w-32 text-xs">
            {['volume','couleur','type','format','parfum','taille'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input className="input-field flex-1" value={varValue}
                 onChange={e => setVarValue(e.target.value)}
                 onKeyDown={e => e.key==='Enter' && addVariant()}
                 placeholder="Ex: 30ml, Rouge, Peau Sèche..." />
          <button onClick={addVariant} className="btn-gold px-4 py-0"><Plus size={14} /></button>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 justify-center">
          <Check size={14} /> Enregistrer le produit
        </button>
        <button onClick={onClose} className="btn-outline px-5">Annuler</button>
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
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    if (state === 'authorized') loadData()
  }, [state])

  async function loadData() {
    const [{ data: cats }, { data: prods }, { data: ords }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('created_at', { ascending:false }),
      supabase.from('orders').select('*').order('created_at', { ascending:false }).limit(20),
    ])
    setCategories(cats || [])
    setProducts(prods || [])
    setOrders(ords || [])
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Category CRUD ─
  async function saveCategory(data) {
    setSaving(true)
    const payload = { name:data.name, slug:data.slug, description:data.description, icon:data.icon, color:data.color, sort_order:data.sort_order||0 }
    if (data.id) {
      await supabase.from('categories').update(payload).eq('id', data.id)
    } else {
      await supabase.from('categories').insert(payload)
    }
    await loadData(); setSaving(false); setModal(null)
    showToast('Catégorie enregistrée ✓')
  }

  async function deleteCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await supabase.from('categories').delete().eq('id', id)
    await loadData(); showToast('Catégorie supprimée.')
  }

  // ── Product CRUD ─
  async function saveProduct(data) {
    setSaving(true)
    const payload = {
      name: data.name, category_slug: data.category_slug,
      price: parseFloat(data.price),
      original_price: data.original_price ? parseFloat(data.original_price) : null,
      description: data.description, image_url: data.image_url,
      badge: data.badge || null, featured: data.featured, in_stock: data.in_stock,
      variants: data.variants || [],
    }
    if (data.id) {
      await supabase.from('products').update(payload).eq('id', data.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    await loadData(); setSaving(false); setModal(null)
    showToast('Produit enregistré ✓')
  }

  async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('products').delete().eq('id', id)
    await loadData(); showToast('Produit supprimé.')
  }

  // ─── SCREENS ──────────────────────────────────────────────

  // Direct login on admin page
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw,    setLoginPw]    = useState('')
  const [loginErr,   setLoginErr]   = useState('')
  const [loginLoad,  setLoginLoad]  = useState(false)

  async function handleAdminLogin(e) {
    e.preventDefault()
    setLoginErr(''); setLoginLoad(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw })
    if (error) { setLoginErr('Email ou mot de passe incorrect.'); setLoginLoad(false); return }
    // Re-check role after login
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role === 'admin') { window.location.reload() }
      else { setLoginErr("Votre compte n'a pas les droits administrateur."); setLoginLoad(false) }
    }
  }

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--charcoal)' }}>
      <div className="text-center">
        <Loader size={32} className="animate-spin mx-auto mb-4" style={{ color:'var(--gold)' }} />
        <p className="text-sm tracking-widest uppercase" style={{ color:'rgba(255,255,255,0.5)' }}>Vérification...</p>
      </div>
    </div>
  )

  if (state === 'denied') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--charcoal)' }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-light tracking-widest" style={{ color:'white' }}>
            BODY <span style={{ color:'var(--gold)' }}>&</span> FACE
          </p>
          <p className="text-xs tracking-widest uppercase mt-2" style={{ color:'rgba(255,255,255,0.4)' }}>Administration</p>
        </div>
        <div className="p-8" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-display text-xl font-light mb-6" style={{ color:'white' }}>Connexion Admin</h2>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color:'rgba(255,255,255,0.5)' }}>E-mail</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
                     className="w-full px-4 py-3 text-sm outline-none"
                     style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white' }}
                     placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color:'rgba(255,255,255,0.5)' }}>Mot de passe</label>
              <input type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} required
                     className="w-full px-4 py-3 text-sm outline-none"
                     style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white' }}
                     placeholder="••••••••" />
            </div>
            {loginErr && <p className="text-xs px-3 py-2" style={{ background:'rgba(201,78,78,0.2)', color:'#E87070' }}>{loginErr}</p>}
            <button type="submit" disabled={loginLoad}
                    className="btn-gold justify-center mt-2" style={{ opacity:loginLoad?0.7:1 }}>
              {loginLoad ? 'Connexion...' : 'Accéder au tableau de bord'}
            </button>
          </form>

          <a href="/" className="block text-center mt-4 text-xs hover:underline" style={{ color:'rgba(255,255,255,0.3)' }}>
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  )

  const NAV = [
    { id:'dashboard', label:'Tableau de bord', icon:<LayoutDashboard size={16}/> },
    { id:'categories',label:'Catégories',      icon:<Tag size={16}/> },
    { id:'products',  label:'Produits',         icon:<Package size={16}/> },
    { id:'orders',    label:'Commandes',        icon:<ShoppingCart size={16}/> },
  ]

  return (
    <div className="min-h-screen flex" style={{ background:'var(--cream)' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 admin-sidebar flex flex-col min-h-screen">
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
             className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-xs tracking-widest uppercase rounded"
             style={{ color:'rgba(255,255,255,0.4)' }}>
            <Eye size={14}/>Voir le site
          </a>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase rounded"
                  style={{ color:'rgba(255,255,255,0.4)' }}>
            <LogOut size={14}/>Déconnexion
          </button>
          <div className="mt-3 px-4">
            <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.25)' }}>Connecté en tant que</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color:'rgba(255,255,255,0.5)' }}>{adminUser?.full_name || adminUser?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* DASHBOARD */}
          {tab==='dashboard' && (
            <div>
              <p className="section-label">Vue d'ensemble</p>
              <h1 className="font-display text-3xl font-light mt-2" style={{ color:'var(--charcoal)' }}>
                Bonjour, {adminUser?.full_name?.split(' ')[0] || 'Admin'} 👋
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                {[
                  { label:'Produits',   value:products.length,                               color:'var(--charcoal)' },
                  { label:'Catégories', value:categories.length,                             color:'var(--gold)' },
                  { label:'Vedettes',   value:products.filter(p=>p.featured).length,         color:'#6B9B7A' },
                  { label:'Commandes',  value:orders.length,                                 color:'#9B6B6B' },
                ].map(stat => (
                  <div key={stat.label} className="p-6" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                    <p className="font-display text-4xl font-light" style={{ color:stat.color }}>{stat.value}</p>
                    <p className="text-xs tracking-widest uppercase mt-2 font-medium" style={{ color:'var(--warm-gray)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => { setTab('products'); setModal({ type:'product', data:null }) }} className="btn-primary">
                  <Plus size={14}/> Nouveau produit
                </button>
                <button onClick={() => { setTab('categories'); setModal({ type:'category', data:null }) }} className="btn-outline">
                  <Plus size={14}/> Nouvelle catégorie
                </button>
              </div>
              {/* Recent products */}
              <div className="mt-10">
                <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color:'var(--warm-gray)' }}>Produits récents</p>
                <div style={{ border:'1px solid var(--cream-dark)', background:'white' }}>
                  {products.slice(0,5).map((p,i) => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-4"
                         style={{ borderBottom:i<4?'1px solid var(--cream-dark)':'none' }}>
                      <div className="w-10 h-10 overflow-hidden flex-shrink-0" style={{ background:'var(--cream-dark)' }}>
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color:'var(--charcoal)' }}>{p.name}</p>
                        <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                          {categories.find(c=>c.slug===p.category_slug)?.name || p.category_slug}
                        </p>
                      </div>
                      <p className="font-display text-base font-medium" style={{ color:'var(--gold-dark)' }}>
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="section-label">Gestion</p>
                  <h1 className="font-display text-3xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
                    Catégories <span className="text-xl font-light ml-2" style={{ color:'var(--warm-gray)' }}>({categories.length})</span>
                  </h1>
                </div>
                <button onClick={() => setModal({ type:'category', data:null })} className="btn-primary">
                  <Plus size={14}/> Nouvelle catégorie
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-4 p-5"
                       style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                    <div className="w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0 rounded-lg"
                         style={{ background:cat.color||'var(--cream-dark)' }}>{cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color:'var(--charcoal)' }}>{cat.name}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                        /{cat.slug} · {products.filter(p=>p.category_slug===cat.slug).length} produits
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setModal({ type:'category', data:cat })}
                              className="w-8 h-8 flex items-center justify-center hover:opacity-70"
                              style={{ color:'var(--warm-gray)' }}><Pencil size={13}/></button>
                      <button onClick={() => deleteCategory(cat.id)}
                              className="w-8 h-8 flex items-center justify-center hover:opacity-70"
                              style={{ color:'#C94E4E' }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab==='products' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="section-label">Gestion</p>
                  <h1 className="font-display text-3xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
                    Produits <span className="text-xl font-light ml-2" style={{ color:'var(--warm-gray)' }}>({products.length})</span>
                  </h1>
                </div>
                <button onClick={() => setModal({ type:'product', data:null })} className="btn-primary">
                  <Plus size={14}/> Nouveau produit
                </button>
              </div>
              <div style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3"
                     style={{ borderBottom:'2px solid var(--cream-dark)', background:'var(--cream)' }}>
                  {['','Produit','Catégorie','Prix','Badge',''].map((h,i) => (
                    <p key={i} className={`text-[10px] tracking-widest uppercase font-medium col-span-${[1,4,3,2,1,1][i]}`}
                       style={{ color:'var(--warm-gray)' }}>{h}</p>
                  ))}
                </div>
                {products.map((p,i) => (
                  <div key={p.id}
                       className="flex md:grid md:grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-[var(--cream)] transition-colors"
                       style={{ borderBottom:i<products.length-1?'1px solid var(--cream-dark)':'none' }}>
                    <div className="col-span-1 flex-shrink-0">
                      <div className="w-10 h-10 overflow-hidden" style={{ background:'var(--cream-dark)' }}>
                        {p.image_url?<img src={p.image_url} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-lg">🧴</div>}
                      </div>
                    </div>
                    <div className="col-span-4 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color:'var(--charcoal)' }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                        {(p.variants||[]).map(v=>v.value).join(' · ')||'—'}
                      </p>
                    </div>
                    <p className="col-span-3 text-xs hidden md:block" style={{ color:'var(--warm-gray)' }}>
                      {categories.find(c=>c.slug===p.category_slug)?.name||p.category_slug}
                    </p>
                    <div className="col-span-2 hidden md:block">
                      <p className="font-display text-sm font-medium" style={{ color:'var(--charcoal)' }}>{Number(p.price).toLocaleString()} FCFA</p>
                      {p.original_price&&<p className="text-xs line-through" style={{ color:'var(--warm-gray)' }}>{Number(p.original_price).toLocaleString()} FCFA</p>}
                    </div>
                    <div className="col-span-1 hidden md:block">
                      {p.badge&&<span className={`badge ${p.badge==='Nouveau'?'badge-new':p.badge==='Bestseller'?'badge-best':'badge-sale'}`}>{p.badge}</span>}
                    </div>
                    <div className="col-span-1 flex gap-1 justify-end flex-shrink-0">
                      <button onClick={() => setModal({ type:'product', data:p })}
                              className="w-7 h-7 flex items-center justify-center hover:opacity-70"
                              style={{ color:'var(--warm-gray)' }}><Pencil size={13}/></button>
                      <button onClick={() => deleteProduct(p.id)}
                              className="w-7 h-7 flex items-center justify-center hover:opacity-70"
                              style={{ color:'#C94E4E' }}><Trash2 size={13}/></button>
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
              <h1 className="font-display text-3xl font-light mt-1 mb-8" style={{ color:'var(--charcoal)' }}>
                Commandes récentes
              </h1>
              {orders.length === 0 ? (
                <div className="text-center py-24" style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                  <ShoppingCart size={40} strokeWidth={1} className="mx-auto mb-4" style={{ color:'var(--cream-dark)' }}/>
                  <p className="font-display text-xl font-light" style={{ color:'var(--warm-gray)' }}>Aucune commande pour l'instant</p>
                  <p className="text-sm mt-2" style={{ color:'var(--warm-gray)' }}>Les commandes passées via WhatsApp apparaîtront ici.</p>
                </div>
              ) : (
                <div style={{ background:'white', border:'1px solid var(--cream-dark)' }}>
                  {orders.map((o,i) => (
                    <div key={o.id} className="px-5 py-4 hover:bg-[var(--cream)] transition-colors"
                         style={{ borderBottom:i<orders.length-1?'1px solid var(--cream-dark)':'none' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color:'var(--charcoal)' }}>
                            {o.customer_name || 'Client anonyme'}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color:'var(--warm-gray)' }}>
                            {new Date(o.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                            {o.customer_phone && ` · ${o.customer_phone}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-base font-medium" style={{ color:'var(--gold-dark)' }}>
                            {Number(o.total_amount).toLocaleString()} FCFA
                          </p>
                          <span className="text-[10px] tracking-widest uppercase px-2 py-0.5"
                                style={{ background: o.status==='pending'?'#FEF3C7':o.status==='confirmed'?'#D1FAE5':'#F3F4F6', color: o.status==='pending'?'#92400E':o.status==='confirmed'?'#065F46':'#374151' }}>
                            {o.status}
                          </span>
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

      {/* Modals */}
      {modal?.type==='category' && (
        <Modal title={modal.data ? 'Modifier la catégorie' : 'Nouvelle catégorie'} onClose={() => setModal(null)}>
          <CategoryForm initial={modal.data} onSave={saveCategory} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type==='product' && (
        <Modal title={modal.data ? 'Modifier le produit' : 'Nouveau produit'} onClose={() => setModal(null)}>
          <ProductForm initial={modal.data} categories={categories} onSave={saveProduct} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <Check size={15} style={{ color:'var(--gold-light)', flexShrink:0 }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
