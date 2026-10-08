const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api'

export type AuthUser = {
  token: string
  expiresAt: string
  userId: string
  fullName: string
  email: string
  role: string
}

const TOKEN_KEY = 'pin_auth'

export function getStoredAuth(): AuthUser | null {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredAuth(auth: AuthUser | null) {
  if (!auth) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, JSON.stringify(auth))
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (!headers.has('Content-Type') && options.body && !isFormData) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const auth = getStoredAuth()
    if (auth?.token) headers.set('Authorization', `Bearer ${auth.token}`)
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    let message = res.statusText
    try {
      const data = await res.json()
      message = data.message ?? data.title ?? message
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api').replace(/\/api\/?$/, '')

export function mediaUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

export type Course = {
  id: string
  slug: string
  title: string
  instructor: string
  instructorRole: string
  instructorBio?: string
  duration: string
  price: number | 'Free'
  rating: number
  reviews: number
  level: string
  category: string
  overview: string
  skills: string[]
  students: number
  featured: boolean
  mode: string
  previewVideoUrl?: string
  curriculum?: {
    id: string
    title: string
    lessons: { id: string; title: string; duration: string; videoUrl?: string }[]
  }[]
  materials?: { id: string; title: string; fileUrl: string; fileType: string }[]
  assignments?: { id: string; title: string; description: string }[]
  quiz?: { id: string; question: string; options: string[] }[]
}
