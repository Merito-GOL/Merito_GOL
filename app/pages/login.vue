<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const user = await auth.login(email.value, password.value)
  if (user) {
    if (user.role === 'student') {
      router.push('/student')
    } else if (user.role === 'teacher') {
      router.push('/teacher')
    }
  }
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <h1 class="login__title">Logowanie</h1>

      <form class="login__form" @submit.prevent="handleLogin">
        <div class="login__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Wpisz email"
            required
          />
        </div>

        <div class="login__field">
          <label for="password">Hasło</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Wpisz hasło"
            required
          />
        </div>

        <p v-if="auth.error.value" class="login__error">
          {{ auth.error.value }}
        </p>

        <button type="submit" class="login__button" :disabled="auth.loading.value">
          {{ auth.loading.value ? 'Logowanie...' : 'Zaloguj się' }}
        </button>

        <p class="login__register">
          Nie masz konta?
          <NuxtLink to="/register">Zarejestruj się</NuxtLink>
        </p>
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
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__error {
    color: #dc2626;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
  }

  &__register {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #6b7280;

    a {
      color: #0b1733;
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>