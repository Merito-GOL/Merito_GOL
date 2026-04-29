<template>
  <div class="auth-layout">
    <main class="auth-layout__content">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f7fb;
  padding: 24px;

  &__content {
    width: 100%;
    max-width: 420px;
  }
}
</style>