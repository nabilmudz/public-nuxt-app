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

export const useAuth = () => {
  const config = useRuntimeConfig()

  const user = useState<LoginUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const refreshToken = useState<string | null>('auth-refresh-token', () => null)

  const login = async (email: string, password: string) => {
    try {
      const res = await $fetch<LoginResponse>(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        body: { email, password },
      })

      user.value = res.data.user
      accessToken.value = res.data.accessToken
      refreshToken.value = res.data.refreshToken

      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(res.data.user))
        localStorage.setItem('access_token', res.data.accessToken)
        localStorage.setItem('refresh_token', res.data.refreshToken)
      }

      return { ok: true }
    } catch (error: any) {
      return {
        ok: false,
        message: error?.data?.message || 'Login gagal',
      }
    }
  }

  const initAuth = () => {
    if (!process.client) return

    const savedUser = localStorage.getItem('auth_user')
    const savedAccessToken = localStorage.getItem('access_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')

    user.value = savedUser ? JSON.parse(savedUser) : null
    accessToken.value = savedAccessToken
    refreshToken.value = savedRefreshToken
  }

  const logout = async () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    if (process.client) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }

    await navigateTo('/login')
  }

  return {
    user,
    accessToken,
    refreshToken,
    login,
    initAuth,
    logout,
  }
}