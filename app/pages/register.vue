<script setup lang="ts">
import type { User, Department, FieldOfStudy, Group } from '~/types/entities'

definePageMeta({
  layout: 'auth'
})

const api = useMeritoApi()
const router = useRouter()

// Dane formularza
const role = ref<'student' | 'teacher'>('student')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const departmentId = ref<number | null>(null)
const fieldOfStudyId = ref<number | null>(null)
const groupId = ref<number | null>(null)
const albumNumber = ref('')
const title = ref('')

// Dane z API
const departments = ref<Department[]>([])
const fieldsOfStudy = ref<FieldOfStudy[]>([])
const groups = ref<Group[]>([])

// Ładowanie danych
onMounted(async () => {
  departments.value = await api.getDepartments()
  fieldsOfStudy.value = await api.getFieldsOfStudy()
  groups.value = await api.getGroups()
})

// Filtrowane kierunki studiów na podstawie wydziału
const filteredFields = computed(() => {
  if (!departmentId.value) return []
  return fieldsOfStudy.value.filter(f => f.departmentId === departmentId.value)
})

// Filtrowane grupy na podstawie kierunku
const filteredGroups = computed(() => {
  if (!fieldOfStudyId.value) return []
  return groups.value.filter(g => g.fieldOfStudyId === fieldOfStudyId.value)
})

// Resetowanie pól przy zmianie roli
watch(role, () => {
  fieldOfStudyId.value = null
  groupId.value = null
  albumNumber.value = ''
  title.value = ''
})

// Resetowanie grupy przy zmianie kierunku
watch(fieldOfStudyId, () => {
  groupId.value = null
})

// Walidacja
const errors = ref<Record<string, string>>({})

const validate = () => {
  errors.value = {}
  
  if (!firstName.value.trim()) errors.value.firstName = 'Imię jest wymagane'
  if (!lastName.value.trim()) errors.value.lastName = 'Nazwisko jest wymagane'
  if (!email.value.trim()) errors.value.email = 'Email jest wymagany'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.value.email = 'Nieprawidłowy format email'
  if (!password.value) errors.value.password = 'Hasło jest wymagane'
  else if (password.value.length < 6) errors.value.password = 'Hasło musi mieć min. 6 znaków'
  if (password.value !== confirmPassword.value) errors.value.confirmPassword = 'Hasła nie są identyczne'
  if (!departmentId.value) errors.value.departmentId = 'Wydział jest wymagany'
  
  if (role.value === 'student') {
    if (!albumNumber.value.trim()) errors.value.albumNumber = 'Numer albumu jest wymagany'
    if (!fieldOfStudyId.value) errors.value.fieldOfStudyId = 'Kierunek studiów jest wymagany'
    if (!groupId.value) errors.value.groupId = 'Grupa jest wymagana'
  } else {
    if (!title.value.trim()) errors.value.title = 'Tytuł naukowy jest wymagany'
  }
  
  return Object.keys(errors.value).length === 0
}

