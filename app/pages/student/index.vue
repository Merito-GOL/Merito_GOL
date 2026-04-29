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
const filters = ref<GradeFilterState>({ search: '', semester: null, gradeStatus: 'all' })
const loading = ref(true)
const subjects = ref<StudentSubject[]>([])
const currentStudent = ref<StudentUser | null>(null)
const currentSemester = ref<Semester | null>(null)
const maxSemesterForStudent = computed<Semester>(() => {
  const dbMax = gradeStore.semesters.value
    .map((s) => s.number)
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => b - a)[0]

  const max = Math.min(currentSemester.value ?? 8, dbMax ?? 8)
  return toViewSemester(max)
})
const page = ref(1)
const perPage = ref(10)

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
  const student = gradeStore.getUser(studentId)
  if (!student || student.role !== 'student') return []

  const group = gradeStore.getGroup(student.groupId)
  const studentGrades = gradeStore.getStudentGrades(studentId)
  const relevantCourses = gradeStore.courses.value
    .filter((course) => course.departmentId === student.departmentId && course.fieldOfStudyId === student.fieldOfStudyId)

  return relevantCourses
    .map((course): StudentSubject | null => {
      const semester = gradeStore.getSemester(course.semesterId)
      const semesterNumber = semester?.number
      const viewSemester = toViewSemester(semesterNumber)

      const latestGrade = studentGrades
        .filter((grade) => grade.courseId === course.id)
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0]

      const teacher = latestGrade
        ? gradeStore.getUser(latestGrade.createdBy)
        : (course.defaultTeacherId ? gradeStore.getUser(course.defaultTeacherId) : undefined)

      return {
        id: `course-${course.id}`,
        name: course.name,
        hours: course.hours,
        ects: course.ects,
        finalGrade: latestGrade ? formatGrade(latestGrade.value) : null,
        date: latestGrade?.date ?? '',
        teacher: fullName(teacher),
        group: group?.code ?? '—',
        semester: viewSemester,
      }
    })
    .filter((subject): subject is StudentSubject => Boolean(subject))
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
  const semesterNumber = currentStudent.value ? getCurrentSemesterNumber(currentStudent.value.id) : undefined
  currentSemester.value = semesterNumber ? toViewSemester(semesterNumber) : null
  filters.value.semester = currentSemester.value
  subjects.value = currentStudent.value ? buildStudentSubjects(currentStudent.value.id) : []
  loading.value = false
})

const filteredSubjects = computed(() => {
  const q = filters.value.search.trim().toLowerCase()

  return subjects.value
    .filter((s) => !q || s.name.toLowerCase().includes(q))
    .filter((s) => filters.value.semester == null || s.semester === filters.value.semester)
    .filter((s) => {
      if (filters.value.gradeStatus === 'graded') return s.finalGrade != null && s.finalGrade !== '—'
      if (filters.value.gradeStatus === 'missing') return s.finalGrade == null || s.finalGrade === '—'
      return true
    })
})

watch(filteredSubjects, () => { page.value = 1 })
watch(perPage, () => { page.value = 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSubjects.value.length / perPage.value)))
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
    <GradesFilter v-model="filters" :max-semester="maxSemesterForStudent" />

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
      @update:per-page="perPage = $event"
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
