<script setup lang="ts">
import type { Subject } from '~/types/grades'
import { GRADE_TYPE_LABELS, computeAverage } from '~/data/mockGrades'

interface Props {
  subjects: Subject[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

type SortKey = 'name' | 'semester' | 'ects' | 'average' | 'finalGrade'
type SortDir = 'asc' | 'desc'

const sortKey = ref<SortKey>('semester')
const sortDir = ref<SortDir>('asc')
const expandedSubjectId = ref<string | null>(null)

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function toggleExpand(id: string) {
  expandedSubjectId.value = expandedSubjectId.value === id ? null : id
}

const sorted = computed(() => {
  return [...props.subjects].sort((a, b) => {
    let va: number | string = 0
    let vb: number | string = 0

    switch (sortKey.value) {
      case 'name':       va = a.name;       vb = b.name;       break
      case 'semester':   va = a.semester;   vb = b.semester;   break
      case 'ects':       va = a.ects;       vb = b.ects;       break
      case 'average':    va = computeAverage(a.grades); vb = computeAverage(b.grades); break
      case 'finalGrade': va = a.finalGrade ?? 0; vb = b.finalGrade ?? 0; break
    }

    const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
    return sortDir.value === 'asc' ? cmp : -cmp
  })
})

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr))
}
</script>

<template>
  <div class="grades-table-wrapper">
    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="grades-table-skeleton">
        <div v-for="i in 5" :key="i" class="grades-table-skeleton__row" />
      </div>
    </template>

    <!-- Empty state -->
    <div v-else-if="!subjects.length" class="grades-table-empty">
      <SidebarIcon name="filter" class="grades-table-empty__icon" />
      <p class="grades-table-empty__title">Brak wyników</p>
      <p class="grades-table-empty__subtitle">Zmień kryteria filtrowania</p>
    </div>

    <!-- Table -->
    <div v-else class="grades-table-scroll" role="region" aria-label="Tabela ocen">
      <table class="grades-table">
        <thead>
          <tr>
            <th class="grades-table__th grades-table__th--expand" aria-label="Rozwiń" />
            <th
              class="grades-table__th grades-table__th--sortable"
              :class="{ 'grades-table__th--sorted': sortKey === 'name' }"
              @click="setSort('name')"
            >
              Przedmiot
              <SidebarIcon :name="sortKey === 'name' && sortDir === 'desc' ? 'chevron-up' : 'chevron-down'" class="grades-table__sort-icon" />
            </th>
            <th
              class="grades-table__th grades-table__th--sortable grades-table__th--center"
              :class="{ 'grades-table__th--sorted': sortKey === 'semester' }"
              @click="setSort('semester')"
            >
              Sem.
              <SidebarIcon :name="sortKey === 'semester' && sortDir === 'desc' ? 'chevron-up' : 'chevron-down'" class="grades-table__sort-icon" />
            </th>
            <th
              class="grades-table__th grades-table__th--sortable grades-table__th--center"
              :class="{ 'grades-table__th--sorted': sortKey === 'ects' }"
              @click="setSort('ects')"
            >
              ECTS
              <SidebarIcon :name="sortKey === 'ects' && sortDir === 'desc' ? 'chevron-up' : 'chevron-down'" class="grades-table__sort-icon" />
            </th>
            <th
              class="grades-table__th grades-table__th--sortable grades-table__th--center"
              :class="{ 'grades-table__th--sorted': sortKey === 'average' }"
              @click="setSort('average')"
            >
              Średnia
              <SidebarIcon :name="sortKey === 'average' && sortDir === 'desc' ? 'chevron-up' : 'chevron-down'" class="grades-table__sort-icon" />
            </th>
            <th
              class="grades-table__th grades-table__th--sortable grades-table__th--center"
              :class="{ 'grades-table__th--sorted': sortKey === 'finalGrade' }"
              @click="setSort('finalGrade')"
            >
              Ocena końcowa
              <SidebarIcon :name="sortKey === 'finalGrade' && sortDir === 'desc' ? 'chevron-up' : 'chevron-down'" class="grades-table__sort-icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="subject in sorted" :key="subject.id">
            <!-- Main row -->
            <tr
              class="grades-table__row"
              :class="{ 'grades-table__row--expanded': expandedSubjectId === subject.id }"
              @click="toggleExpand(subject.id)"
            >
              <td class="grades-table__td grades-table__td--expand">
                <button class="grades-table__expand-btn" :aria-label="expandedSubjectId === subject.id ? 'Zwiń' : 'Rozwiń'">
                  <SidebarIcon :name="expandedSubjectId === subject.id ? 'chevron-up' : 'chevron-down'" />
                </button>
              </td>
              <td class="grades-table__td">
                <div class="grades-table__subject-name">{{ subject.name }}</div>
                <div class="grades-table__subject-meta">{{ subject.code }} · {{ subject.teacherName }}</div>
              </td>
              <td class="grades-table__td grades-table__td--center">
                <span class="grades-table__semester-badge">{{ subject.semester }}</span>
              </td>
              <td class="grades-table__td grades-table__td--center">
                <span class="grades-table__ects">{{ subject.ects }}</span>
              </td>
              <td class="grades-table__td grades-table__td--center">
                <span class="grades-table__average">
                  {{ subject.grades.length ? computeAverage(subject.grades).toFixed(2) : '—' }}
                </span>
              </td>
              <td class="grades-table__td grades-table__td--center">
                <GradesBadge :value="subject.finalGrade" size="md" />
              </td>
            </tr>

            <!-- Expanded detail row -->
            <Transition name="expand">
              <tr v-if="expandedSubjectId === subject.id" class="grades-table__detail-row">
                <td colspan="6" class="grades-table__detail-cell">
                  <div class="grades-table__detail">
                    <p v-if="!subject.grades.length" class="grades-table__detail-empty">
                      Brak cząstkowych ocen
                    </p>
                    <table v-else class="grades-table__detail-table">
                      <thead>
                        <tr>
                          <th>Opis</th>
                          <th>Typ</th>
                          <th>Data</th>
                          <th>Ocena</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="grade in subject.grades" :key="grade.id">
                          <td>{{ grade.description }}</td>
                          <td>
                            <span class="grades-table__type-pill">{{ GRADE_TYPE_LABELS[grade.type] }}</span>
                          </td>
                          <td class="grades-table__date">{{ formatDate(grade.date) }}</td>
                          <td><GradesBadge :value="grade.value" size="sm" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </Transition>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grades-table-wrapper {
  width: 100%;
}

