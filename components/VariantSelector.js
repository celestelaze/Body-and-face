'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

// ── Predefined options per variant type ──────────────────────

const COLORS = [
  { name: 'Blanc Lait',    hex: '#F8F0E8' },
  { name: 'Crème Ivoire',  hex: '#FFFFF0' },
  { name: 'Rose Nude',     hex: '#E8C4C0' },
  { name: 'Rose Poudré',   hex: '#D4A090' },
  { name: 'Brun Doré',     hex: '#C89060' },
  { name: 'Beige Sable',   hex: '#D4B896' },
  { name: 'Ocre Doré',     hex: '#C8A040' },
  { name: 'Bronze',        hex: '#8B6040' },
  { name: 'Caramel',       hex: '#A06030' },
  { name: 'Miel',          hex: '#C07830' },
  { name: 'Chocolat',      hex: '#6B3A2A' },
  { name: 'Ébène',         hex: '#2C1810' },
  { name: 'Or',            hex: '#FFD700' },
  { name: 'Rosé',          hex: '#FFB6C1' },
  { name: 'Pêche',         hex: '#FFCBA4' },
  { name: 'Doré',          hex: '#DAA520' },
]

const VOLUMES = ['5ml','10ml','15ml','20ml','30ml','50ml','75ml','100ml','125ml','150ml','200ml','250ml','300ml','500ml','1L']

const SKIN_TYPES = ['Peau Normale','Peau Sèche','Peau Mixte','Peau Grasse','Peau Sensible','Peau Terne','Peau Mature','Toutes peaux']

const FORMATS = ['30 gélules','60 gélules','90 gélules','120 gélules','30 comprimés','60 comprimés','30 sachets','60 sachets','Flacon 30ml','Flacon 60ml','Pot 50ml','Pot 100ml','Tube 75ml']

const FRAGRANCES = ['Vanille','Rose','Jasmin','Lavande','Coco','Fleur Blanche','Musc','Bois de Santal','Agrumes','Mangue','Fraise','Amande','Cerise','Menthe','Fruits Rouges','Sans Parfum']

// ── Color Picker ──────────────────────────────────────────────
function ColorPicker({ selected, onChange }) {
  const [custom, setCustom] = useState('')
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {COLORS.map(c => {
          const isSelected = selected.some(s => s.value === c.name)
          return (
            <button key={c.name} type="button" title={c.name}
                    onClick={() => onChange(isSelected
                      ? selected.filter(s => s.value !== c.name)
                      : [...selected, { type: 'couleur', value: c.name }])}
                    className="relative w-8 h-8 rounded-full transition-all hover:scale-110"
                    style={{
                      background: c.hex,
                      border: isSelected ? '3px solid var(--charcoal)' : '2px solid #E0D8D0',
                      boxShadow: isSelected ? '0 0 0 1px white inset' : 'none',
                    }}>
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px]"
                      style={{ color: c.hex < '#888' ? 'white' : '#333' }}>✓</span>
              )}
            </button>
          )
        })}
      </div>
      {/* Selected colors display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map(v => (
            <span key={v.value} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1"
                  style={{ background: 'var(--cream-dark)', color: 'var(--charcoal)' }}>
              {v.value}
              <button type="button" onClick={() => onChange(selected.filter(s => s.value !== v.value))}><X size={9}/></button>
            </span>
          ))}
        </div>
      )}
      {/* Custom color */}
      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)}
               className="input-field flex-1 text-xs py-2" placeholder="Couleur personnalisée..." />
        <button type="button" onClick={() => { if (custom.trim()) { onChange([...selected, { type: 'couleur', value: custom.trim() }]); setCustom('') } }}
                className="btn-gold px-3 py-0 text-xs"><Plus size={13}/></button>
      </div>
    </div>
  )
}

// ── Pill Picker ───────────────────────────────────────────────
function PillPicker({ options, selected, varType, onChange, allowCustom, customPlaceholder }) {
  const [custom, setCustom] = useState('')
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map(opt => {
          const isSelected = selected.some(s => s.value === opt)
          return (
            <button key={opt} type="button"
                    onClick={() => onChange(isSelected
                      ? selected.filter(s => s.value !== opt)
                      : [...selected, { type: varType, value: opt }])}
                    className="text-xs px-3 py-1.5 transition-all"
                    style={{
                      background: isSelected ? 'var(--charcoal)' : 'white',
                      color: isSelected ? 'white' : 'var(--warm-gray)',
                      border: `1px solid ${isSelected ? 'var(--charcoal)' : 'var(--cream-dark)'}`,
                    }}>
              {opt}
            </button>
          )
        })}
      </div>
      {/* Selected */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map(v => (
            <span key={v.value} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1"
                  style={{ background: 'var(--cream-dark)', color: 'var(--charcoal)' }}>
              {v.value}
              <button type="button" onClick={() => onChange(selected.filter(s => s.value !== v.value))}><X size={9}/></button>
            </span>
          ))}
        </div>
      )}
      {allowCustom && (
        <div className="flex gap-2 mt-2">
          <input value={custom} onChange={e => setCustom(e.target.value)}
                 className="input-field flex-1 text-xs py-2"
                 placeholder={customPlaceholder || 'Valeur personnalisée...'}
                 onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (custom.trim()) { onChange([...selected, { type: varType, value: custom.trim() }]); setCustom('') } } }} />
          <button type="button" onClick={() => { if (custom.trim()) { onChange([...selected, { type: varType, value: custom.trim() }]); setCustom('') } }}
                  className="btn-gold px-3 py-0 text-xs"><Plus size={13}/></button>
        </div>
      )}
    </div>
  )
}

