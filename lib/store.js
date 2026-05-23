// lib/store.js — Client-side data management

export const DEFAULT_CATEGORIES = [
  { id: 'skincare',        name: 'Skincare',               slug: 'skincare',        description: 'Sérums, crèmes hydratantes, nettoyants et plus pour un teint parfait.',   icon: '✨', color: '#F0E8DF' },
  { id: 'body-care',       name: 'Soins du Corps',         slug: 'body-care',       description: 'Lotions, huiles et gommages pour une peau satinée de la tête aux pieds.',  icon: '🌿', color: '#DFF0E8' },
  { id: 'sun-care',        name: 'Protection Solaire',     slug: 'sun-care',        description: 'Crèmes solaires SPF 30–100, après-soleil, et soins anti-âge solaires.',   icon: '☀️', color: '#F0F0DF' },
  { id: 'supplements',     name: 'Compléments Alimentaires', slug: 'supplements',   description: 'Vitamines, collagène, antioxydants pour rayonner de l\'intérieur.',       icon: '💊', color: '#EFE0F0' },
  { id: 'fragrances',      name: 'Parfums & Brumes',       slug: 'fragrances',      description: 'Eaux de parfum, brumes corporelles et déodorants de luxe.',               icon: '🌸', color: '#F0DFE8' },
  { id: 'hair-care',       name: 'Soin Capillaire',        slug: 'hair-care',       description: 'Shampoings, masques et sérums pour une chevelure sublimée.',              icon: '💆', color: '#DFE8F0' },
]

export const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Sérum Éclat Vitamine C',
    category: 'skincare',
    price: 890,
    originalPrice: 1100,
    description: 'Un sérum concentré en Vitamine C pure à 15% qui illumine, unifie et protège le teint. Résultats visibles dès 7 jours.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    badge: 'Bestseller',
    featured: true,
    variants: [
      { type: 'volume', value: '30ml' },
      { type: 'volume', value: '50ml' },
    ],
  },
  {
    id: 'p2',
    name: 'Crème Hydratante Acide Hyaluronique',
    category: 'skincare',
    price: 750,
    description: 'Formule riche en acide hyaluronique triplex pour une hydratation 72h. Peau rebondie et visiblement lissée.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    badge: 'Nouveau',
    featured: true,
    variants: [
      { type: 'type', value: 'Peau Normale' },
      { type: 'type', value: 'Peau Sèche' },
      { type: 'type', value: 'Peau Mixte' },
    ],
  },
  {
    id: 'p3',
    name: 'Huile Corps Argan & Rose',
    category: 'body-care',
    price: 620,
    description: 'Huile sèche précieuse enrichie en argan marocain et extrait de rose de Damas. Peau soyeuse et parfumée.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    badge: 'Bestseller',
    featured: true,
    variants: [
      { type: 'volume', value: '100ml' },
      { type: 'volume', value: '200ml' },
    ],
  },
  {
    id: 'p4',
    name: 'Crème Solaire SPF 50+ Invisible',
    category: 'sun-care',
    price: 480,
    description: 'Protection solaire haute SPF 50+ sans effet blanc, texture ultra-légère. Convient aux peaux sensibles.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    badge: null,
    featured: true,
    variants: [
      { type: 'volume', value: '50ml' },
      { type: 'type', value: 'Teintée' },
      { type: 'type', value: 'Transparente' },
    ],
  },
  {
    id: 'p5',
    name: 'Collagène Marin + Vitamine C',
    category: 'supplements',
    price: 950,
    description: 'Complément alimentaire au collagène marin hydrolysé et Vitamine C. Fermeté, éclat et vitalité en 28 jours.',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80',
    badge: 'Nouveau',
    featured: false,
    variants: [
      { type: 'format', value: '30 sachets' },
      { type: 'format', value: '60 gélules' },
    ],
  },
  {
    id: 'p6',
    name: 'Gommage Corps Sucre & Coco',
    category: 'body-care',
    price: 390,
    description: 'Gommage exfoliant au sucre de canne et huile de coco vierge. Peau douce et lumineuse après une seule utilisation.',
    image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&q=80',
    badge: null,
    featured: false,
    variants: [
      { type: 'parfum', value: 'Coco Vanille' },
      { type: 'parfum', value: 'Rose & Grenade' },
    ],
  },
  {
    id: 'p7',
    name: 'Brume Parfumée Fleur Blanche',
    category: 'fragrances',
    price: 320,
    description: 'Brume corporelle légère aux notes de jasmin, muguet et bois de santal. Un nuage de fraîcheur et de féminité.',
    image: 'https://images.unsplash.com/photo-1547887538-047f814d1803?w=600&q=80',
    badge: null,
    featured: false,
    variants: [
      { type: 'volume', value: '150ml' },
      { type: 'volume', value: '250ml' },
    ],
  },
  {
    id: 'p8',
    name: 'Masque Capillaire Kératine',
    category: 'hair-care',
    price: 550,
    description: 'Masque restructurant intense à la kératine et aux protéines de soie. Cheveux lissés, brillants et fortifiés.',
    image: 'https://images.unsplash.com/photo-1527799820374-87591a16f715?w=600&q=80',
    badge: 'Nouveau',
    featured: false,
    variants: [
      { type: 'type', value: 'Cheveux Secs' },
      { type: 'type', value: 'Cheveux Colorés' },
    ],
  },
]

// ─── HELPERS ────────────────────────────────────────────

export function getCategories() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  const stored = localStorage.getItem('bf_categories')
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
}

export function saveCategories(cats) {
  localStorage.setItem('bf_categories', JSON.stringify(cats))
}

export function getProducts() {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS
  const stored = localStorage.getItem('bf_products')
  return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS
}

export function saveProducts(products) {
  localStorage.setItem('bf_products', JSON.stringify(products))
}

export function seedIfEmpty() {
  if (!localStorage.getItem('bf_categories')) saveCategories(DEFAULT_CATEGORIES)
  if (!localStorage.getItem('bf_products'))   saveProducts(DEFAULT_PRODUCTS)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
