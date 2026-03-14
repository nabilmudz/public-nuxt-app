<!-- Component yang reusable -->
<script setup lang="ts">
defineProps<{
  label: string
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    class="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
  >
    {{ label }}
  </button>
</template>