// lib/sheets.js — Fetch products from Google Sheet (public)

const SHEET_ID   = '1iDL2b8ZFDTlTTdmK_1PwMJ7sjlrmz_jpqJX8b62uPE8'
const SHEET_NAME = 'Produits'
const CSV_URL    = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(SHEET_NAME)}`

function cleanPrice(raw) {
  if (!raw) return 0
  return parseInt(String(raw).replace(/[\s,\u00a0 ]/g, ''), 10) || 0
}
function cleanText(raw) {
  if (!raw) return ''
  return String(raw).replace(/\s*\|\s*SHEIN\s*$/i, '').trim()
}

// Simple CSV parser handling quoted fields
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.map(line => {
    const cells = []; let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"' && !inQ)           inQ = true
      else if (ch === '"' && inQ) { if (line[i+1]==='"') { cur+='"'; i++ } else inQ=false }
      else if (ch === ',' && !inQ)      { cells.push(cur); cur='' }
      else cur += ch
    }
    cells.push(cur); return cells
  })
}

// 16 categories from image 2 — with emoji + pastel color
export const ALL_CATEGORIES = [
  { name:'Outil de Beauté',                  emoji:'💄', color:'#FFE4EE', text:'#C94070' },
  { name:'Kits faux cils et adhésifs',        emoji:'👁️', color:'#EDE0FF', text:'#7B4FA6' },
  { name:'Soins des ongles, des mains et des pieds', emoji:'💅', color:'#FFE8D6', text:'#C4622D' },
  { name:'Produits capillaires et outils',    emoji:'💆', color:'#D6EFF8', text:'#2A7FA8' },
  { name:'Soins du corps et outils',          emoji:'🧴', color:'#D6F5E8', text:'#2A8A5A' },
  { name:'Vernis à ongles en gel',            emoji:'✨', color:'#FFF0D6', text:'#B8860B' },
  { name:'Maquillage',                        emoji:'🎨', color:'#FFD6EE', text:'#C42060' },
  { name:'Maquillage yeux',                   emoji:'👁',  color:'#D6E4FF', text:'#3A50B8' },
  { name:'Soin de la peau & outils',          emoji:'🌿', color:'#E8FFD6', text:'#4A8A2A' },
  { name:'Pinceaux à maquillage',             emoji:'🖌️', color:'#FFE0D6', text:'#B84020' },
  { name:'Parfums & Aromathérapie',           emoji:'🌸', color:'#FFD6F5', text:'#A02090' },
  { name:'Maquillage visage',                 emoji:'💋', color:'#FFE4D6', text:'#C05030' },
  { name:'Maquillage bouche',                 emoji:'👄', color:'#FFD6D6', text:'#B83030' },
  { name:'Appareils de soins personnels',     emoji:'🛁', color:'#D6F0FF', text:'#2080B8' },
  { name:'Outils & Soins à la personne',      emoji:'🌺', color:'#F5D6FF', text:'#8040B0' },
  { name:'Soins des cheveux et coiffure',     emoji:'💇', color:'#D6FFE8', text:'#208A50' },
]

export function getCategoryStyle(name) {
  return ALL_CATEGORIES.find(c => c.name === name) ||
    { emoji:'🛍️', color:'#FFE4EE', text:'#C94070' }
}

export async function fetchSheetProducts() {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text = await res.text()
    const rows = parseCSV(text)
    if (rows.length < 2) return []

    return rows.slice(1).map((cells, i) => {
      const photo        = cells[0]?.trim() || ''
      const category     = cells[1]?.trim() || ''
      const subcategory  = cells[2]?.trim() || ''
      const description  = cleanText(cells[3] || '')
      const priceFCFA    = cleanPrice(cells[5])        // F
      const link         = cells[6]?.trim() || ''      // G
      const imageUrl     = cells[7]?.trim() || photo || '' // H — optional URL
      const tag          = cells[8]?.trim() || ''      // I — Tendance | Bestseller | Promo | BlackFriday
      const promoPriceFCFA = cleanPrice(cells[9])      // J — Prix Promo FCFA (optional)

      if (!description && !priceFCFA) return null

      const style = getCategoryStyle(subcategory || category)

      return {
        id:            `sheet-${i+1}`,
        name:          description.length > 80 ? description.slice(0,80)+'…' : description,
        fullDescription: description,
        category,
        subcategory:   subcategory || category,
        priceFCFA,
        promoPriceFCFA: promoPriceFCFA || 0,
        isPromo:       tag.toLowerCase().includes('promo') || promoPriceFCFA > 0,
        isTendance:    tag.toLowerCase().includes('tendance'),
        isBestseller:  tag.toLowerCase().includes('bestseller'),
        isBlackFriday: tag.toLowerCase().includes('black'),
        tag,
        link,
        imageUrl,
        style,
      }
    }).filter(Boolean)
  } catch(err) {
    console.error('Google Sheet fetch error:', err)
    return []
  }
}
