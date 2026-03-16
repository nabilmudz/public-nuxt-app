<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
definePageMeta({
  layout: false,
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
  <div class="flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-800">
  <div class="flex h-full w-full overflow-hidden">
  <!-- Sol Taraf - Görsel Bölüm -->
  <div class="hidden lg:flex lg:w-[70%] bg-gradient-to-tr from-[#1B7BFF] to-[#A0C8FF] justify-center items-center relative overflow-hidden">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative z-10 px-10">
      <img
        src="/iconlogin.png"
        alt="Login illustration"
        class="w-[24rem] max-w-full mx-auto select-none pointer-events-none"
      >
      <h2 class="text-3xl font-extrabold text-white mb-2">Silahkan Login</h2>
      <p class="text-white/100 text-lg mb-8">Selamat Datang di portal pengajuan Proposal Penelitian. Silahkan Login menggunakan akun Universitas Anda</p>
    </div>
  </div>
  
  <!-- Sağ Taraf - Form Bölümü -->
  <div class="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
    <div class="w-full max-w-md">
      <div class="text-center lg:text-left">
        <h2 class="text-2xl font-extrabold text-blue-900 mb-8">Log in</h2>
      </div>
      
      <form class="space-y-6" @submit.prevent="handleLogin">
        <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" v-model="email" class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan Email">
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" name="password" v-model="password" class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan Password">
        </div>
        <div>
          <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

</div>
</template>