<script setup lang="ts">
import { reactive, ref } from 'vue'
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
  requiredRole: 'ADMIN',
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

type UserItem = {
  id: string
  name: string
  email: string
  role: string
  password?: string
}

type UsersResponse = {
  data?: UserItem[]
  users?: UserItem[]
  items?: UserItem[]
}

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const isSubmitting = ref(false)
const isEditSubmitting = ref(false)
const isDeleteSubmitting = ref(false)
const createError = ref('')
const editError = ref('')
const deleteError = ref('')
const editingUserId = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)
const deletingUserName = ref('')

const createForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'PROPOSAL_SUBMITTER',
})

const editForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'PROPOSAL_SUBMITTER',
})

// fetch data user dari API
const { data: users, pending, error, refresh } = await useFetch<UserItem[]>('/api/user', {
  baseURL: config.public.apiBase,
  headers: accessToken.value
  ? { Authorization: `Bearer ${accessToken.value}` }
  : undefined,
  transform: (response: UserItem[] | UsersResponse) => {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.users)) return response.users
    if (Array.isArray(response?.items)) return response.items
    return []
  },
  default: () => [],
})

const resetCreateForm = () => {
  createForm.name = ''
  createForm.email = ''
  createForm.password = ''
  createForm.role = 'PROPOSAL_SUBMITTER'
  createError.value = ''
}

const openCreateModal = () => {
  resetCreateForm()
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const openEditModal = (user: UserItem) => {
  editingUserId.value = user.id
  editForm.name = user.name
  editForm.email = user.email
  editForm.password = ''
  editForm.role = user.role
  editError.value = ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUserId.value = null
  editError.value = ''
  editForm.password = ''
}

const submitCreateUser = async () => {
  isSubmitting.value = true
  createError.value = ''

  try {
    await $fetch(`${config.public.apiBase}/api/user`, {
      method: 'POST',
      headers: accessToken.value
        ? { Authorization: `Bearer ${accessToken.value}` }
        : undefined,
      body: {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
      },
    })

    await refresh()
    closeCreateModal()
  } catch (err: any) {
    createError.value = err?.data?.message || err?.message || 'Gagal menambahkan user'
  } finally {
    isSubmitting.value = false
  }
}

const submitEditUser = async () => {
  if (!editingUserId.value) return

  isEditSubmitting.value = true
  editError.value = ''

  try {
    const body: Record<string, string> = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    }

    if (editForm.password) {
      body.password = editForm.password
    }

    await $fetch(`${config.public.apiBase}/api/user/${editingUserId.value}`, {
      method: 'PUT',
      headers: accessToken.value
        ? { Authorization: `Bearer ${accessToken.value}` }
        : undefined,
      body,
    })

    await refresh()
    closeEditModal()
  } catch (err: any) {
    editError.value = err?.data?.message || err?.message || 'Gagal mengubah user'
  } finally {
    isEditSubmitting.value = false
  }
}

const openDeleteModal = (user: UserItem) => {
  deletingUserId.value = user.id
  deletingUserName.value = user.name
  deleteError.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingUserId.value = null
  deletingUserName.value = ''
  deleteError.value = ''
}

