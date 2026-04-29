export default defineNuxtRouteMiddleware((to) => {
  // Pomijamy na serwerze - localStorage nie jest dostępny
  if (!import.meta.client) {
    return
  }

  const auth = useAuthStore()

  // Przywracamy stan z localStorage
  auth.restore()

  const publicRoutes = ['/login', '/register']

  if (!auth.currentUser.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})