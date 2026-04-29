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
    // Zapisz w cookie dla SSR
    const cookie = useCookie<User | null>('auth_user', {
      default: () => null,
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    })
    cookie.value = user

    // Zapisz w localStorage dla CSR
    if (!import.meta.client) return
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      return
    }
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const restore = () => {
    // Najpierw sprawdź cookie (dla SSR)
    const cookie = useCookie<User | null>('auth_user')
    if (cookie.value) {
      currentUser.value = normalizeStoredUser(cookie.value)
      return
    }

    // Potem localStorage (dla CSR)
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
