type LoginUser = {
  id: string
  name: string
  email: string
}

type LoginData = {
  user: LoginUser
  accessToken: string
  refreshToken: string
}

type LoginResponse = {
  success: boolean
  message: string
  data: LoginData
}

type RefreshResponse = {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken?: string
  }
}

export const useAuth = () => {
  const config = useRuntimeConfig()

  const user = useState<LoginUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const refreshToken = useState<string | null>('auth-refresh-token', () => null)

  const setAuthData = (data: LoginData) => {
    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
    }
  }

  const clearAuthData = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    if (process.client) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  const parseJwt = (token: string): Record<string, any> | null => {
    try {
      const parts = token.split('.')

      if (parts.length < 2) return null

      const base64Payload = parts[1]
      if (!base64Payload) return null

      const normalized = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(normalized)) as Record<string, any>
    } catch {
      return null
    }
  }
  
  const isTokenExpired = (token: string | null) => {
    if (!token) return true

    const payload = parseJwt(token)
    if (!payload?.exp) return true

    const now = Math.floor(Date.now() / 1000)
    return payload.exp <= now
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await $fetch<LoginResponse>(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        body: { email, password },
      })

      setAuthData(res.data)

      return { ok: true }
    } catch (error: any) {
      return {
        ok: false,
        message: error?.data?.message || 'Login gagal',
      }
    }
  }

  const initAuth = () => {
    if (!process.client) return false

    const savedUser = localStorage.getItem('auth_user')
    const savedAccessToken = localStorage.getItem('access_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')

    user.value = savedUser ? JSON.parse(savedUser) : null
    accessToken.value = savedAccessToken
    refreshToken.value = savedRefreshToken

    return !!savedRefreshToken
  }

  const refresh = async () => {
    try {
      if (!refreshToken.value) return false

      if (isTokenExpired(refreshToken.value)) {
        clearAuthData()
        return false
      }

      const res = await $fetch<RefreshResponse>(`${config.public.apiBase}/api/auth/refresh`, {
        method: 'POST',
        body: {
          refreshToken: refreshToken.value,
        },
      })

      accessToken.value = res.data.accessToken

      if (res.data.refreshToken) {
        refreshToken.value = res.data.refreshToken
      }

      if (process.client) {
        localStorage.setItem('access_token', accessToken.value)
        if (res.data.refreshToken) {
          localStorage.setItem('refresh_token', refreshToken.value!)
        }
      }

      return true
    } catch {
      clearAuthData()
      return false
    }
  }

  const ensureValidAccessToken = async () => {
    if (!accessToken.value) {
      return await refresh()
    }

    if (!isTokenExpired(accessToken.value)) {
      return true
    }

    return await refresh()
  }

  const logout = async () => {
    clearAuthData()
    await navigateTo('/login')
  }

  return {
    user,
    accessToken,
    refreshToken,
    login,
    initAuth,
    refresh,
    logout,
    isTokenExpired,
    ensureValidAccessToken,
  }
}