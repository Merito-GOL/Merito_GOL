<script setup lang="ts">
const { toasts, remove } = useToast()

const icons = {
  success: `<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>`,
  error:   `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
  warning: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>`,
  info:    `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
} as const
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" role="status" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <svg class="toast__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <g v-html="icons[toast.type]" />
          </svg>
          <div class="toast__body">
            <span class="toast__title">{{ toast.title }}</span>
            <span v-if="toast.message" class="toast__message">{{ toast.message }}</span>
          </div>
          <button
            class="toast__close"
            type="button"
            aria-label="Zamknij powiadomienie"
            @click="remove(toast.id)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 480px) {
    align-items: stretch;
  }
}

.toast {
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1.5px solid transparent;
  background: $color-surface-card;
  box-shadow: 0 4px 20px rgba(26, 34, 56, 0.14), 0 1px 4px rgba(26, 34, 56, 0.06);
  min-width: 280px;
  max-width: 380px;

  @media (max-width: 480px) {
    min-width: 0;
    max-width: none;
  }

  &--success {
    border-color: $grade-high-border;
    .toast__icon { color: $grade-high-fg; }
    .toast__title { color: $grade-high-fg; }
  }

  &--error {
    border-color: $grade-low-border;
    .toast__icon { color: $grade-low-fg; }
    .toast__title { color: $grade-low-fg; }
  }

  &--warning {
    border-color: $grade-mid-border;
    .toast__icon { color: $grade-mid-fg; }
    .toast__title { color: $grade-mid-fg; }
  }

  &--info {
    border-color: #c5d9f9;
    .toast__icon { color: $color-accent; }
    .toast__title { color: $color-accent; }
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
    color: $color-ink-muted;
    line-height: 1.4;
  }

  &__close {
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    color: $color-ink-subtle;
    transition: color $transition-base;

    &:hover { color: $color-ink; }
  }
}

// Transition animations
.toast-enter-active { transition: all 280ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 200ms ease; }
.toast-enter-from   { opacity: 0; transform: translateX(30px) scale(0.95); }
.toast-leave-to     { opacity: 0; transform: translateX(30px); }
.toast-move         { transition: transform 200ms ease; }
</style>
