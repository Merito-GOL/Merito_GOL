<script setup lang="ts">
import type { StudentSubject } from '~/types/grades'

interface Props {
  subjects: StudentSubject[]
  loading?: boolean
  perPage?: number
  page?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  perPage: 10,
  page: 1,
})

const expanded = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

const sortedSubjects = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.subjects].sort((a, b) => dir * a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }))
})

const paged = computed(() =>
  sortedSubjects.value.slice((props.page - 1) * props.perPage, props.page * props.perPage)
)

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

function toggleSort() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <div class="grades-table-wrap">
    <!-- Skeleton -->
    <template v-if="loading">
      <div class="grades-skeleton">
        <div class="grades-skeleton__header" />
        <div v-for="i in perPage" :key="i" class="grades-skeleton__row" />
      </div>
    </template>

    <template v-else>
      <!-- Empty -->
      <div v-if="!subjects.length" class="grades-empty">
        Brak przedmiotów spełniających kryteria wyszukiwania.
      </div>

      <!-- Table -->
      <div v-else class="grades-table-scroll">
        <table class="grades-table" role="table">
          <thead>
            <tr class="grades-table__head-row">
              <th class="grades-table__th grades-table__th--toggle" />
              <th class="grades-table__th">
                <button
                  class="grades-table__sort-btn"
                  type="button"
                  :aria-label="sortDir === 'asc' ? 'Sortuj: A do Z' : 'Sortuj: Z do A'"
                  @click="toggleSort"
                >
                  <span>Nazwa przedmiotu</span>
                  <span class="grades-table__sort-icon">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                </button>
              </th>
              <th class="grades-table__th grades-table__th--num">Liczba godzin</th>
              <th class="grades-table__th grades-table__th--num">Punkty ECTS</th>
              <th class="grades-table__th grades-table__th--num">Ocena</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="s in paged" :key="s.id">
              <!-- Main row -->
              <tr
                class="grades-table__row"
                :class="{ 'grades-table__row--open': expanded === s.id }"
                @click="toggle(s.id)"
              >
                <td class="grades-table__td grades-table__td--toggle">
                  <button
                    class="grades-table__toggle-btn"
                    :aria-label="expanded === s.id ? 'Zwiń' : 'Rozwiń'"
                    @click.stop="toggle(s.id)"
                  >
                    {{ expanded === s.id ? '−' : '+' }}
                  </button>
                </td>
                <td class="grades-table__td">
                  <span class="grades-table__name">{{ s.name }}</span>
                </td>
                <td class="grades-table__td grades-table__td--num">{{ s.hours }}</td>
                <td class="grades-table__td grades-table__td--num grades-table__td--ects">{{ s.ects }}</td>
                <td class="grades-table__td grades-table__td--num">
                  <GradesBadge :grade="s.finalGrade" />
                </td>
              </tr>

              <!-- Detail row -->
              <Transition name="expand">
                <tr v-if="expanded === s.id" class="grades-table__detail-row">
                  <td colspan="5" class="grades-table__detail-cell">
                    <div class="grades-table__detail">
                      <div class="grades-table__detail-item">
                        <div class="grades-table__detail-label">Wykładowca</div>
                        <div class="grades-table__detail-value">{{ s.teacher }}</div>
                      </div>
                      <div class="grades-table__detail-item">
                        <div class="grades-table__detail-label">Data wpisu</div>
                        <div class="grades-table__detail-value">{{ s.date || '—' }}</div>
                      </div>
                      <div class="grades-table__detail-item">
                        <div class="grades-table__detail-label">Typ oceny</div>
                        <div class="grades-table__detail-value">Ocena końcowa</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Transition>
            </template>
          </tbody>
        </table>
      </div>

    </template>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grades-table-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}

// ─── Skeleton ──────────────────────────────────────────────────────
.grades-skeleton {
  &__header {
    height: 44px;
    background: $color-surface-muted;
    border-radius: 4px 4px 0 0;
    margin-bottom: 1px;
  }

  &__row {
    height: 52px;
    margin-bottom: 1px;
    background: linear-gradient(90deg, #f1f3f9 25%, #e8eaf0 50%, #f1f3f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ─── Empty ─────────────────────────────────────────────────────────
.grades-empty {
  padding: 40px;
  text-align: center;
  color: $color-ink-subtle;
  font-size: 14px;
}

// ─── Scroll wrapper ────────────────────────────────────────────────
.grades-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

// ─── Table ─────────────────────────────────────────────────────────
.grades-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;

  &__head-row {
    border-bottom: 1px solid $color-border;
  }

  &__th {
    padding: 13px 18px;
    text-align: left;
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    background: $color-surface-card;

    &--toggle { width: 50px; padding: 13px 8px 13px 18px; }
    &--num    { text-align: left; }
  }

  &__sort-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__sort-icon {
    font-size: 10px;
    line-height: 1;
  }

  &__row {
    cursor: pointer;
    transition: background $transition-base;
    border-bottom: 1px solid $color-border-light;

    &:hover     { background: $color-surface-hover; }
    &--open     { background: $color-surface-card; }
    &:last-child { border-bottom: none; }
  }

  &__td {
    padding: 13px 18px;
    color: $color-ink;
    vertical-align: middle;

    &--toggle { padding: 13px 8px 13px 18px; }
    &--num    { color: $color-ink-muted; }
    &--ects   { font-weight: 700; color: $color-ink-dark; }
  }

  &__toggle-btn {
    width: 22px;
    height: 22px;
    border: 1.5px solid $color-border-input;
    background: $color-surface-card;
    border-radius: 5px;
    cursor: pointer;
    color: $color-ink-muted;
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-sans;
    transition: background $transition-base, border-color $transition-base;

    &:hover { background: $color-surface-muted; border-color: $color-ink-subtle; }
  }

  &__name {
    font-weight: 500;
    color: $color-ink;
  }

  // ─── Detail ────────────────────────────────────────────────────
  &__detail-row { background: $color-surface; }

  &__detail-cell { padding: 0 18px 0px 56px; }

  &__detail {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    font-size: 13px;
    padding: 16px 0;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__detail-label {
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }

  &__detail-value {
    font-weight: 600;
    color: $color-ink;
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
