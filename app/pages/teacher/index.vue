<script setup lang="ts">
import type { TeacherUser } from '~/types/entities'
import type { Course, Grade } from '~/types/entities'

definePageMeta({ layout: 'teacher' })

// ─── Store & composables ───────────────────────────────────────────
const auth = useAuthStore()
const gradeStore = useGradeStore()
const toast = useToast()

// ─── Current teacher ──────────────────────────────────────────────
const teacher = computed(() => auth.currentUser.value as TeacherUser | null)

// ─── Data state ───────────────────────────────────────────────────
const loading = ref(true)
const apiError = ref<string | null>(null)

// ─── Selected course ──────────────────────────────────────────────
const selectedCourse = ref<Course | null>(null)

// ─── Modal state (add / edit grade) ──────────────────────────────
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingGrade = ref<Grade | null>(null)
const modalStudentId = ref<number | null>(null)
const modalValue = ref<number>(5)
const modalType = ref('końcowa')
const modalDate = ref(new Date().toISOString().slice(0, 10))
const modalLoading = ref(false)
const modalError = ref<string | null>(null)

// ─── Delete confirm ───────────────────────────────────────────────
const confirmDeleteGrade = ref<Grade | null>(null)
const deleteLoading = ref(false)

// ─── Teacher's courses ────────────────────────────────────────────
const teacherCourses = computed(() => {
  if (!teacher.value) return []
  return gradeStore.courses.value.filter(
    (c) => c.departmentId === teacher.value!.departmentId,
  )
})

// ─── Students for selected course ────────────────────────────────
const courseStudents = computed(() => {
  if (!selectedCourse.value || !teacher.value) return []

  return gradeStore.users.value.filter(
    (u) =>
      u.role === 'student' &&
      u.departmentId === teacher.value!.departmentId &&
      'fieldOfStudyId' in u &&
      u.fieldOfStudyId === selectedCourse.value!.fieldOfStudyId,
  )
})

// ─── Roster rows (students + their grade for this course) ────────
interface RosterRow {
  studentId: number
  albumNumber: string
  fullName: string
  grade: Grade | null
  gradeDisplay: string
}

const roster = computed<RosterRow[]>(() => {
  if (!selectedCourse.value) return []

  return courseStudents.value.map((student) => {
    const grades = gradeStore.grades.value
      .filter((g) => g.studentId === student.id && g.courseId === selectedCourse.value!.id)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))

    const latest = grades[0] ?? null

    return {
      studentId: student.id,
      albumNumber: 'albumNumber' in student ? student.albumNumber : String(student.id),
      fullName: `${student.firstName} ${student.lastName}`,
      grade: latest,
      gradeDisplay: latest ? formatGrade(latest.value) : '—',
    }
  })
})

// ─── Search / filter ─────────────────────────────────────────────
const search = ref('')
const filteredRoster = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return roster.value
  return roster.value.filter(
    (r) => r.fullName.toLowerCase().includes(q) || r.albumNumber.toLowerCase().includes(q),
  )
})

// ─── Stats ────────────────────────────────────────────────────────
const stats = computed(() => {
  const graded = roster.value.filter((r) => r.grade !== null)
  const numericValues = graded
    .map((r) => r.grade!.value)
    .filter((v) => v >= 2)

  const avg = numericValues.length
    ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length)
        .toFixed(2)
        .replace('.', ',')
    : '—'

  return {
    total: roster.value.length,
    graded: graded.length,
    missing: roster.value.length - graded.length,
    avg,
  }
})

// ─── Helpers ─────────────────────────────────────────────────────
function formatGrade(value: number) {
  return value.toFixed(1).replace('.', ',')
}

function gradeColor(display: string) {
  if (display === '—' || !display) return 'empty'
  const n = parseFloat(display.replace(',', '.'))
  if (n >= 4.5) return 'high'
  if (n >= 3.5) return 'mid'
  return 'low'
}

