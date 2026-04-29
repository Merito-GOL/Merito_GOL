export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/login', '/register']

  // Jeśli jesteśmy na publicznej trasie, nie blokujemy
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Na serwerze - sprawdzamy cookie
  if (!import.meta.client) {
    const cookies = useCookie('auth_token')
    if (!cookies.value) {
      return navigateTo('/login')
    }
    return
  }

  // Na kliencie - używamy store
  const auth = useAuthStore()
  auth.restore()

  if (!auth.currentUser.value) {
    return navigateTo('/login')
  }
})