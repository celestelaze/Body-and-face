import Link from 'next/link'
import { Instagram } from 'lucide-react'

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/body_and_face_congo'
const WA_NUMBER     = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '242064731996'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.7)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Newsletter</p>
            <h3 className="font-display text-3xl font-light mt-2" style={{ color: 'white' }}>Rejoignez notre communauté beauté</h3>
          </div>
          <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Votre adresse e-mail" className="flex-1 md:w-72 px-5 py-3.5 text-sm outline-none"
                   style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }} />
            <button type="submit" className="btn-gold text-[11px] px-6">S'abonner</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-light tracking-widest" style={{ color: 'white' }}>
            BODY <span style={{ color: 'var(--gold)' }}>&</span> FACE
          </p>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Votre destination premium pour la beauté et le bien-être. Des produits d'exception livrés directement chez vous.
          </p>
          <div className="flex gap-4 mt-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:opacity-100"
               style={{ border: '1px solid rgba(255,255,255,0.2)', opacity: 0.7 }}>
              <Instagram size={15} color="white" />
            </a>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:opacity-100"
               style={{ border: '1px solid rgba(255,255,255,0.2)', opacity: 0.7 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.112 1.522 5.845L.057 23.714a.5.5 0 00.611.636l6.098-1.597A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.788 9.788 0 01-5.064-1.407l-.363-.215-3.76.985 1.003-3.647-.236-.374A9.793 9.793 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Boutique */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-medium" style={{ color: 'var(--gold-light)' }}>Boutique</p>
          {[['Skincare','skincare'],['Soins du Corps','body-care'],['Protection Solaire','sun-care'],['Compléments','supplements'],['Parfums','fragrances'],['Capillaire','hair-care']].map(([l,s]) => (
            <Link key={l} href={`/shop?cat=${s}`} className="block text-xs mb-3 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>

        {/* Aide */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-medium" style={{ color: 'var(--gold-light)' }}>Aide</p>
          <Link href="/faq" className="block text-xs mb-3 hover:text-white transition-colors">FAQ</Link>
          <Link href="/livraison-retours" className="block text-xs mb-3 hover:text-white transition-colors">Livraison & Retours</Link>
          <Link href="/livraison-retours#suivi" className="block text-xs mb-3 hover:text-white transition-colors">Suivi de commande</Link>
          <Link href="/contact" className="block text-xs mb-3 hover:text-white transition-colors">Contact</Link>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
             className="block text-xs mb-3 hover:text-white transition-colors" style={{ color: '#25D366' }}>
            WhatsApp +{WA_NUMBER}
          </a>
        </div>

        {/* À propos */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-medium" style={{ color: 'var(--gold-light)' }}>À propos</p>
          <Link href="/notre-histoire" className="block text-xs mb-3 hover:text-white transition-colors">Notre Histoire</Link>
          <Link href="/faq" className="block text-xs mb-3 hover:text-white transition-colors">Nos Valeurs</Link>
          <Link href="/contact" className="block text-xs mb-3 hover:text-white transition-colors">Presse</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
             className="mt-4 flex items-center gap-2 px-4 py-2.5 text-xs font-medium"
             style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white' }}>
            <Instagram size={13} /> Suivez-nous sur Instagram
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>© {new Date().getFullYear()} Body & Face. Tous droits réservés.</p>
          <div className="flex gap-6">
            {['Mentions légales','Politique de confidentialité','CGV'].map(l => (
              <Link key={l} href="#" className="text-[11px] hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
