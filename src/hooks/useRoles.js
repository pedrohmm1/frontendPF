import { useAuth0 } from '@auth0/auth0-react'

const NAMESPACE = import.meta.env.VITE_AUTH0_NAMESPACE || 'https://imoveis-api/'

export function useRoles() {
  const { user } = useAuth0()
  const roles = (user && user[`${NAMESPACE}roles`]) || []
  return {
    roles,
    isAdmin: roles.includes('ADMIN'),
    isUser:  roles.includes('USER'),
  }
}