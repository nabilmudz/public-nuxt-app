<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <div class="flex min-h-screen">
      <aside class="flex w-64 flex-col border-r bg-white">
        <div class="border-b px-6 py-4">
          <h1 class="text-lg font-bold">Proposal App</h1>
        </div>

        <nav class="flex flex-col gap-1 p-4">
          <NuxtLink
            to="/proposals"
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            active-class="bg-black text-white hover:bg-black"
          >
            Proposals
          </NuxtLink>

          <NuxtLink
            to="/proposals/create"
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            active-class="bg-black text-white hover:bg-black"
          >
            Create Proposal
          </NuxtLink>
        </nav>

        <div class="mt-auto border-t p-4">
          <NuxtLink
            to="/login"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>

            <span>Logout</span>
          </NuxtLink>
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col">
        <header class="border-b bg-white px-6 py-4">
          <h2 class="text-lg font-semibold">Dashboard</h2>
        </header>

        <main class="flex-1 p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>