'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// Page secrète pour activer le rôle admin sur son propre compte
// URL: /setup-admin (à supprimer après utilisation)
export default function SetupAdminPage() {
  const [user,    setUser]    = useState(null)
  const [status,  setStatus]  = useState('')
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
    })
  }, [])

  async function makeAdmin() {
    if (!user) return
    setLoading(true)
    setStatus('Activation en cours...')
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
    setLoading(false)
    if (error) {
      setStatus('Erreur : ' + error.message)
    } else {
      setDone(true)
      setStatus('Votre compte est maintenant administrateur !')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--charcoal)' }}>
      <div className="w-full max-w-sm p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-display text-2xl font-light tracking-widest mb-2" style={{ color: 'white' }}>
          BODY <span style={{ color: 'var(--gold)' }}>&</span> FACE
        </p>
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Activation Admin</p>

        {!user ? (
          <div>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Vous devez d'abord vous connecter à votre compte.
            </p>
            <a href="/" className="btn-gold w-full justify-center">Aller se connecter</a>
          </div>
        ) : done ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-sm mb-2" style={{ color: 'white' }}>Admin activé pour :</p>
            <p className="text-xs mb-6" style={{ color: 'var(--gold-light)' }}>{user.email}</p>
            <a href="/admin" className="btn-gold w-full justify-center block text-center">Accéder au Dashboard →</a>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Compte connecté :</p>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--gold-light)' }}>{user.email}</p>
            <button onClick={makeAdmin} disabled={loading}
                    className="btn-gold w-full justify-center" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Activation...' : '🔐 Activer le rôle Admin'}
            </button>
            {status && <p className="text-xs mt-4 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>{status}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
