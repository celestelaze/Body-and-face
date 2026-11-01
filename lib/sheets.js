// Lecture du Google Sheet "Produits Shein" (colonnes lues par leur NOM, pas leur position)
const SHEET_ID    = '1iDL2b8ZFDTlTTdmK_1PwMJ7sjlrmz_jpqJX8b62uPE8'
const SHEET_NAME  = 'Produits'
export const DEFAULT_SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

// Les 7 catégories PERMANENTES du site (ordre d'affichage).
// imageUrl = photo miniature, ex. '/categories/cheveux.jpg' (fichier à mettre dans public/categories/)
export const ALL_CATEGORIES = [
  { name:'Cheveux',             emoji:'💇', color:'#D6EFF8', text:'#2A7FA8', imageUrl:'' },
  { name:'Soins du visage',     emoji:'✨', color:'#FFE4EE', text:'#C94070', imageUrl:'' },
  { name:'Soins du corps',      emoji:'🧴', color:'#D6F5E8', text:'#2A8A5A', imageUrl:'' },
  { name:'Maquillage',          emoji:'💄', color:'#FFD6EE', text:'#C42060', imageUrl:'' },
  { name:'Ongles',              emoji:'💅', color:'#FFE8D6', text:'#C4622D', imageUrl:'' },
  { name:'Parfums',             emoji:'🌸', color:'#FFD6F5', text:'#A02090', imageUrl:'' },
  { name:'Appareils de beauté', emoji:'🪞', color:'#E8E0FF', text:'#6A4FB0', imageUrl:'' },
]

const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '')

// Anciens libellés du Sheet → les 7 catégories (le temps que le Sheet soit reclassé)
const ALIASES = {
  // Soins du visage
  soinsdelapeau:'Soins du visage', soindelapeauoutils:'Soins du visage', nettoyants:'Soins du visage',
  serumsettraitementsduvisage:'Soins du visage',
  // Soins du corps
  soinsducorpsetoutils:'Soins du corps', corps:'Soins du corps',
  // Cheveux
  produitscapillairesetoutils:'Cheveux', soinsdescheveuxetcoiffure:'Cheveux', soinscapillaires:'Cheveux',
  // Maquillage
  maquillageyeux:'Maquillage', maquillagevisage:'Maquillage', maquillagebouche:'Maquillage',
  maquillagesourcils:'Maquillage', pinceauxamaquillage:'Maquillage', kitsfauxcilsetadhesifs:'Maquillage',
  // Ongles
  soinsdesongleslesmainsetdespieds:'Ongles', vernisaongles:'Ongles', vernisaonglesengel:'Ongles',
  // Parfums
  parfumsaromatherapie:'Parfums',
  // Appareils de beauté
  appareilsdesoinspersonnels:'Appareils de beauté', outildebeaute:'Appareils de beauté',
}

export function matchCategory(...names) {
  for (const n of names) {
    const k = norm(n)
    if (!k) continue
    const exact = ALL_CATEGORIES.find(c => norm(c.name) === k)
    if (exact) return exact
    if (ALIASES[k]) return ALL_CATEGORIES.find(c => c.name === ALIASES[k])
  }
  return null
}

function cleanPrice(raw) {
  const s = String(raw || '').replace(/[\s\u00a0\u202f]/g, '')
  const m = s.match(/^(\d+)(?:[.,]\d{1,2})?$/)
  return m ? parseInt(m[1], 10) : (parseInt(s.replace(/\D/g, ''), 10) || 0)
}
const cleanText = raw => String(raw || '').replace(/\s*\|\s*SHEIN\s*$/i, '').trim()

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '')
  const rows = []; let row = [], cur = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++ } else inQ = false }
      else cur += ch
    } else if (ch === '"') inQ = true
    else if (ch === ',') { row.push(cur); cur = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cur); cur = ''; rows.push(row); row = []
    } else cur += ch
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows
}

// Retourne { products, error } — error: '' | 'not_public' | 'missing_columns' | 'http_XXX' | 'network'
export async function fetchSheetProducts() {
  const url = process.env.SHEET_CSV_URL || DEFAULT_SHEET_URL
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return { products: [], error: res.status === 401 || res.status === 403 ? 'not_public' : `http_${res.status}` }
    const text = await res.text()
    if (/^\s*<(!doctype|html)/i.test(text)) return { products: [], error: 'not_public' }

    const rows = parseCSV(text)
    if (rows.length < 2) return { products: [], error: '' }

    const head = rows[0].map(norm)
    const col = (...names) => head.findIndex(h => names.includes(h))
    const C = {
      photo: col('photo'), cat: col('categorie'), sub: col('souscategorie'),
      desc: col('description'), price: col('prixfcfa'), promo: col('prixpromofcfa'),
      link: col('lien'), img: col('urlimage'), avail: col('disponibilite'), status: col('statut'),
    }
    if (C.desc < 0 || C.price < 0) return { products: [], error: 'missing_columns' }
    const get = (cells, i) => (i >= 0 ? (cells[i] || '').trim() : '')

    const products = rows.slice(1).map(cells => {
      const description = cleanText(get(cells, C.desc))
      const priceFCFA   = cleanPrice(get(cells, C.price))
      if (!description) return null
      const sub  = get(cells, C.sub), cat = get(cells, C.cat)
      const matched = matchCategory(sub, cat)
      const promoPriceFCFA = cleanPrice(get(cells, C.promo))
      const st    = norm(get(cells, C.status))
      const avail = norm(get(cells, C.avail))
      const link  = get(cells, C.link)

      return {
        id: `p-${hash(link || description)}`,
        name: description,
        fullDescription: description,
        category: cat,
        subcategory: sub,
        categoryName: matched ? matched.name : '',
        priceFCFA,
        promoPriceFCFA: promoPriceFCFA < priceFCFA ? promoPriceFCFA : 0,
        isPromo: st.includes('promo') || (promoPriceFCFA > 0 && promoPriceFCFA < priceFCFA),
        isTendance: st.includes('tendance'),
        isBestseller: st.includes('best'),
        isBlackFriday: st.includes('black'),
        isCoupDeCoeur: st.includes('coeur') || st.includes('favori'),
        isNouveau: st.includes('nouveaute') || st.includes('nouveau'),
        soldOut: avail.includes('puise') || avail.includes('rupture'),
        link,
        imageUrl: get(cells, C.img) || get(cells, C.photo),
        style: matched || { emoji: '🛍️', color: '#FFE4EE', text: '#C94070' },
      }
    }).filter(Boolean)

    return { products, error: '' }
  } catch (e) {
    console.error('Sheet error:', e)
    return { products: [], error: 'network' }
  }
}
