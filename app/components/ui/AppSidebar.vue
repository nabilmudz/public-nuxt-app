<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { user } = useAuth()

const role = computed(() => user.value?.role || 'PROPOSAL_SUBMITTER')

const baseMenuClass =
  'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm'
const activeMenuClass = 'bg-blue-500 font-medium text-white'
const inactiveMenuClass = 'text-white/80 hover:bg-white/10'

const menus = computed(() => {
  if (role.value === 'ADMIN') {
    return [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Tambah User', path: '/admin/users' },
    ]
  }

  if (role.value === 'PROPOSAL_REVIEWER') {
    return [
      { name: 'Dashboard', path: '/LPPM/dashboard' },
      { name: 'Daftar Proposal', path: '/LPPM/proposals' },
    ]
  }

  // default user
  return [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Proposal Saya', path: '/proposals' }
  ]
})

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="w-full bg-indigo-950 px-4 py-5 text-white sm:px-5 sm:py-6 lg:h-screen lg:w-64 lg:overflow-hidden">
    <!-- Header -->
    <div class="mb-8 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="h-4 w-4"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      </div>
      <span class="text-xl font-semibold sm:text-2xl">Simpemnas</span>
    </div>

    <p
      class="mb-3 border-t border-white/20 pt-5 text-xs font-semibold tracking-wide text-white/70"
    >
      MENU UTAMA
    </p>

    <!-- Menu -->
    <nav class="flex flex-wrap gap-1.5 lg:block lg:space-y-1.5">
      <NuxtLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        :class="[
          baseMenuClass,
          isActive(menu.path) ? activeMenuClass : inactiveMenuClass
        ]"
      >
        <span>{{ menu.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>