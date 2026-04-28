import type {
  Course,
  Department,
  FieldOfStudy,
  Grade,
  GradePayload,
  Group,
  Semester,
  StudentSemesterSummary,
  User,
} from '~/types/entities'

const API_BASE = 'http://localhost:3001'

export const useMeritoApi = () => {
  const normalizeIds = <T>(value: T): T => {
    if (Array.isArray(value)) {
      return value.map((item) => normalizeIds(item)) as T
    }

    if (!value || typeof value !== 'object') {
      return value
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => {
        const shouldNormalize = key === 'id' || key.endsWith('Id')
        const normalized = shouldNormalize && typeof entry === 'string' && /^\d+$/.test(entry)
          ? Number(entry)
          : normalizeIds(entry)

        return [key, normalized]
      }),
    ) as T
  }

  const request = async <T>(path: string, options = {}) => {
    const response = await $fetch<T>(`${API_BASE}${path}`, options)
    return normalizeIds(response)
  }

  return {
    login: async (email: string, password: string) => {
      const users = await request<User[]>(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      return users[0] ?? null
    },
    register: async (payload: Omit<User, 'id'>) => {
      return await request<User>('/users', {
        method: 'POST',
        body: payload,
      })
    },
    getDepartments: () => request<Department[]>('/departments'),
    getFieldsOfStudy: () => request<FieldOfStudy[]>('/fieldsOfStudy'),
    getGroups: () => request<Group[]>('/groups'),
    getSemesters: () => request<Semester[]>('/semesters'),
    getUsers: () => request<User[]>('/users'),
    getCourses: () => request<Course[]>('/courses'),
    getGrades: () => request<Grade[]>('/grades'),
    getStudentSemesterSummaries: () => request<StudentSemesterSummary[]>('/studentSemesterSummaries'),
    createGrade: (payload: GradePayload) => request<Grade>('/grades', {
      method: 'POST',
      body: payload,
    }),
    updateGrade: (id: number, payload: Partial<GradePayload>) => request<Grade>(`/grades/${id}`, {
      method: 'PATCH',
      body: payload,
    }),
    deleteGrade: (id: number) => request<void>(`/grades/${id}`, {
      method: 'DELETE',
    }),
  }
}
