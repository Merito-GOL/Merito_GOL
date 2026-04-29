import type { User } from '~/types/entities'

const AUTH_STORAGE_KEY = 'meritogol.currentUser'

export const useAuthStore = () => {
  const api = useMeritoApi()
  const currentUser = useState<User | null>('auth.currentUser', () => null)
  const loading = useState('auth.loading', () => false)
  const error = useState<string | null>('auth.error', () => null)

  const normalizeStoredUser = (user: User) => {
    const normalized = {
      ...user,
      id: Number(user.id),
      departmentId: Number(user.departmentId),
    }

    if (user.role !== 'student') {
      return normalized as User
    }

    return {
      ...normalized,
      fieldOfStudyId: Number(user.fieldOfStudyId),
      groupId: Number(user.groupId),
    } as User
  }

  const persist = (user: User | null) => {
    if (!import.meta.client) return
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      return
    }
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const restore = () => {
    if (!import.meta.client) return

    if (currentUser.value) {
      currentUser.value = normalizeStoredUser(currentUser.value)
      persist(currentUser.value)
      return
    }

    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return

    try {
      currentUser.value = normalizeStoredUser(JSON.parse(raw) as User)
      persist(currentUser.value)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const user = await api.login(email, password)
      if (!user) {
        error.value = 'Nieprawidlowy e-mail lub haslo.'
        return null
      }

      currentUser.value = user
      persist(user)
      return user
    } catch {
      error.value = 'Nie mozna polaczyc sie z mock API. Uruchom npm run mock-api.'
      return null
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    persist(null)
  }

  return {
    currentUser,
    loading,
    error,
    restore,
    login,
    logout,
  }
}
