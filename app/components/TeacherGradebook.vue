<script setup lang="ts">
import type { TeachingAssignment, RosterStudent, GradeOption } from '~/types/grades'
import { GRADE_OPTIONS } from '~/types/grades'

interface Props {
  assignment: TeachingAssignment
  roster: RosterStudent[]
}

const props = defineProps<Props>()
defineEmits<{ back: [] }>()

const search = ref('')
const grades = ref<Record<string, GradeOption>>({})
const savedAt = ref<Date | null>(null)

onMounted(() => {
  props.roster.forEach((s, i) => {
    grades.value[s.id] = i < 4 ? (['5,0', '4,5', '4,0', '3,5'] as GradeOption[])[i] : '—'
  })
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return props.roster.filter(s =>
    s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
  )
})

const numericGrades = computed(() =>
  Object.values(grades.value)
    .filter(g => g !== '—')
    .map(g => parseFloat(g.replace(',', '.')))
)

const avg = computed(() => {
  if (!numericGrades.value.length) return '—'
  return (numericGrades.value.reduce((a, b) => a + b, 0) / numericGrades.value.length)
    .toFixed(2).replace('.', ',')
})

const filled = computed(() => numericGrades.value.length)

function save() {
  savedAt.value = new Date()
  setTimeout(() => { savedAt.value = null }, 3500)
}
</script>

<template>
  <div class="gradebook">
    <!-- Stats strip -->
    <div class="gradebook__stats">
      <div class="gradebook__stat">
        <div class="gradebook__stat-label">Grupa</div>
        <div class="gradebook__stat-value">{{ assignment.group }}</div>
      </div>
      <div class="gradebook__stat">
        <div class="gradebook__stat-label">ECTS</div>
        <div class="gradebook__stat-value">{{ assignment.ects }}</div>
      </div>
      <div class="gradebook__stat">
        <div class="gradebook__stat-label">Wystawione</div>
        <div class="gradebook__stat-value" :class="{ 'gradebook__stat-value--done': filled === roster.length }">
          {{ filled }} / {{ roster.length }}
        </div>
      </div>
      <div class="gradebook__stat">
        <div class="gradebook__stat-label">Średnia grupy</div>
        <div class="gradebook__stat-value">{{ avg }}</div>
      </div>
      <button class="gradebook__back-btn" type="button" @click="$emit('back')">
        ← Inny przedmiot
      </button>
    </div>

    <!-- Toolbar -->
    <div class="gradebook__toolbar">
      <div class="gradebook__search-wrap">
        <svg class="gradebook__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="search"
          class="gradebook__search-input"
          placeholder="Szukaj studenta lub nr albumu"
        />
      </div>
      <div class="gradebook__toolbar-spacer" />
      <Transition name="fade">
        <span v-if="savedAt" class="gradebook__saved">
          ✓ Zapisano {{ savedAt.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </Transition>
      <button class="gradebook__save-btn" type="button" @click="save">
        Zapisz oceny
      </button>
    </div>

    <!-- Roster table -->
    <div class="gradebook__table">
      <div class="gradebook__table-header">
        <span>Nr albumu</span>
        <span>Student</span>
        <span>Ocena końcowa</span>
      </div>

      <div v-if="!filtered.length" class="gradebook__empty">
        Brak studentów spełniających kryteria wyszukiwania.
      </div>

      <div
        v-for="(s, i) in filtered"
        :key="s.id"
        class="gradebook__row"
        :class="{ 'gradebook__row--pending': grades[s.id] === '—' }"
      >
        <span class="gradebook__album">{{ s.id }}</span>
        <span class="gradebook__student-name">{{ s.name }}</span>
        <div class="gradebook__grade-btns">
          <button
            v-for="opt in GRADE_OPTIONS"
            :key="opt"
            class="gradebook__grade-btn"
            :class="{
              'gradebook__grade-btn--active': grades[s.id] === opt,
              'gradebook__grade-btn--empty': opt === '—',
            }"
            type="button"
            @click="grades[s.id] = opt"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <div class="gradebook__footer">
      <span>Łącznie studentów: <strong>{{ roster.length }}</strong></span>
      <span>Wpisz oceny i kliknij <strong>Zapisz oceny</strong>, aby je opublikować.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

// ─── Stats strip ───────────────────────────────────────────────────
.gradebook {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__stats {
    background: $color-surface-card;
    border: 1px solid $color-border;
    border-radius: $border-radius-card;
    padding: 18px 22px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    gap: 24px;
    align-items: center;

    @media (max-width: 700px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__stat-label {
    font-size: 11px;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }

  &__stat-value {
    font-weight: 700;
    font-size: 15px;
    color: $color-ink;

    &--done { color: $grade-high-fg; }
  }

  &__back-btn {
    background: $color-surface-card;
    border: 1.5px solid $color-accent;
    color: $color-accent;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    font-family: $font-sans;
    cursor: pointer;
    white-space: nowrap;
    transition: background $transition-base;

    &:hover { background: #f0f5ff; }
  }

  // ─── Toolbar ───────────────────────────────────────────────────
  &__toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

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

  &__search-input {
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

  &__toolbar-spacer { flex: 1; }

  &__saved {
    font-size: 13px;
    color: $grade-high-fg;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__save-btn {
    background: $color-ink-dark;
    border: none;
    color: #fff;
    padding: 10px 22px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13.5px;
    font-family: $font-sans;
    cursor: pointer;
    transition: background $transition-base;

    &:hover { background: $color-ink; }
  }

  // ─── Roster table ──────────────────────────────────────────────
  &__table {
    background: $color-surface-card;
    border: 1px solid $color-border;
    border-radius: $border-radius-card;
    overflow: hidden;
  }

  &__table-header {
    display: grid;
    grid-template-columns: 120px 1fr 260px;
    padding: 13px 18px;
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid $color-border;
  }

  &__empty {
    padding: 40px;
    text-align: center;
    color: $color-ink-subtle;
    font-size: 14px;
  }

  &__row {
    display: grid;
    grid-template-columns: 120px 1fr 260px;
    padding: 12px 18px;
    font-size: 13.5px;
    align-items: center;
    border-bottom: 1px solid $color-border-light;
    transition: background $transition-base;

    &:last-child { border-bottom: none; }
    &--pending { background: #fafbfe; }
  }

  &__album {
    color: $color-ink-faint;
    font-variant-numeric: tabular-nums;
  }

  &__student-name {
    font-weight: 500;
    color: $color-ink;
  }

  &__grade-btns {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  &__grade-btn {
    min-width: 32px;
    height: 30px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid $color-border-input;
    background: $color-surface-card;
    color: $color-ink;
    font-weight: 500;
    font-size: 13px;
    font-family: $font-sans;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: background $transition-base, border-color $transition-base, color $transition-base;

    &:hover { background: $color-surface-muted; }

    &--active {
      background: $color-ink-dark;
      border-color: $color-ink-dark;
      color: #fff;
      font-weight: 700;
    }

    &--empty {
      color: $color-ink-subtle;

      &.gradebook__grade-btn--active {
        background: $color-ink-dark;
        color: #fff;
      }
    }
  }

  // ─── Footer ────────────────────────────────────────────────────
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 4px;
    font-size: 13px;
    color: $color-ink-faint;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition-base; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
