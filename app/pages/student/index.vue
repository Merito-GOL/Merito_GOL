<script setup lang="ts">
import type { GradeFilterState, Subject } from '~/types/grades'
import { mockSubjects, mockStudent } from '~/data/mockGrades'

definePageMeta({ layout: 'student' })

type ViewMode = 'table' | 'cards'

const viewMode = ref<ViewMode>('table')

const filters = ref<GradeFilterState>({
  search:    '',
  semester:  null,
  type:      null,
  minGrade:  null,
})

const loading = ref(false)
const subjects = ref<Subject[]>([])

// Simulate async fetch
onMounted(async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  subjects.value = mockSubjects
  loading.value = false
})

const filteredSubjects = computed<Subject[]>(() => {
  let result = subjects.value

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.teacherName.toLowerCase().includes(q)
    )
  }

  if (filters.value.semester !== null) {
    result = result.filter(s => s.semester === filters.value.semester)
  }

  if (filters.value.type !== null) {
    result = result.filter(s =>
      s.grades.some(g => g.type === filters.value.type)
    )
  }

  if (filters.value.minGrade !== null) {
    result = result.filter(s =>
      s.finalGrade !== null && s.finalGrade >= (filters.value.minGrade as number)
    )
  }

  return result
})

function handleCardClick(id: string) {
  // Future: navigate to detail or expand
  console.log('Subject clicked:', id)
}
</script>

<template>
  <div class="student-page">
    <!-- Page header -->
    <header class="student-page__header">
      <div class="student-page__header-text">
        <h1 class="student-page__title">Moje oceny</h1>
        <p class="student-page__subtitle">
          {{ mockStudent.firstName }} {{ mockStudent.lastName }}
          · Nr albumu {{ mockStudent.albumNumber }}
          · {{ mockStudent.program }}
        </p>
      </div>

      <!-- View toggle -->
      <div class="student-page__view-toggle" role="group" aria-label="Widok">
        <button
          class="student-page__view-btn"
          :class="{ 'student-page__view-btn--active': viewMode === 'table' }"
          aria-label="Widok tabeli"
          @click="viewMode = 'table'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="3" y1="6"  x2="21" y2="6"  /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          class="student-page__view-btn"
          :class="{ 'student-page__view-btn--active': viewMode === 'cards' }"
          aria-label="Widok kart"
          @click="viewMode = 'cards'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3"  y="3"  width="7" height="7" rx="1" /><rect x="14" y="3"  width="7" height="7" rx="1" />
            <rect x="3"  y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Stats -->
    <section aria-label="Statystyki" class="student-page__section">
      <GradesStatsSummary :subjects="subjects" />
    </section>

    <!-- Filters + content card -->
    <section class="student-page__section student-page__content-card">
      <div class="student-page__content-header">
        <h2 class="student-page__section-title">
          Przedmioty
          <span v-if="!loading" class="student-page__count">
            {{ filteredSubjects.length }} z {{ subjects.length }}
          </span>
        </h2>
      </div>

      <GradesFilter v-model="filters" />

      <div class="student-page__table-area">
        <!-- Table view -->
        <Transition name="view-switch" mode="out-in">
          <GradesTable
            v-if="viewMode === 'table'"
            :subjects="filteredSubjects"
            :loading="loading"
          />

          <!-- Cards view -->
          <div v-else class="student-page__cards-grid">
            <template v-if="loading">
              <div v-for="i in 6" :key="i" class="student-page__card-skeleton" />
            </template>
            <template v-else-if="filteredSubjects.length">
              <GradesSubjectCard
                v-for="subject in filteredSubjects"
                :key="subject.id"
                :subject="subject"
                @click="handleCardClick"
              />
            </template>
            <div v-else class="student-page__cards-empty">
              <p>Brak wyników dla podanych filtrów.</p>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.student-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__header-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    color: $color-ink;
    letter-spacing: -0.03em;
  }

  &__subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: $color-ink-muted;
  }

  // ─── View toggle ─────────────────────────────────────────────
  &__view-toggle {
    display: flex;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    padding: 2px;
    gap: 2px;
  }

  &__view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: $color-ink-subtle;
    border-radius: 8px;
    cursor: pointer;
    transition: background $transition-base, color $transition-base;

    &:hover { background: #f1f5f9; color: $color-ink; }

    &--active {
      background: $color-brand-600;
      color: #fff;

      &:hover { background: $color-brand-700; }
    }
  }

  // ─── Section ──────────────────────────────────────────────────
  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__content-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: $border-radius-card;
    padding: 1.5rem;
    gap: 1rem;
  }

  &__content-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__section-title {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 700;
    color: $color-ink;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__count {
    font-size: 0.8125rem;
    font-weight: 500;
    color: $color-ink-subtle;
    background: $color-surface-muted;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
  }

  &__table-area {
    margin-top: 0.25rem;
  }

  // ─── Cards grid ───────────────────────────────────────────────
  &__cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  &__card-skeleton {
    height: 178px;
    border-radius: $border-radius-card;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  &__cards-empty {
    grid-column: 1 / -1;
    text-align: center;
    color: $color-ink-muted;
    padding: 3rem 1rem;
    font-size: 0.875rem;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ─── View switch transition ────────────────────────────────────────
.view-switch-enter-active,
.view-switch-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.view-switch-enter-from { opacity: 0; transform: translateY(6px); }
.view-switch-leave-to   { opacity: 0; transform: translateY(-4px); }

// ─── Responsive ───────────────────────────────────────────────────
@media (max-width: 640px) {
  .student-page__title { font-size: 1.375rem; }
  .student-page__content-card { padding: 1rem; }
}
</style>
