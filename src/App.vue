<script setup>
import { ref, onMounted } from "vue";
import Editor from "./components/Editor.vue";
import Corner from "./components/Corner.vue";
import MenuFolder from "./components/Folder.vue"
const editorRef = ref(null);

onMounted(async () => {
  // const kvStore = new KeyValueStore();
  // await kvStore.set("1", "admin123");
  // const allData = await kvStore.getAll();
  // console.warn(allData);
});

const saveNote = () => {
  const editorEl = editorRef.value
  if (editorEl && editorEl.saveNote) {
    console.warn("save note");
    editorEl.saveNote()
  }
};
</script>

<template>
  <div class="container">
    <MenuFolder/>
    <Editor ref="editorRef" />
    <Corner @save="saveNote" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
}
</style>
