<script setup lang="ts">
const { user, logout } = useAuth()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  closeMenu()
  await logout()
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!menuRef.value) {
    return
  }

  const target = event.target as Node | null

  if (target && !menuRef.value.contains(target)) {
    closeMenu()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentClick)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div ref="menuRef" class="relative z-20">
    <button
      class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-950 shadow-sm transition hover:border-blue-200 hover:text-blue-500"
      type="button"
      aria-label="User menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7">
        <path
          fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm-3.75 13.5a8.25 8.25 0 1 1 16.5 0 .75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm-3.75 13.5a8.25 8.25 0 1 1 16.5 0 .75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-gray-900">{{ user?.name || 'User' }}</p>
          <p class="truncate text-xs text-gray-500">{{ user?.email || 'user@example.com' }}</p>
        </div>
      </div>

      <div class="pt-3">
        <button
          class="flex w-full items-center justify-center rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          type="button"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>