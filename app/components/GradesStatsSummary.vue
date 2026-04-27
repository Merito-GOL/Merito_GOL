<script setup lang="ts">
import type { Subject } from '~/types/grades'
import { computeAverage } from '~/data/mockGrades'

interface Props {
  subjects: Subject[]
}

const props = defineProps<Props>()

const stats = computed(() => {
  const graded = props.subjects.filter(s => s.finalGrade !== null)
  const totalEcts = graded.reduce((sum, s) => sum + s.ects, 0)
  const allGrades = props.subjects.flatMap(s => s.grades)
  const overallAvg = computeAverage(allGrades)
  const bestSubject = graded.reduce<Subject | null>((best, s) => {
    if (!best || (s.finalGrade ?? 0) > (best.finalGrade ?? 0)) return s
    return best
  }, null)

  return {
    subjectCount: props.subjects.length,
    gradedCount: graded.length,
    totalEcts,
    overallAvg,
    totalGradeCount: allGrades.length,
    bestSubject,
  }
})
</script>

<template>
  <div class="stats-summary" role="region" aria-label="Podsumowanie ocen">
    <div class="stats-summary__card">
      <SidebarIcon name="book-open" class="stats-summary__icon stats-summary__icon--brand" />
      <div class="stats-summary__value">{{ stats.subjectCount }}</div>
      <div class="stats-summary__label">Przedmiotów</div>
    </div>

    <div class="stats-summary__card">
      <SidebarIcon name="trending-up" class="stats-summary__icon stats-summary__icon--green" />
      <div class="stats-summary__value">
        {{ stats.overallAvg > 0 ? stats.overallAvg.toFixed(2) : '—' }}
      </div>
      <div class="stats-summary__label">Średnia ogólna</div>
    </div>

    <div class="stats-summary__card">
      <SidebarIcon name="layers" class="stats-summary__icon stats-summary__icon--amber" />
      <div class="stats-summary__value">{{ stats.totalEcts }}</div>
      <div class="stats-summary__label">Punkty ECTS</div>
    </div>

    <div class="stats-summary__card">
      <SidebarIcon name="award" class="stats-summary__icon stats-summary__icon--purple" />
      <div class="stats-summary__value">{{ stats.totalGradeCount }}</div>
      <div class="stats-summary__label">Wszystkich ocen</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  &__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: $border-radius-card;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__icon {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 8px;

    &--brand  { background: #ede9fe; color: $color-brand-600; }
    &--green  { background: #dcfce7; color: $color-grade-excellent; }
    &--amber  { background: #fef3c7; color: $color-grade-average; }
    &--purple { background: #f3e8ff; color: #9333ea; }
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 800;
    color: $color-ink;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  &__label {
    font-size: 0.8125rem;
    color: $color-ink-muted;
    font-weight: 500;
  }
}
</style>
