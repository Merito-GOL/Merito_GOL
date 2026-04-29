<script setup lang="ts">
interface Props {
  page: number
  totalPages: number
  total: number
  perPage: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:page': [value: number]
  'update:perPage': [value: number]
}>()

const pageRange = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))

const from = computed(() => (props.page - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.page * props.perPage, props.total))

const perPageOptions = computed(() => {
  const base = [5, 10, 20, 50]
  const set = new Set<number>(base)
  set.add(props.perPage)
  return Array.from(set).sort((a, b) => a - b)
})

const perPageModel = computed({
  get: () => String(props.perPage),
  set: (value: string) => {
    const next = Number(value)
    if (!Number.isFinite(next) || next <= 0) return
    emit('update:perPage', next)
  },
})
</script>

<template>
  <div class="pagination">
    <span class="pagination__info">
      Wyświetlanie: {{ from }}–{{ to }} / {{ total }}
    </span>

    <div class="pagination__pages" role="navigation" aria-label="Strony">
      <button
        class="pagination__btn"
        :disabled="page === 1"
        @click="emit('update:page', page - 1)"
      >‹</button>

      <button
        v-for="p in pageRange"
        :key="p"
        class="pagination__btn"
        :class="{ 'pagination__btn--active': page === p }"
        @click="emit('update:page', p)"
      >{{ p }}</button>

      <button
        class="pagination__btn"
        :disabled="page === totalPages"
        @click="emit('update:page', page + 1)"
      >›</button>
    </div>

    <div class="pagination__per-page">
      Pokaż na stronie:
      <select v-model="perPageModel" class="pagination__select">
        <option v-for="n in perPageOptions" :key="n" :value="String(n)">{{ n }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 18px;
  font-size: 13px;
  color: $color-ink-faint;
  flex-wrap: wrap;
  gap: 8px;

  &__info { white-space: nowrap; }

  &__pages {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid $color-border-input;
    background: $color-surface-card;
    color: $color-ink;
    cursor: pointer;
    font-family: $font-sans;
    font-size: 13px;
    transition: background $transition-base;

    &:hover:not(:disabled) { background: $color-surface-muted; }
    &:disabled { opacity: 0.35; cursor: default; }

    &--active {
      background: $color-ink-dark;
      color: #fff;
      border-color: $color-ink-dark;
    }

    &--active:hover:not(:disabled) {
      background: $color-ink-dark;
    }
  }

  &__per-page {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  &__select {
    padding: 5px 10px;
    border: 1.5px solid $color-border-input;
    border-radius: 8px;
    font-family: $font-sans;
    font-size: 13px;
    background: $color-surface-card;
    color: $color-ink;
  }
}
</style>
