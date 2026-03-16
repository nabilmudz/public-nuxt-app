<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'PROPOSAL_REVIEWER',
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
  <div class="min-h-screen bg-gray-100">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />

      <main class="w-full flex-1 overflow-y-auto bg-gray-50">
        <Header />

        <div class="px-4 py-6 sm:px-6 lg:px-8">
          <div class="mb-5">
            <h1 class="text-2xl font-semibold text-gray-900">Usulan </h1>
            <p class="mb-8 mt-2 text-base text-gray-500">Review Usulan yang diajukan</p>
          </div>

          <div class="overflow-x-auto border border-gray-300 bg-white">
            <table class="min-w-[760px] w-full text-sm">
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