const submitDeleteUser = async () => {
  if (!deletingUserId.value) return

  isDeleteSubmitting.value = true
  deleteError.value = ''

  try {
    await $fetch(`${config.public.apiBase}/api/user/${deletingUserId.value}`, {
      method: 'DELETE',
      headers: accessToken.value
        ? { Authorization: `Bearer ${accessToken.value}` }
        : undefined,
    })

    await refresh()
    closeDeleteModal()
  } catch (err: any) {
    deleteError.value = err?.data?.message || err?.message || 'Gagal menghapus user'
  } finally {
    isDeleteSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />

      <main class="w-full flex-1 overflow-y-auto bg-gray-50">
        <Header />

        <div class="px-4 py-6 sm:px-6 lg:px-8">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Data User</h1>
                <p class="mt-2 text-base text-gray-500">
                    Kelola user sistem di sini
                    </p>
                </div>

              <div class="flex sm:pt-1">
                    <button
                    type="button"
                    @click="openCreateModal"
                    class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                    Tambah User
                    </button>
                </div>
            </div>
          

          <!-- Loading -->
          <div v-if="pending" class="py-6 text-center text-gray-500">
            Loading data...
          </div>

          <!-- Error -->
          <div v-else-if="error" class="py-6 text-center text-red-500">
            Gagal mengambil data
            <pre>{{ error }}</pre>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto border border-gray-300 bg-white">
            <table class="w-full min-w-[760px] text-sm">
              <thead class="bg-gray-100 text-left text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Name</th>
                  <th class="px-3 py-3 font-semibold">Email</th>
                  <th class="px-3 py-3 font-semibold">Role</th>
                  <th class="px-3 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody class="text-gray-700">
                <tr
                  v-for="(user, index) in users"
                  :key="user.id || index"
                  class="border-t border-gray-200 even:bg-slate-100"
                >
                  <td class="px-4 py-2.5 font-semibold">
                    {{ user.name }}
                  </td>

                  <td class="px-3 py-2.5">
                    {{ user.email }}
                  </td>

                  <td class="px-3 py-2.5">
                    <span v-if="user.role === 'PROPOSAL_SUBMITTER'">Dosen</span>
                    <span v-else-if="user.role === 'PROPOSAL_REVIEWER' || user.role === 'PROPOSAL_REVIEWWER'">LPPM</span>
                    <span v-else>{{ user.role }}</span>
                  </td>
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <button
                      class="rounded-md bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                      type="button"
                      @click="openEditModal(user)"
                    >
                      Edit
                    </button>
                    <button
                      class="ml-2 rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                      type="button"
                      @click="openDeleteModal(user)"
                    >
                      Hapus
                    </button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="showCreateModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Tambah User</h2>
                <button
                  type="button"
                  class="text-sm text-gray-500 hover:text-gray-700"
                  @click="closeCreateModal"
                >
                  Tutup
                </button>
              </div>

              <form class="space-y-4" @submit.prevent="submitCreateUser">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    v-model="createForm.name"
                    type="text"
                    required
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="createForm.email"
                    type="email"
                    required
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                  <input
                    v-model="createForm.password"
                    type="password"
                    required
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    v-model="createForm.role"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                    <option value="PROPOSAL_SUBMITTER">Dosen</option>
                    <option value="PROPOSAL_REVIEWER">LPPM</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <p v-if="createError" class="text-sm text-red-500">{{ createError }}</p>

                <div class="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    @click="closeCreateModal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div
            v-if="showEditModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Edit User</h2>
                <button
                  type="button"
                  class="text-sm text-gray-500 hover:text-gray-700"
                  @click="closeEditModal"
                >
                  Tutup
                </button>
              </div>

              <form class="space-y-4" @submit.prevent="submitEditUser">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    required
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    required
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Password (opsional)</label>
                  <input
                    v-model="editForm.password"
                    type="password"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    v-model="editForm.role"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                  >
                    <option value="PROPOSAL_SUBMITTER">Dosen</option>
                    <option value="PROPOSAL_REVIEWER">LPPM</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <p v-if="editError" class="text-sm text-red-500">{{ editError }}</p>

                <div class="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    @click="closeEditModal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="isEditSubmitting"
                    class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {{ isEditSubmitting ? 'Menyimpan...' : 'Update' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div
            v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h2>
              <p class="mt-3 text-sm text-gray-600">
                Yakin ingin menghapus user <span class="font-semibold">{{ deletingUserName }}</span>?
              </p>

              <p v-if="deleteError" class="mt-3 text-sm text-red-500">{{ deleteError }}</p>

              <div class="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  @click="closeDeleteModal"
                >
                  Batal
                </button>
                <button
                  type="button"
                  :disabled="isDeleteSubmitting"
                  class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                  @click="submitDeleteUser"
                >
                  {{ isDeleteSubmitting ? 'Menghapus...' : 'Ya, Hapus' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>