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

const { user, accessToken } = useAuth()
const config = useRuntimeConfig()

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
} = await useAsyncData<ProposalListResponse>('reviewer-dashboard-proposals', async () => {
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

const reviewableProposals = computed(() =>
  (proposalResponse.value?.data ?? []).filter(
    item => item.status !== ProposalStatus.DRAFT,
  ),
)

const proposals = computed(() =>
  reviewableProposals.value.filter(
    item => item.status === ProposalStatus.SUBMITTED,
  ),
)
const selectedProposalId = ref<string | null>(null)
const showReviewModal = ref(false)

const submittedCount = computed(
  () =>
    proposals.value.filter(
      (item) => item.status === ProposalStatus.SUBMITTED
    ).length
)

const approvedCount = computed(
  () =>
    reviewableProposals.value.filter(
      (item) => item.status === ProposalStatus.APPROVED
    ).length
)

const rejectedCount = computed(
  () =>
    reviewableProposals.value.filter(
      (item) => item.status === ProposalStatus.REJECTED
    ).length
)

const latestProposals = computed(() => {
  return [...proposals.value]
    .sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime()
      const bTime = new Date(b.createdAt ?? 0).getTime()
      return bTime - aTime
    })
    .slice(0, 5)
})

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

const openReviewModal = (proposalId: string) => {
  selectedProposalId.value = proposalId
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedProposalId.value = null
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

        <div class="space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">
          <section>
            <h4 class="mb-5 text-2xl font-semibold text-gray-900">
              Selamat datang, {{ user?.name || 'User' }}
            </h4>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <article class="rounded-lg bg-white px-5 py-4 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="rounded-xl bg-amber-100 p-3 text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 7.5a.75.75 0 0 0-1.5 0v5.25c0 .199.079.39.22.53l2.25 2.25a.75.75 0 1 0 1.06-1.06l-2.03-2.03V7.5Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Submitted</p>
                    <p class="text-3xl font-bold text-amber-500">
                      {{ submittedCount }}
                    </p>
                  </div>
                </div>
              </article>

              <article class="rounded-lg bg-white px-5 py-4 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="rounded-xl bg-green-100 p-3 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.443-1.443a.75.75 0 1 0-1.06 1.06l2.062 2.063a.75.75 0 0 0 1.14-.094l3.757-5.244Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Approved</p>
                    <p class="text-3xl font-bold text-green-600">
                      {{ approvedCount }}
                    </p>
                  </div>
                </div>
              </article>

              <article class="rounded-lg bg-white px-5 py-4 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="rounded-xl bg-red-100 p-3 text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.28 6.22a.75.75 0 0 1 1.06 0L12 9.69l1.22-1.22a.75.75 0 1 1 1.06 1.06L13.06 10.75l1.22 1.22a.75.75 0 1 1-1.06 1.06L12 11.81l-1.22 1.22a.75.75 0 0 1-1.06-1.06l1.22-1.22-1.22-1.22a.75.75 0 0 1 0-1.06Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Rejected</p>
                    <p class="text-3xl font-bold text-red-600">
                      {{ rejectedCount }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
            <div class="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-xl font-semibold text-slate-900">
                  Proposal Terbaru
                </h3>
              </div>
            </div>

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
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Judul
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Ketua
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Kategori
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Status
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Dibuat
                    </th>
                    <th
                      class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr
                    v-for="item in latestProposals"
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
                          type="button"
                          class="rounded border border-amber-500 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
                          @click="openReviewModal(item.id)"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!latestProposals.length">
                    <td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">
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
      v-model="showReviewModal"
      :proposal-id="selectedProposalId"
      @reviewed="handleReviewed"
      @update:model-value="value => !value && closeReviewModal()"
    />
  </div>
</template>