function getSemesterLabel(course: Course) {
  return gradeStore.getSemester(course.semesterId)?.label ?? `Sem. ${course.semesterId}`
}

// ─── CRUD actions ────────────────────────────────────────────────
function openCreate(studentId: number) {
  modalMode.value = 'create'
  editingGrade.value = null
  modalStudentId.value = studentId
  modalValue.value = 5
  modalType.value = 'końcowa'
  modalDate.value = new Date().toISOString().slice(0, 10)
  modalError.value = null
  showModal.value = true
}

function openEdit(grade: Grade) {
  modalMode.value = 'edit'
  editingGrade.value = grade
  modalStudentId.value = grade.studentId
  modalValue.value = grade.value
  modalType.value = grade.type
  modalDate.value = grade.date
  modalError.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  modalError.value = null
}

async function submitGrade() {
  if (!teacher.value || !selectedCourse.value || !modalStudentId.value) return

  modalLoading.value = true
  modalError.value = null

  try {
    const isEdit = modalMode.value === 'edit' && editingGrade.value

    await gradeStore.saveGrade(
      teacher.value,
      {
        studentId: modalStudentId.value,
        courseId: selectedCourse.value.id,
        value: modalValue.value,
        type: modalType.value,
        date: modalDate.value,
      },
      isEdit ? editingGrade.value!.id : undefined,
    )

    closeModal()
    toast.success(
      isEdit ? 'Ocena zaktualizowana' : 'Ocena wystawiona',
      `Ocena ${formatGrade(modalValue.value)} została ${isEdit ? 'zaktualizowana' : 'zapisana'}.`,
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd.'
    modalError.value = msg
    toast.error('Błąd zapisu oceny', msg)
  } finally {
    modalLoading.value = false
  }
}

async function confirmDelete() {
  if (!confirmDeleteGrade.value) return

  deleteLoading.value = true
  try {
    await gradeStore.removeGrade(confirmDeleteGrade.value.id)
    toast.success('Ocena usunięta', 'Ocena została pomyślnie usunięta.')
    confirmDeleteGrade.value = null
  } catch {
    toast.error('Błąd usuwania', 'Nie udało się usunąć oceny. Spróbuj ponownie.')
  } finally {
    deleteLoading.value = false
  }
}

// ─── Load data ───────────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  apiError.value = null

  try {
    await gradeStore.loadAll()
  } catch {
    apiError.value = 'Nie udało się pobrać danych. Sprawdź, czy działa mock API (npm run mock-api).'
  } finally {
    loading.value = false
  }
})

// ─── Grade value options ──────────────────────────────────────────
const GRADE_VALUES = [5, 4.5, 4, 3.5, 3, 2]
const GRADE_TYPES = ['końcowa', 'poprawkowa', 'cząstkowa', 'egzamin', 'zaliczenie']

// ─── Keyboard shortcut: Escape closes modal ───────────────────────
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
      confirmDeleteGrade.value = null
    }
  })
})
</script>

