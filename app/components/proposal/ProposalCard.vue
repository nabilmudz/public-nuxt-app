<!-- components/fitur/ buat simpen kumpulan component yang dipakai di satu fitur tertentu -->
<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="rounded-xl border p-4 shadow-sm">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p class="mt-2 text-sm text-gray-600">{{ description }}</p>
  </div>
</template>