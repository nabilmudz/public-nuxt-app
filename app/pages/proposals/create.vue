<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'
import ProposalEditor from '~/components/proposal/ProposalEditor.vue'
import AddDosenMemberModal from '~/components/proposal/AddDosenMemberModal.vue'
import AddMahasiswaMemberModal from '~/components/proposal/AddMahasiswaMemberModal.vue'
import { FocusType, ProgramCategory, ProposalInputMode, ScopeLevel } from '~/types/proposal'

const isiProposal = ref('<p>Mulai ketik proposal di sini...</p>')
const inputMode = ref<ProposalInputMode>(ProposalInputMode.EDITOR)
const kategoriProgram = ref<ProgramCategory>(ProgramCategory.PENGABDIAN)
const kategoriProgramOptions = Object.values(ProgramCategory)
const ruangLingkup = ref<ScopeLevel>(ScopeLevel.NASIONAL)
const ruangLingkupOptions = Object.values(ScopeLevel)
const focusType = ref<FocusType>(FocusType.TEMATIK)

const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

const judul = ref('')
const lamaKegiatan = ref('')
const focusTematikValue = ref('')
const focusRirnValue = ref('')
const rumpunIlmuLevel1 = ref('')
const rumpunIlmuLevel2 = ref('')
const rumpunIlmuLevel3 = ref('')
const kelompokSkema = ref('')
const tahunPertamaUsulan = ref('')
const namaKetua = ref('')
const proposalFile = ref<File | null>(null)
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'PROPOSAL_SUBMITTER',
})

type DosenMember = {
  id: string
  nidn: string
  name: string
  duty: string
  status: 'Dosen'
}

type MahasiswaMember = {
  id: string
  memberType: 'Mahasiswa'
  identityNumber: string
  name: string
  duty: string
}

const dosenRows = ref<DosenMember[]>([])
const mahasiswaRows = ref<MahasiswaMember[]>([])
const showAddDosenModal = ref(false)
const showAddMahasiswaModal = ref(false)

const openAddDosenModal = () => {
  showAddDosenModal.value = true
}

const closeAddDosenModal = () => {
  showAddDosenModal.value = false
}

const addDosenMember = (payload: Omit<DosenMember, 'id'>) => {
  dosenRows.value.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...payload,
  })
}

const removeDosenMember = (memberId: string) => {
  dosenRows.value = dosenRows.value.filter(member => member.id !== memberId)
}

const openAddMahasiswaModal = () => {
  showAddMahasiswaModal.value = true
}

const closeAddMahasiswaModal = () => {
  showAddMahasiswaModal.value = false
}

const addMahasiswaMember = (payload: Omit<MahasiswaMember, 'id'>) => {
  mahasiswaRows.value.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...payload,
  })
}

const removeMahasiswaMember = (memberId: string) => {
  mahasiswaRows.value = mahasiswaRows.value.filter(member => member.id !== memberId)
}

const selectedFocusValue = computed(() => {
  return focusType.value === FocusType.TEMATIK ? focusTematikValue.value : focusRirnValue.value
})

const onProposalFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  proposalFile.value = target.files?.[0] || null
}

