<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <section class="register">
    <div class="register__card">
      <h1 class="register__title">Rejestracja</h1>

      <form class="register__form">
        <div class="register__field">
          <label for="name">Imię i nazwisko</label>
          <input
            id="name"
            type="text"
            placeholder="Wpisz imię i nazwisko"
          />
        </div>

        <div class="register__field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Wpisz email"
          />
        </div>

        <div class="register__field">
          <label for="password">Hasło</label>
          <input
            id="password"
            type="password"
            placeholder="Utwórz hasło"
          />
        </div>

        <button type="submit" class="register__button">
          Zarejestruj się
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.register {
  &__card {
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  &__title {
    text-align: center;
    margin-bottom: 24px;
    color: #0b1733;
    font-size: 28px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    input {
      padding: 12px;
      border: 1px solid #dcdfe6;
      border-radius: 10px;
      font-size: 14px;
    }
  }

  &__button {
    margin-top: 8px;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #0b1733;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>