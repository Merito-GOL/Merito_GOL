<script setup lang="ts">
// TODO Topbar component with user info, notifications, etc.
</script>

<template>
  <div class="student-layout">
    <slot name="topbar" />
    <div class="student-layout__body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.student-layout {
  min-height: 100dvh;
  background: $color-surface;
  font-family: $font-sans;
  color: $color-ink;
  display: flex;
  flex-direction: column;

  &__body {
    flex: 1;
    max-width: $content-max-width;
    width: 100%;
    margin: 0 auto;
    padding: 24px 28px;

    @media (max-width: 640px) {
      padding: 16px;
    }
  }
}
</style>
