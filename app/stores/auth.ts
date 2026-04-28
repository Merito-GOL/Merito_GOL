console.log('auth store loaded')
import { defineStore } from 'pinia'
import { ref } from 'vue'
    
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userRole = ref<'student' | 'lecturer' | null>(null)

  const login = (role: 'student' | 'lecturer') => {
    isAuthenticated.value = true
    userRole.value = role
  }

  const logout = () => {
    isAuthenticated.value = false
    userRole.value = null
  }

  return {
    isAuthenticated,
    userRole,
    login,
    logout
  }
})