<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'PROPOSAL_REVIEWER',
})

const { user } = useAuth()

const reviewStats = [
  { label: 'Usulan Aktif', value: '24', helper: 'Periode 2026' },
  { label: 'Review Berjalan', value: '9', helper: 'Menunggu penilaian' },
  { label: 'Lolos Pendanaan', value: '6', helper: 'Sudah diumumkan' },
]

const agendaItems = [
  { title: 'Desk evaluation proposal pengabdian', note: '08:00 - 10:00 WIB' },
  { title: 'Rapat penetapan reviewer internal', note: '13:00 - 14:30 WIB' },
  { title: 'Finalisasi berita acara seleksi', note: '15:00 - 16:00 WIB' },
]

const proposalStages = [
  { label: 'Seleksi Administrasi', count: '12' },
  { label: 'Substansi', count: '7' },
  { label: 'Pendanaan', count: '5' },
]
</script>

<template>
  <div class="min-h-screen bg-stone-100 text-slate-900">
    <div class="flex min-h-screen">
      <Sidebar />

      <main class="flex-1">
        <Header />

        <div class="space-y-8 px-8 py-8">
          <section class="grid gap-4 lg:grid-cols-3">
            <article
              v-for="item in reviewStats"
              :key="item.label"
              class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100"
            >
              <p class="text-sm text-slate-500">{{ item.label }}</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">{{ item.value }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ item.helper }}</p>
            </article>
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <article class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900">Sebaran Tahapan Proposal</h3>
                  <p class="mt-1 text-sm text-slate-500">Distribusi proposal aktif berdasarkan tahapan evaluasi.</p>
                </div>
              </div>

              <div class="mt-6 space-y-5">
                <div
                  v-for="stage in proposalStages"
                  :key="stage.label"
                  class="space-y-2"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium text-slate-700">{{ stage.label }}</span>
                    <span class="text-slate-500">{{ stage.count }} proposal</span>
                  </div>
                  <div class="h-3 overflow-hidden rounded-full bg-emerald-50">
                    <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${Number(stage.count) * 8}%` }" />
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>