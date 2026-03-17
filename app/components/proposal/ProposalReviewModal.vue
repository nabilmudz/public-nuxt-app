<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ProposalInputMode, ProposalStatus, type Proposal } from '~/types/proposal'

type ProposalOwner = {
  id: string
  name: string
  email: string
  role: string
}

type ServiceMember = {
  id?: string
  proposalId?: string
  nidn: string
  name: string
  duty: string
  status: string
}

type StudentMember = {
  id?: string
  proposalId?: string
  memberType: string
  identityNumber: string
  name: string
  duty: string
}

type ProposalDetail = Proposal & {
  owner?: ProposalOwner | null
  serviceMembers?: ServiceMember[]
  studentMembers?: StudentMember[]
}

type ProposalDetailResponse = {
  success?: boolean
  message?: string
  data?: ProposalDetail
}

const props = defineProps<{
  modelValue: boolean
  proposalId: string | null
  readOnly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  reviewed: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const pending = ref(false)
const error = ref('')
const detail = ref<ProposalDetail | null>(null)
const submitPending = ref(false)
const submitError = ref('')
const pendingStatus = ref<ProposalStatus | null>(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const resolveFileUrl = (fileUrl?: string | null) => {
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

const fileUrl = computed(() => resolveFileUrl(detail.value?.fileUrl))

const canPreviewPdf = computed(() => {
  if (!detail.value || detail.value.inputMode !== ProposalInputMode.UPLOAD || !fileUrl.value) {
    return false
  }

  const mimeType = detail.value.fileMimeType?.toLowerCase() || ''
  const fileName = detail.value.fileName?.toLowerCase() || ''

  return mimeType.includes('pdf') || fileName.endsWith('.pdf') || fileUrl.value.toLowerCase().includes('.pdf')
})

const formatDate = (value?: string) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const formatFileSize = (size?: number | null) => {
  if (!size) return '-'

  const kb = size / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

const reviewDocument = computed(() => {
  const content = detail.value?.editorContent?.trim() || '<p>Tidak ada konten proposal.</p>'

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
      }

      body {
        margin: 0;
        padding: 32px;
        font-family: Georgia, "Times New Roman", serif;
        color: #0f172a;
        background: #ffffff;
        line-height: 1.7;
        word-break: break-word;
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 0 0 16px;
        line-height: 1.25;
      }

      p, ul, ol, blockquote, table, pre {
        margin: 0 0 16px;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
      }

      blockquote {
        border-left: 4px solid #cbd5e1;
        padding-left: 16px;
        color: #334155;
      }

      pre {
        white-space: pre-wrap;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
      }
    </style>
  </head>
  <body>${content}</body>
</html>`
})

const statusBadgeClass = computed(() => {
  if (detail.value?.status === ProposalStatus.APPROVED) {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (detail.value?.status === ProposalStatus.REJECTED) {
    return 'bg-rose-100 text-rose-700'
  }

  if (detail.value?.status === ProposalStatus.SUBMITTED) {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-slate-100 text-slate-700'
})

const buildPayload = (proposal: ProposalDetail, nextStatus: ProposalStatus) => ({
  ownerId: proposal.ownerId,
  title: proposal.title,
  category: proposal.category,
  focusType: proposal.focusType,
  focusValue: proposal.focusValue,
  schemeGroup: proposal.schemeGroup,
  scopeLevel: proposal.scopeLevel,
  firstProposalYear: proposal.firstProposalYear,
  durationMonths: proposal.durationMonths,
  scientificFieldLevel1: proposal.scientificFieldLevel1,
  scientificFieldLevel2: proposal.scientificFieldLevel2,
  scientificFieldLevel3: proposal.scientificFieldLevel3,
  leadName: proposal.leadName,
  status: nextStatus,
  inputMode: proposal.inputMode,
  editorContent: proposal.inputMode === ProposalInputMode.EDITOR ? proposal.editorContent ?? '' : null,
  fileUrl: proposal.inputMode === ProposalInputMode.UPLOAD ? proposal.fileUrl ?? '' : undefined,
  fileName: proposal.inputMode === ProposalInputMode.UPLOAD ? proposal.fileName ?? '' : undefined,
  fileMimeType: proposal.inputMode === ProposalInputMode.UPLOAD ? proposal.fileMimeType ?? '' : undefined,
  fileSize: proposal.inputMode === ProposalInputMode.UPLOAD ? proposal.fileSize ?? null : undefined,
  serviceMembers: (proposal.serviceMembers ?? []).map(member => ({
    nidn: member.nidn,
    name: member.name,
    duty: member.duty,
    status: member.status,
  })),
  studentMembers: (proposal.studentMembers ?? []).map(member => ({
    memberType: member.memberType,
    identityNumber: member.identityNumber,
    name: member.name,
    duty: member.duty,
  })),
})

const loadDetail = async () => {
  if (!isOpen.value || !props.proposalId) return

  pending.value = true
  error.value = ''
  submitError.value = ''

  try {
    const response = await $fetch<ProposalDetail | ProposalDetailResponse>(
      `${config.public.apiBase}/api/proposal/${props.proposalId}`,
      {
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : undefined,
      },
    )

    if (response && !Array.isArray(response) && 'data' in response && response.data) {
      detail.value = response.data
      return
    }

    detail.value = response as ProposalDetail
  }
  catch (fetchError: any) {
    detail.value = null
    error.value = fetchError?.data?.message || 'Gagal memuat detail proposal.'
  }
  finally {
    pending.value = false
  }
}

const close = () => {
  isOpen.value = false
  submitError.value = ''
  pendingStatus.value = null
}

const updateStatus = async (nextStatus: ProposalStatus) => {
  if (!detail.value || !props.proposalId) return

  submitPending.value = true
  submitError.value = ''
  pendingStatus.value = nextStatus

  try {
    const body = buildPayload(detail.value, nextStatus)

    await $fetch(`${config.public.apiBase}/api/proposal/${props.proposalId}`, {
      method: 'PUT',
      headers: accessToken.value
        ? { Authorization: `Bearer ${accessToken.value}` }
        : undefined,
      body,
    })

    detail.value = {
      ...detail.value,
      status: nextStatus,
    }

    emit('reviewed')
    close()
  }
  catch (submitErr: any) {
    submitError.value = submitErr?.data?.message || 'Gagal memperbarui status proposal.'
  }
  finally {
    submitPending.value = false
    pendingStatus.value = null
  }
}

watch(
  [() => props.modelValue, () => props.proposalId, accessToken],
  async ([open, proposalId, token], previousValues) => {
    const [previousOpen, previousProposalId, previousToken] = previousValues ?? []

    if (!open || !proposalId) return

    const shouldReload =
      open !== previousOpen ||
      proposalId !== previousProposalId ||
      token !== previousToken

    if (shouldReload) {
      await loadDetail()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 py-6">
    <div class="flex max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <p class="text-sm font-medium text-slate-500">Review Proposal</p>
          <h2 class="text-lg font-semibold text-slate-900">Detail Pengajuan</h2>
        </div>

        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          @click="close"
        >
          Tutup
        </button>
      </div>

      <div class="scrollbar-hide flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <div v-if="pending" class="py-16 text-center text-sm text-slate-500">
          Memuat detail proposal...
        </div>

        <div
          v-else-if="error"
          class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ error }}
        </div>

        <div v-else-if="detail" class="space-y-6">
          <section class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
            <div class="rounded-2xl border border-slate-200 bg-white p-5">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {{ detail.category }}
                  </p>
                  <h3 class="mt-1 text-2xl font-semibold text-slate-900">
                    {{ detail.title }}
                  </h3>
                </div>

                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusBadgeClass"
                >
                  {{ detail.status }}
                </span>
              </div>

              <dl class="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Ketua</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.leadName || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Mode Input</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.inputMode }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Bidang Fokus</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.focusType }} / {{ detail.focusValue }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Skema</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.schemeGroup || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Ruang Lingkup</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.scopeLevel }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Durasi</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.durationMonths }} bulan</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Tahun Pertama</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ detail.firstProposalYear }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Dibuat</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ formatDate(detail.createdAt) }}</dd>
                </div>
              </dl>
            </div>

            <div class="space-y-4">
              <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 class="text-sm font-semibold text-slate-900">Informasi Pengusul</h4>
                <dl class="mt-4 space-y-3 text-sm">
                  <div>
                    <dt class="text-slate-500">Nama</dt>
                    <dd class="font-medium text-slate-800">{{ detail.owner?.name || detail.leadName || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-slate-500">Email</dt>
                    <dd class="font-medium text-slate-800">{{ detail.owner?.email || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-slate-500">Rumpun Ilmu</dt>
                    <dd class="font-medium text-slate-800">
                      {{ detail.scientificFieldLevel1 }} / {{ detail.scientificFieldLevel2 }} / {{ detail.scientificFieldLevel3 }}
                    </dd>
                  </div>
                </dl>
              </section>

              <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 class="text-sm font-semibold text-slate-900">Anggota</h4>
                <div class="mt-4 space-y-4 text-sm">
                  <div>
                    <p class="mb-2 font-medium text-slate-700">Dosen</p>
                    <div v-if="detail.serviceMembers?.length" class="space-y-2">
                      <div
                        v-for="member in detail.serviceMembers"
                        :key="member.id || `${member.nidn}-${member.name}`"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <p class="font-medium text-slate-800">{{ member.name }}</p>
                        <p class="text-slate-500">{{ member.nidn }} - {{ member.duty }}</p>
                      </div>
                    </div>
                    <p v-else class="text-slate-500">Belum ada anggota dosen.</p>
                  </div>

                  <div>
                    <p class="mb-2 font-medium text-slate-700">Mahasiswa</p>
                    <div v-if="detail.studentMembers?.length" class="space-y-2">
                      <div
                        v-for="member in detail.studentMembers"
                        :key="member.id || `${member.identityNumber}-${member.name}`"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <p class="font-medium text-slate-800">{{ member.name }}</p>
                        <p class="text-slate-500">{{ member.identityNumber }} - {{ member.duty }}</p>
                      </div>
                    </div>
                    <p v-else class="text-slate-500">Belum ada anggota mahasiswa.</p>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h4 class="text-lg font-semibold text-slate-900">Dokumen Proposal</h4>
              </div>
            </div>

            <div v-if="detail.inputMode === ProposalInputMode.UPLOAD" class="space-y-4">

              <iframe
                v-if="canPreviewPdf"
                :src="fileUrl"
                class="h-[70vh] w-full rounded-xl border border-slate-200"
                title="Preview proposal PDF"
              />

              <div
                v-else
                class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
              >
                Preview hanya tersedia untuk file PDF.
              </div>

              <a
                v-if="fileUrl"
                :href="fileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Buka file di tab baru
              </a>
            </div>

            <div v-else class="overflow-hidden rounded-xl border border-slate-200">
              <iframe
                :srcdoc="reviewDocument"
                sandbox="allow-same-origin"
                class="h-[70vh] w-full bg-white"
                title="Preview proposal editor"
              />
            </div>
          </section>
        </div>
      </div>

      <div class="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
        <p v-if="submitError" class="mb-3 text-sm text-rose-600">{{ submitError }}</p>

        <div v-if="!readOnly" class="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="submitPending || detail?.status === ProposalStatus.REJECTED"
            @click="updateStatus(ProposalStatus.REJECTED)"
          >
            {{ pendingStatus === ProposalStatus.REJECTED ? 'Menyimpan...' : 'Reject' }}
          </button>

          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="submitPending || detail?.status === ProposalStatus.APPROVED"
            @click="updateStatus(ProposalStatus.APPROVED)"
          >
            {{ pendingStatus === ProposalStatus.APPROVED ? 'Menyimpan...' : 'Approve' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
