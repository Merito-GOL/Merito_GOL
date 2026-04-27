<script setup lang="ts">
import type { MockSemester } from '~/data/mockGrades'

defineProps<{ semester: MockSemester }>()
</script>

<template>
  <div class="stats-strip">
    <div class="stats-strip__item">
      <span class="stats-strip__label">Średnia semestru</span>
      <span class="stats-strip__value">{{ semester.avgSem.toFixed(2).replace('.', ',') }}</span>
    </div>
    <div class="stats-strip__divider" />
    <div class="stats-strip__item">
      <span class="stats-strip__label">Średnia roku</span>
      <span class="stats-strip__value">{{ semester.avgYear.toFixed(2).replace('.', ',') }}</span>
    </div>
    <div class="stats-strip__divider" />
    <div class="stats-strip__item">
      <span class="stats-strip__label">Średnia ogólna</span>
      <span class="stats-strip__value">{{ semester.avgAll.toFixed(2).replace('.', ',') }}</span>
    </div>
    <div class="stats-strip__divider" />
    <div class="stats-strip__item">
      <span class="stats-strip__label">Status</span>
      <span
        class="stats-strip__status"
        :class="semester.status === 'zaliczony' ? 'stats-strip__status--ok' : 'stats-strip__status--warn'"
      >
        {{ semester.status }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.stats-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background: $color-surface-card;
  border: 1px solid $color-border;
  border-radius: $border-radius-card;
  padding: 14px 22px;
  font-size: 13px;
  gap: 0;

  &__divider {
    width: 1px;
    height: 28px;
    background: $color-border;
    margin: 0 20px;

    @media (max-width: 600px) { display: none; }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 600px) {
      flex: 1 1 45%;
      padding: 6px 0;
    }
  }

  &__label {
    color: $color-ink-subtle;
    white-space: nowrap;
  }

  &__value {
    font-weight: 700;
    font-size: 15px;
    color: $color-ink;
    font-variant-numeric: tabular-nums;
  }

  &__status {
    padding: 2px 8px;
    border-radius: $border-radius-chip;
    font-weight: 500;
    font-size: 12.5px;

    &--ok   { background: $grade-high-bg; color: $grade-high-fg; border: 1px solid $grade-high-border; }
    &--warn { background: $grade-low-bg;  color: $grade-low-fg;  border: 1px solid $grade-low-border; }
  }
}
</style>
