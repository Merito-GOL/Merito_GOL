<script setup lang="ts">
interface Props {
  grade: string | null
}

defineProps<Props>()

function tone(grade: string | null) {
  if (!grade || grade === '—') return 'empty'
  const n = parseFloat(grade.replace(',', '.'))
  if (n >= 4.5) return 'high'
  if (n >= 3.5) return 'mid'
  return 'low'
}
</script>

<template>
  <span class="grade-chip" :class="`grade-chip--${tone(grade)}`">
    {{ grade ?? '—' }}
  </span>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grade-chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: $border-radius-chip;
  font-weight: 500;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  &--high  { background: $grade-high-bg; color: $grade-high-fg; border: 1px solid $grade-high-border; }
  &--mid   { background: $grade-mid-bg;  color: $grade-mid-fg;  border: 1px solid $grade-mid-border;  }
  &--low   { background: $grade-low-bg;  color: $grade-low-fg;  border: 1px solid $grade-low-border;  }
  &--empty { background: #f1f3f9; color: $color-ink-subtle; border: 1px solid $color-border-input; }
}
</style>
