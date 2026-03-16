export default defineNuxtRouteMiddleware(async (to) => {
  const { initAuth, refreshToken, ensureValidAccessToken, user, getDashboardPathByRole } = useAuth()

  if (process.client) {
    initAuth()
  }

  if (!refreshToken.value) {
    return navigateTo('/login')
  }

  const ok = await ensureValidAccessToken()
  if (!ok) {
    return navigateTo('/login')
  }

  // RBAC: cek requiredRole dari page meta
  const requiredRole = to.meta?.requiredRole
  if (requiredRole && user.value?.role !== requiredRole) {
    if (!user.value?.role) {
      return navigateTo('/login')
    }

    const redirectPath = getDashboardPathByRole(user.value.role)
    if (to.path === redirectPath) {
      return navigateTo('/login')
    }

    return navigateTo(redirectPath)
  }
})