<script setup lang="ts">
const title = ref('')
const description = ref('')

const submitForm = () => {
  console.log({
    title: title.value,
    description: description.value,
  })
}
</script>

<template>
  <form class="space-y-4 rounded-xl border p-4" @submit.prevent="submitForm">
    <div class="space-y-2">
      <label class="block text-sm font-medium">Judul</label>
      <input
        v-model="title"
        type="text"
        class="w-full rounded-lg border px-3 py-2 outline-none"
        placeholder="Masukkan judul proposal"
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium">Deskripsi</label>
      <textarea
        v-model="description"
        class="w-full rounded-lg border px-3 py-2 outline-none"
        rows="5"
        placeholder="Masukkan deskripsi proposal"
      />
    </div>

    <AppButton label="Simpan Proposal" type="submit" />
  </form>
</template>