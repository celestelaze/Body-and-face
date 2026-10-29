// Lecture du Google Sheet "Produits Shein" (colonnes lues par leur NOM, pas leur position)
const SHEET_ID    = '1iDL2b8ZFDTlTTdmK_1PwMJ7sjlrmz_jpqJX8b62uPE8'
const SHEET_NAME  = 'Produits'
export const DEFAULT_SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

// Les 16 catégories du site. imageUrl = photo miniature (à renseigner)
export const ALL_CATEGORIES = [
  { name:'Outil de Beauté',                         emoji:'💄', color:'#FFE4EE', text:'#C94070', imageUrl:'' },
  { name:'Kits faux cils et adhésifs',               emoji:'👁️', color:'#EDE0FF', text:'#7B4FA6', imageUrl:'' },
  { name:'Soins des ongles, des mains et des pieds', emoji:'💅', color:'#FFE8D6', text:'#C4622D', imageUrl:'' },
  { name:'Produits capillaires et outils',           emoji:'💆', color:'#D6EFF8', text:'#2A7FA8', imageUrl:'' },
  { name:'Soins du corps et outils',                 emoji:'🧴', color:'#D6F5E8', text:'#2A8A5A', imageUrl:'' },
  { name:'Vernis à ongles en gel',                   emoji:'✨', color:'#FFF0D6', text:'#B8860B', imageUrl:'' },
  { name:'Maquillage',                               emoji:'🎨', color:'#FFD6EE', text:'#C42060', imageUrl:'' },
  { name:'Maquillage yeux',                          emoji:'👁',  color:'#D6E4FF', text:'#3A50B8', imageUrl:'' },
  { name:'Soin de la peau & outils',                 emoji:'🌿', color:'#E8FFD6', text:'#4A8A2A', imageUrl:'' },
  { name:'Pinceaux à maquillage',                    emoji:'🖌️', color:'#FFE0D6', text:'#B84020', imageUrl:'' },
  { name:'Parfums & Aromathérapie',                  emoji:'🌸', color:'#FFD6F5', text:'#A02090', imageUrl:'' },
  { name:'Maquillage visage',                        emoji:'💋', color:'#FFE4D6', text:'#C05030', imageUrl:'' },
  { name:'Maquillage bouche',                        emoji:'👄', color:'#FFD6D6', text:'#B83030', imageUrl:'' },
  { name:'Appareils de soins personnels',            emoji:'🛁', color:'#D6F0FF', text:'#2080B8', imageUrl:'' },
  { name:'Outils & Soins à la personne',             emoji:'🌺', color:'#F5D6FF', text:'#8040B0', imageUrl:'' },
  { name:'Soins des cheveux et coiffure',            emoji:'💇', color:'#D6FFE8', text:'#208A50', imageUrl:'' },
]

const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '')

// Anciennes sous-catégories du Sheet → catégories du site (provisoire, le temps que le Sheet soit reclassé)
const ALIASES = {
  soinsdelapeau: 'Soin de la peau & outils',
  nettoyants: 'Soin de la peau & outils',
  serumsettraitementsduvisage: 'Soin de la peau & outils',
  parfums: 'Parfums & Aromathérapie',
  maquillagesourcils: 'Maquillage yeux',
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
