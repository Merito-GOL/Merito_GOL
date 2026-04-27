<script setup lang="ts">
import type { GradeFilterState, GradeType, Semester, GradeValue } from '~/types/grades'
import { GRADE_TYPE_LABELS, SEMESTER_OPTIONS } from '~/data/mockGrades'

const model = defineModel<GradeFilterState>({ required: true })

const gradeValueOptions: GradeValue[] = [2, 3, 3.5, 4, 4.5, 5]

const gradeTypeOptions = Object.entries(GRADE_TYPE_LABELS).map(([value, label]) => ({
  value: value as GradeType,
  label,
}))

function clearFilters() {
  model.value = { search: '', semester: null, type: null, minGrade: null }
}

const hasActiveFilters = computed(() =>
  !!model.value.search ||
  model.value.semester !== null ||
  model.value.type !== null ||
  model.value.minGrade !== null
)
</script>

<template>
  <div class="grades-filter">
    <div class="grades-filter__row">
      <!-- Search -->
      <div class="grades-filter__search-wrapper">
        <SidebarIcon name="search" class="grades-filter__search-icon" />
        <input
          v-model="model.search"
          type="search"
          class="grades-filter__search"
          placeholder="Szukaj przedmiotu lub nauczyciela…"
          aria-label="Szukaj"
        />
      </div>

      <!-- Semester -->
      <select
        v-model="model.semester"
        class="grades-filter__select"
        aria-label="Semestr"
      >
        <option :value="null">Wszystkie semestry</option>
        <option v-for="s in SEMESTER_OPTIONS" :key="s" :value="s">
          Semestr {{ s }}
        </option>
      </select>

      <!-- Grade type -->
      <select
        v-model="model.type"
        class="grades-filter__select"
        aria-label="Typ oceny"
      >
        <option :value="null">Wszystkie typy</option>
        <option v-for="opt in gradeTypeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <!-- Min grade -->
      <select
        v-model="model.minGrade"
        class="grades-filter__select"
        aria-label="Minimalna ocena"
      >
        <option :value="null">Min. ocena</option>
        <option v-for="g in gradeValueOptions" :key="g" :value="g">
          ≥ {{ g }}
        </option>
      </select>

      <!-- Clear -->
      <Transition name="fade">
        <button
          v-if="hasActiveFilters"
          class="grades-filter__clear"
          aria-label="Wyczyść filtry"
          @click="clearFilters"
        >
          <SidebarIcon name="x" />
          <span>Wyczyść</span>
        </button>
      </Transition>
    </div>

    <!-- Active filter chips -->
    <div v-if="hasActiveFilters" class="grades-filter__chips">
      <span v-if="model.search" class="grades-filter__chip">
        "{{ model.search }}"
        <button class="grades-filter__chip-remove" @click="model.search = ''">
          <SidebarIcon name="x" />
        </button>
      </span>
      <span v-if="model.semester !== null" class="grades-filter__chip">
        Semestr {{ model.semester }}
        <button class="grades-filter__chip-remove" @click="model.semester = null">
          <SidebarIcon name="x" />
        </button>
      </span>
      <span v-if="model.type !== null" class="grades-filter__chip">
        {{ GRADE_TYPE_LABELS[model.type] }}
        <button class="grades-filter__chip-remove" @click="model.type = null">
          <SidebarIcon name="x" />
        </button>
      </span>
      <span v-if="model.minGrade !== null" class="grades-filter__chip">
        Min. {{ model.minGrade }}
        <button class="grades-filter__chip-remove" @click="model.minGrade = null">
          <SidebarIcon name="x" />
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grades-filter {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  &__search-wrapper {
    position: relative;
    flex: 1;
    min-width: 220px;
  }

  &__search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: $color-ink-subtle;
    pointer-events: none;
    width: 16px;
    height: 16px;
  }

  &__search {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff;
    font-size: 0.875rem;
    color: $color-ink;
    outline: none;
    transition: border-color $transition-base, box-shadow $transition-base;

    &::placeholder { color: $color-ink-subtle; }

    &:focus {
      border-color: $color-brand-600;
      box-shadow: 0 0 0 3px rgba($color-brand-600, 0.12);
    }

    &::-webkit-search-cancel-button { cursor: pointer; }
  }

  &__select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
    appearance: none;
    font-size: 0.875rem;
    color: $color-ink;
    cursor: pointer;
    outline: none;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:focus {
      border-color: $color-brand-600;
      box-shadow: 0 0 0 3px rgba($color-brand-600, 0.12);
    }
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.875rem;
    border: 1px solid #fecaca;
    border-radius: 10px;
    background: #fff;
    color: #dc2626;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background $transition-base, color $transition-base;

    svg { width: 14px; height: 14px; }

    &:hover { background: #fee2e2; }
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.5rem 0.2rem 0.75rem;
    background: #ede9fe;
    color: $color-brand-600;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  &__chip-remove {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    opacity: 0.7;
    transition: opacity $transition-base;

    svg { width: 12px; height: 12px; }

    &:hover { opacity: 1; }
  }
}

// Responsive
@media (max-width: 640px) {
  .grades-filter__search-wrapper { min-width: 100%; }
  .grades-filter__select { flex: 1; min-width: 140px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition-base; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
