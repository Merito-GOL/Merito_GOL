import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userRole = ref<'student' | 'lecturer' | null>(null)

  const login = (role: 'student' | 'lecturer') => {
    console.log('LOGIN CALLED', role)

    isAuthenticated.value = true
    userRole.value = role

    if (import.meta.client) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userRole', role)

      console.log('LOCALSTORAGE SAVED')
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    userRole.value = null

    if (import.meta.client) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userRole')
    }
  }

  const initAuth = () => {
    if (import.meta.client) {
      const savedAuth = localStorage.getItem('isAuthenticated')
      const savedRole = localStorage.getItem('userRole')

      if (savedAuth === 'true' && savedRole) {
        isAuthenticated.value = true
        userRole.value = savedRole as 'student' | 'lecturer'
        console.log('AUTH RESTORED FROM LOCALSTORAGE')
      }
    }
  }

  // Metoda do bezpośredniego przywrócenia stanu z localStorage
  const restoreAuth = () => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    const savedRole = localStorage.getItem('userRole')

    if (savedAuth === 'true' && savedRole) {
      isAuthenticated.value = true
      userRole.value = savedRole as 'student' | 'lecturer'
      console.log('AUTH RESTORED DIRECTLY')
    }
  }

  return {
    isAuthenticated,
    userRole,
    login,
    logout,
    initAuth,
    restoreAuth
  }
})