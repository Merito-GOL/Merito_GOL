export default defineNuxtRouteMiddleware((to) => {
  // Pomijamy na serwerze - localStorage nie jest dostępny
  if (!import.meta.client) {
    return
  }

  const auth = useAuthStore()

  // Przywracamy stan z localStorage
  auth.restore()

  const publicRoutes = ['/login', '/register']

  // Niezalogowany użytkownik → przekieruj na login
  if (!auth.currentUser.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Zalogowany wykładowca na stronie głównej / studenta → do panelu wykładowcy
  if (auth.currentUser.value?.role === 'teacher') {
    if (to.path === '/' || to.path.startsWith('/student')) {
      return navigateTo('/teacher')
    }
  }

  // Zalogowany student próbuje wejść do panelu wykładowcy → do panelu studenta
  if (auth.currentUser.value?.role === 'student') {
    if (to.path.startsWith('/teacher')) {
      return navigateTo('/student')
    }
  }
})
