<script setup lang="ts">
// TEMP — delete this page when contributor 4 implements the real teacher view
import type { TeachingAssignment } from '~/types/grades'
import { mockTeachingAssignments, mockRoster } from '~/data/mockGrades'

definePageMeta({ layout: 'student' })

const activeAssignment = ref<TeachingAssignment | null>(null)
</script>

<template>
  <div class="teacher-test">
    <nav class="teacher-test__breadcrumb" aria-label="Ścieżka nawigacji">
      <span>🏠</span>
      <span class="teacher-test__sep">›</span>
      <span>Pulpit</span>
      <span class="teacher-test__sep">›</span>
      <button
        v-if="activeAssignment"
        class="teacher-test__breadcrumb-link"
        @click="activeAssignment = null"
      >Przedmioty</button>
      <template v-else>
        <span class="teacher-test__breadcrumb-current">Przedmioty</span>
      </template>
      <template v-if="activeAssignment">
        <span class="teacher-test__sep">›</span>
        <span class="teacher-test__breadcrumb-current">{{ activeAssignment.name }}</span>
      </template>
    </nav>

    <h1 class="teacher-test__title">
      {{ activeAssignment ? activeAssignment.name : 'Przedmioty' }}
      <span class="teacher-test__temp-badge">TEMP</span>
    </h1>

    <TeacherSubjectList
      v-if="!activeAssignment"
      :assignments="mockTeachingAssignments"
      @select="activeAssignment = $event"
    />

    <TeacherGradebook
      v-else
      :assignment="activeAssignment"
      :roster="mockRoster"
      @back="activeAssignment = null"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.teacher-test {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: $color-ink-subtle;
    margin-bottom: -4px;
  }

  &__sep { color: $color-border-input; }

  &__breadcrumb-link {
    background: none;
    border: none;
    padding: 0;
    font-family: $font-sans;
    font-size: 12.5px;
    color: $color-accent;
    cursor: pointer;
    text-decoration: underline;
  }

  &__breadcrumb-current { color: $color-ink; font-weight: 600; }

  &__title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $color-ink;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__temp-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: $color-ink-subtle;
    border: 1px solid $color-border-input;
    border-radius: 4px;
    padding: 2px 6px;
    opacity: 0.5;
  }
}
</style>
