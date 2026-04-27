<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const sidebarOpen = ref(true)
const route = useRoute()

interface NavItem {
  label: string
  icon: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Oceny',        icon: 'star',         to: '/student' },
  { label: 'Plan zajęć',   icon: 'calendar',     to: '/student/schedule' },
  { label: 'Przedmioty',   icon: 'book-open',    to: '/student/subjects' },
  { label: 'Profil',       icon: 'user-circle',  to: '/student/profile' },
]

function isActive(to: string): boolean {
  return route.path === to || (to !== '/student' && route.path.startsWith(to))
}
</script>

<template>
  <div class="student-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': !sidebarOpen }">
      <div class="sidebar__logo">
        <span class="sidebar__logo-icon">G</span>
        <Transition name="fade-slide">
          <span v-if="sidebarOpen" class="sidebar__logo-text">MeritoGOŁ</span>
        </Transition>
      </div>

      <nav class="sidebar__nav" aria-label="Nawigacja studenta">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar__nav-item"
          :class="{ 'sidebar__nav-item--active': isActive(item.to) }"
        >
          <SidebarIcon :name="item.icon" class="sidebar__nav-icon" />
          <Transition name="fade-slide">
            <span v-if="sidebarOpen" class="sidebar__nav-label">{{ item.label }}</span>
          </Transition>
        </NuxtLink>
      </nav>

      <div class="sidebar__footer">
        <button
          class="sidebar__collapse-btn"
          :aria-label="sidebarOpen ? 'Zwiń menu' : 'Rozwiń menu'"
          @click="sidebarOpen = !sidebarOpen"
        >
          <SidebarIcon :name="sidebarOpen ? 'chevrons-left' : 'chevrons-right'" />
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="student-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.student-layout {
  display: flex;
  min-height: 100dvh;
  background: $color-surface;
}

// ─── Sidebar ───────────────────────────────────────────────────────
.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  width: $sidebar-width;
  min-width: $sidebar-width;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width $transition-base, min-width $transition-base;
  z-index: 40;

  &--collapsed {
    width: 68px;
    min-width: 68px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1.25rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    min-height: $topbar-height;
  }

  &__logo-icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
    background: $color-brand-600;
    color: #fff;
    font-size: 1.125rem;
    font-weight: 800;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.02em;
  }

  &__logo-text {
    font-size: 1.125rem;
    font-weight: 800;
    color: $color-ink;
    white-space: nowrap;
    letter-spacing: -0.03em;
  }

  &__nav {
    flex: 1;
    padding: 0.75rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 10px;
    text-decoration: none;
    color: $color-ink-muted;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background $transition-base, color $transition-base;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      background: #f1f5f9;
      color: $color-ink;
    }

    &--active {
      background: #ede9fe;
      color: $color-brand-600;

      .sidebar__nav-icon { color: $color-brand-600; }
    }
  }

  &__nav-icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    flex-shrink: 0;
  }

  &__nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__footer {
    padding: 0.75rem 0.5rem;
    border-top: 1px solid #f1f5f9;
  }

  &__collapse-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: $color-ink-subtle;
    cursor: pointer;
    transition: background $transition-base, color $transition-base;

    &:hover {
      background: #f1f5f9;
      color: $color-ink;
    }
  }
}

// ─── Main ──────────────────────────────────────────────────────────
.student-layout__main {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  max-width: 1280px;

  @media (max-width: 640px) {
    padding: 1rem;
  }
}

// ─── Transitions ───────────────────────────────────────────────────
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity $transition-base, transform $transition-base;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

// ─── Responsive: mobile sidebar ────────────────────────────────────
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 2px 0 20px rgba(0,0,0,0.08);

    &--collapsed {
      width: 0;
      min-width: 0;
      border-right: none;
      overflow: hidden;
    }
  }

  .student-layout__main {
    padding: 1rem;
  }
}
</style>
