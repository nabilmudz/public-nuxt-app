<script setup lang="ts">
const { accessToken } = useAuth()

if (accessToken.value) {
  await navigateTo('/dashboard')
} else {
  await navigateTo('/login')
}
</script>

<template>
  <div />
</template>