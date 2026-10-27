import Link from 'next/link'
import { Instagram, Heart } from 'lucide-react'

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/body_and_face_congo'
const WA_NUMBER     = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '242064731996'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--charcoal)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,107,157,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-script text-3xl mb-1" style={{ color: 'var(--pink-light)' }}>Restez dans la boucle ✨</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Nouveautés, promos et conseils beauté dans votre boîte mail</p>
          </div>
          <form className="flex w-full md:w-auto gap-0 rounded-full overflow-hidden" style={{ border: '2px solid rgba(255,107,157,0.3)' }}
                onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="votre@email.com"
                   className="flex-1 md:w-64 px-5 py-3 text-sm outline-none"
                   style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none' }} />
            <button type="submit" className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,var(--pink),var(--coral))' }}>
              S'abonner
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-bold" style={{ color: 'white' }}>
            Body <span style={{ color: 'var(--pink)' }}>&</span> Face
          </p>
          <p className="font-script text-sm mt-0.5" style={{ color: 'var(--pink-light)' }}>Luxe Beauty</p>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Votre boutique beauté premium livrée partout. Des produits soigneusement sélectionnés pour sublimer chaque femme.
          </p>
          {/* Socials */}
          <div className="flex gap-3 mt-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
               style={{ background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', color: 'white' }}>
              <Instagram size={15} />
            </a>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
               style={{ background: '#25D366', color: 'white' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.112 1.522 5.845L.057 23.714a.5.5 0 00.611.636l6.098-1.597A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.788 9.788 0 01-5.064-1.407l-.363-.215-3.76.985 1.003-3.647-.236-.374A9.793 9.793 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Boutique */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-bold" style={{ color: 'var(--pink-light)' }}>Boutique</p>
          {[['Tout voir','/shop'],['Soins de la peau','/shop?cat=Soins+de+la+peau'],['Maquillage','/shop?cat=Maquillage'],['Parfums','/shop?cat=Parfums'],['Corps','/shop?cat=Corps'],['Solaire','/shop?cat=Solaire']].map(([l,h]) => (
            <Link key={l} href={h} className="block text-xs mb-3 transition-colors hover:text-pink-300" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</Link>
          ))}
        </div>

        {/* Aide */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-bold" style={{ color: 'var(--pink-light)' }}>Aide</p>
          <Link href="/faq" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>FAQ</Link>
          <Link href="/livraison-retours" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>Livraison & Retours</Link>
          <Link href="/livraison-retours#suivi" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>Suivi de commande</Link>
          <Link href="/contact" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>Contact</Link>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
             className="block text-xs mb-3 font-medium" style={{ color:'#25D366' }}>
            💬 WhatsApp +{WA_NUMBER}
          </a>
        </div>

        {/* À propos */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5 font-bold" style={{ color: 'var(--pink-light)' }}>À propos</p>
          <Link href="/notre-histoire" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>Notre Histoire</Link>
          <Link href="/contact" className="block text-xs mb-3 hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.5)' }}>Contact</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
             className="mt-5 flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-white transition-all hover:opacity-90"
             style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
            <Instagram size={13} /> Suivre @body_and_face_congo
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,107,157,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] flex items-center gap-1.5" style={{ color:'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Body & Face. Fait avec <Heart size={10} fill="var(--pink)" style={{ color:'var(--pink)' }} /> au Congo.
          </p>
          <div className="flex gap-6">
            {['Mentions légales','Confidentialité','CGV'].map(l => (
              <Link key={l} href="#" className="text-[11px] hover:text-pink-300 transition-colors" style={{ color:'rgba(255,255,255,0.3)' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
