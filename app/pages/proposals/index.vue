<!-- Kalau modulnya banyak dijadiin satu folder pages/proposals/ .vue .vue .vue -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Daftar Proposal</h1>
      <NuxtLink
        to="/proposals/create"
        class="rounded-lg bg-black px-4 py-2 text-white"
      >
        Tambah Proposal
      </NuxtLink>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <ProposalCard title="Proposal A" description="Deskripsi proposal A" />
      <ProposalCard title="Proposal B" description="Deskripsi proposal B" />
    </div>
  </div>
</template>