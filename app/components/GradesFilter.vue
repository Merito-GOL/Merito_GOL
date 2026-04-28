<script setup lang="ts">
import type { GradeFilterState } from '~/types/grades'

const model = defineModel<GradeFilterState>({ required: true })
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

      <button class="grades-filter__btn grades-filter__btn--search" type="button">
        Szukaj
      </button>

      <button class="grades-filter__btn grades-filter__btn--filters" type="button" disabled>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        Pokaż filtry
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

    &--search {
      background: #dbe4f3;
      color: $color-ink;

      &:hover { background: darken(#dbe4f3, 5%); }
    }

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
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition-base; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
