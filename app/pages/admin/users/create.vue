<script setup lang="ts">
import { reactive, ref } from 'vue'
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
	layout: false,
	middleware: 'auth',
	requiredRole: 'ADMIN',
})

const { apiFetch } = useApi()

const form = reactive({
	name: '',
	email: '',
	password: '',
	role: 'PROPOSAL_SUBMITTER',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitUser = async () => {
	isSubmitting.value = true
	errorMessage.value = ''
	successMessage.value = ''

	try {
		await apiFetch('/api/user', {
			method: 'POST',
			body: {
				name: form.name,
				email: form.email,
				password: form.password,
				role: form.role,
			},
		})

		successMessage.value = 'User berhasil ditambahkan'
		form.name = ''
		form.email = ''
		form.password = ''
		form.role = 'PROPOSAL_SUBMITTER'
	} catch (error: any) {
		errorMessage.value = error?.data?.message || error?.message || 'Gagal menambahkan user'
	} finally {
		isSubmitting.value = false
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
					<div class="mb-6">
						<h1 class="text-2xl font-semibold text-gray-900">Tambah User</h1>
						<p class="mt-2 text-base text-gray-500">Tambahkan akun user baru ke sistem</p>
					</div>

					<form class="w-full max-w-2xl space-y-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-6" @submit.prevent="submitUser">
						<div>
							<label class="mb-1.5 block text-sm font-medium text-gray-700">Nama</label>
							<input
								v-model="form.name"
								type="text"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
								placeholder="Masukkan nama"
							>
						</div>

						<div>
							<label class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
							<input
								v-model="form.email"
								type="email"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
								placeholder="Masukkan email"
							>
						</div>

						<div>
							<label class="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
							<input
								v-model="form.password"
								type="password"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
								placeholder="Masukkan password"
							>
						</div>

						<div>
							<label class="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
							<select
								v-model="form.role"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
							>
								<option value="PROPOSAL_SUBMITTER">Dosen</option>
								<option value="PROPOSAL_REVIEWER">LPPM</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>

						<p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
						<p v-if="successMessage" class="text-sm text-emerald-600">{{ successMessage }}</p>

						<div class="flex items-center justify-end gap-3 pt-2">
							<NuxtLink
								to="/admin/users"
								class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
							>
								Kembali
							</NuxtLink>

							<button
								type="submit"
								:disabled="isSubmitting"
								class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
							>
								{{ isSubmitting ? 'Menyimpan...' : 'Simpan User' }}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	</div>
</template>
