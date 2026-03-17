<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'
import ProposalReviewModal from '~/components/proposal/ProposalReviewModal.vue'
import type { Proposal } from '~/types/proposal'
import { ProposalStatus } from '~/types/proposal'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'PROPOSAL_REVIEWER',
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

type ProposalListResponse = {
  success: boolean
  message: string
  data: Proposal[]
}

const {
  data: proposalResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<ProposalListResponse>('reviewer-proposal-list', async () => {
  const response = await $fetch<ProposalListResponse>(`${config.public.apiBase}/api/proposal`, {
    headers: accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : undefined,
  })

  return {
    success: response.success ?? true,
    message: response.message ?? '',
    data: response.data ?? [],
  }
}, {
  default: () => ({
    success: true,
    message: '',
    data: [],
  }),
  server: false,
  watch: [accessToken],
})

const proposals = computed(() =>
  (proposalResponse.value?.data ?? [])
    .filter(item => item.status !== ProposalStatus.DRAFT)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime()
      const bTime = new Date(b.createdAt ?? 0).getTime()
      return bTime - aTime
    }),
)

const selectedProposalId = ref<string | null>(null)
const showProposalModal = ref(false)
const modalReadOnly = ref(false)

const formatDate = (value?: string) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const statusClass = (status: ProposalStatus) => {
  if (status === ProposalStatus.SUBMITTED) {
    return 'bg-amber-100 text-amber-700'
  }

  if (status === ProposalStatus.APPROVED) {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === ProposalStatus.REJECTED) {
    return 'bg-rose-100 text-rose-700'
  }

  return 'bg-slate-100 text-slate-700'
}

const openProposalModal = (proposalId: string, readOnly: boolean) => {
  selectedProposalId.value = proposalId
  modalReadOnly.value = readOnly
  showProposalModal.value = true
}

const closeProposalModal = () => {
  showProposalModal.value = false
  selectedProposalId.value = null
  modalReadOnly.value = false
}

const handleReviewed = async () => {
  await refresh()
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 lg:h-screen lg:overflow-hidden">
    <div class="flex min-h-screen flex-col lg:h-full lg:min-h-0 lg:flex-row">
      <Sidebar />

      <main class="scrollbar-hide w-full flex-1 bg-slate-50 lg:min-h-0 lg:overflow-y-auto">
        <Header />

        <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div class="mb-6">
            <h1 class="text-2xl font-semibold text-gray-900">Daftar Proposal</h1>
            <p class="mt-2 text-base text-gray-500">Review dan lihat detail proposal yang sudah dikirim.</p>
          </div>

          <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div v-if="pending" class="py-10 text-center text-sm text-slate-500">
              Memuat data proposal...
            </div>

            <div
              v-else-if="error"
              class="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              Gagal memuat data proposal.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Judul
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ketua
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Kategori
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Dibuat
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr
                    v-for="item in proposals"
                    :key="item.id"
                    class="hover:bg-slate-50"
                  >
                    <td class="px-4 py-4">
                      <div class="max-w-xs">
                        <p class="line-clamp-2 font-medium text-slate-900">
                          {{ item.title }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                          {{ item.scopeLevel }} • {{ item.focusValue }}
                        </p>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-sm text-slate-700">
                      {{ item.leadName }}
                    </td>

                    <td class="px-4 py-4 text-sm text-slate-700">
                      {{ item.category }}
                    </td>

                    <td class="px-4 py-4">
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="statusClass(item.status)"
                      >
                        {{ item.status }}
                      </span>
                    </td>

                    <td class="px-4 py-4 text-sm text-slate-700">
                      {{ formatDate(item.createdAt) }}
                    </td>

                    <td class="px-4 py-4">
                      <div class="flex justify-center gap-2">
                        <button
                          v-if="item.status === ProposalStatus.SUBMITTED"
                          type="button"
                          class="rounded border border-amber-500 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
                          @click="openProposalModal(item.id, false)"
                        >
                          Review
                        </button>

                        <button
                          v-else
                          type="button"
                          class="rounded border border-blue-500 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          @click="openProposalModal(item.id, true)"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!proposals.length">
                    <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500">
                      Belum ada data proposal.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>

    <ProposalReviewModal
      v-model="showProposalModal"
      :proposal-id="selectedProposalId"
      :read-only="modalReadOnly"
      @reviewed="handleReviewed"
      @update:model-value="value => !value && closeProposalModal()"
    />
  </div>
</template>
