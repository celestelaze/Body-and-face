'use client'
import { useState } from 'react'
import { X, Eye, EyeOff, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../lib/context'

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
    if (error) { setError(error.message); return }
    setAuthModal(false)
  }

  async function handleSignup(e) {
    e.preventDefault(); setError(''); setLoading(true)
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
                           style={{ color: 'var(--warm-gray)' }}>Nom complet</label>
                    <input className="input-field" type="text" value={form.full_name} required
                           onChange={e => set('full_name', e.target.value)} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                           style={{ color: 'var(--warm-gray)' }}>Téléphone</label>
                    <input className="input-field" type="tel" value={form.phone}
                           onChange={e => set('phone', e.target.value)} placeholder="+242..." />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                       style={{ color: 'var(--warm-gray)' }}>E-mail</label>
                <input className="input-field" type="email" value={form.email} required
                       onChange={e => set('email', e.target.value)} placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                       style={{ color: 'var(--warm-gray)' }}>Mot de passe</label>
                <div className="relative">
                  <input className="input-field pr-10"
                         type={showPw ? 'text' : 'password'}
                         value={form.password} required minLength={6}
                         onChange={e => set('password', e.target.value)}
                         placeholder="••••••••" />
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
                      className="btn-primary justify-center mt-1" style={{ opacity: loading ? 0.7 : 1 }}>
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
