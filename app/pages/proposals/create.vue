<script setup lang="ts">
import ProfileMenu from '~/components/ui/ProfileMenu.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const steps = [
  'Identitas Usulan',
  'Substansi Usulan',
  'RAB',
  'Dokumen Pendukung',
  'Konfirmasi Usulan',
]

const anggotaRows = [
  { no: '1', nidn: 'Overflowing', nama: 'Overflowing', tugas: 'Overflowing', status: 'Overflowing', aksi: 'Overflowing' },
  { no: '2', nidn: 'Satisfied', nama: 'Satisfied', tugas: 'Satisfied', status: 'Satisfied', aksi: 'Satisfied' },
  { no: '3', nidn: 'Overflowing', nama: 'Overflowing', tugas: 'Overflowing', status: 'Overflowing', aksi: 'Overflowing' },
]

const mahasiswaRows = [
  { no: '1', jenisAnggota: 'Overflowing', noIdentitas: 'Overflowing', nama: 'Overflowing', tugas: 'Overflowing', aksi: 'Overflowing' },
  { no: '2', jenisAnggota: 'Satisfied', noIdentitas: 'Satisfied', nama: 'Satisfied', tugas: 'Satisfied', aksi: 'Satisfied' },
  { no: '3', jenisAnggota: 'Overflowing', noIdentitas: 'Overflowing', nama: 'Overflowing', tugas: 'Overflowing', aksi: 'Overflowing' },
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

        <div class="px-7 py-6">
          <h1 class="text-2xl font-semibold text-gray-900">Usulan Pengabdian</h1>

          <div class="mb-8 mt-6 flex items-start gap-4 overflow-x-auto pb-2">
            <template v-for="(step, index) in steps" :key="step">
              <div class="flex min-w-[120px] flex-col items-center">
                <div
                  class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                  :class="index === 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'"
                >
                  {{ index + 1 }}
                </div>
                <p class="mt-2 text-center text-[10px] text-gray-600">{{ step }}</p>
              </div>
              <div
                v-if="index < steps.length - 1"
                class="mt-2 h-1 min-w-[56px] flex-1 rounded"
                :class="index === 0 ? 'bg-blue-500' : 'bg-gray-300'"
              />
            </template>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <section>
              <h2 class="text-lg font-semibold text-blue-500">1.1. Identitas Pengabdian</h2>

              <div class="mt-4 max-w-md">
                <label class="mb-1.5 block text-sm text-gray-800">1. Judul <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Masukkan Judul Anda"
                  class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                >
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.2. Pemilihan Program Pengabdian</h2>

              <div class="mt-4 grid gap-x-5 gap-y-4 lg:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">1. Kategori Program Pengabdian</label>
                  <input
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">6. Lama Kegiatan <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">2. Bidang Fokus Pengabdian <span class="text-red-500">*</span></label>

                  <label class="mb-2 flex items-center gap-2 text-sm text-gray-800">
                    <input type="radio" name="bidang-fokus" checked class="h-4 w-4 accent-violet-600">
                    <span>Bidang Fokus Tematik</span>
                  </label>
                  <input
                    type="text"
                    value="Green Economy"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500"
                  >

                  <label class="mb-2 mt-3 flex items-center gap-2 text-sm text-gray-800">
                    <input type="radio" name="bidang-fokus" class="h-4 w-4 accent-violet-600">
                    <span>Bidang Fokus RIRN</span>
                  </label>
                  <input
                    type="text"
                    value="Green Economy"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500"
                  >
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">7. Rumpun Ilmu Level 1 <span class="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">8. Rumpun Ilmu Level 2 <span class="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">9. Rumpun Ilmu Level 3 <span class="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">3. Kelompok Skema</label>
                  <input
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div />

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">4. Ruang Lingkup</label>
                  <input
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div />

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">5. Tahun Pertama Usulan <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.3 Identitas Ketua</h2>

              <div class="mt-4 max-w-md">
                <label class="mb-1.5 block text-sm text-gray-800">Nama Ketua</label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Ketua"
                  class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                >
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.4 Identitas Anggota Pengabdian</h2>

              <button class="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                  <path fill-rule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                </svg>
                Tambah
              </button>

              <div class="mt-3 overflow-hidden border border-gray-200">
                <table class="min-w-full text-xs">
                  <thead class="bg-white text-left text-gray-700">
                    <tr>
                      <th class="px-3 py-2 font-semibold">No</th>
                      <th class="px-3 py-2 font-semibold">NIDN</th>
                      <th class="px-3 py-2 font-semibold">Nama</th>
                      <th class="px-3 py-2 font-semibold">Tugas</th>
                      <th class="px-3 py-2 font-semibold">Status</th>
                      <th class="px-3 py-2 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in anggotaRows"
                      :key="`${row.no}-${row.nidn}`"
                      class="border-t border-gray-200 even:bg-slate-100"
                    >
                      <td class="px-3 py-2">{{ row.no }}</td>
                      <td class="px-3 py-2">{{ row.nidn }}</td>
                      <td class="px-3 py-2">{{ row.nama }}</td>
                      <td class="px-3 py-2">{{ row.tugas }}</td>
                      <td class="px-3 py-2">{{ row.status }}</td>
                      <td class="px-3 py-2">{{ row.aksi }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.5 Identitas Mahasiswa</h2>

              <button class="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                  <path fill-rule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                </svg>
                Tambah
              </button>

              <div class="mt-3 overflow-hidden border border-gray-200">
                <table class="min-w-full text-xs">
                  <thead class="bg-white text-left text-gray-700">
                    <tr>
                      <th class="px-3 py-2 font-semibold">No</th>
                      <th class="px-3 py-2 font-semibold">Jenis Anggota</th>
                      <th class="px-3 py-2 font-semibold">No Identitas</th>
                      <th class="px-3 py-2 font-semibold">Nama</th>
                      <th class="px-3 py-2 font-semibold">Tugas</th>
                      <th class="px-3 py-2 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in mahasiswaRows"
                      :key="`${row.no}-${row.noIdentitas}`"
                      class="border-t border-gray-200 even:bg-slate-100"
                    >
                      <td class="px-3 py-2">{{ row.no }}</td>
                      <td class="px-3 py-2">{{ row.jenisAnggota }}</td>
                      <td class="px-3 py-2">{{ row.noIdentitas }}</td>
                      <td class="px-3 py-2">{{ row.nama }}</td>
                      <td class="px-3 py-2">{{ row.tugas }}</td>
                      <td class="px-3 py-2">{{ row.aksi }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div class="mt-4 flex justify-end">
            <button class="inline-flex items-center gap-2 rounded-md bg-blue-500 px-6 py-2.5 text-sm font-medium text-white" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                <path fill-rule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
              </svg>
              Lanjut
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>