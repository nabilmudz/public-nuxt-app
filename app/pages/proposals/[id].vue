<script setup lang="ts">
  const route = useRoute()
definePageMeta({
  middleware: 'auth',
  requiredRole: 'PROPOSAL_SUBMITTER',
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Detail Proposal</h1>
    <p class="text-gray-600">ID Proposal: {{ route.params.id }}</p>
  </div>
</template>