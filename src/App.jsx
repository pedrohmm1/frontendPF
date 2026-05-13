import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { propertiesApi } from './api/client'
import { useRoles } from './hooks/useRoles'
import PropertyForm from './components/PropertyForm'
import PropertyTable from './components/PropertyTable'

export default function App() {
  const {
    isAuthenticated, isLoading, loginWithRedirect, logout, user,
    getAccessTokenSilently,
  } = useAuth0()

  const { roles, isAdmin } = useRoles()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getAccessTokenSilently()
      const data = await propertiesApi.list(token)
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (isAuthenticated) loadItems()
  }, [isAuthenticated, loadItems])

  async function handleCreate(payload) {
    setError('')
    try {
      const token = await getAccessTokenSilently()
      await propertiesApi.create(token, payload)
      await loadItems()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este imóvel?')) return
    setError('')
    try {
      const token = await getAccessTokenSilently()
      await propertiesApi.remove(token, id)
      await loadItems()
    } catch (e) {
      setError(e.message)
    }
  }

  if (isLoading) return <div className="loading">Carregando...</div>

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <h1>Sistema de Venda de Imóveis</h1>
        <p>Faça login para continuar.</p>
        <button className="btn-primary" onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>Sistema de Venda de Imóveis</h1>
          <small>
            {user?.email} — papéis: {roles.join(', ') || 'nenhum'}
          </small>
        </div>
        <button className="btn-ghost"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sair
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {isAdmin && <PropertyForm onSubmit={handleCreate} />}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Imóveis</h3>
        {loading
          ? <div className="loading">Carregando imóveis...</div>
          : <PropertyTable items={items} canDelete={isAdmin} onDelete={handleDelete} />}
      </div>
    </div>
  )
}
