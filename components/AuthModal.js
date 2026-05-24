'use client'
import { useState } from 'react'
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

function PhoneInput({ value, onChange }) {
  const [open,       setOpen]       = useState(false)
  const [dialCode,   setDialCode]   = useState('+242')
  const [localPhone, setLocalPhone] = useState('')
  const [search,     setSearch]     = useState('')

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  )

  function select(code) {
    setDialCode(code)
    setOpen(false)
    setSearch('')
    onChange(code + localPhone.replace(/^0/, ''))
  }

  function handleLocal(v) {
    setLocalPhone(v)
    onChange(dialCode + v.replace(/^0/, ''))
  }

  const selected = COUNTRIES.find(c => c.code === dialCode) || COUNTRIES[0]

  return (
    <div className="flex gap-0 relative">
      {/* Dial code selector */}
      <button type="button" onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 border border-r-0 text-sm flex-shrink-0 transition-colors hover:bg-[var(--cream)]"
              style={{ borderColor: '#E2D9D0', background: 'white', color: 'var(--charcoal)', minWidth: 80 }}>
        <span>{selected.flag}</span>
        <span className="text-xs font-medium">{selected.code}</span>
        <ChevronDown size={11} style={{ color: 'var(--warm-gray)' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 w-64 bg-white shadow-xl max-h-60 overflow-y-auto"
             style={{ border: '1px solid var(--cream-dark)', borderTop: '2px solid var(--gold)' }}>
          <div className="p-2 sticky top-0 bg-white" style={{ borderBottom: '1px solid var(--cream-dark)' }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                   className="w-full px-3 py-1.5 text-xs outline-none"
                   style={{ border: '1px solid var(--cream-dark)', background: 'var(--cream)' }}
                   placeholder="Rechercher un pays..." />
          </div>
          {filtered.map(c => (
            <button key={c.code} type="button" onClick={() => select(c.code)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs hover:bg-[var(--cream)] transition-colors"
                    style={{ color: dialCode === c.code ? 'var(--gold-dark)' : 'var(--charcoal)', fontWeight: dialCode === c.code ? 600 : 400 }}>
              <span>{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span style={{ color: 'var(--warm-gray)' }}>{c.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Number input */}
      <input type="tel" value={localPhone} onChange={e => handleLocal(e.target.value)}
             className="flex-1 px-4 py-3 text-sm outline-none"
             style={{ border: '1px solid #E2D9D0', borderLeft: 'none', color: 'var(--charcoal)', background: 'white' }}
             placeholder="06 473 19 96" />
    </div>
  )
}

export default function AuthModal() {
  const { authModal, setAuthModal } = useApp()
  const [mode,    setMode]    = useState(authModal || 'login')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [form,    setForm]    = useState({ email: '', password: '', full_name: '', phone: '' })

  if (!authModal) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (error) { setError("Email ou mot de passe incorrect."); return }
    setAuthModal(false)
  }

  async function handleSignup(e) {
    e.preventDefault(); setError(''); setLoading(true)
    if (!form.phone || form.phone.length < 8) {
      setError("Veuillez entrer un numéro de téléphone valide.")
      setLoading(false); return
    }
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.full_name, phone: form.phone } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Compte créé ! Vérifiez votre e-mail pour confirmer.')
  }

  const isLogin = mode === 'login'

  return (
    <div className="modal-overlay" onClick={() => setAuthModal(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5"
             style={{ borderBottom: '1px solid var(--cream-dark)' }}>
          <div>
            <p className="section-label">{isLogin ? 'Bienvenue' : 'Rejoignez-nous'}</p>
            <h2 className="font-display text-2xl font-light mt-1" style={{ color: 'var(--charcoal)' }}>
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>
          <button onClick={() => setAuthModal(false)} className="p-1.5 hover:opacity-60"
                  style={{ color: 'var(--warm-gray)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">✉️</div>
              <p className="font-display text-lg" style={{ color: 'var(--charcoal)' }}>{success}</p>
              <button className="btn-primary mt-5" onClick={() => setAuthModal(false)}>Fermer</button>
            </div>
          ) : (
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col gap-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                           style={{ color: 'var(--warm-gray)' }}>Nom complet *</label>
                    <input className="input-field" type="text" value={form.full_name} required
                           onChange={e => set('full_name', e.target.value)} placeholder="Votre prénom et nom" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                           style={{ color: 'var(--warm-gray)' }}>Numéro de téléphone *</label>
                    <PhoneInput value={form.phone} onChange={v => set('phone', v)} />
                    <p className="text-[10px] mt-1" style={{ color: 'var(--warm-gray)' }}>
                      Indicatif Congo (+242) par défaut
                    </p>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                       style={{ color: 'var(--warm-gray)' }}>E-mail *</label>
                <input className="input-field" type="email" value={form.email} required
                       onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                       style={{ color: 'var(--warm-gray)' }}>Mot de passe *</label>
                <div className="relative">
                  <input className="input-field pr-10"
                         type={showPw ? 'text' : 'password'}
                         value={form.password} required minLength={6}
                         onChange={e => set('password', e.target.value)}
                         placeholder="Minimum 6 caractères" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
                          style={{ color: 'var(--warm-gray)' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs px-3 py-2" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                      className="btn-primary justify-center mt-1"
                      style={{ opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><Loader size={14} className="animate-spin" /> Chargement...</>
                  : isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-xs mt-5" style={{ color: 'var(--warm-gray)' }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
              <button className="font-medium hover:underline"
                      style={{ color: 'var(--gold-dark)' }}
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