// ─── Skeleton ──────────────────────────────────────────────────────
.grades-table-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__row {
    height: 56px;
    border-radius: 10px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ─── Empty state ───────────────────────────────────────────────────
.grades-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 0.5rem;

  &__icon {
    width: 40px;
    height: 40px;
    color: $color-ink-subtle;
    margin-bottom: 0.5rem;
  }

  &__title    { font-size: 1rem; font-weight: 600; color: $color-ink; margin: 0; }
  &__subtitle { font-size: 0.875rem; color: $color-ink-muted; margin: 0; }
}

// ─── Scroll wrapper ────────────────────────────────────────────────
.grades-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
}

// ─── Table ─────────────────────────────────────────────────────────
.grades-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  &__th {
    padding: 0.625rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: $color-ink-muted;
    white-space: nowrap;
    border-bottom: 1px solid #f1f5f9;
    user-select: none;

    &--sortable {
      cursor: pointer;
      display: table-cell;

      &:hover { color: $color-ink; }
    }

    &--sorted { color: $color-brand-600; }
    &--center { text-align: center; }
    &--expand { width: 40px; padding: 0 0.5rem; }
  }

  &__sort-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin-left: 4px;
    opacity: 0.6;
  }

  &__row {
    cursor: pointer;
    transition: background $transition-base;
    border-bottom: 1px solid #f8fafc;

    &:hover { background: #f8fafc; }

    &--expanded {
      background: #f5f3ff;

      &:hover { background: #f5f3ff; }
    }
  }

  &__td {
    padding: 0.875rem 1rem;
    vertical-align: middle;

    &--center { text-align: center; }
    &--expand { padding: 0 0.5rem; }
  }

  &__expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: $color-ink-muted;
    border-radius: 6px;
    cursor: pointer;
    transition: background $transition-base;

    svg { width: 14px; height: 14px; }

    &:hover { background: #e2e8f0; }
  }

  &__subject-name {
    font-weight: 600;
    color: $color-ink;
    margin-bottom: 2px;
  }

  &__subject-meta {
    font-size: 0.75rem;
    color: $color-ink-subtle;
  }

  &__semester-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #ede9fe;
    color: $color-brand-600;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  &__ects {
    font-weight: 600;
    color: $color-ink-muted;
  }

  &__average {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: $color-ink;
  }

  // ─── Detail row ───────────────────────────────────────────────
  &__detail-row { background: #faf8ff; }

  &__detail-cell {
    padding: 0 1rem 1.25rem 1rem;
  }

  &__detail {
    padding: 0.75rem;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #ede9fe;
  }

  &__detail-empty {
    color: $color-ink-subtle;
    font-size: 0.875rem;
    margin: 0;
  }

  &__detail-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;

    th {
      padding: 0.375rem 0.75rem;
      text-align: left;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: $color-ink-subtle;
      border-bottom: 1px solid #f1f5f9;
    }

    td {
      padding: 0.5rem 0.75rem;
      color: $color-ink;
      border-bottom: 1px solid #f8fafc;

      &:last-child { border-bottom: none; }
    }

    tr:last-child td { border-bottom: none; }
  }

  &__type-pill {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    background: #f1f5f9;
    color: $color-ink-muted;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  &__date {
    color: $color-ink-muted;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}

// ─── Expand transition ─────────────────────────────────────────────
.expand-enter-active,
.expand-leave-active {
  transition: opacity $transition-base;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
