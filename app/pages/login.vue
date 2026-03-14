<!-- Kalau cuma single langsung aja pages/page.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const handleLogin = async () => {
  await navigateTo('/proposals')
}
</script>

<template>
  <div class="rounded-2xl border bg-white p-6 shadow-sm">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Login</h1>
      <p class="text-sm text-gray-500">Dummy login untuk testing alur halaman.</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="masukkan email"
          class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="masukkan password"
          class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
      >
        Login
      </button>
    </form>
  </div>
</template>