<template>
  <div class="teacher-page">
    <!-- Breadcrumb -->
    <nav class="teacher-page__breadcrumb" aria-label="Ścieżka nawigacji">
      <span class="teacher-page__breadcrumb-home">🏠</span>
      <span class="teacher-page__breadcrumb-sep">›</span>
      <button
        v-if="selectedCourse"
        class="teacher-page__breadcrumb-link"
        type="button"
        @click="selectedCourse = null; search = ''"
      >
        Pulpit
      </button>
      <span v-else>Pulpit</span>
      <template v-if="selectedCourse">
        <span class="teacher-page__breadcrumb-sep">›</span>
        <span class="teacher-page__breadcrumb-current">{{ selectedCourse.name }}</span>
      </template>
    </nav>

    <!-- Page header -->
    <div class="teacher-page__header">
      <div>
        <h1 class="teacher-page__title">
          {{ selectedCourse ? selectedCourse.name : 'Panel wykładowcy' }}
        </h1>
        <p class="teacher-page__subtitle" v-if="!selectedCourse && teacher">
          Witaj, {{ teacher.title }} {{ teacher.lastName }}. Wybierz przedmiot, aby wystawiać oceny.
        </p>
        <p class="teacher-page__subtitle" v-if="selectedCourse">
          {{ getSemesterLabel(selectedCourse) }} &middot; {{ selectedCourse.hours }}&nbsp;h &middot; {{ selectedCourse.ects }}&nbsp;ECTS
        </p>
      </div>
      <button
        v-if="selectedCourse"
        class="teacher-page__back-btn"
        type="button"
        @click="selectedCourse = null; search = ''"
      >
        ← Zmień przedmiot
      </button>
    </div>

    <!-- API Error -->
    <AppAlert
      v-if="apiError"
      type="error"
      title="Błąd połączenia"
      :message="apiError"
      :dismissible="true"
    />

    <!-- Loading skeleton -->
    <div v-if="loading" class="teacher-page__skeleton">
      <div class="skeleton-row" v-for="n in 5" :key="n" />
    </div>

    <!-- ── SUBJECT LIST (no course selected) ──────────────────── -->
    <template v-else-if="!selectedCourse">
      <div class="teacher-page__card">
        <div class="subject-table">
          <div class="subject-table__header">
            <span>Przedmiot</span>
            <span>Semestr</span>
            <span>Godziny / ECTS</span>
            <span />
          </div>

          <div v-if="!teacherCourses.length" class="subject-table__empty">
            Brak przypisanych przedmiotów.
          </div>

          <button
            v-for="course in teacherCourses"
            :key="course.id"
            class="subject-table__row"
            type="button"
            @click="selectedCourse = course"
          >
            <span class="subject-table__name">{{ course.name }}</span>
            <span class="subject-table__meta">{{ getSemesterLabel(course) }}</span>
            <span class="subject-table__meta">{{ course.hours }} h / {{ course.ects }} ECTS</span>
            <span class="subject-table__action">Wystawiaj oceny →</span>
          </button>
        </div>
      </div>
    </template>

    <!-- ── GRADEBOOK (course selected) ───────────────────────── -->
    <template v-else>
      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stats-strip__item">
          <div class="stats-strip__label">Studentów</div>
          <div class="stats-strip__value">{{ stats.total }}</div>
        </div>
        <div class="stats-strip__item">
          <div class="stats-strip__label">Ocenionych</div>
          <div class="stats-strip__value stats-strip__value--ok">{{ stats.graded }}</div>
        </div>
        <div class="stats-strip__item">
          <div class="stats-strip__label">Bez oceny</div>
          <div class="stats-strip__value" :class="{ 'stats-strip__value--warn': stats.missing > 0 }">
            {{ stats.missing }}
          </div>
        </div>
        <div class="stats-strip__item">
          <div class="stats-strip__label">Średnia grupy</div>
          <div class="stats-strip__value">{{ stats.avg }}</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="gradebook-toolbar">
        <div class="gradebook-toolbar__search-wrap">
          <svg class="gradebook-toolbar__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="search"
            type="search"
            class="gradebook-toolbar__search"
            placeholder="Szukaj studenta lub nr albumu…"
            aria-label="Szukaj studenta"
          />
        </div>
        <div class="gradebook-toolbar__spacer" />
        <span class="gradebook-toolbar__count">
          {{ filteredRoster.length }} / {{ roster.length }} studentów
        </span>
      </div>

      <!-- Roster table -->
      <div class="teacher-page__card">
        <div class="roster-table">
          <div class="roster-table__header">
            <span>Nr albumu</span>
            <span>Student</span>
            <span>Ocena końcowa</span>
            <span>Data wpisu</span>
            <span>Akcje</span>
          </div>

          <div v-if="!filteredRoster.length" class="roster-table__empty">
            Brak studentów spełniających kryteria wyszukiwania.
          </div>

          <div
            v-for="row in filteredRoster"
            :key="row.studentId"
            class="roster-table__row"
            :class="{ 'roster-table__row--pending': !row.grade }"
          >
            <span class="roster-table__album">{{ row.albumNumber }}</span>
            <span class="roster-table__name">{{ row.fullName }}</span>
            <span class="roster-table__grade">
              <span
                class="grade-chip"
                :class="`grade-chip--${gradeColor(row.gradeDisplay)}`"
              >
                {{ row.gradeDisplay }}
              </span>
            </span>
            <span class="roster-table__date">
              {{ row.grade?.date || '—' }}
            </span>
            <div class="roster-table__actions">
              <!-- CREATE if no grade -->
              <button
                v-if="!row.grade"
                class="action-btn action-btn--primary"
                type="button"
                title="Wystaw ocenę"
                @click="openCreate(row.studentId)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Wystaw
              </button>
              <!-- EDIT if grade exists -->
              <button
                v-if="row.grade"
                class="action-btn action-btn--edit"
                type="button"
                title="Edytuj ocenę"
                @click="openEdit(row.grade!)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edytuj
              </button>
              <!-- DELETE if grade exists -->
              <button
                v-if="row.grade"
                class="action-btn action-btn--delete"
                type="button"
                title="Usuń ocenę"
                @click="confirmDeleteGrade = row.grade"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
                Usuń
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── MODAL: Add / Edit grade ────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal" role="dialog" :aria-label="modalMode === 'create' ? 'Wystaw ocenę' : 'Edytuj ocenę'">
            <div class="modal__header">
              <h2 class="modal__title">
                {{ modalMode === 'create' ? 'Wystaw ocenę' : 'Edytuj ocenę' }}
              </h2>
              <button class="modal__close" type="button" aria-label="Zamknij" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="modal__body">
              <AppAlert
                v-if="modalError"
                type="error"
                :title="modalError"
                :dismissible="true"
                @dismiss="modalError = null"
              />

              <!-- Student info (read-only in edit mode) -->
              <div class="form-group" v-if="modalStudentId">
                <label class="form-label">Student</label>
                <div class="form-static">
                  {{ roster.find(r => r.studentId === modalStudentId)?.fullName ?? '—' }}
                  &nbsp;·&nbsp;
                  <span class="form-static--muted">{{ roster.find(r => r.studentId === modalStudentId)?.albumNumber }}</span>
                </div>
              </div>

              <!-- Grade value -->
              <div class="form-group">
                <label class="form-label">Ocena</label>
                <div class="grade-picker">
                  <button
                    v-for="val in GRADE_VALUES"
                    :key="val"
                    class="grade-picker__btn"
                    :class="{ 'grade-picker__btn--active': modalValue === val }"
                    type="button"
                    @click="modalValue = val"
                  >
                    {{ formatGrade(val) }}
                  </button>
                </div>
              </div>

              <!-- Type -->
              <div class="form-group">
                <label class="form-label" for="modal-type">Typ oceny</label>
                <select id="modal-type" v-model="modalType" class="form-select">
                  <option v-for="t in GRADE_TYPES" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <!-- Date -->
              <div class="form-group">
                <label class="form-label" for="modal-date">Data wpisu</label>
                <input
                  id="modal-date"
                  v-model="modalDate"
                  type="date"
                  class="form-input"
                />
              </div>
            </div>

            <div class="modal__footer">
              <button class="modal-btn modal-btn--cancel" type="button" @click="closeModal">
                Anuluj
              </button>
              <button
                class="modal-btn modal-btn--submit"
                type="button"
                :disabled="modalLoading"
                @click="submitGrade"
              >
                <svg v-if="modalLoading" class="modal-btn__spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                  <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                </svg>
                {{ modalMode === 'create' ? 'Wystaw ocenę' : 'Zapisz zmiany' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL: Confirm delete ──────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmDeleteGrade" class="modal-overlay" @click.self="confirmDeleteGrade = null">
          <div class="modal modal--compact" role="dialog" aria-label="Potwierdź usunięcie oceny">
            <div class="modal__header">
              <h2 class="modal__title modal__title--danger">Usuń ocenę</h2>
              <button class="modal__close" type="button" aria-label="Zamknij" @click="confirmDeleteGrade = null">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal__body">
              <AppAlert type="warning">
                Czy na pewno chcesz usunąć ocenę
                <strong>{{ formatGrade(confirmDeleteGrade.value) }}</strong>
                wystawioną {{ confirmDeleteGrade.date }}?
                Tej operacji nie można cofnąć.
              </AppAlert>
            </div>
            <div class="modal__footer">
              <button class="modal-btn modal-btn--cancel" type="button" @click="confirmDeleteGrade = null">
                Anuluj
              </button>
              <button
                class="modal-btn modal-btn--danger"
                type="button"
                :disabled="deleteLoading"
                @click="confirmDelete"
              >
                Tak, usuń ocenę
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

// ─── Page shell ──────────────────────────────────────────────────
.teacher-page {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: $color-ink-subtle;

    &-home { font-size: 13px; }
    &-sep  { color: $color-border-input; }
    &-link {
      background: none;
      border: none;
      padding: 0;
      font-family: $font-sans;
      font-size: 12.5px;
      color: $color-accent;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    &-current { color: $color-ink; font-weight: 600; }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $color-ink;
  }

  &__subtitle {
    margin: 4px 0 0;
    font-size: 14px;
    color: $color-ink-muted;
  }

  &__back-btn {
    height: 40px;
    padding: 0 18px;
    border: 1.5px solid $color-accent;
    border-radius: 8px;
    background: $color-surface-card;
    color: $color-accent;
    font-size: 13.5px;
    font-weight: 600;
    font-family: $font-sans;
    cursor: pointer;
    white-space: nowrap;
    transition: background $transition-base;
    flex-shrink: 0;

    &:hover { background: #f0f5ff; }
  }

  &__card {
    background: $color-surface-card;
    border: 1px solid $color-border;
    border-radius: $border-radius-card;
    overflow: hidden;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

// ─── Loading skeleton ────────────────────────────────────────────
.skeleton-row {
  height: 52px;
  background: linear-gradient(90deg, $color-surface-muted 25%, $color-surface-hover 50%, $color-surface-muted 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: $border-radius-card;
}

@keyframes shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

// ─── Subject table ───────────────────────────────────────────────
.subject-table {
  &__header {
    display: grid;
    grid-template-columns: 1fr 120px 160px 160px;
    padding: 13px 20px;
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid $color-border;

    @media (max-width: 700px) {
      grid-template-columns: 1fr auto;
      span:nth-child(2), span:nth-child(3) { display: none; }
    }
  }

  &__empty {
    padding: 48px;
    text-align: center;
    color: $color-ink-subtle;
    font-size: 14px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 120px 160px 160px;
    padding: 15px 20px;
    align-items: center;
    border-bottom: 1px solid $color-border-light;
    background: none;
    width: 100%;
    text-align: left;
    font-family: $font-sans;
    cursor: pointer;
    transition: background $transition-base;

    &:last-child { border-bottom: none; }
    &:hover { background: $color-surface-hover; }

    @media (max-width: 700px) {
      grid-template-columns: 1fr auto;
      span:nth-child(2), span:nth-child(3) { display: none; }
    }
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: $color-ink;
  }

  &__meta {
    font-size: 13px;
    color: $color-ink-muted;
  }

  &__action {
    font-size: 13px;
    font-weight: 600;
    color: $color-accent;
    text-align: right;
  }
}

// ─── Stats strip ────────────────────────────────────────────────
.stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: $color-border;
  border: 1px solid $color-border;
  border-radius: $border-radius-card;
  overflow: hidden;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  &__item {
    background: $color-surface-card;
    padding: 16px 20px;
  }

  &__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-ink-subtle;
    margin-bottom: 6px;
  }

  &__value {
    font-size: 22px;
    font-weight: 800;
    color: $color-ink;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;

    &--ok   { color: $grade-high-fg; }
    &--warn { color: $grade-mid-fg; }
  }
}

// ─── Gradebook toolbar ───────────────────────────────────────────
.gradebook-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  &__search-wrap {
    position: relative;
    flex: 0 0 320px;
    @media (max-width: 600px) { flex: 1; }
  }

  &__search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: $color-ink-subtle;
    pointer-events: none;
  }

  &__search {
    width: 100%;
    padding: 10px 13px 10px 36px;
    border: 1.5px solid $color-border-input;
    border-radius: $border-radius-btn;
    font-size: 14px;
    font-family: $font-sans;
    background: $color-surface-card;
    color: $color-ink;
    outline: none;
    transition: border-color $transition-base, box-shadow $transition-base;

    &::placeholder { color: $color-ink-subtle; }
    &:focus {
      border-color: $color-ink-dark;
      box-shadow: 0 0 0 4px rgba(11, 23, 51, 0.08);
    }
  }

  &__spacer { flex: 1; }

  &__count {
    font-size: 13px;
    color: $color-ink-subtle;
    white-space: nowrap;
  }
}

// ─── Roster table ────────────────────────────────────────────────
.roster-table {
  &__header {
    display: grid;
    grid-template-columns: 120px 1fr 130px 120px 200px;
    padding: 13px 20px;
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid $color-border;

    @media (max-width: 900px) {
      grid-template-columns: 100px 1fr 100px auto;
      span:nth-child(4) { display: none; }
    }
    @media (max-width: 640px) {
      grid-template-columns: 1fr 80px auto;
      span:nth-child(1), span:nth-child(4) { display: none; }
    }
  }

  &__empty {
    padding: 48px;
    text-align: center;
    color: $color-ink-subtle;
    font-size: 14px;
  }

  &__row {
    display: grid;
    grid-template-columns: 120px 1fr 130px 120px 200px;
    padding: 13px 20px;
    align-items: center;
    border-bottom: 1px solid $color-border-light;
    transition: background $transition-base;
    font-size: 13.5px;

    &:last-child { border-bottom: none; }
    &--pending { background: #fafbfe; }
    &:hover { background: $color-surface-hover; }

    @media (max-width: 900px) {
      grid-template-columns: 100px 1fr 100px auto;
      .roster-table__date { display: none; }
    }
    @media (max-width: 640px) {
      grid-template-columns: 1fr 80px auto;
      .roster-table__album { display: none; }
    }
  }

  &__album {
    color: $color-ink-faint;
    font-variant-numeric: tabular-nums;
    font-size: 13px;
  }

  &__name {
    font-weight: 500;
    color: $color-ink;
  }

  &__grade {
    display: flex;
    align-items: center;
  }

  &__date {
    font-size: 12.5px;
    color: $color-ink-subtle;
    font-variant-numeric: tabular-nums;
  }

  &__actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
  }
}

// ─── Grade chip ──────────────────────────────────────────────────
.grade-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: $border-radius-chip;
  font-weight: 600;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  border: 1px solid transparent;

  &--high  { background: $grade-high-bg; color: $grade-high-fg; border-color: $grade-high-border; }
  &--mid   { background: $grade-mid-bg;  color: $grade-mid-fg;  border-color: $grade-mid-border;  }
  &--low   { background: $grade-low-bg;  color: $grade-low-fg;  border-color: $grade-low-border;  }
  &--empty { background: $color-surface-muted; color: $color-ink-subtle; border-color: $color-border-input; }
}

// ─── Action buttons ──────────────────────────────────────────────
.action-btn {
  height: 30px;
  padding: 0 11px;
  border-radius: 7px;
  border: 1.5px solid transparent;
  font-size: 12.5px;
  font-weight: 600;
  font-family: $font-sans;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: background $transition-base, border-color $transition-base;
  white-space: nowrap;

  &--primary {
    background: $color-accent;
    color: #fff;
    border-color: $color-accent;
    &:hover { background: darken(#1f6feb, 8%); }
  }

  &--edit {
    background: $color-surface-card;
    color: $color-ink;
    border-color: $color-border-input;
    &:hover { background: $color-surface-muted; }
  }

  &--delete {
    background: $color-surface-card;
    color: $grade-low-fg;
    border-color: $grade-low-border;
    &:hover { background: $grade-low-bg; }
  }
}

// ─── Modal overlay ───────────────────────────────────────────────
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 30, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.modal {
  background: $color-surface-card;
  border-radius: 16px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 24px 60px rgba(10, 15, 30, 0.25), 0 4px 16px rgba(10, 15, 30, 0.12);

  &--compact { max-width: 400px; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: $color-ink;
    letter-spacing: -0.02em;

    &--danger { color: $grade-low-fg; }
  }

  &__close {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: $color-ink-subtle;
    display: flex;
    align-items: center;
    transition: color $transition-base;

    &:hover { color: $color-ink; }
  }

  &__body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 0 24px 20px;
    border-top: 1px solid $color-border;
    padding-top: 16px;
  }
}

// ─── Form elements ───────────────────────────────────────────────
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $color-ink-subtle;
}

.form-static {
  font-size: 14px;
  font-weight: 500;
  color: $color-ink;

  &--muted { color: $color-ink-subtle; font-weight: 400; }
}

.form-input,
.form-select {
  height: 42px;
  padding: 0 12px;
  border: 1.5px solid $color-border-input;
  border-radius: $border-radius-btn;
  font-size: 14px;
  font-family: $font-sans;
  background: $color-surface-card;
  color: $color-ink;
  outline: none;
  transition: border-color $transition-base, box-shadow $transition-base;

  &:focus {
    border-color: $color-accent;
    box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.12);
  }
}

