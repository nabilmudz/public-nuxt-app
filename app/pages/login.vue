<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const { login } = useAuth()

const handleLogin = async () => {
  errorMessage.value = ''

  const result = await login(email.value, password.value)

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }

  await navigateTo('/proposals')
}
</script>

<template>
  <div class="rounded-2xl border bg-white p-6 shadow-sm">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Login</h1>
      <p class="text-sm text-gray-500">Masuk ke aplikasi</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="mb-1 block text-sm font-medium">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full rounded-lg border px-3 py-2"
          placeholder="Masukkan email"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full rounded-lg border px-3 py-2"
          placeholder="Masukkan password"
        />
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="w-full rounded-lg bg-black px-4 py-2 text-white"
      >
        Login
      </button>
    </form>
  </div>
</template>