export default defineNuxtRouteMiddleware((to) => {
  // Pomijamy na serwerze - localStorage nie jest dostępny
  if (!import.meta.client) {
    return
  }

  const auth = useAuthStore()

  // Bezpośrednio przywracamy stan z localStorage
  auth.restoreAuth()

  const publicRoutes = ['/login', '/register']

  if (!auth.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})