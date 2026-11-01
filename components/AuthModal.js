'use client'
import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Loader, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../lib/context'

const COUNTRIES = [
  { code: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: '+243', flag: '🇨🇩', name: 'RDC' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+236', flag: '🇨🇫', name: 'Centrafrique' },
  { code: '+235', flag: '🇹🇩', name: 'Tchad' },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+229', flag: '🇧🇯', name: 'Bénin' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+234', flag: '🇳🇬', name: 'Nigéria' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+20',  flag: '🇪🇬', name: 'Égypte' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
  { code: '+41',  flag: '🇨🇭', name: 'Suisse' },
  { code: '+1',   flag: '🇺🇸', name: 'États-Unis' },
]

// Chiffres uniquement. Congo (+242) : le 0 initial fait partie du numéro (06 xxx xxxx) → on le garde.
// Ailleurs, le 0 initial est un préfixe national → on l'enlève.
function toNational(dial, raw) {
  const digits = String(raw).replace(/\D/g, '')
  return dial === '+242' ? digits : digits.replace(/^0+/, '')
}

function frenchError(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('invalid login'))                                      return 'E-mail ou mot de passe incorrect.'
  if (m.includes('already registered') || m.includes('already been'))   return 'Cet e-mail a déjà un compte. Connecte-toi.'
  if (m.includes('not confirmed'))                                      return "Ton e-mail n'est pas encore confirmé."
  if (m.includes('rate limit') || m.includes('too many'))               return 'Trop de tentatives. Réessaie dans quelques minutes.'
  if (m.includes('password') && (m.includes('6') || m.includes('short'))) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (m.includes('valid email') || m.includes('invalid email'))         return "Cette adresse e-mail n'est pas valide."
  if (m.includes('fetch') || m.includes('network'))                     return 'Connexion impossible. Vérifie ton réseau.'
  return 'Une erreur est survenue. Réessaie.'
}

function PhoneInput({ onChange }) {
  const [open,   setOpen]   = useState(false)
  const [dial,   setDial]   = useState('+242')
  const [local,  setLocal]  = useState('')
  const [search, setSearch] = useState('')

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search))
  const selected = COUNTRIES.find(c => c.code === dial) || COUNTRIES[0]

  function emit(d, l) { onChange(l ? d + toNational(d, l) : '') }
  function pick(code) { setDial(code); setOpen(false); setSearch(''); emit(code, local) }
  function typing(v)  { setLocal(v); emit(dial, v) }

  return (
    <div className="flex gap-0 relative">
      <button type="button" onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 border border-r-0 text-sm flex-shrink-0 transition-colors hover:bg-[var(--cream)]"
              style={{ borderColor:'#E2D9D0', background:'white', color:'var(--charcoal)', minWidth:80 }}>
        <span>{selected.flag}</span>
        <span className="text-xs font-medium">{selected.code}</span>
        <ChevronDown size={11} style={{ color:'var(--warm-gray)' }} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 w-64 bg-white shadow-xl max-h-60 overflow-y-auto"
             style={{ border:'1px solid var(--cream-dark)', borderTop:'2px solid var(--pink)' }}>
          <div className="p-2 sticky top-0 bg-white" style={{ borderBottom:'1px solid var(--cream-dark)' }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                   className="w-full px-3 py-1.5 text-xs outline-none"
                   style={{ border:'1px solid var(--cream-dark)', background:'var(--cream)' }}
                   placeholder="Rechercher un pays..." />
          </div>
          {filtered.map(c => (
            <button key={c.code} type="button" onClick={() => pick(c.code)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs hover:bg-[var(--cream)] transition-colors"
                    style={{ color: dial === c.code ? 'var(--pink)' : 'var(--charcoal)', fontWeight: dial === c.code ? 600 : 400 }}>
              <span>{c.flag}</span><span className="flex-1">{c.name}</span>
              <span style={{ color:'var(--warm-gray)' }}>{c.code}</span>
            </button>
          ))}
        </div>
      )}

      <input type="tel" inputMode="tel" autoComplete="tel-national" value={local}
             onChange={e => typing(e.target.value)}
             className="flex-1 min-w-0 px-4 py-3 text-sm outline-none"
             style={{ border:'1px solid #E2D9D0', borderLeft:'none', color:'var(--charcoal)', background:'white' }}
             placeholder="06 002 01 01" />
    </div>
  )
}

