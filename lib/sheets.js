// lib/sheets.js — Fetch products from Google Sheet (public)

const SHEET_ID   = '1iDL2b8ZFDTlTTdmK_1PwMJ7sjlrmz_jpqJX8b62uPE8'
const SHEET_NAME = 'Produits'

// Public CSV export — works without API key on publicly shared sheets
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(SHEET_NAME)}`

function cleanPrice(raw) {
  if (!raw) return 0
  // "7 976" → 7976 ; "7,976" → 7976
  return parseInt(String(raw).replace(/[\s,\u00a0]/g, ''), 10) || 0
}

function cleanText(raw) {
  if (!raw) return ''
  // Remove trailing "| SHEIN" and trim
  return String(raw).replace(/\s*\|\s*SHEIN\s*$/i, '').trim()
}

// Very simple CSV parser (handles quoted fields with commas inside)
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const rows  = []
  for (const line of lines) {
    const cells = []
    let cur = '', inQuote = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"' && !inQuote) { inQuote = true }
      else if (ch === '"' && inQuote) {
        if (line[i+1] === '"') { cur += '"'; i++ }   // escaped quote
        else inQuote = false
      } else if (ch === ',' && !inQuote) { cells.push(cur); cur = '' }
      else cur += ch
    }
    cells.push(cur)
    rows.push(cells)
  }
  return rows
}

// Category → gradient for cards without image
export const CATEGORY_STYLES = {
  'Soins de la peau':    { bg: 'linear-gradient(135deg,#FFE4E8,#FFCDD6)', emoji: '✨', color: '#C94070' },
  'Maquillage sourcils': { bg: 'linear-gradient(135deg,#E8D5FF,#D4B8FF)', emoji: '💄', color: '#7B4FA6' },
  'Parfums':             { bg: 'linear-gradient(135deg,#FFE8D6,#FFD0B5)', emoji: '🌸', color: '#C4622D' },
  'Soins capillaires':   { bg: 'linear-gradient(135deg,#D6EFF8,#B8DFF5)', emoji: '💆', color: '#2A7FA8' },
  'Corps':               { bg: 'linear-gradient(135deg,#D6F5E8,#B8EDD5)', emoji: '🌿', color: '#2A8A5A' },
  'Maquillage':          { bg: 'linear-gradient(135deg,#FFD6E8,#FFBAD8)', emoji: '💅', color: '#C42060' },
  'Solaire':             { bg: 'linear-gradient(135deg,#FFF5CC,#FFE680)', emoji: '☀️', color: '#B8860B' },
  'À classer':           { bg: 'linear-gradient(135deg,#F5E6FF,#EBD0FF)', emoji: '🫧', color: '#8040B0' },
  default:               { bg: 'linear-gradient(135deg,#FFE4F0,#FFD0E8)', emoji: '🛍️', color: '#C04080' },
}

export function getStyle(subcategory) {
  return CATEGORY_STYLES[subcategory] || CATEGORY_STYLES.default
}

export async function fetchSheetProducts() {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 300 }, // cache 5 minutes on Vercel
    })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text    = await res.text()
    const rows    = parseCSV(text)
    if (rows.length < 2) return []

    // Skip header row (row 0)
    return rows.slice(1)
      .map((cells, i) => {
        const photo       = cells[0]?.trim() || ''   // A — may be empty
        const category    = cells[1]?.trim() || ''   // B
        const subcategory = cells[2]?.trim() || ''   // C
        const description = cleanText(cells[3] || '') // D — also serves as name
        const priceFCFA   = cleanPrice(cells[5])      // F
        const link        = cells[6]?.trim() || ''   // G
        // Optional column H for image URL (if Celeste adds it later)
        const imageUrl    = cells[7]?.trim() || photo || ''

        if (!description && !priceFCFA) return null  // skip empty rows

        return {
          id: `sheet-${i+1}`,
          name: description.length > 80
            ? description.slice(0, 80) + '…'
            : description,
          fullDescription: description,
          category,
          subcategory,
          priceFCFA,
          link,
          imageUrl,
          style: getStyle(subcategory),
        }
      })
      .filter(Boolean)
  } catch (err) {
    console.error('Google Sheet fetch error:', err)
    return []
  }
}

// Group products by subcategory
export function groupBySubcategory(products) {
  return products.reduce((acc, p) => {
    const key = p.subcategory || p.category || 'Autres'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})
}