// ── Main VariantSelector ──────────────────────────────────────
const VARIANT_TYPES = [
  { key: 'couleur',  label: 'Couleur',             icon: '🎨' },
  { key: 'volume',   label: 'Volume',               icon: '💧' },
  { key: 'type',     label: 'Type de peau',         icon: '✨' },
  { key: 'format',   label: 'Format / Conditionnement', icon: '📦' },
  { key: 'parfum',   label: 'Parfum',               icon: '🌸' },
]

export default function VariantSelector({ variants = [], onChange }) {
  const [activeType, setActiveType] = useState(null)

  // Group variants by type
  const byType = type => variants.filter(v => v.type === type)
  const setByType = (type, vals) => {
    const others = variants.filter(v => v.type !== type)
    onChange([...others, ...vals])
  }

  return (
    <div>
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {VARIANT_TYPES.map(t => {
          const count = byType(t.key).length
          return (
            <button key={t.key} type="button"
                    onClick={() => setActiveType(activeType === t.key ? null : t.key)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all"
                    style={{
                      background: activeType === t.key ? 'var(--charcoal)' : count > 0 ? 'var(--cream-dark)' : 'white',
                      color: activeType === t.key ? 'white' : 'var(--charcoal)',
                      border: `1px solid ${activeType === t.key ? 'var(--charcoal)' : 'var(--cream-dark)'}`,
                    }}>
              <span>{t.icon}</span>
              <span className="tracking-wide uppercase" style={{ fontSize: 10 }}>{t.label}</span>
              {count > 0 && (
                <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center"
                      style={{ background: activeType === t.key ? 'rgba(255,255,255,0.3)' : 'var(--gold)', color: 'white' }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active picker */}
      {activeType && (
        <div className="p-4 mb-3" style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)' }}>
          <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: 'var(--warm-gray)' }}>
            {VARIANT_TYPES.find(t => t.key === activeType)?.icon}{' '}
            {VARIANT_TYPES.find(t => t.key === activeType)?.label} — sélectionnez ou ajoutez
          </p>

          {activeType === 'couleur' && (
            <ColorPicker selected={byType('couleur')} onChange={vals => setByType('couleur', vals)} />
          )}
          {activeType === 'volume' && (
            <PillPicker options={VOLUMES} selected={byType('volume')} varType="volume"
                        onChange={vals => setByType('volume', vals)}
                        allowCustom customPlaceholder="Volume personnalisé (ex: 75ml)" />
          )}
          {activeType === 'type' && (
            <PillPicker options={SKIN_TYPES} selected={byType('type')} varType="type"
                        onChange={vals => setByType('type', vals)}
                        allowCustom customPlaceholder="Type personnalisé..." />
          )}
          {activeType === 'format' && (
            <PillPicker options={FORMATS} selected={byType('format')} varType="format"
                        onChange={vals => setByType('format', vals)}
                        allowCustom customPlaceholder="Format personnalisé (ex: Tube 150ml)" />
          )}
          {activeType === 'parfum' && (
            <PillPicker options={FRAGRANCES} selected={byType('parfum')} varType="parfum"
                        onChange={vals => setByType('parfum', vals)}
                        allowCustom customPlaceholder="Parfum personnalisé (ex: Hibiscus)" />
          )}
        </div>
      )}

      {/* Summary of all selected variants */}
      {variants.length > 0 && (
        <div className="mt-2">
          <p className="text-[10px] tracking-widest uppercase font-medium mb-2" style={{ color: 'var(--warm-gray)' }}>
            Variantes sélectionnées ({variants.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1"
                    style={{ background: 'white', border: '1px solid var(--cream-dark)', color: 'var(--charcoal)' }}>
                <span style={{ color: 'var(--warm-gray)' }}>{v.type}:</span>
                {v.value}
                <button type="button" onClick={() => onChange(variants.filter((_, idx) => idx !== i))}
                        className="hover:opacity-60"><X size={9}/></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
