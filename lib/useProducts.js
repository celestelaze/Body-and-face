'use client'
import { useState, useEffect } from 'react'

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: '' })
  useEffect(() => {
    let alive = true
    fetch('/api/products')
      .then(r => r.json())
      .then(d => alive && setState({ products: d.products || [], loading: false, error: d.error || '' }))
      .catch(() => alive && setState({ products: [], loading: false, error: 'network' }))
    return () => { alive = false }
  }, [])
  return state
}

export function sheetErrorMessage(code) {
  if (code === 'not_public') return "Le catalogue n'est pas accessible pour le moment."
  if (code === 'missing_columns') return 'Le catalogue est en cours de mise à jour.'
  return 'Impossible de charger les produits pour le moment.'
}
