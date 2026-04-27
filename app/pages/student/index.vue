<script setup lang="ts">
import type { GradeFilterState, Semester } from '~/types/grades'
import { mockSubjects, mockSemesters, mockStudent } from '~/data/mockGrades'
import type { MockSubject } from '~/data/mockGrades'

definePageMeta({ layout: 'student' })

// mockSemesters[0] = semester 4, [1] = 3, [2] = 2, [3] = 1
const SEMESTER_MAP: Semester[] = [4, 3, 2, 1]

const activeSemesterId = ref(0)
const filters = ref<GradeFilterState>({ search: '' })
const loading = ref(false)
const subjects = ref<MockSubject[]>([])

onMounted(async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  subjects.value = mockSubjects
  loading.value = false
})

const currentSemester = computed(() => mockSemesters[activeSemesterId.value])

const filteredSubjects = computed(() => {
  const semNum = SEMESTER_MAP[activeSemesterId.value]
  let result = subjects.value.filter(s => s.semester === semNum)

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(q))
  }

  return result
})
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

    <!-- Semester selector tabs -->
    <div class="semester-tabs" role="tablist" aria-label="Semestry">
      <button
        v-for="(sem, idx) in mockSemesters"
        :key="sem.id"
        class="semester-tabs__tab"
        :class="{ 'semester-tabs__tab--active': activeSemesterId === idx }"
        role="tab"
        :aria-selected="activeSemesterId === idx"
        @click="activeSemesterId = idx; filters.semester = null"
      >
        {{ sem.label }}
      </button>
    </div>

    <!-- Stats strip -->
    <GradesStatsSummary :semester="currentSemester" />

    <!-- Filter bar + table card -->
    <div class="student-page__card">
      <GradesFilter v-model="filters" />

      <GradesTable
        :subjects="filteredSubjects"
        :loading="loading"
        :per-page="10"
      />
    </div>

    <footer class="student-page__footer">
      MeritoGOŁ • Panel studenta • Zalogowany jako
      <strong>{{ mockStudent.firstName }} {{ mockStudent.lastName }}</strong>
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
    display: flex;
    flex-direction: column;
    gap: 0;

    // filter gets padding, table sits flush
    > :first-child {
      padding: 14px 18px;
      border-bottom: 1px solid $color-border;
    }
  }

  &__footer {
    text-align: center;
    color: $color-ink-subtle;
    font-size: 12px;
    padding: 20px 0 40px;
  }
}

// ─── Semester tabs ─────────────────────────────────────────────────
.semester-tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  &__tab {
    padding: 10px 18px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    font-family: $font-sans;
    font-size: 13.5px;
    font-weight: 500;
    color: $color-ink-subtle;
    cursor: pointer;
    white-space: nowrap;
    transition: color $transition-base, border-color $transition-base;

    &:hover { color: $color-ink; }

    &--active {
      color: $color-ink-dark;
      font-weight: 700;
      border-bottom-color: $color-accent;
    }
  }
}
</style>
