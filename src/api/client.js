const API_URL = import.meta.env.VITE_API_URL

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.message || data.description || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}

export const propertiesApi = {
  list:   (token) => request('/properties', { token }),
  create: (token, body) => request('/properties', { method: 'POST', token, body }),
  remove: (token, id) => request(`/properties/${id}`, { method: 'DELETE', token }),
}
