<script setup lang="ts">
import type { GradeFilterState } from '~/types/grades'

const props = withDefaults(defineProps<{ maxSemester?: number | null }>(), {
  maxSemester: null,
})

const model = defineModel<GradeFilterState>({ required: true })

const showFilters = ref(false)

const semesterOptions = computed(() => {
  const max = typeof props.maxSemester === 'number' && Number.isFinite(props.maxSemester)
    ? Math.max(1, Math.min(8, props.maxSemester))
    : 8

  return Array.from({ length: max }, (_, i) => i + 1)
})

const semesterValue = computed({
  get: () => (model.value.semester ? String(model.value.semester) : 'all'),
  set: (value: string) => {
    model.value.semester = value === 'all' ? null : Number(value) as GradeFilterState['semester']
  },
})
</script>

<template>
  <div class="grades-filter">
    <div class="grades-filter__bar">
      <div class="grades-filter__search-wrap">
        <svg class="grades-filter__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="model.search"
          type="search"
          class="grades-filter__input"
          placeholder="Nazwa przedmiotu"
          aria-label="Szukaj przedmiotu"
        />
      </div>

      <button class="grades-filter__btn grades-filter__btn--filters" type="button" @click="showFilters = !showFilters">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        {{ showFilters ? 'Ukryj filtry' : 'Pokaż filtry' }}
      </button>

      <Transition name="fade">
        <button
          v-if="model.search"
          class="grades-filter__btn grades-filter__btn--clear"
          type="button"
          @click="model.search = ''"
        >
          Wyczyść
        </button>
      </Transition>
    </div>

    <Transition name="expand">
      <div v-if="showFilters" class="grades-filter__panel" role="group" aria-label="Filtry">
        <label class="grades-filter__field">
          <span class="grades-filter__label">Semestr</span>
          <select v-model="semesterValue" class="grades-filter__select">
            <option value="all">Wszystkie</option>
            <option v-for="n in semesterOptions" :key="n" :value="String(n)">{{ n }}</option>
          </select>
        </label>

        <label class="grades-filter__field">
          <span class="grades-filter__label">Ocena</span>
          <select v-model="model.gradeStatus" class="grades-filter__select">
            <option value="all">Wszystkie</option>
            <option value="graded">Tylko ocenione</option>
            <option value="missing">Bez oceny</option>
          </select>
        </label>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grades-filter {
  &__bar {
    display: flex;
    gap: 8px;
    align-items: center;
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

  &__input {
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

    &::-webkit-search-cancel-button { cursor: pointer; }
  }

  &__btn {
    height: 40px;
    padding: 0 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: $font-sans;
    cursor: pointer;
    border: none;
    transition: background $transition-base, transform 50ms;
    white-space: nowrap;

    &:active:not(:disabled) { transform: translateY(1px); }
    &:disabled { opacity: 0.6; cursor: default; }

    &--filters {
      background: $color-surface-card;
      color: $color-ink;
      border: 1.5px solid $color-accent;
      display: inline-flex;
      align-items: center;
      gap: 7px;

      &:hover:not(:disabled) { background: #f0f5ff; }
    }

    &--clear {
      background: transparent;
      color: $color-ink-subtle;
      border: 1px solid $color-border-input;
      font-weight: 500;

      &:hover { color: $color-ink; background: $color-surface-muted; }
    }
  }

  &__panel {
    margin-top: 10px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  &__field {
    display: grid;
    gap: 6px;
    min-width: 180px;
  }

  &__label {
    font-size: 11px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__select {
    height: 40px;
    padding: 0 12px;
    border: 1.5px solid $color-border-input;
    border-radius: $border-radius-btn;
    background: $color-surface-card;
    color: $color-ink;
    font-family: $font-sans;
    font-size: 14px;
    outline: none;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:focus {
      border-color: $color-ink-dark;
      box-shadow: 0 0 0 4px rgba(11, 23, 51, 0.08);
    }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition-base; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.expand-enter-active, .expand-leave-active { transition: max-height $transition-base, opacity $transition-base; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to, .expand-leave-from { max-height: 120px; opacity: 1; }
</style>
