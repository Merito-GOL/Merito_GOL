<script setup lang="ts">
  const auth = useAuthStore()

  auth.restore()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/main.scss';
</style>
