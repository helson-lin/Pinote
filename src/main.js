import { createApp } from "vue";
import App from "./App.vue";
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import './assets/css/global.css'
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import './assets/css/resetQuill.css'

import {
    // create naive ui
    create,
    // component
    NTree,
    NButton
  } from 'naive-ui'
  
  const naive = create({
    components: [NButton,NTree]
  })
createApp(App)
.use(naive)
.mount("#app");
