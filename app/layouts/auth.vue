<template>
  <div class="auth-layout">
    <main class="auth-layout__content">
      <div class="auth-layout__title">
        Merito<span>GOŁ</span>
      </div>

      <p class="auth-layout__subtitle">
        Twoje oceny. W jednym miejscu.
      </p>

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
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__title {
    text-align: center;
    font-weight: 800;
    font-size: clamp(28px, 5vw, 48px);
    letter-spacing: -0.5px;
    color: #0b1733;

    span {
      color: #0b1733;
      text-shadow: 0 2px 8px rgba(11, 23, 51, 0.2);
    }
  }

  &__subtitle {
    text-align: center;
    font-size: clamp(14px, 2.5vw, 16px);
    color: #6b7280;
    margin-top: -8px;
    margin-bottom: 8px;
  }
}
</style>