<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const auth = useAuthStore()
const router = useRouter()

const handleLogin = () => {
  auth.login('student')
  router.push('/student')
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <h1 class="login__title">Logowanie</h1>

      <form class="login__form">
        <div class="login__field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Wpisz email"
          />
        </div>

        <div class="login__field">
          <label for="password">Hasło</label>
          <input
            id="password"
            type="password"
            placeholder="Wpisz hasło"
          />
        </div>

        <button type="button" class="login__button" @click="handleLogin">
        Zaloguj się
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login {
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