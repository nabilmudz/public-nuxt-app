<template>
  <div class="editor-wrapper" v-if="editor">
    <div class="editor-toolbar">
      <button 
        @click="editor.chain().focus().toggleBold().run()" 
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <b>B</b>
      </button>
      <button 
        @click="editor.chain().focus().toggleItalic().run()" 
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <i>I</i>
      </button>
      <button 
        @click="editor.chain().focus().toggleStrike().run()" 
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <s>S</s>
      </button>
      <div class="divider"></div>
      <button 
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" 
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </button>
      <button 
        @click="editor.chain().focus().toggleBulletList().run()" 
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        • List
      </button>
    </div>

    <editor-content :editor="editor" class="editor-content-area" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

// Menerima v-model dari parent component (misal untuk isi proposal)
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

// Emit untuk mengupdate v-model
const emit = defineEmits(['update:modelValue'])

// Inisialisasi Tiptap
const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    // Setiap ada ketikan, kirim HTML-nya ke parent (v-model)
    emit('update:modelValue', editor.getHTML())
  },
})

// Pantau perubahan dari parent (jika data berubah dari luar, update editor)
watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value
  if (!isSame) {
    editor.value.commands.setContent(value, false)
  }
})
</script>

<style scoped>
/* Styling agar terlihat seperti WYSIWYG beneran */
.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.editor-toolbar {
  display: flex;
  gap: 5px;
  padding: 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ccc;
  align-items: center;
}

.editor-toolbar button {
  background: white;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: #e9ecef;
}

/* Penanda kalau tombol sedang aktif (misal teks lagi di-bold) */
.editor-toolbar button.is-active {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #ccc;
  margin: 0 5px;
}

/* Styling untuk area ketik */
/* Gunakan :deep() karena konten Tiptap di-generate secara dinamis */
:deep(.tiptap) {
  padding: 15px;
  min-height: 200px;
  outline: none; /* Hilangkan garis biru bawaan browser saat fokus */
}

:deep(.tiptap p) {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>