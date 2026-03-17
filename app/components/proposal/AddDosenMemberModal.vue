<script setup lang="ts">
type DosenMemberPayload = {
  nidn: string
  name: string
  duty: string
  status: 'Dosen'
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: DosenMemberPayload): void
}>()

const form = reactive<DosenMemberPayload>({
  nidn: '',
  name: '',
  duty: '',
  status: 'Dosen',
})

const resetForm = () => {
  form.nidn = ''
  form.name = ''
  form.duty = ''
  form.status = 'Dosen'
}

const closeModal = () => {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (open) => {
  if (open) {
    resetForm()
  }
})

const submitForm = () => {
  if (!form.nidn || !form.name || !form.duty) return

  emit('submit', {
    nidn: form.nidn,
    name: form.name,
    duty: form.duty,
    status: 'Dosen',
  })

  closeModal()
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div class="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Tambah Anggota Dosen</h3>
        <button
          type="button"
          class="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
          @click="closeModal"
        >
          Tutup
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="mb-1.5 block text-sm text-gray-800">NIDN</label>
          <input
            v-model="form.nidn"
            type="text"
            placeholder="Masukkan NIDN"
            class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-gray-800">Nama</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Masukkan nama dosen"
            class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-gray-800">Tugas</label>
          <input
            v-model="form.duty"
            type="text"
            placeholder="Masukkan tugas dosen"
            class="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-gray-800">Status</label>
          <input
            type="text"
            value="Dosen"
            disabled
            class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-600 outline-none"
          >
        </div>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="closeModal"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          @click="submitForm"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>
