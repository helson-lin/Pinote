<script setup>
import { ref } from "vue";
import { NTree } from "naive-ui";
const defaultExpandedKeys = ref([]);
const toolbars = [
    {
        icon: 'FolderAddOutlined'
    }
]
const data = ref([
  {
    label: "根目录",
    key: "0-1",
    children: [
        {
            label: "根目录2",
            key: "0-1-1",
        }
    ],
  },
]);
</script>
<template>
  <div class="menu-folder">
    <!-- 工具 -->
     <div class="toolbar">
        <span class="icon" v-for="item in toolbars" :key="item.icon">
        </span>
     </div>
     <div class="folder"></div>
    <n-tree
      block-line
      :data="data"
      :default-expanded-keys="defaultExpandedKeys"
      key-field="key"
      label-field="label"
      children-field="children"
      selectable
    />
  </div>
</template>
<style lang="scss" scoped>
.menu-folder {
    width: 140px;
    height: 100%;
}
</style>