// Rejestracja
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (!validate()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const userData = {
      role: role.value,
      email: email.value.trim(),
      password: password.value,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      departmentId: departmentId.value!,
      ...(role.value === 'student' ? {
        albumNumber: albumNumber.value.trim(),
        fieldOfStudyId: fieldOfStudyId.value!,
        groupId: groupId.value!,
      } : {
        title: title.value.trim(),
      }),
    }
    
    await api.register(userData as any)
    
    // Przekierowanie do logowania po udanej rejestracji
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = 'Nie udało się zarejestrować. Spróbuj ponownie.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="register">
    <div class="register__card">
      <h1 class="register__title">Rejestracja</h1>

      <form class="register__form" @submit.prevent="handleRegister">
        <!-- Wybór roli -->
        <div class="register__role">
          <button
            type="button"
            class="register__role-btn"
            :class="{ 'register__role-btn--active': role === 'student' }"
            @click="role = 'student'"
          >
            Student
          </button>
          <button
            type="button"
            class="register__role-btn"
            :class="{ 'register__role-btn--active': role === 'teacher' }"
            @click="role = 'teacher'"
          >
            Nauczyciel
          </button>
        </div>

        <!-- Imię i nazwisko -->
          <div class="register__field">
            <label for="firstName">Imię</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              placeholder="Wpisz imię"
              :class="{ 'register__input--error': errors.firstName }"
            />
            <span v-if="errors.firstName" class="register__error">{{ errors.firstName }}</span>
          </div>

          <div class="register__field">
            <label for="lastName">Nazwisko</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Wpisz nazwisko"
              :class="{ 'register__input--error': errors.lastName }"
            />
            <span v-if="errors.lastName" class="register__error">{{ errors.lastName }}</span>
          </div>

        <!-- Email -->
        <div class="register__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Wpisz email"
            :class="{ 'register__input--error': errors.email }"
          />
          <span v-if="errors.email" class="register__error">{{ errors.email }}</span>
        </div>

        <!-- Hasło -->
        <div class="register__field">
          <label for="password">Hasło</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Utwórz hasło (min. 6 znaków)"
            :class="{ 'register__input--error': errors.password }"
          />
          <span v-if="errors.password" class="register__error">{{ errors.password }}</span>
        </div>

        <!-- Potwierdzenie hasła -->
        <div class="register__field">
          <label for="confirmPassword">Powtórz hasło</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Powtórz hasło"
            :class="{ 'register__input--error': errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="register__error">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Wydział -->
        <div class="register__field">
          <label for="department">Wydział</label>
          <select
            id="department"
            v-model="departmentId"
            :class="{ 'register__input--error': errors.departmentId }"
          >
            <option :value="null">Wybierz wydział</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
          <span v-if="errors.departmentId" class="register__error">{{ errors.departmentId }}</span>
        </div>

        <!-- Pola dla studenta -->
        <template v-if="role === 'student'">
          <!-- Numer albumu -->
          <div class="register__field">
            <label for="albumNumber">Numer albumu</label>
            <input
              id="albumNumber"
              v-model="albumNumber"
              type="text"
              placeholder="np. S-12345"
              :class="{ 'register__input--error': errors.albumNumber }"
            />
            <span v-if="errors.albumNumber" class="register__error">{{ errors.albumNumber }}</span>
          </div>

          <!-- Kierunek studiów -->
          <div class="register__field">
            <label for="fieldOfStudy">Kierunek studiów</label>
            <select
              id="fieldOfStudy"
              v-model="fieldOfStudyId"
              :disabled="!departmentId"
              :class="{ 'register__input--error': errors.fieldOfStudyId }"
            >
              <option :value="null">Wybierz kierunek</option>
              <option v-for="field in filteredFields" :key="field.id" :value="field.id">
                {{ field.name }}
              </option>
            </select>
            <span v-if="errors.fieldOfStudyId" class="register__error">{{ errors.fieldOfStudyId }}</span>
          </div>

          <!-- Grupa -->
          <div class="register__field">
            <label for="group">Grupa</label>
            <select
              id="group"
              v-model="groupId"
              :disabled="!fieldOfStudyId"
              :class="{ 'register__input--error': errors.groupId }"
            >
              <option :value="null">Wybierz grupę</option>
              <option v-for="group in filteredGroups" :key="group.id" :value="group.id">
                {{ group.code }}
              </option>
            </select>
            <span v-if="errors.groupId" class="register__error">{{ errors.groupId }}</span>
          </div>
        </template>

        <!-- Pola dla nauczyciela -->
        <template v-else>
          <div class="register__field">
            <label for="title">Tytuł naukowy</label>
            <select
              id="title"
              v-model="title"
              :class="{ 'register__input--error': errors.title }"
            >
              <option value="">Wybierz tytuł</option>
              <option value="mgr">magister</option>
              <option value="dr">doktor</option>
              <option value="dr hab.">doktor habilitowany</option>
              <option value="prof.">profesor</option>
            </select>
            <span v-if="errors.title" class="register__error">{{ errors.title }}</span>
          </div>
        </template>

        <!-- Komunikat błędu -->
        <div v-if="errorMessage" class="register__error-message">
          {{ errorMessage }}
        </div>

        <!-- Przycisk submit -->
        <button type="submit" class="register__button" :disabled="isLoading">
          {{ isLoading ? 'Rejestracja...' : 'Zarejestruj się' }}
        </button>

        <!-- Link do logowania -->
        <p class="register__login-link">
          Masz już konto? <NuxtLink to="/login">Zaloguj się</NuxtLink>
        </p>
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
    max-width: 520px;
    margin: 0 auto;
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

  &__role {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__role-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid #dcdfe6;
    border-radius: 10px;
    background: white;
    color: #606266;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #0b1733;
    }

    &--active {
      border-color: #0b1733;
      background: #0b1733;
      color: white;
    }
  }

  &__row {
    display: flex;
    gap: 16px;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }

    input, select {
      padding: 12px;
      border: 1px solid #dcdfe6;
      border-radius: 10px;
      font-size: 14px;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #0b1733;
      }

      &:disabled {
        background: #f5f7fa;
        cursor: not-allowed;
      }
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606060' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
  }

  &__input--error {
    border-color: #f56c6c !important;
  }

  &__error {
    font-size: 12px;
    color: #f56c6c;
  }

  &__error-message {
    padding: 12px;
    background: #fef0f0;
    border: 1px solid #fde2e2;
    border-radius: 8px;
    color: #f56c6c;
    font-size: 14px;
    text-align: center;
  }

  &__button {
    margin-top: 8px;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #0b1733;
    color: white;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover:not(:disabled) {
      background: #1a2a4a;
    }

    &:disabled {
      background: #909399;
      cursor: not-allowed;
    }
  }

  &__login-link {
    text-align: center;
    font-size: 14px;
    color: #606266;
    margin-top: 8px;

    a {
      color: #0b1733;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>