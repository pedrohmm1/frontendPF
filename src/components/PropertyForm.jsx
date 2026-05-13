import { useState } from 'react'

const STATUS = ['DISPONIVEL', 'VENDIDO', 'CANCELADO']

export default function PropertyForm({ onSubmit, disabled }) {
  const [codigo, setCodigo] = useState('')
  const [preco, setPreco] = useState('')
  const [status, setStatus] = useState('DISPONIVEL')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!codigo || !preco) return
    setSubmitting(true)
    try {
      await onSubmit({ codigo, preco: parseFloat(preco), status })
      setCodigo('')
      setPreco('')
      setStatus('DISPONIVEL')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cadastrar novo imóvel</h3>
      <form className="form-row" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código</label>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="IM-001" required />
        </div>
        <div className="form-group">
          <label>Preço (R$)</label>
          <input type="number" step="0.01" min="0" value={preco}
                 onChange={(e) => setPreco(e.target.value)} placeholder="350000" required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className="btn-success" type="submit" disabled={disabled || submitting}>
          {submitting ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}
