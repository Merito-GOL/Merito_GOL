<script setup lang="ts">
import type { GradeFilterState } from '~/types/grades'
import { mockSubjects, mockSemesters, mockStudent } from '~/data/mockGrades'
import type { MockSubject } from '~/data/mockGrades'

definePageMeta({ layout: 'student' })

const filters = ref<GradeFilterState>({ search: '' })
const loading = ref(false)
const subjects = ref<MockSubject[]>([])
const page = ref(1)
const perPage = 10

onMounted(async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  subjects.value = mockSubjects.filter(s => s.semester === mockStudent.currentSemester)
  loading.value = false
})

const currentSemester = computed(() => mockSemesters[0])

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
  }

  &__footer {
    text-align: center;
    color: $color-ink-subtle;
    font-size: 12px;
    padding: 20px 0 40px;
  }
}

</style>