const EMPTY = { email:'', password:'', full_name:'', phone:'' }

export default function AuthModal() {
  const { authModal, setAuthModal } = useApp()
  const [mode,    setMode]    = useState('login')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [form,    setForm]    = useState(EMPTY)

  // À l'ouverture : bon onglet. À la fermeture : on remet tout à zéro.
  useEffect(() => {
    if (authModal) setMode(authModal === 'signup' ? 'signup' : 'login')
    else { setError(''); setSuccess(''); setLoading(false); setShowPw(false); setForm(EMPTY) }
  }, [authModal])

  if (!authModal) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isLogin = mode === 'login'

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password })
    setLoading(false)
    if (error) { setError(frenchError(error.message)); return }
    setAuthModal(false)
  }

  async function handleSignup(e) {
    e.preventDefault(); setError('')
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Entre un numéro de téléphone valide.'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(), password: form.password,
      options: { data: { full_name: form.full_name.trim(), phone: form.phone } },
    })
    setLoading(false)
    if (error) { setError(frenchError(error.message)); return }
    if (data.session) { setAuthModal(false); return }   // compte créé ET connecté, rien d'autre à faire
    setSuccess("Compte créé ! Un e-mail de confirmation t'a été envoyé : clique sur le lien pour activer ton compte.")
  }

  return (
    <div className="modal-overlay" onClick={() => setAuthModal(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 pt-7 pb-5" style={{ borderBottom:'1px solid var(--cream-dark)' }}>
          <div>
            <p className="section-label">{isLogin ? 'Bienvenue' : 'Rejoins-nous'}</p>
            <h2 className="font-display text-2xl font-light mt-1" style={{ color:'var(--charcoal)' }}>
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>
          <button onClick={() => setAuthModal(false)} aria-label="Fermer" className="p-1.5 hover:opacity-60" style={{ color:'var(--warm-gray)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6">
          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">✉️</div>
              <p className="font-display text-lg" style={{ color:'var(--charcoal)' }}>{success}</p>
              <button className="btn-pink mt-5" onClick={() => setAuthModal(false)}>Fermer</button>
            </div>
          ) : (
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col gap-4">
              {!isLogin && (<>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Nom complet *</label>
                  <input className="input-field" type="text" autoComplete="name" value={form.full_name} required
                         onChange={e => set('full_name', e.target.value)} placeholder="Ton prénom et nom" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Numéro de téléphone *</label>
                  <PhoneInput onChange={v => set('phone', v)} />
                </div>
              </>)}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>E-mail *</label>
                <input className="input-field" type="email" autoComplete="email" value={form.email} required
                       onChange={e => set('email', e.target.value)} placeholder="ton@email.com" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color:'var(--warm-gray)' }}>Mot de passe *</label>
                <div className="relative">
                  <input className="input-field pr-10" type={showPw ? 'text' : 'password'}
                         autoComplete={isLogin ? 'current-password' : 'new-password'}
                         value={form.password} required minLength={6}
                         onChange={e => set('password', e.target.value)} placeholder="Minimum 6 caractères" />
                  <button type="button" onClick={() => setShowPw(v => !v)} aria-label="Afficher le mot de passe"
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60" style={{ color:'var(--warm-gray)' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs px-3 py-2 rounded-lg" style={{ background:'#FEF2F2', color:'#B91C1C' }}>{error}</p>}

              <button type="submit" disabled={loading} className="btn-pink justify-center mt-1" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Loader size={14} className="animate-spin" /> Chargement...</> : isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-xs mt-5" style={{ color:'var(--warm-gray)' }}>
              {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
              <button className="font-medium hover:underline" style={{ color:'var(--pink)' }}
                      onClick={() => { setMode(isLogin ? 'signup' : 'login'); setError('') }}>
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
