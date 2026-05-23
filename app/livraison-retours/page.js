'use client'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Truck, RotateCcw, MessageCircle, Package, Clock, Shield } from 'lucide-react'

const WA_NUMBER = '242064731996'

function TrackingForm() {
  const [orderDate,    setOrderDate]    = useState('')
  const [orderAmount,  setOrderAmount]  = useState('')
  const [trackingNum,  setTrackingNum]  = useState('')
  const [customerName, setCustomerName] = useState('')

  function getDaysElapsed() {
    if (!orderDate) return null
    const diff = Math.floor((new Date() - new Date(orderDate)) / (1000 * 60 * 60 * 24))
    return diff
  }

  function buildMessage() {
    const days    = getDaysElapsed()
    const dateStr = orderDate ? new Date(orderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
    const elapsed = days !== null
      ? days === 0 ? "aujourd'hui"
      : days === 1 ? 'il y a 1 jour'
      : `il y a ${days} jours`
      : ''

    return encodeURIComponent(
`Bonjour Body & Face ! 👋

J'aimerais connaître le suivi de ma commande.

👤 Nom : ${customerName || '—'}
📅 Date de commande : ${dateStr} (${elapsed})
💰 Montant de la commande : ${orderAmount ? Number(orderAmount).toLocaleString() + ' FCFA' : '—'}
📦 Numéro de suivi : ${trackingNum || '—'}

Merci de me tenir informé(e). 🌸`
    )
  }

  const days    = getDaysElapsed()
  const canSend = orderDate && orderAmount && trackingNum && customerName

  return (
    <div id="suivi" className="scroll-mt-24">
      <div className="p-8" style={{ border: '2px solid var(--gold-light)', background: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--cream-dark)', color: 'var(--gold)' }}>
            <MessageCircle size={18} />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium" style={{ color: 'var(--charcoal)' }}>Suivre ma commande</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>Remplissez le formulaire — un message pré-rempli sera envoyé sur WhatsApp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'var(--warm-gray)' }}>Votre nom *</label>
            <input className="input-field" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Prénom et nom" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'var(--warm-gray)' }}>Date de commande *</label>
            <input className="input-field" type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)}
                   max={new Date().toISOString().split('T')[0]} />
            {days !== null && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--gold-dark)' }}>
                ⏱ {days === 0 ? "Commandé aujourd'hui" : days === 1 ? 'Commandé il y a 1 jour' : `Commandé il y a ${days} jours`}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'var(--warm-gray)' }}>Montant de la commande (FCFA) *</label>
            <input className="input-field" type="number" value={orderAmount} onChange={e => setOrderAmount(e.target.value)} placeholder="Ex: 45000" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'var(--warm-gray)' }}>Numéro de suivi *</label>
            <input className="input-field" value={trackingNum} onChange={e => setTrackingNum(e.target.value)} placeholder="Ex: BF-2024-00123" />
            <p className="text-xs mt-1.5" style={{ color: 'var(--warm-gray)' }}>Reçu par WhatsApp lors de la confirmation de commande</p>
          </div>
        </div>

        {/* Preview message */}
        {canSend && (
          <div className="mt-5 p-4 rounded" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#166534' }}>📱 Aperçu du message WhatsApp :</p>
            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#15803D', fontFamily: 'monospace' }}>
{`Bonjour Body & Face ! 👋

J'aimerais connaître le suivi de ma commande.

👤 Nom : ${customerName}
📅 Date de commande : ${new Date(orderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} (${days === 0 ? "aujourd'hui" : days === 1 ? 'il y a 1 jour' : `il y a ${days} jours`})
💰 Montant : ${Number(orderAmount).toLocaleString()} FCFA
📦 N° de suivi : ${trackingNum}`}
            </p>
          </div>
        )}

        <button disabled={!canSend}
                onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${buildMessage()}`, '_blank')}
                className="mt-5 w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-widest uppercase text-white transition-all"
                style={{ background: canSend ? '#25D366' : '#D0D0D0', cursor: canSend ? 'pointer' : 'not-allowed', letterSpacing: '0.1em' }}>
          <MessageCircle size={17} />
          {canSend ? 'Envoyer le suivi sur WhatsApp' : 'Remplissez tous les champs'}
        </button>
      </div>
    </div>
  )
}

export default function LivraisonRetoursPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="py-20 text-center" style={{ background: '#DFF0E8' }}>
          <p className="section-label">Informations pratiques</p>
          <h1 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color: 'var(--charcoal)' }}>Livraison & Retours</h1>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: 'var(--warm-gray)' }}>
            Tout ce que vous devez savoir sur la livraison de vos commandes et notre politique de retour.
          </p>
          <div className="gold-divider mt-6" />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Livraison */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: 'var(--cream-dark)', color: 'var(--gold)' }}>
                <Truck size={22} />
              </div>
              <h2 className="font-display text-3xl font-light" style={{ color: 'var(--charcoal)' }}>Livraison</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {[
                { icon: <Clock size={20}/>, title: 'Délai de livraison', text: '2 à 3 semaines à partir de la confirmation de commande' },
                { icon: <Truck size={20}/>, title: 'Livraison offerte', text: 'Gratuite dès 60 000 FCFA d\'achat. En dessous, des frais s\'appliquent selon la zone' },
                { icon: <Package size={20}/>, title: 'Numéro de suivi', text: 'Reçu par WhatsApp dès l\'expédition de votre colis' },
              ].map((card, i) => (
                <div key={i} className="p-6" style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)' }}>
                  <div className="mb-3" style={{ color: 'var(--gold)' }}>{card.icon}</div>
                  <p className="font-display text-base font-medium mb-2" style={{ color: 'var(--charcoal)' }}>{card.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--warm-gray)' }}>{card.text}</p>
                </div>
              ))}
            </div>
            <div className="p-6" style={{ background: 'var(--cream-dark)', borderLeft: '3px solid var(--gold)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
                <strong>Comment ça marche ?</strong> Après validation de votre commande via WhatsApp, notre équipe prépare votre colis sous 24 à 48h. L'envoi se fait via des transporteurs internationaux fiables (DHL, Colissimo, EMS). Une fois expédié, vous recevez votre <strong>numéro de suivi</strong> directement sur WhatsApp pour suivre votre colis en temps réel jusqu'à sa livraison à votre porte.
              </p>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--cream-dark)', marginBottom: 64 }} />

          {/* Retours */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: 'var(--cream-dark)', color: 'var(--gold)' }}>
                <RotateCcw size={22} />
              </div>
              <h2 className="font-display text-3xl font-light" style={{ color: 'var(--charcoal)' }}>Politique de retour</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              {[
                { icon: <Clock size={18}/>, title: 'Délai de retour', text: 'Les retours sont acceptés dans un délai de 3 jours après réception du colis.' },
                { icon: <Shield size={18}/>, title: 'Frais de retour', text: 'Les frais de renvoi du colis sont entièrement à la charge du client.' },
              ].map((card, i) => (
                <div key={i} className="p-6" style={{ background: 'white', border: '1px solid var(--cream-dark)' }}>
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--gold)' }}>
                    {card.icon}
                    <p className="font-display text-base font-medium" style={{ color: 'var(--charcoal)' }}>{card.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--warm-gray)' }}>{card.text}</p>
                </div>
              ))}
            </div>
            <div className="p-6 mb-8" style={{ background: '#FEF9EC', border: '1px solid #F0D080', borderLeft: '3px solid var(--gold)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
                <strong>⚠️ Conditions de retour :</strong> Pour initier un retour, vous devez fournir le <strong>numéro de suivi</strong> qui vous a été communiqué lors de la confirmation de votre commande. Le produit doit être retourné dans son emballage d'origine, non utilisé et en parfait état. Les produits ouverts ou utilisés ne sont pas éligibles au retour.
              </p>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--cream-dark)', marginBottom: 64 }} />

          {/* Tracking form */}
          <div>
            <div className="mb-6">
              <p className="section-label">Besoin d'aide ?</p>
              <h2 className="font-display text-3xl font-light mt-2" style={{ color: 'var(--charcoal)' }}>Suivre ma commande</h2>
              <p className="text-sm mt-3" style={{ color: 'var(--warm-gray)' }}>
                Remplissez le formulaire ci-dessous. Un message pré-rempli avec tous les détails de votre commande sera automatiquement envoyé à notre équipe sur WhatsApp.
              </p>
            </div>
            <TrackingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
