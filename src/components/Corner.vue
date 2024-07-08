<script setup>
import { ref, getCurrentInstance, defineEmits } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
const showOperations = ref(false);
const loadImg = (iconName) =>
  new URL(`../assets/svg/${iconName}.svg`, import.meta.url).href;
const alwaysOnTop = ref(false);
// 设置窗口的层级
async function setWindowAlwaysOnTop() {
  await invoke("set_window_always_on_top", { alwaysOnTop: alwaysOnTop.value });
}

const emit = defineEmits(['save'])
const operations = ref([
  {
    iconPath: loadImg("save"),
    name: "Save",
    callback() {
      emit('save')
    },
  },
  {
    iconPath: loadImg("pin"),
    name: "Pin",
    callback() {
      alwaysOnTop.value = !alwaysOnTop.value;
      setWindowAlwaysOnTop();
    },
  },
]);
const closeOperations = () => (showOperations.value = false);
const enter = (event) => {
  var x = event.pageX; // 获取鼠标的水平位置
  var y = event.pageY; // 获取鼠标的垂直位置

  var screenWidth = window.innerWidth; // 窗口宽度
  var screenHeight = window.innerHeight; // 窗口高度

  // 判断鼠标是否在右下角位置（例如，距离右边和底部各10像素）
  var rightCornerX = screenWidth - 20;
  var rightCornerY = screenHeight - 20;

  if (x >= rightCornerX && y >= rightCornerY) {
    if (!showOperations.value) showOperations.value = true;
  }
};
</script>

<template>
  <div class="corner" @mousemove="enter">
    <div
      :class="{ 'corner-operations': true, open: showOperations }"
      @mouseleave="closeOperations"
    >
      <span
        class="op-item"
        v-for="btn in operations"
        :key="btn.name"
        @click="
          btn.callback && typeof btn.callback === 'function' && btn.callback()
        "
      >
        <img :src="`${btn.iconPath}`" />
        {{ btn.name }}</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.corner {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 70px;
  height: 40px;
  z-index: 2024;

  &-operations {
    --move-height: calc(-100% + 30px);
    position: absolute;
    background: var(--page-second-background-color);
    color: var(--primary-color);
    transform: translate(40px, 100px);
    transition: all 500ms ease;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &.open {
      transform: translate(-10px, var(--move-height));
      transition: all 500ms ease;
    }

    .op-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 5px 10px;
      box-sizing: border-box;
      img {
        width: 15px;
        height: 15px;
        margin-right: 10px;

        // svg {
        //   fill: var(--primary-color);
        // }
      }

      &:hover {
        border-radius: 6px;
        background-color: var(--page-third-background-color);
      }
    }
  }
}
</style>
