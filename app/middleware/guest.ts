export default defineNuxtRouteMiddleware(async () => {
  const { initAuth, refreshToken, ensureValidAccessToken } = useAuth()

  if (process.client) {
    initAuth()
  }

  if (!refreshToken.value) return

  const ok = await ensureValidAccessToken()

  if (ok) {
    return navigateTo('/proposals')
  }
})