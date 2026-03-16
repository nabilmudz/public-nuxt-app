<script setup lang="ts">
import Sidebar from '~/components/ui/AppSidebar.vue'
import Header from '~/components/ui/AppHeader.vue'

definePageMeta({
	layout: false,
	middleware: 'auth',
})

const { user } = useAuth()
</script>

<template>
	<div class="h-screen w-screen bg-gray-100">
		<div class="flex h-full w-full">
			<Sidebar />

			<main class="flex-1 overflow-y-auto bg-gray-50">
				<Header />

				<div class="space-y-8 px-8 py-6">
					<section>
						<h2 class="mb-5 text-3xl font-semibold text-gray-900">
								Selamat datang, {{ user?.name || 'User' }}
							</h2>

						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<article class="rounded-lg bg-white px-5 py-4 shadow-sm">
								<div class="flex items-center gap-3">
									<div class="rounded-xl bg-blue-100 p-3 text-blue-600">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
												<path d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V8.56a1.5 1.5 0 0 0-.44-1.06l-3.06-3.06a1.5 1.5 0 0 0-1.06-.44h-5.94Z" />
											</svg>
										</div>
										<div>
											<p class="text-sm text-gray-500">Total Pengajuan</p>
											<p class="text-3xl font-bold text-blue-600">2</p>
										</div>
									</div>
								</article>

							<article class="rounded-lg bg-white px-5 py-4 shadow-sm">
								<div class="flex items-center gap-3">
									<div class="rounded-xl bg-amber-100 p-3 text-amber-500">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
												<path
													fill-rule="evenodd"
													d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 7.5a.75.75 0 0 0-1.5 0v5.25c0 .199.079.39.22.53l2.25 2.25a.75.75 0 1 0 1.06-1.06l-2.03-2.03V7.5Z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
										<div>
											<p class="text-sm text-gray-500">Pending Review</p>
											<p class="text-3xl font-bold text-amber-500">1</p>
										</div>
									</div>
								</article>

								<article class="rounded-lg bg-white px-5 py-4 shadow-sm">
									<div class="flex items-center gap-3">
										<div class="rounded-xl bg-green-100 p-3 text-green-600">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
												<path
													fill-rule="evenodd"
													d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.443-1.443a.75.75 0 1 0-1.06 1.06l2.062 2.063a.75.75 0 0 0 1.14-.094l3.757-5.244Z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
										<div>
											<p class="text-sm text-gray-500">Lolos Seleksi</p>
											<p class="text-3xl font-bold text-green-600">3</p>
										</div>
									</div>
								</article>
							</div>
						</section>

						<section>
							<p class="mb-4 text-lg text-gray-600">Anda dapat mengajukan usulan terkait dengan layanan berikut</p>
							<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<button class="flex items-center justify-center gap-4 rounded-lg bg-white py-7 shadow-sm" type="button">
									<span class="rounded-full bg-blue-500 p-3 text-white">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
											<path
												fill-rule="evenodd"
												d="M10.5 3a7.5 7.5 0 1 0 4.673 13.369l4.229 4.229a.75.75 0 1 0 1.06-1.06l-4.228-4.228A7.5 7.5 0 0 0 10.5 3ZM4.5 10.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
												clip-rule="evenodd"
											/>
										</svg>
									</span>
									<span class="text-2xl font-semibold text-gray-700">Penelitian</span>
								</button>

							<button class="flex items-center justify-center gap-4 rounded-lg bg-white py-7 shadow-sm" type="button">
								<span class="rounded-full bg-blue-500 p-3 text-white">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
											<path
												fill-rule="evenodd"
												d="M11.48 3.499a.75.75 0 0 1 1.04 0l2.5 2.375 3.42-.394a.75.75 0 0 1 .782.964l-1.191 3.21 1.95 2.86a.75.75 0 0 1-.305 1.104l-3.134 1.517-.94 3.324a.75.75 0 0 1-.963.518l-3.138-1.304-3.138 1.304a.75.75 0 0 1-.962-.518l-.941-3.324-3.133-1.517a.75.75 0 0 1-.305-1.104l1.95-2.86-1.191-3.21a.75.75 0 0 1 .782-.964l3.42.394 2.497-2.375Z"
												clip-rule="evenodd"
											/>
										</svg>
									</span>
									<span class="text-2xl font-semibold text-gray-700">Pengabdian</span>
								</button>
						</div>
					</section>

					<section>
						<h3 class="text-3xl font-semibold text-gray-900">Status Usulan Terakhir</h3>
						<p class="mb-8 mt-2 text-base text-gray-500">Lihat Status Usulan Terakhir Anda</p>

						<div class="relative mt-8">
								<div class="h-1 w-full bg-gray-300" />
								<div class="absolute left-0 top-0 h-1 w-1/4 bg-blue-500" />

								<div class="absolute -top-2 left-[12.5%] h-5 w-5 -translate-x-1/2 rounded-full bg-blue-500 ring-4 ring-white" />
								<div class="absolute -top-2 left-[37.5%] h-5 w-5 -translate-x-1/2 rounded-full bg-gray-300 ring-4 ring-white" />
								<div class="absolute -top-2 left-[62.5%] h-5 w-5 -translate-x-1/2 rounded-full bg-gray-300 ring-4 ring-white" />
								<div class="absolute -top-2 left-[87.5%] h-5 w-5 -translate-x-1/2 rounded-full bg-gray-300 ring-4 ring-white" />
							</div>

						<div class="mt-7 grid grid-cols-4 text-center text-xs text-blue-500">
								<div>
									<p class="font-medium">Tahapan Seleksi/Usulan</p>
									<p class="mt-1 text-[11px] text-gray-500">13-03-2026</p>
								</div>
								<div>
									<p class="font-medium">Tahapan Pelaksanaan Kegiatan</p>
								</div>
								<div>
									<p class="font-medium">Tahapan Seleksi Lanjutan</p>
								</div>
								<div>
									<p class="font-medium">Tahapan Pasca Pelaksanaan Kegiatan</p>
								</div>
						</div>
					</section>
				</div>
			</main>
			</div>
		</div>
</template>
