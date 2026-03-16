<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Buat Proposal</h1>
    <ProposalForm />
  </div>
</template>