<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'ADMIN',
})

const { user } = useAuth()

const statCards = [
  { label: 'Total Pengguna', value: '128', tone: 'blue' },
  { label: 'Proposal Masuk', value: '42', tone: 'amber' },
]

const recentActivities = [
  { title: 'Akun reviewer baru ditambahkan', time: 'Hari ini, 09:15', status: 'Selesai' },
  { title: 'Validasi data dosen pengusul', time: 'Hari ini, 10:40', status: 'Diproses' },
  { title: 'Sinkronisasi proposal semester genap', time: 'Kemarin, 16:20', status: 'Selesai' },
]

const toneClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  emerald: 'bg-emerald-100 text-emerald-600',
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="flex min-h-screen">
      <Sidebar />

      <main class="flex-1">
        <Header />

        <div class="space-y-8 px-8 py-8">
          <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="card in statCards"
              :key="card.label"
              class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm text-slate-500">{{ card.label }}</p>
                  <p class="mt-3 text-3xl font-semibold text-slate-900">{{ card.value }}</p>
                </div>

                <span :class="['rounded-2xl px-3 py-2 text-xs font-semibold', toneClasses[card.tone]]">
                  Ringkas
                </span>
              </div>
            </article>
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <article class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900">Aktivitas Terbaru</h3>
                  <p class="mt-1 text-sm text-slate-500">Ringkasan pekerjaan administratif hari ini.</p>
                </div>

                <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-blue-300 hover:text-blue-600" type="button">
                  Lihat Semua
                </button>
              </div>

              <div class="mt-6 space-y-4">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.title"
                  class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4"
                >
                  <div>
                    <p class="font-medium text-slate-900">{{ activity.title }}</p>
                    <p class="mt-1 text-sm text-slate-500">{{ activity.time }}</p>
                  </div>

                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {{ activity.status }}
                  </span>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>