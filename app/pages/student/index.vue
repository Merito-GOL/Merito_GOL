<script setup lang="ts">
import type { GradeFilterState, Semester, StudentSubject } from '~/types/grades'
import type { StudentUser, User } from '~/types/entities'

definePageMeta({ layout: 'student' })

const DEFAULT_STUDENT_ID = 1
const MOCK_USER_ID_STORAGE_KEY = 'meritogol.mockUserId'
const CURRENT_USER_ID_STORAGE_KEY = 'meritogol.currentUserId'
const CURRENT_USER_STORAGE_KEY = 'meritogol.currentUser'

// Temporary user switching until registration/login is integrated:
// localStorage.setItem('meritogol.mockUserId', '1'); location.reload()
// localStorage.setItem('meritogol.mockUserId', '4'); location.reload()
const gradeStore = useGradeStore()
const filters = ref<GradeFilterState>({ search: '' })
const loading = ref(true)
const subjects = ref<StudentSubject[]>([])
const currentStudent = ref<StudentUser | null>(null)
const page = ref(1)
const perPage = 10

function formatGrade(value: number) {
  return value.toFixed(value % 1 === 0 ? 1 : 1).replace('.', ',')
}

function fullName(user?: User) {
  if (!user) return '—'
  return `${'title' in user ? `${user.title} ` : ''}${user.firstName} ${user.lastName}`
}

function toViewSemester(value?: number): Semester {
  return value && value >= 1 && value <= 8 ? value as Semester : 1
}

function readTemporaryStudentId() {
  if (!import.meta.client) return DEFAULT_STUDENT_ID

  const explicitId = localStorage.getItem(MOCK_USER_ID_STORAGE_KEY)
    ?? localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY)

  if (explicitId && Number.isFinite(Number(explicitId))) {
    return Number(explicitId)
  }

  const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY)

  if (!storedUser) return DEFAULT_STUDENT_ID

  try {
    const parsed = JSON.parse(storedUser) as Partial<User>

    if (parsed.role === 'student' && Number.isFinite(Number(parsed.id))) {
      return Number(parsed.id)
    }
  } catch {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  }

  return DEFAULT_STUDENT_ID
}

function buildStudentSubjects(studentId: number) {
  const currentSemesterNumber = getCurrentSemesterNumber(studentId)

  return gradeStore.getStudentGrades(studentId)
    .map((grade): StudentSubject | null => {
      const course = gradeStore.getCourse(grade.courseId)
      if (!course) return null

      const teacher = gradeStore.getUser(grade.createdBy)
      const group = currentStudent.value ? gradeStore.getGroup(currentStudent.value.groupId) : null
      const semester = gradeStore.getSemester(course.semesterId)

      return {
        id: String(grade.id),
        name: course.name,
        hours: course.hours,
        ects: course.ects,
        finalGrade: formatGrade(grade.value),
        date: grade.date,
        teacher: fullName(teacher),
        group: group?.code ?? '—',
        semester: toViewSemester(semester?.number),
      }
    })
    .filter((subject): subject is StudentSubject => Boolean(subject))
    .filter((subject) => !currentSemesterNumber || subject.semester === currentSemesterNumber)
}

function getCurrentSemesterNumber(studentId: number) {
  return gradeStore.summaries.value
    .filter((summary) => summary.studentId === studentId)
    .map((summary) => gradeStore.getSemester(summary.semesterId)?.number)
    .filter((number): number is number => typeof number === 'number')
    .sort((a, b) => b - a)[0]
}

onMounted(async () => {
  loading.value = true
  await gradeStore.loadAll()

  const studentId = readTemporaryStudentId()
  const user = gradeStore.getUser(studentId)

  currentStudent.value = user?.role === 'student' ? user : null
  subjects.value = currentStudent.value ? buildStudentSubjects(currentStudent.value.id) : []
  loading.value = false
})

const filteredSubjects = computed(() => {
  if (!filters.value.search) return subjects.value
  const q = filters.value.search.toLowerCase()
  return subjects.value.filter(s => s.name.toLowerCase().includes(q))
})

watch(filteredSubjects, () => { page.value = 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSubjects.value.length / perPage)))
</script>

<template>
  <div class="student-page">
    <!-- Breadcrumbs -->
    <nav class="student-page__breadcrumb" aria-label="Ścieżka nawigacji">
      <span class="student-page__breadcrumb-home">🏠</span>
      <span class="student-page__breadcrumb-sep">›</span>
      <span>Pulpit</span>
      <span class="student-page__breadcrumb-sep">›</span>
      <span class="student-page__breadcrumb-current">Oceny</span>
    </nav>

    <h1 class="student-page__title">Oceny</h1>

    <!-- Filter bar -->
    <GradesFilter v-model="filters" />

    <!-- Table card -->
    <div class="student-page__card">
      <GradesTable
        :subjects="filteredSubjects"
        :loading="loading"
        :per-page="perPage"
        :page="page"
      />
    </div>

    <GradesPagination
      v-if="!loading && filteredSubjects.length"
      :page="page"
      :total-pages="totalPages"
      :total="filteredSubjects.length"
      :per-page="perPage"
      @update:page="page = $event"
    />

    <footer class="student-page__footer">
      MeritoGOŁ • Panel studenta • Zalogowany jako
      <strong>{{ currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : 'Jan Kowalski' }}</strong>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.student-page {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: $color-ink-subtle;
    margin-bottom: -4px;

    &-home   { font-size: 13px; }
    &-sep    { color: $color-border-input; }
    &-current { color: $color-ink; font-weight: 600; }
  }

  &__title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $color-ink;
  }

  &__card {
    background: $color-surface-card;
    border: 1px solid $color-border;
    border-radius: $border-radius-card;
    overflow: hidden;
  }

  &__footer {
    text-align: center;
    color: $color-ink-subtle;
    font-size: 12px;
    padding: 20px 0 40px;
  }
}

</style>
