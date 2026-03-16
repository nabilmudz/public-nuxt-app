<script setup lang="ts">
import ProfileMenu from '~/components/ui/ProfileMenu.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const proposalRows = [
  {
    informasi: 'Transformasi Digital UMKM Desa',
    skema: 'Overflowing',
    tanggal: 'Overflowing',
    status: 'Overflowing',
    aksi: 'Overflowing',
  },
  {
    informasi: 'Analisis Mikroplastik',
    skema: 'Satisfied',
    tanggal: 'Satisfied',
    status: 'Satisfied',
    aksi: 'Satisfied',
  },
  {
    informasi: 'Empty',
    skema: 'Overflowing',
    tanggal: 'Overflowing',
    status: 'Overflowing',
    aksi: 'Overflowing',
  },
  {
    informasi: 'Analisis Mikroplastik',
    skema: 'Satisfied',
    tanggal: 'Satisfied',
    status: 'Satisfied',
    aksi: 'Satisfied',
  },
]
</script>

<template>
  <div class="h-screen w-screen bg-gray-100">
    <div class="flex h-full w-full">
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
            class="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm text-white/80 hover:bg-white/10"
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
            class="flex items-center gap-3 rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium"
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

      <main class="flex-1 overflow-y-auto bg-gray-50">
        <header class="relative border-b border-gray-200 px-8 py-4">
          <div class="absolute right-8 top-3">
            <ProfileMenu />
          </div>
        </header>

        <div class="px-8 py-6">
          <div class="mb-5">
            <h1 class="text-4xl font-semibold text-gray-900">Usulan Anda</h1>
            <p class="mt-1 text-xl text-gray-600">Kelola Usulan yang anda ajukan disini</p>
          </div>

          <NuxtLink
            to="/proposals/create"
            class="mb-5 inline-flex items-center gap-2 rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path fill-rule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
            Tambah Usulan
          </NuxtLink>

          <div class="overflow-hidden border border-gray-300 bg-white">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-100 text-left text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Informasi Proposal</th>
                  <th class="px-3 py-3 font-semibold">Skema</th>
                  <th class="px-3 py-3 font-semibold">Tanggal</th>
                  <th class="px-3 py-3 font-semibold">Status</th>
                  <th class="px-3 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr
                  v-for="(row, index) in proposalRows"
                  :key="`${row.informasi}-${index}`"
                  class="border-t border-gray-200 even:bg-slate-100"
                >
                  <td class="px-4 py-2.5 font-semibold">{{ row.informasi }}</td>
                  <td class="px-3 py-2.5">{{ row.skema }}</td>
                  <td class="px-3 py-2.5">{{ row.tanggal }}</td>
                  <td class="px-3 py-2.5">{{ row.status }}</td>
                  <td class="px-3 py-2.5">{{ row.aksi }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>