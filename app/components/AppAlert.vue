<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

interface Props {
  type?: ToastType
  title?: string
  message?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
})

const emit = defineEmits<{ dismiss: [] }>()

const visible = ref(true)

function dismiss() {
  visible.value = false
  emit('dismiss')
}

const icons = {
  success: `<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>`,
  error:   `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
  warning: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  info:    `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
} as const
</script>

<template>
  <Transition name="alert-fade">
    <div
      v-if="visible"
      class="app-alert"
      :class="`app-alert--${type}`"
      role="alert"
      :aria-live="type === 'error' ? 'assertive' : 'polite'"
    >
      <svg class="app-alert__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <g v-html="icons[type]" />
      </svg>
      <div class="app-alert__body">
        <span v-if="title" class="app-alert__title">{{ title }}</span>
        <span v-if="message" class="app-alert__message">{{ message }}</span>
        <slot v-if="!title && !message" />
      </div>
      <button
        v-if="dismissible"
        class="app-alert__close"
        type="button"
        aria-label="Zamknij"
        @click="dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.app-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  font-size: 13.5px;
  line-height: 1.5;

  &--success {
    background: $grade-high-bg;
    border-color: $grade-high-border;
    color: $grade-high-fg;

    .app-alert__icon { color: $grade-high-fg; }
  }

  &--error {
    background: $grade-low-bg;
    border-color: $grade-low-border;
    color: $grade-low-fg;

    .app-alert__icon { color: $grade-low-fg; }
  }

  &--warning {
    background: $grade-mid-bg;
    border-color: $grade-mid-border;
    color: $grade-mid-fg;

    .app-alert__icon { color: $grade-mid-fg; }
  }

  &--info {
    background: #e8f1ff;
    border-color: #c5d9f9;
    color: $color-accent;

    .app-alert__icon { color: $color-accent; }
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-weight: 700;
    font-size: 13.5px;
  }

  &__message {
    font-size: 13px;
    opacity: 0.85;
  }

  &__close {
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    opacity: 0.6;
    transition: opacity $transition-base;
    color: inherit;

    &:hover { opacity: 1; }
  }
}

.alert-fade-enter-active,
.alert-fade-leave-active { transition: opacity 200ms ease, transform 200ms ease; }
.alert-fade-enter-from,
.alert-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
