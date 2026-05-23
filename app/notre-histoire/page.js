'use client'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { ArrowRight, Heart, Star, Sparkles } from 'lucide-react'

export default function NotreHistoirePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero cinématique */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #2C1810 0%, #1E1C1A 50%, #3D2415 100%)' }}>
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, var(--gold) 0%, transparent 60%), radial-gradient(circle at 70% 70%, var(--blush) 0%, transparent 50%)' }} />
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Notre histoire</p>
            <h1 className="font-display text-5xl md:text-7xl font-light mt-4 leading-tight" style={{ color: 'white' }}>
              Née d'une <em className="not-italic shimmer-text">passion</em>
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              L'histoire de Body & Face est celle d'une femme, d'un rêve, et d'un amour infini pour la beauté.
            </p>
          </div>
        </div>

        {/* Story content */}
        <div className="max-w-3xl mx-auto px-6 py-20">

          {/* Chapter 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)', color: 'white', fontSize: 12, fontWeight: 700 }}>1</div>
              <div className="flex-1 h-px" style={{ background: 'var(--gold-light)' }} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-6" style={{ color: 'var(--charcoal)' }}>
              L'enfant qui rêvait de beauté
            </h2>
            <div className="prose-custom">
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--warm-gray)' }}>
                Tout a commencé dans une petite maison de Brazzaville, où une jeune fille passait ses après-midis à observer sa mère se préparer. Les crèmes, les huiles parfumées, les rituels du soir — chaque geste était pour elle une forme de magie. Elle ne le savait pas encore, mais ces moments allaient définir toute sa vie.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
                Adolescente, elle était celle que ses amies consultaient avant chaque sortie. "Qu'est-ce que je mets sur ma peau ?" "Comment faire pour que ça brille sans graisser ?" Elle répondait avec une assurance naturelle, puisée dans des heures de lecture, de recherches et d'expérimentation.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <div className="my-14 py-10 px-8 text-center relative" style={{ background: 'var(--cream-dark)' }}>
            <Heart size={20} className="mx-auto mb-4" style={{ color: 'var(--gold)' }} />
            <p className="font-display text-2xl md:text-3xl font-light italic" style={{ color: 'var(--charcoal)', lineHeight: 1.5 }}>
              "La peau n'est pas juste une enveloppe. C'est la première chose que le monde voit de toi — et tu mérites qu'elle raconte ta plus belle histoire."
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)', color: 'white', fontSize: 12, fontWeight: 700 }}>2</div>
              <div className="flex-1 h-px" style={{ background: 'var(--gold-light)' }} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-6" style={{ color: 'var(--charcoal)' }}>
              La frustration qui devient étincelle
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--warm-gray)' }}>
              En grandissant, elle réalise que trouver de bons produits de skincare au Congo relève parfois du parcours du combattant. Soit les produits sont introuvables, soit ils sont contrefaits, soit les prix sont inaccessibles. Elle voit ses amies utiliser des produits qui éclaircissent de manière dangereuse, faute d'alternatives honnêtes et efficaces.
            </p>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--warm-gray)' }}>
              Cette frustration, loin de la décourager, l'enflamme. Elle commence à se former — en autodidacte d'abord, puis à travers des certifications en cosmétologie et en soin de la peau. Elle voyage, rencontre des professionnels, teste des centaines de produits. Son obsession : trouver ce qui fonctionne vraiment pour les peaux africaines.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
              Et surtout : rendre ces produits accessibles à toutes les femmes qui, comme elle, méritaient mieux.
            </p>
          </div>

          {/* Image quote section */}
          <div className="mb-16 grid md:grid-cols-3 gap-5">
            {[
              { icon: <Star size={22}/>, title: '100% Authentique', text: 'Chaque produit est rigoureusement sélectionné et vérifié avant d\'arriver chez vous.' },
              { icon: <Heart size={22}/>, title: 'Formulé avec amour', text: 'Nous choisissons des produits qui respectent et subliment toutes les carnations.' },
              { icon: <Sparkles size={22}/>, title: 'Pour chaque femme', text: 'De la peau sèche à mixte, foncée à claire — il y a un soin Body & Face pour vous.' },
            ].map((v, i) => (
              <div key={i} className="p-6 text-center" style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)' }}>
                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full mb-4" style={{ background: 'var(--cream-dark)', color: 'var(--gold)' }}>{v.icon}</div>
                <p className="font-display text-base font-medium mb-2" style={{ color: 'var(--charcoal)' }}>{v.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--warm-gray)' }}>{v.text}</p>
              </div>
            ))}
          </div>

          {/* Chapter 3 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)', color: 'white', fontSize: 12, fontWeight: 700 }}>3</div>
              <div className="flex-1 h-px" style={{ background: 'var(--gold-light)' }} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-6" style={{ color: 'var(--charcoal)' }}>
              La naissance de Body & Face
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--warm-gray)' }}>
              Body & Face naît d'une conviction simple et puissante : <strong style={{ color: 'var(--charcoal)' }}>chaque femme mérite d'avoir accès à des produits de beauté authentiques, efficaces et sûrs</strong>, peu importe où elle vit.
            </p>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--warm-gray)' }}>
              Ce n'est pas simplement une boutique en ligne. C'est une communauté de femmes qui croient que prendre soin de soi est un acte d'amour-propre. C'est un espace où la transparence n'est pas un option — c'est une obligation. Pas de fausses promesses. Pas de produits douteux. Seulement ce qui fonctionne, ce qui est testé, ce qui est aimé.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
              Aujourd'hui, Body & Face continue de grandir, portée par la confiance de milliers de clientes et par cette même passion intacte qui a tout déclenché — l'amour inconditionnel de la beauté, dans tous ses états.
            </p>
          </div>

          {/* CTA final */}
          <div className="text-center py-14" style={{ background: 'var(--charcoal)' }}>
            <p className="font-display text-3xl md:text-4xl font-light mb-4" style={{ color: 'white' }}>
              Rejoignez l'aventure Body & Face
            </p>
            <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Des produits d'exception, une communauté qui vous ressemble, et une équipe passionnée à votre service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="btn-gold inline-flex justify-center">
                Découvrir la boutique <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="btn-outline inline-flex justify-center" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
