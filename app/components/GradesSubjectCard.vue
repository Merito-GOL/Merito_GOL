<script setup lang="ts">
import type { Subject } from '~/types/grades'
import { computeAverage } from '~/data/mockGrades'

interface Props {
  subject: Subject
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'click', id: string): void }>()

const average = computed(() => computeAverage(props.subject.grades))
const gradeCount = computed(() => props.subject.grades.length)
</script>

<template>
  <article
    class="subject-card"
    role="button"
    tabindex="0"
    :aria-label="`${subject.name}, semestr ${subject.semester}`"
    @click="emit('click', subject.id)"
    @keydown.enter="emit('click', subject.id)"
  >
    <div class="subject-card__header">
      <div class="subject-card__code">{{ subject.code }}</div>
      <GradesBadge :value="subject.finalGrade" size="md" />
    </div>

    <h3 class="subject-card__name">{{ subject.name }}</h3>
    <p class="subject-card__teacher">{{ subject.teacherName }}</p>

    <div class="subject-card__footer">
      <div class="subject-card__meta">
        <span class="subject-card__meta-item">
          <SidebarIcon name="layers" />
          Sem. {{ subject.semester }}
        </span>
        <span class="subject-card__meta-item">
          <SidebarIcon name="award" />
          {{ subject.ects }} ECTS
        </span>
        <span class="subject-card__meta-item">
          <SidebarIcon name="star" />
          {{ gradeCount }} {{ gradeCount === 1 ? 'ocena' : gradeCount >= 5 ? 'ocen' : 'oceny' }}
        </span>
      </div>

      <div v-if="gradeCount > 0" class="subject-card__average">
        Śr. <strong>{{ average.toFixed(2) }}</strong>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.subject-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: $border-radius-card;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  transition: box-shadow $transition-base, border-color $transition-base, transform $transition-base;
  outline: none;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid $color-brand-600;
    outline-offset: 2px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__code {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-brand-600;
    background: #ede9fe;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
  }

  &__name {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 700;
    color: $color-ink;
    line-height: 1.35;
  }

  &__teacher {
    margin: 0;
    font-size: 0.8125rem;
    color: $color-ink-muted;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.25rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: $color-ink-subtle;

    svg { width: 12px; height: 12px; }
  }

  &__average {
    font-size: 0.8125rem;
    color: $color-ink-muted;
    white-space: nowrap;

    strong {
      font-size: 0.9375rem;
      font-weight: 700;
      color: $color-ink;
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