// ─── Grade picker ────────────────────────────────────────────────
.grade-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  &__btn {
    width: 56px;
    height: 44px;
    border-radius: 10px;
    border: 2px solid $color-border-input;
    background: $color-surface-card;
    color: $color-ink;
    font-size: 15px;
    font-weight: 600;
    font-family: $font-sans;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: background $transition-base, border-color $transition-base, color $transition-base, transform 80ms;

    &:hover { background: $color-surface-muted; border-color: $color-ink-subtle; }
    &:active { transform: scale(0.95); }

    &--active {
      background: $color-ink-dark;
      border-color: $color-ink-dark;
      color: #fff;
      font-weight: 800;
    }
  }
}

// ─── Modal buttons ───────────────────────────────────────────────
.modal-btn {
  height: 40px;
  padding: 0 22px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  font-family: $font-sans;
  cursor: pointer;
  transition: background $transition-base;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:disabled { opacity: 0.6; cursor: default; }

  &--cancel {
    background: $color-surface-muted;
    color: $color-ink-muted;
    &:hover:not(:disabled) { background: $color-border-light; }
  }

  &--submit {
    background: $color-ink-dark;
    color: #fff;
    &:hover:not(:disabled) { background: $color-ink; }
  }

  &--danger {
    background: $grade-low-fg;
    color: #fff;
    &:hover:not(:disabled) { background: darken(#c8341d, 8%); }
  }

  &__spinner {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }

// ─── Modal transition ────────────────────────────────────────────
.modal-enter-active { transition: all 220ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.modal-leave-active { transition: all 160ms ease; }
.modal-enter-from   { opacity: 0; }
.modal-leave-to     { opacity: 0; }
.modal-enter-from .modal { transform: scale(0.93) translateY(8px); }
.modal-leave-to .modal   { transform: scale(0.96) translateY(4px); }
</style>
