<script setup lang="ts">
import type { GradeValue } from '~/types/grades'
import { gradeColor } from '~/data/mockGrades'

interface Props {
  value: GradeValue | null
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })

const colorClass = computed(() =>
  props.value ? `grade-badge--${gradeColor(props.value)}` : 'grade-badge--empty'
)
</script>

<template>
  <span class="grade-badge" :class="[`grade-badge--${size}`, colorClass]">
    {{ value ?? '—' }}
  </span>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.grade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  border-radius: 8px;
  line-height: 1;

  &--sm  { padding: 0.2rem 0.45rem; font-size: 0.75rem; border-radius: 6px; }
  &--md  { padding: 0.3rem 0.6rem;  font-size: 0.875rem; }
  &--lg  { padding: 0.45rem 0.85rem; font-size: 1.1rem; border-radius: 10px; }

  &--excellent { background: #dcfce7; color: $color-grade-excellent; }
  &--good      { background: #dbeafe; color: $color-grade-good; }
  &--average   { background: #fef3c7; color: $color-grade-average; }
  &--poor      { background: #fee2e2; color: $color-grade-poor; }
  &--fail      { background: #f1f5f9; color: $color-grade-fail; }
  &--empty     { background: #f1f5f9; color: $color-ink-subtle; }
}
</style>
