<script setup lang="ts">
import type { User } from '~/types/entities'

const props = defineProps<{
  user: User | null
}>()

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  auth.logout()
  await router.push('/login')
}

const displayName = computed(() => {
  if (!props.user) return ''
  const title = 'title' in props.user ? `${props.user.title} ` : ''
  return `${title}${props.user.firstName} ${props.user.lastName}`
})

const roleBadge = computed(() => {
  if (!props.user) return ''
  return props.user.role === 'teacher' ? 'Wykładowca' : 'Student'
})

const roleClass = computed(() => props.user?.role ?? 'student')

const initials = computed(() => {
  if (!props.user) return '?'
  return `${props.user.firstName[0]}${props.user.lastName[0]}`.toUpperCase()
})
</script>

<template>
  <header class="topbar" role="banner">
    <div class="topbar__inner">
      <!-- Logo / Brand -->
      <a class="topbar__brand" href="/" aria-label="MeritoGOŁ — strona główna">
        <span class="topbar__brand-logo" aria-hidden="true">M</span>
        <span class="topbar__brand-name">Merito<strong>GOŁ</strong></span>
      </a>

      <div class="topbar__spacer" />

      <!-- User section -->
      <div class="topbar__user" v-if="user">
        <div class="topbar__user-info">
          <span class="topbar__user-name">{{ displayName }}</span>
          <span class="topbar__role-chip" :class="`topbar__role-chip--${roleClass}`">
            {{ roleBadge }}
          </span>
        </div>
        <div class="topbar__avatar" :class="`topbar__avatar--${roleClass}`" aria-hidden="true">
          {{ initials }}
        </div>
        <button class="topbar__logout" type="button" @click="handleLogout" aria-label="Wyloguj się">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Wyloguj
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: $topbar-height;
  background: $color-surface-card;
  border-bottom: 1px solid $color-border;
  box-shadow: 0 1px 4px rgba(26, 34, 56, 0.06);

  &__inner {
    max-width: $content-max-width;
    margin: 0 auto;
    height: 100%;
    padding: 0 28px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 640px) {
      padding: 0 16px;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: $color-ink;
    flex-shrink: 0;
  }

  &__brand-logo {
    width: 32px;
    height: 32px;
    background: $color-accent;
    color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }

  &__brand-name {
    font-size: 16px;
    font-weight: 500;
    color: $color-ink;
    letter-spacing: -0.01em;

    strong {
      font-weight: 800;
    }

    @media (max-width: 400px) {
      display: none;
    }
  }

  &__spacer {
    flex: 1;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;

    @media (max-width: 540px) {
      display: none;
    }
  }

  &__user-name {
    font-size: 13.5px;
    font-weight: 600;
    color: $color-ink;
    white-space: nowrap;
  }

  &__role-chip {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 1px 7px;
    border-radius: 99px;

    &--teacher {
      background: #e8f1ff;
      color: $color-accent;
      border: 1px solid #c5d9f9;
    }

    &--student {
      background: #e8f9ef;
      color: #1d7a36;
      border: 1px solid #b8e8c8;
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12.5px;
    flex-shrink: 0;
    letter-spacing: -0.02em;

    &--teacher {
      background: #dde9fc;
      color: $color-accent;
    }

    &--student {
      background: #d5f0e0;
      color: #1d7a36;
    }
  }

  &__logout {
    height: 36px;
    padding: 0 14px;
    border: 1.5px solid $color-border-input;
    border-radius: 8px;
    background: transparent;
    color: $color-ink-muted;
    font-size: 13px;
    font-weight: 600;
    font-family: $font-sans;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    transition: background $transition-base, border-color $transition-base, color $transition-base;
    flex-shrink: 0;

    &:hover {
      background: #fff0ef;
      border-color: #f7c2b7;
      color: $grade-low-fg;
    }
  }
}
</style>