const submitProposal = async () => {
  submitError.value = ''
  submitSuccess.value = ''

  if (!judul.value || !lamaKegiatan.value || !tahunPertamaUsulan.value || !namaKetua.value) {
    submitError.value = 'Mohon lengkapi field wajib terlebih dahulu.'
    return
  }

  if (inputMode.value === ProposalInputMode.UPLOAD && !proposalFile.value) {
    submitError.value = 'Silakan upload file proposal.'
    return
  }

  if (!user.value?.id) {
    submitError.value = 'User login tidak ditemukan. Silakan login ulang.'
    return
  }

  const payload = {
    ownerId: user.value.id,
    title: judul.value,
    category: kategoriProgram.value,
    focusType: focusType.value,
    focusValue: selectedFocusValue.value,
    schemeGroup: kelompokSkema.value,
    scopeLevel: ruangLingkup.value,
    firstProposalYear: Number(tahunPertamaUsulan.value),
    durationMonths: Number(lamaKegiatan.value),
    scientificFieldLevel1: rumpunIlmuLevel1.value,
    scientificFieldLevel2: rumpunIlmuLevel2.value,
    scientificFieldLevel3: rumpunIlmuLevel3.value,
    leadName: namaKetua.value,
    status: 'SUBMITTED',
    inputMode: inputMode.value,
    editorContent: inputMode.value === ProposalInputMode.EDITOR ? isiProposal.value : null,
    serviceMembers: dosenRows.value.map(member => ({
      nidn: member.nidn,
      name: member.name,
      duty: member.duty,
      status: member.status,
    })),
    studentMembers: mahasiswaRows.value.map(member => ({
      memberType: member.memberType,
      identityNumber: member.identityNumber,
      name: member.name,
      duty: member.duty,
    })),
  }

  isSubmitting.value = true

  try {
    if (inputMode.value === ProposalInputMode.UPLOAD) {
      const formData = new FormData()
      formData.append('ownerId', payload.ownerId)
      formData.append('title', payload.title)
      formData.append('category', payload.category)
      formData.append('focusType', payload.focusType)
      formData.append('focusValue', payload.focusValue)
      formData.append('schemeGroup', payload.schemeGroup)
      formData.append('scopeLevel', payload.scopeLevel)
      formData.append('firstProposalYear', String(payload.firstProposalYear))
      formData.append('durationMonths', String(payload.durationMonths))
      formData.append('scientificFieldLevel1', payload.scientificFieldLevel1)
      formData.append('scientificFieldLevel2', payload.scientificFieldLevel2)
      formData.append('scientificFieldLevel3', payload.scientificFieldLevel3)
      formData.append('leadName', payload.leadName)
      formData.append('status', payload.status)
      formData.append('inputMode', payload.inputMode)
      formData.append('serviceMembers', JSON.stringify(payload.serviceMembers))
      formData.append('studentMembers', JSON.stringify(payload.studentMembers))

      if (proposalFile.value) {
        formData.append('proposalFile', proposalFile.value)
      }

      await $fetch(`${config.public.apiBase}/api/proposal`, {
        method: 'POST',
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : undefined,
        body: formData,
      })
    }
    else {
      await $fetch(`${config.public.apiBase}/api/proposal`, {
        method: 'POST',
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : undefined,
        body: payload,
      })
    }

    submitSuccess.value = 'Proposal berhasil dibuat.'
    await navigateTo('/proposals')
  }
  catch (error: any) {
    submitError.value = error?.data?.message || 'Gagal membuat proposal.'
  }
  finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <div class="h-screen w-screen bg-gray-100">
    <div class="flex h-full w-full">
      <Sidebar />

      <main class="flex-1 overflow-y-auto bg-gray-50">
        <Header />

        <div class="px-7 py-6">
          <h1 class="text-2xl mb-5 font-semibold text-gray-900">Usulan Pengabdian</h1>


          <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <section>
              <h2 class="text-lg font-semibold text-blue-500">1.1. Identitas Pengabdian</h2>

              <div class="mt-4 max-w-md">
                <label class="mb-1.5 block text-sm text-gray-800">1. Judul <span class="text-red-500">*</span></label>
                <input
                  v-model="judul"
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
                  <select
                    v-model="kategoriProgram"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                  >
                    <option v-for="option in kategoriProgramOptions" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">6. Lama Kegiatan <span class="text-red-500">*</span></label>
                  <input
                    v-model="lamaKegiatan"
                    type="text"
                    placeholder="Contoh: 12"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">2. Bidang Fokus Pengabdian <span class="text-red-500">*</span></label>

                  <label class="mb-2 flex items-center gap-2 text-sm text-gray-800">
                    <input v-model="focusType" :value="FocusType.TEMATIK" type="radio" name="bidang-fokus" class="h-4 w-4 accent-violet-600">
                    <span>Bidang Fokus Tematik</span>
                  </label>
                  <input
                    v-model="focusTematikValue"
                    type="text"
                    placeholder="Masukkan fokus tematik"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500"
                  >

                  <label class="mb-2 mt-3 flex items-center gap-2 text-sm text-gray-800">
                    <input v-model="focusType" :value="FocusType.RIRN" type="radio" name="bidang-fokus" class="h-4 w-4 accent-violet-600">
                    <span>Bidang Fokus RIRN</span>
                  </label>
                  <input
                    v-model="focusRirnValue"
                    type="text"
                    placeholder="Masukkan fokus RIRN"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500"
                  >
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">7. Rumpun Ilmu Level 1 <span class="text-red-500">*</span></label>
                    <input
                      v-model="rumpunIlmuLevel1"
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">8. Rumpun Ilmu Level 2 <span class="text-red-500">*</span></label>
                    <input
                      v-model="rumpunIlmuLevel2"
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm text-gray-800">9. Rumpun Ilmu Level 3 <span class="text-red-500">*</span></label>
                    <input
                      v-model="rumpunIlmuLevel3"
                      type="text"
                      placeholder="Masukkan Judul Anda"
                      class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                    >
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">3. Kelompok Skema</label>
                  <input
                    v-model="kelompokSkema"
                    type="text"
                    placeholder="Masukkan Judul Anda"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                  >
                </div>

                <div />

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">4. Ruang Lingkup</label>
                  <select
                    v-model="ruangLingkup"
                    class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                  >
                    <option v-for="option in ruangLingkupOptions" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>

                <div />

                <div>
                  <label class="mb-1.5 block text-sm text-gray-800">5. Tahun Pertama Usulan <span class="text-red-500">*</span></label>
                  <input
                    v-model="tahunPertamaUsulan"
                    type="text"
                    placeholder="Contoh: 2026"
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
                  v-model="namaKetua"
                  type="text"
                  placeholder="Masukkan Nama Ketua"
                  class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
                >
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.4 Identitas Anggota Pengabdian</h2>

              <button class="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white" type="button" @click="openAddDosenModal">
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
                      v-for="(row, index) in dosenRows"
                      :key="row.id"
                      class="border-t border-gray-200 even:bg-slate-100"
                    >
                      <td class="px-3 py-2">{{ index + 1 }}</td>
                      <td class="px-3 py-2">{{ row.nidn }}</td>
                      <td class="px-3 py-2">{{ row.name }}</td>
                      <td class="px-3 py-2">{{ row.duty }}</td>
                      <td class="px-3 py-2">{{ row.status }}</td>
                      <td class="px-3 py-2">
                        <button
                          type="button"
                          class="rounded border border-red-500 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          @click="removeDosenMember(row.id)"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!dosenRows.length" class="border-t border-gray-200">
                      <td colspan="6" class="px-3 py-4 text-center text-xs text-gray-500">Belum ada anggota dosen.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mt-6">
              <h2 class="text-lg font-semibold text-blue-500">1.5 Identitas Mahasiswa</h2>

              <button class="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white" type="button" @click="openAddMahasiswaModal">
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
                      v-for="(row, index) in mahasiswaRows"
                      :key="row.id"
                      class="border-t border-gray-200 even:bg-slate-100"
                    >
                      <td class="px-3 py-2">{{ index + 1 }}</td>
                      <td class="px-3 py-2">{{ row.memberType }}</td>
                      <td class="px-3 py-2">{{ row.identityNumber }}</td>
                      <td class="px-3 py-2">{{ row.name }}</td>
                      <td class="px-3 py-2">{{ row.duty }}</td>
                      <td class="px-3 py-2">
                        <button
                          type="button"
                          class="rounded border border-red-500 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          @click="removeMahasiswaMember(row.id)"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!mahasiswaRows.length" class="border-t border-gray-200">
                      <td colspan="6" class="px-3 py-4 text-center text-xs text-gray-500">Belum ada anggota mahasiswa.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div class="mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-blue-500">1.6 Proposal</h2>

            <div class="mt-4">
              <label class="mb-2 block text-sm text-gray-800">Mode Input Proposal <span class="text-red-500">*</span></label>
              <div class="flex flex-wrap items-center gap-5">
                <label class="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    v-model="inputMode"
                    :value="ProposalInputMode.EDITOR"
                    type="radio"
                    name="proposal-input-mode"
                    class="h-4 w-4 accent-violet-600"
                  >
                  <span>Editor</span>
                </label>

                <label class="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    v-model="inputMode"
                    :value="ProposalInputMode.UPLOAD"
                    type="radio"
                    name="proposal-input-mode"
                    class="h-4 w-4 accent-violet-600"
                  >
                  <span>Upload File</span>
                </label>
              </div>
            </div>

            <div class="mt-4" v-if="inputMode === ProposalInputMode.EDITOR">
              <ProposalEditor v-model="isiProposal" />
            </div>

            <div class="mt-4 max-w-xl" v-else>
              <label class="mb-1.5 block text-sm text-gray-800">File Proposal</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                @change="onProposalFileChange"
                class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              >
              <p class="mt-1 text-xs text-gray-500">Format file yang didukung: PDF, DOC, DOCX.</p>
            </div>

            <p v-if="submitError" class="mt-3 text-sm text-red-500">{{ submitError }}</p>
            <p v-if="submitSuccess" class="mt-3 text-sm text-green-600">{{ submitSuccess }}</p>
          </div>

          <div class="mt-4 flex justify-end">
            <button class="inline-flex items-center gap-2 rounded-md bg-blue-500 px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" type="button" :disabled="isSubmitting" @click="submitProposal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                <path fill-rule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
              </svg>
              {{ isSubmitting ? 'Menyimpan...' : 'Lanjut' }}
            </button>
          </div>
        </div>
      </main>
    </div>

    <AddDosenMemberModal
      v-model="showAddDosenModal"
      @submit="addDosenMember"
      @update:model-value="closeAddDosenModal"
    />

    <AddMahasiswaMemberModal
      v-model="showAddMahasiswaModal"
      @submit="addMahasiswaMember"
      @update:model-value="closeAddMahasiswaModal"
    />
  </div>
</template>
