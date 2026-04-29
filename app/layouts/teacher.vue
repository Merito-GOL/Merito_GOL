<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <div class="teacher-layout">
    <AppTopbar :user="auth.currentUser.value" />
    <div class="teacher-layout__body">
      <slot />
    </div>
    <AppToast />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.teacher-layout {
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
    padding: 28px 28px;

    @media (max-width: 640px) {
      padding: 16px;
    }
  }
}
</style>
