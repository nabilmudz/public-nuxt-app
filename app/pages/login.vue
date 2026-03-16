<script setup lang="ts">
import authIcon from '~/assets/images/auth-icon.png'
import { useAuth } from '~/composables/useAuth'
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
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

  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div class="flex items-center justify-center bg-[linear-gradient(to_top_right,#1B7BFF,#A0C8FF)] px-8 py-12 lg:px-16">
      <div class="flex max-w-md flex-col items-center">
        <img
          :src="authIcon"
          alt="Auth Icon"
          class="mb-12 h-28 w-28 object-contain lg:h-72 lg:w-72"
        />

        <div class="w-full text-left">
          <h1 class="mb-8 text-4xl font-bold text-white lg:text-4xl">
            Selamat Datang!
          </h1>

          <p class="text-base leading-7 text-white lg:text-xl">
            Selamat Datang di portal pengajuan Proposal Penelitian. Silahkan Login menggunakan akun Universitas Anda
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center bg-gray-50 px-8 py-12 lg:px-16">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-primary lg:text-5xl">Login</h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              placeholder="Masukkan password"
            />
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>