<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'
import { formatDate } from '~/utils/formatDate'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'PROPOSAL_SUBMITTER',
})

const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

type ProposalOwner = {
  id: string
  name: string
  email: string
  role: string
}

type ServiceMember = {
  id: string
  proposalId: string
  nidn: string
  name: string
  duty: string
  status: string
}

type StudentMember = {
  id: string
  proposalId: string
  memberType: string
  identityNumber: string
  name: string
  duty: string
}

type ProposalItem = {
  id: string
  ownerId: string
  title: string
  category: string
  focusType: string
  focusValue: string
  schemeGroup: string
  scopeLevel: string
  firstProposalYear: number
  durationMonths: number
  scientificFieldLevel1: string
  scientificFieldLevel2: string
  scientificFieldLevel3: string
  leadName: string
  status: string
  inputMode: 'EDITOR' | 'UPLOAD'
  editorContent: string | null
  fileUrl: string | null
  fileName: string | null
  fileMimeType: string | null
  fileSize: number | null
  createdAt: string
  updatedAt: string
  owner?: ProposalOwner
  serviceMembers?: ServiceMember[]
  studentMembers?: StudentMember[]
}

type ProposalResponse = {
  success?: boolean
  message?: string
  data?: ProposalItem[]
  items?: ProposalItem[]
  proposals?: ProposalItem[]
}

type ProposalDetailResponse = {
  success?: boolean
  message?: string
  data?: ProposalItem
}

const normalizeProposalResponse = (response: ProposalItem[] | ProposalResponse) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.proposals)) return response.proposals
  return []
}

const deletingProposalId = ref<string | null>(null)
const loadingDetailId = ref<string | null>(null)
const showDetailModal = ref(false)
const detailPending = ref(false)
const detailError = ref('')
const selectedProposal = ref<ProposalItem | null>(null)

const { data: proposals, pending, error, refresh } = await useAsyncData<ProposalItem[]>(
  'user-proposals',
  async () => {
    if (!user.value?.id) return []

    const response = await $fetch<ProposalItem[] | ProposalResponse>(
      `${config.public.apiBase}/api/proposal/user/${user.value.id}`,
      {
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : undefined,
      },
    )

    return normalizeProposalResponse(response)
  },
  {
    default: () => [],
    watch: [() => user.value?.id, accessToken],
  },
)

const proposalRows = computed(() => proposals.value ?? [])

const resolvedOwner = computed<ProposalOwner | null>(() => {
  if (!selectedProposal.value) return null

  if (selectedProposal.value.owner) {
    return selectedProposal.value.owner
  }

  const ownerFromList = proposalRows.value.find(item => item.id === selectedProposal.value?.id)?.owner
  if (ownerFromList) {
    return ownerFromList
  }

  if (user.value && selectedProposal.value.ownerId === user.value.id) {
    return {
      id: user.value.id,
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
    }
  }

  return null
})

const formatInputMode = (mode: ProposalItem['inputMode']) => {
  return mode === 'UPLOAD' ? 'Upload File' : 'Editor'
}

