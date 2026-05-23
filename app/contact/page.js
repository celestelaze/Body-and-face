'use client'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Instagram, MessageCircle, Clock, MapPin } from 'lucide-react'

const WA_NUMBER     = '242064731996'
const INSTAGRAM_URL = 'https://www.instagram.com/body_and_face_congo?igsh=dW81ZWMza3hjeGhs&utm_source=qr'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <div className="py-20 text-center" style={{ background: 'var(--cream-dark)' }}>
          <p className="section-label">Parlons beauté</p>
          <h1 className="font-display text-4xl md:text-5xl font-light mt-3" style={{ color: 'var(--charcoal)' }}>Contactez-nous</h1>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: 'var(--warm-gray)' }}>
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans votre routine beauté.
          </p>
          <div className="gold-divider mt-6" />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-8">

            {/* WhatsApp */}
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Bonjour Body & Face ! 👋\nJ\'ai une question concernant vos produits.')}`}
               target="_blank" rel="noopener noreferrer"
               className="group flex flex-col items-center text-center p-10 transition-all duration-300 hover:-translate-y-2"
               style={{ background: 'white', border: '2px solid var(--cream-dark)' }}>
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 transition-all group-hover:scale-110"
                   style={{ background: '#E8F8EE' }}>
                <MessageCircle size={36} style={{ color: '#25D366' }} />
              </div>
              <p className="font-display text-2xl font-light mb-2" style={{ color: 'var(--charcoal)' }}>WhatsApp</p>
              <p className="text-sm mb-4" style={{ color: 'var(--warm-gray)' }}>
                La façon la plus rapide de nous joindre. Réponse garantie sous 24h.
              </p>
              <p className="font-medium text-base mb-6" style={{ color: '#25D366' }}>+{WA_NUMBER}</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--warm-gray)' }}>
                <Clock size={12} /> Disponible 7j/7
              </div>
              <div className="mt-6 py-3 px-8 text-sm font-medium tracking-widest uppercase text-white transition-all group-hover:opacity-90"
                   style={{ background: '#25D366', letterSpacing: '0.1em' }}>
                Nous écrire sur WhatsApp
              </div>
            </a>

            {/* Instagram */}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
               className="group flex flex-col items-center text-center p-10 transition-all duration-300 hover:-translate-y-2"
               style={{ background: 'white', border: '2px solid var(--cream-dark)' }}>
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 transition-all group-hover:scale-110"
                   style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE8D8,#FCE4EC)' }}>
                <Instagram size={36} style={{ color: '#E1306C' }} />
              </div>
              <p className="font-display text-2xl font-light mb-2" style={{ color: 'var(--charcoal)' }}>Instagram</p>
              <p className="text-sm mb-4" style={{ color: 'var(--warm-gray)' }}>
                Suivez notre univers beauté, découvrez nos nouveautés et inspirations quotidiennes.
              </p>
              <p className="font-medium text-base mb-6" style={{ color: '#E1306C' }}>@body_and_face_congo</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--warm-gray)' }}>
                <Clock size={12} /> Nouveautés chaque semaine
              </div>
              <div className="mt-6 py-3 px-8 text-sm font-medium tracking-widest uppercase text-white transition-all group-hover:opacity-90"
                   style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', letterSpacing: '0.1em' }}>
                Nous suivre sur Instagram
              </div>
            </a>
          </div>

          {/* Bottom note */}
          <div className="mt-12 p-8 text-center" style={{ background: 'var(--cream-dark)' }}>
            <div className="flex items-center justify-center gap-2 mb-3" style={{ color: 'var(--gold)' }}>
              <MapPin size={16} />
              <p className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--warm-gray)' }}>République du Congo</p>
            </div>
            <p className="font-display text-xl font-light" style={{ color: 'var(--charcoal)' }}>
              "La beauté, c'est notre passion. Votre satisfaction, notre priorité."
            </p>
            <p className="text-sm mt-3" style={{ color: 'var(--warm-gray)' }}>
              Nous mettons tout en œuvre pour vous offrir la meilleure expérience beauté possible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
