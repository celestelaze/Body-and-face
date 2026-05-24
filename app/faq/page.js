'use client'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const WA_NUMBER = '242064731996'

const FAQS = [
  {
    q: "Combien de temps prend une commande pour arriver ?",
    a: "Toutes nos commandes sont livrées dans un délai de 2 à 3 semaines à compter de la date de validation. Dès que votre commande est expédiée, vous recevez un numéro de suivi par WhatsApp pour suivre votre colis en temps réel."
  },
  {
    q: "Vos produits sont-ils fiables et authentiques ?",
    a: "Oui, absolument ! Tous les produits Body & Face sont 100 % authentiques. Nous travaillons directement avec des fournisseurs certifiés et des marques reconnues. Chaque produit est rigoureusement sélectionné pour sa qualité, son efficacité et sa sécurité."
  },
  {
    q: "Comment passer une commande ?",
    a: "C'est très simple : parcourez notre boutique, ajoutez vos produits au panier, puis cliquez sur 'Commander via WhatsApp'. Vous serez redirigé vers notre WhatsApp avec le récapitulatif de votre commande. Notre équipe confirme votre commande et vous guide pour le paiement."
  },
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous acceptons les paiements via Mobile Money (Orange Money, MTN Mobile Money), ainsi que les virements bancaires et les paiements en espèces pour les livraisons locales. Le paiement est sécurisé à 100 %."
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Une fois votre commande expédiée, vous recevez un numéro de suivi sur WhatsApp. Vous pouvez également utiliser notre page 'Suivi de commande' pour nous contacter directement avec votre numéro de suivi et votre date de commande."
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Oui, les retours sont acceptés sous 3 jours après réception du colis. Les frais de retour sont à la charge du client. Pour initier un retour, rendez-vous sur notre page Livraison & Retours et remplissez le formulaire de suivi — vous serez redirigé vers notre WhatsApp avec un message pré-rempli."
  },
  {
    q: "Livrez-vous dans toute l'Afrique ?",
    a: "Nous livrons principalement en République du Congo et dans les pays voisins. Pour les livraisons internationales, contactez-nous directement sur WhatsApp afin que nous puissions vous proposer les meilleures options disponibles selon votre localisation."
  },
  {
    q: "Les produits conviennent-ils à tous les types de peau ?",
    a: "Notre gamme est conçue pour tous les types de peau : normale, sèche, mixte, grasse et sensible. Chaque produit indique clairement le type de peau recommandé. En cas de doute, n'hésitez pas à nous contacter via WhatsApp — notre équipe vous conseille personnellement."
  },
  {
    q: "La livraison est-elle vraiment gratuite ?",
    a: "Oui ! La livraison est offerte pour toute commande d'un montant supérieur ou égal à 100 000 FCFA. En dessous de ce montant, des frais de livraison s'appliquent selon votre zone géographique."
  },
  {
    q: "Comment vous contacter en cas de problème ?",
    a: "Notre équipe est disponible sur WhatsApp au +242 06 473 19 96 et sur Instagram @body_and_face_congo. Vous pouvez également passer par notre page Contact. Nous répondons généralement dans les 24 heures."
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden transition-all" style={{ border: '1px solid var(--cream-dark)', marginBottom: 8 }}>
      <button onClick={() => setOpen(v => !v)}
              className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[var(--cream)]">
        <span className="font-display text-base font-medium pr-4" style={{ color: 'var(--charcoal)' }}>
          {item.q}
        </span>
        <ChevronDown size={18} className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                     style={{ color: 'var(--gold)' }} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div style={{ borderTop: '1px solid var(--cream-dark)', paddingTop: 16 }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--warm-gray)' }}>{item.a}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="py-20 text-center" style={{ background: 'var(--cream-dark)' }}>
          <p className="section-label">Centre d'aide</p>
          <h1 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color: 'var(--charcoal)' }}>
            Questions fréquentes
          </h1>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: 'var(--warm-gray)' }}>
            Tout ce que vous devez savoir sur vos commandes, nos produits et nos livraisons.
          </p>
          <div className="gold-divider mt-6" />
        </div>

        {/* FAQ list */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          {FAQS.map((item, i) => <FAQItem key={i} item={item} index={i} />)}

          {/* Still have questions */}
          <div className="mt-12 p-8 text-center" style={{ background: 'var(--charcoal)' }}>
            <p className="font-display text-2xl font-light" style={{ color: 'white' }}>
              Vous n'avez pas trouvé votre réponse ?
            </p>
            <p className="text-sm mt-3 mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Notre équipe est disponible pour vous aider directement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
                 className="btn-gold justify-center">
                Nous contacter sur WhatsApp
              </a>
              <Link href="/contact" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                Page contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
