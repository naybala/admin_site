<!-- RichEditor.vue -->
<template>
  <div>
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 mb-2">
      <!-- Text styles -->
      <button @click="toggleBold($event)" :class="{ active: isBold }">
        Bold
      </button>
      <button @click="toggleItalic($event)" :class="{ active: isItalic }">
        Italic
      </button>
      <button @click="toggleStrike($event)" :class="{ active: isStrike }">
        Strike
      </button>

      <!-- Headings -->
      <button @click="setHeading(1, $event)" :class="{ active: isHeading(1) }">
        H1
      </button>
      <button @click="setHeading(2, $event)" :class="{ active: isHeading(2) }">
        H2
      </button>
      <button @click="setHeading(3, $event)" :class="{ active: isHeading(3) }">
        H3
      </button>

      <!-- Paragraph -->
      <button @click="setParagraph($event)" :class="{ active: isParagraph }">
        Paragraph
      </button>

      <!-- Lists -->
      <button @click="toggleBulletList($event)" :class="{ active: isBullet }">
        • List
      </button>
      <button @click="toggleOrderedList($event)" :class="{ active: isOrdered }">
        1. List
      </button>

      <!-- Links -->
      <button @click="setLink($event)">🔗 Link</button>
      <button @click="unsetLink($event)">❌ Unlink</button>

      <!-- Color -->
      <input type="color" @input="setColor" />

      <!-- Image upload -->
      <input
        type="file"
        accept="image/*"
        @change="onImageSelected($event)"
        class="hidden"
        ref="fileInput"
        multiple
      />
      <button @click="triggerFileInput($event)">🖼️ Images (Multiple)</button>

      <!-- Undo / Redo -->
      <button @click="undo($event)" :disabled="!canUndo">↩️ Undo</button>
      <button @click="redo($event)" :disabled="!canRedo">↪️ Redo</button>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" class="rounded border p-3 min-h-[200px]" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { apiRequest } from "@/composables/common/useApi";

type PresignedUrl = { filename: string; key: string; url: string };
type PresignedResponse = { success: boolean; data: { urls: PresignedUrl[] } };

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:uploadProgress", value: number[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<number[]>([]);

// Setup editor
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      link: false,
    }),
    Link.configure({ openOnClick: false }),
    TextStyle,
    Color,
    Image,
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

// Computed states
const isBold = computed(() => editor.value?.isActive("bold"));
const isItalic = computed(() => editor.value?.isActive("italic"));
const isStrike = computed(() => editor.value?.isActive("strike"));
const isBullet = computed(() => editor.value?.isActive("bulletList"));
const isOrdered = computed(() => editor.value?.isActive("orderedList"));
const isParagraph = computed(() => editor.value?.isActive("paragraph"));
const isHeading = (level: number) =>
  computed(() => editor.value?.isActive("heading", { level }));
const canUndo = computed(() => editor.value?.can().undo() ?? false);
const canRedo = computed(() => editor.value?.can().redo() ?? false);

// Toolbar actions
function toggleBold(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().toggleBold().run();
}
function toggleItalic(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().toggleItalic().run();
}
function toggleStrike(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().toggleStrike().run();
}
function setHeading(level: any, e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().setHeading({ level }).run();
}
function setParagraph(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().setParagraph().run();
}
function toggleBulletList(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().toggleBulletList().run();
}
function toggleOrderedList(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().toggleOrderedList().run();
}
function setLink(e: Event) {
  e.preventDefault();
  const url = prompt("Enter URL");
  if (url) editor.value?.chain().focus().setLink({ href: url }).run();
}
function unsetLink(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().unsetLink().run();
}
function setColor(e: Event) {
  e.preventDefault();
  const color = (e.target as HTMLInputElement).value;
  editor.value?.chain().focus().setColor(color).run();
}
function triggerFileInput(e: Event) {
  e.preventDefault();
  fileInput.value?.click();
}

async function onImageSelected(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;

  const fileArray = Array.from(files);

  // Step 1: Get presigned URLs
  const requestBody = {
    path: "news/description",
    imageFiles: fileArray.map((f) => ({
      filename: f.name,
      contentType: f.type,
    })),
  };

  const presignedResponse = await apiRequest<PresignedResponse>(
    "api/v1/web/get-presigned-urls",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    }
  );

  const presignedUrls = presignedResponse?.data?.urls;

  if (!presignedUrls) {
    console.error("Presigned URL generation failed");
    return;
  }

  // Initialize progress array
  uploadProgress.value = Array(fileArray.length).fill(0);
  emit("update:uploadProgress", [...uploadProgress.value]);

  // Step 2: Upload each file
  await Promise.all(
    presignedUrls.map(async (urlObj: any, index: number) => {
      const file = fileArray[index];
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", urlObj.url, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-amz-acl", "public-read");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            uploadProgress.value[index] = Math.round(
              (event.loaded / event.total) * 100
            );
            emit("update:uploadProgress", [...uploadProgress.value]);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            uploadProgress.value[index] = 100;
            emit("update:uploadProgress", [...uploadProgress.value]);
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () =>
          reject(new Error("Upload failed due to network error"));

        xhr.send(file);
      });
    })
  );

  // Step 3: Insert images into editor
  const imageHTML = presignedUrls
    .map(
      (urlObj: any) =>
        `<img src="https://proptechapp.sgp1.digitaloceanspaces.com/${urlObj.key}" alt="${urlObj.filename}" />`
    )
    .join("");

  editor.value?.chain().focus().insertContent(imageHTML).run();

  // Reset
  uploadProgress.value = [];
  emit("update:uploadProgress", []);
  target.value = "";
}

function undo(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().undo().run();
}

function redo(e: Event) {
  e.preventDefault();
  editor.value?.chain().focus().redo().run();
}

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
button {
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.active {
  font-weight: bold;
}
input[type="color"] {
  border: none;
  padding: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;
  appearance: none;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}
:deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.875rem 0;
  }
  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0.75rem 0;
  }
  p {
    margin: 0.5rem 0;
  }
  ul,
  ol {
    padding-left: 1.5rem;
    margin: 1.25rem 0;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
  li p {
    margin: 0.25em 0;
  }
}
</style>