const formatFileSize = (size: number | null) => {
  if (!size) return '-'
  const kb = size / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

const resolveFileUrl = (fileUrl: string | null) => {
  if (!fileUrl) return ''

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl
  }

  try {
    return new URL(fileUrl, config.public.apiBase).toString()
  }
  catch {
    return fileUrl
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  detailPending.value = false
  detailError.value = ''
  selectedProposal.value = null
}

const openDetailModal = async (proposalId: string) => {
  showDetailModal.value = true
  detailPending.value = true
  detailError.value = ''
  selectedProposal.value = proposalRows.value.find(item => item.id === proposalId) ?? null
  loadingDetailId.value = proposalId

  try {
    const response = await $fetch<ProposalItem | ProposalDetailResponse>(
      `${config.public.apiBase}/api/proposal/${proposalId}`,
      {
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : undefined,
      },
    )

    if (response && !Array.isArray(response) && 'data' in response && response.data) {
      selectedProposal.value = response.data
      return
    }

    selectedProposal.value = response as ProposalItem
  }
  catch {
    detailError.value = 'Gagal memuat detail proposal.'
  }
  finally {
    detailPending.value = false
    loadingDetailId.value = null
  }
}

// const handleDeleteProposal = async (proposalId: string) => {
//   const confirmed = window.confirm('Yakin ingin menghapus proposal ini?')
//   if (!confirmed) return

//   deletingProposalId.value = proposalId

//   try {
//     await $fetch(`${config.public.apiBase}/api/proposal/${proposalId}`, {
//       method: 'DELETE',
//       headers: accessToken.value
//         ? { Authorization: `Bearer ${accessToken.value}` }
//         : undefined,
//     })

//     await refresh()
//   }
//   finally {
//     deletingProposalId.value = null
//   }
// }
</script>

<template>
  <div class="h-screen w-screen bg-gray-100">
    <div class="flex h-full w-full">
      <Sidebar />

      <main class="flex-1 overflow-y-auto bg-gray-50">
        <Header />

        <div class="px-8 py-6">
          <div class="mb-5">
            <h1 class="text-2xl font-semibold text-gray-900">Usulan Anda</h1>
            <p class="mb-8 mt-2 text-base text-gray-500">Kelola Usulan yang anda ajukan disini</p>
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
                  v-for="row in proposalRows"
                  :key="row.id"
                  class="border-t border-gray-200 even:bg-slate-100"
                >
                  <td class="px-4 py-2.5 font-semibold">
                    <div>{{ row.title }}</div>
                    <p class="mt-1 text-xs font-normal text-gray-500">
                      {{ row.category }} • {{ formatInputMode(row.inputMode) }}
                    </p>
                  </td>
                  <td class="px-3 py-2.5">{{ row.schemeGroup || '-' }}</td>
                  <td class="px-3 py-2.5">{{ formatDate(row.createdAt) }}</td>
                  <td class="px-3 py-2.5">{{ row.status }}</td>
                  <td class="px-3 py-2.5">
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="rounded border border-blue-500 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        :disabled="loadingDetailId === row.id"
                        @click="openDetailModal(row.id)"
                      >
                        {{ loadingDetailId === row.id ? 'Memuat...' : 'Detail' }}
                      </button>
                      <NuxtLink
                        :to="`/proposals/${row.id}?mode=edit`"
                        class="rounded border border-amber-500 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
                      >
                        Edit
                      </NuxtLink>
                      <!-- <button
                        type="button"
                        class="rounded border border-red-500 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="deletingProposalId === row.id"
                        @click="handleDeleteProposal(row.id)"
                      >
                        {{ deletingProposalId === row.id ? 'Menghapus...' : 'Hapus' }}
                      </button> -->
                    </div>
                  </td>
                </tr>
                <tr v-if="!pending && !proposalRows.length">
                  <td colspan="5" class="px-4 py-6 text-center text-sm text-gray-500">Belum ada proposal.</td>
                </tr>
                <tr v-if="error">
                  <td colspan="5" class="px-4 py-6 text-center text-sm text-red-500">Gagal memuat data proposal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div class="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
          <h2 class="text-lg font-semibold text-gray-900">Detail Proposal</h2>
          <button
            type="button"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            @click="closeDetailModal"
          >
            Tutup
          </button>
        </div>

        <div class="px-5 py-4">
          <p v-if="detailPending" class="text-sm text-gray-500">Memuat detail proposal...</p>
          <p v-else-if="detailError" class="text-sm text-red-500">{{ detailError }}</p>

          <div v-else-if="selectedProposal" class="space-y-5 text-sm text-gray-700">
            <div class="grid gap-3 md:grid-cols-2">
              <div><span class="font-semibold text-gray-900">Judul:</span> {{ selectedProposal.title }}</div>
              <div><span class="font-semibold text-gray-900">Kategori:</span> {{ selectedProposal.category }}</div>
              <div><span class="font-semibold text-gray-900">Status:</span> {{ selectedProposal.status }}</div>
              <div><span class="font-semibold text-gray-900">Mode Input:</span> {{ formatInputMode(selectedProposal.inputMode) }}</div>
              <div><span class="font-semibold text-gray-900">Focus Type:</span> {{ selectedProposal.focusType }}</div>
              <div><span class="font-semibold text-gray-900">Focus Value:</span> {{ selectedProposal.focusValue }}</div>
              <div><span class="font-semibold text-gray-900">Skema:</span> {{ selectedProposal.schemeGroup || '-' }}</div>
              <div><span class="font-semibold text-gray-900">Ruang Lingkup:</span> {{ selectedProposal.scopeLevel }}</div>
              <div><span class="font-semibold text-gray-900">Tahun Usulan:</span> {{ selectedProposal.firstProposalYear }}</div>
              <div><span class="font-semibold text-gray-900">Durasi (bulan):</span> {{ selectedProposal.durationMonths }}</div>
              <div><span class="font-semibold text-gray-900">Rumpun 1:</span> {{ selectedProposal.scientificFieldLevel1 }}</div>
              <div><span class="font-semibold text-gray-900">Rumpun 2:</span> {{ selectedProposal.scientificFieldLevel2 }}</div>
              <div><span class="font-semibold text-gray-900">Rumpun 3:</span> {{ selectedProposal.scientificFieldLevel3 }}</div>
              <div><span class="font-semibold text-gray-900">Ketua:</span> {{ selectedProposal.leadName }}</div>
              <div><span class="font-semibold text-gray-900">Dibuat:</span> {{ formatDate(selectedProposal.createdAt) }}</div>
              <div><span class="font-semibold text-gray-900">Diupdate:</span> {{ formatDate(selectedProposal.updatedAt) }}</div>
            </div>

            <div class="rounded-md border border-gray-200 p-4">
              <h3 class="mb-2 font-semibold text-gray-900">Owner</h3>
              <div v-if="resolvedOwner" class="grid gap-2 md:grid-cols-2">
                <div><span class="font-semibold text-gray-900">Nama:</span> {{ resolvedOwner.name }}</div>
                <div><span class="font-semibold text-gray-900">Email:</span> {{ resolvedOwner.email }}</div>
              </div>
              <p v-else class="text-gray-500">Data owner tidak tersedia.</p>
            </div>

            <!-- <div class="rounded-md border border-gray-200 p-4">
              <h3 class="mb-2 font-semibold text-gray-900">Konten Proposal</h3>
              <div v-if="selectedProposal.inputMode === 'EDITOR'" class="space-y-2">
                <p class="text-xs text-gray-500">Isi dari editor:</p>
                <div class="max-h-60 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-3" v-html="selectedProposal.editorContent || '-'" />
              </div>
              <div v-else class="space-y-1">
                <p><span class="font-semibold text-gray-900">Nama File:</span> {{ selectedProposal.fileName || '-' }}</p>
                <p><span class="font-semibold text-gray-900">Mime Type:</span> {{ selectedProposal.fileMimeType || '-' }}</p>
                <p><span class="font-semibold text-gray-900">Ukuran:</span> {{ formatFileSize(selectedProposal.fileSize) }}</p>
                <div>
                  <span class="font-semibold text-gray-900">URL:</span>
                  <a
                    v-if="selectedProposal.fileUrl"
                    :href="resolveFileUrl(selectedProposal.fileUrl)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-1 text-blue-600 underline hover:text-blue-700"
                  >
                    {{ resolveFileUrl(selectedProposal.fileUrl) }}
                  </a>
                  <span v-else> - </span>
                </div>
                <div v-if="selectedProposal.fileUrl" class="pt-1">
                  <a
                    :href="resolveFileUrl(selectedProposal.fileUrl)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center rounded border border-blue-500 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Buka File
                  </a>
                </div>
              </div>
            </div> -->

            <div class="rounded-md border border-gray-200 p-4">
              <h3 class="mb-2 font-semibold text-gray-900">Anggota Pengabdian</h3>
              <div v-if="selectedProposal.serviceMembers?.length" class="overflow-x-auto">
                <table class="min-w-full text-xs">
                  <thead class="bg-gray-100 text-left">
                    <tr>
                      <th class="px-2 py-2">NIDN</th>
                      <th class="px-2 py-2">Nama</th>
                      <th class="px-2 py-2">Tugas</th>
                      <th class="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in selectedProposal.serviceMembers" :key="member.id" class="border-t border-gray-200">
                      <td class="px-2 py-2">{{ member.nidn }}</td>
                      <td class="px-2 py-2">{{ member.name }}</td>
                      <td class="px-2 py-2">{{ member.duty }}</td>
                      <td class="px-2 py-2">{{ member.status }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-gray-500">Belum ada anggota pengabdian.</p>
            </div>

            <div class="rounded-md border border-gray-200 p-4">
              <h3 class="mb-2 font-semibold text-gray-900">Anggota Mahasiswa</h3>
              <div v-if="selectedProposal.studentMembers?.length" class="overflow-x-auto">
                <table class="min-w-full text-xs">
                  <thead class="bg-gray-100 text-left">
                    <tr>
                      <th class="px-2 py-2">Jenis</th>
                      <th class="px-2 py-2">No Identitas</th>
                      <th class="px-2 py-2">Nama</th>
                      <th class="px-2 py-2">Tugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in selectedProposal.studentMembers" :key="member.id" class="border-t border-gray-200">
                      <td class="px-2 py-2">{{ member.memberType }}</td>
                      <td class="px-2 py-2">{{ member.identityNumber }}</td>
                      <td class="px-2 py-2">{{ member.name }}</td>
                      <td class="px-2 py-2">{{ member.duty }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-gray-500">Belum ada anggota mahasiswa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>