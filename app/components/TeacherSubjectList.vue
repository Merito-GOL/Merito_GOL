<script setup lang="ts">
import type { TeachingAssignment } from '~/types/grades'

defineProps<{ assignments: TeachingAssignment[] }>()
defineEmits<{ select: [assignment: TeachingAssignment] }>()
</script>

<template>
  <div class="subject-list">
    <div class="subject-list__header">
      <span>Przedmiot</span>
      <span>Grupa</span>
      <span>Studentów</span>
      <span />
    </div>

    <div v-if="!assignments.length" class="subject-list__empty">
      Brak przypisanych przedmiotów.
    </div>

    <div
      v-for="a in assignments"
      :key="a.id"
      class="subject-list__row"
      @click="$emit('select', a)"
    >
      <span class="subject-list__name">{{ a.name }}</span>
      <span class="subject-list__group">{{ a.group }}</span>
      <span class="subject-list__meta">{{ a.studentCount }}</span>
      <button class="subject-list__btn" type="button" @click.stop="$emit('select', a)">
        Wystawiaj oceny →
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.subject-list {
  background: $color-surface-card;
  border: 1px solid $color-border;
  border-radius: $border-radius-card;
  overflow: hidden;

  &__header {
    display: grid;
    grid-template-columns: 1fr 100px 100px 160px;
    padding: 13px 18px;
    font-size: 11.5px;
    font-weight: 700;
    color: $color-ink-subtle;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid $color-border;
    background: $color-surface-card;
  }

  &__empty {
    padding: 40px;
    text-align: center;
    color: $color-ink-subtle;
    font-size: 14px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 100px 100px 160px;
    padding: 14px 18px;
    align-items: center;
    border-bottom: 1px solid $color-border-light;
    cursor: pointer;
    transition: background $transition-base;

    &:last-child { border-bottom: none; }
    &:hover { background: $color-surface-hover; }
  }

  &__group {
    font-size: 13px;
    color: $color-ink-faint;
    font-variant-numeric: tabular-nums;
  }

  &__name {
    font-size: 13.5px;
    font-weight: 500;
    color: $color-ink;
  }

  &__meta {
    font-size: 13px;
    font-weight: 700;
    color: $color-ink;
    font-variant-numeric: tabular-nums;
  }

  &__btn {
    background: transparent;
    border: none;
    color: $color-accent;
    padding: 0;
    font-size: 13px;
    font-weight: 600;
    font-family: $font-sans;
    cursor: pointer;
    white-space: nowrap;
    transition: color $transition-base;

    &:hover { color: darken(#1f6feb, 12%); }
  }
}
</style>
