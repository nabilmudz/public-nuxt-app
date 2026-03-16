<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

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
      <Sidebar />

      <main class="flex-1 overflow-y-auto bg-gray-50">
        <Header />

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