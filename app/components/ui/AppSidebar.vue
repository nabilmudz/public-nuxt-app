<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const baseMenuClass = 'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm'
const activeMenuClass = 'bg-blue-500 font-medium text-white'
const inactiveMenuClass = 'text-white/80 hover:bg-white/10'

const isDashboardActive = computed(() => route.path === '/dashboard')
const isProposalActive = computed(() => route.path.startsWith('/proposals'))
</script>

<template>
    <aside class="w-64 bg-indigo-950 px-5 py-6 text-white">
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
          <span class="text-2xl font-semibold">Simpemnas</span>
        </div>

        <p class="mb-3 border-t border-white/20 pt-5 text-xs font-semibold tracking-wide text-white/70">MENU UTAMA</p>

        <nav class="space-y-1.5">
          <NuxtLink
            to="/dashboard"
            :class="[baseMenuClass, isDashboardActive ? activeMenuClass : inactiveMenuClass]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/proposals"
            :class="[baseMenuClass, isProposalActive ? activeMenuClass : inactiveMenuClass]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" fill="white" fill-opacity="0.35" />
            </svg>
            <span>Proposal Saya</span>
          </NuxtLink>
        </nav>
      </aside>
</template>