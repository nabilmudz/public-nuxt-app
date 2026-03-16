export default defineNuxtRouteMiddleware(async () => {
  const { initAuth, refreshToken, ensureValidAccessToken, user, getDashboardPathByRole } = useAuth()

  if (process.client) {
    initAuth()
  }

  if (!refreshToken.value) return

  const ok = await ensureValidAccessToken()

  if (ok) {
    return navigateTo(getDashboardPathByRole(user.value?.role))
  }
})