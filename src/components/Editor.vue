<script setup>
import { ref } from "vue";
import Quill from "quill";
import hljs from "highlight.js";
import { invoke } from "@tauri-apps/api/tauri";
import { onMounted } from "vue";
import { KeyValueStore } from "../db/index";
import { v4 as uuidv4 } from "uuid";
import moment from 'moment'
let quill;
const store = new KeyValueStore();
const currentNote = ref(null)
class CustomQuillModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.quill.root.addEventListener("keydown", this.handleKeyDown.bind(this));
    // 监听文本变化事件
    // this.quill.on('text-change', this.onTextChange.bind(this));
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      // 阻止默认的回车行为
      event.preventDefault();
      const text = editor.innerText;
      // 获取当前光标位置
      const selection = this.quill.getSelection();
      const isFaster = /\/(h1|h2|h3|h4|h5|p|code)\s/.test(text);
      if (selection) {
        const { index, length } = selection;
        // 获取当前行的内容
        const [line, offset] = this.quill.getLine(index);
        // 在这里执行自定义操作
        console.log(
          "Enter key pressed at index:",
          index,
          isFaster,
          line,
          offset
        );
        // if (isFaster) {
        //   // 获取当前光标所在的叶子节点
        //   const [leaf, offset] = this.quill.getLeaf(index);

        //   // 获取当前行的内容
        //   let lineContent = "";
        //   let currentLeaf = leaf;
        //   while (currentLeaf && currentLeaf.parent) {
        //     if (currentLeaf.parent.domNode.nodeName === "P") {
        //       lineContent = currentLeaf.parent.domNode.textContent.trim();
        //       break;
        //     }
        //     currentLeaf = currentLeaf.parent;
        //   }

        //   // 删除当前行的内容
        //   this.quill.deleteText(
        //     index - lineContent.length,
        //     lineContent.length,
        //     Quill.sources.USER
        //   );

        //   // 插入一个新的 <h3> 标签
        //   this.quill.insertText(
        //     index - lineContent.length,
        //     lineContent,
        //     "header",
        //     3,
        //     Quill.sources.USER
        //   );
        //   this.quill.insertText(index, "\n", Quill.sources.USER);
        //   this.quill.setSelection(index + 1, 0, Quill.sources.USER);
        //   console.log("fiunishs", lineContent);
        // }
        // 示例：插入一个新段落
        // this.quill.insertText(index, "\n", Quill.sources.USER);
        // this.quill.setSelection(index + 1, 0, Quill.sources.USER);
      }
    }
  }
}
// const Parchment = Quill.import('parchment');
// const registry = new Parchment.Registry();
// registry.register(CustomQuillModule)
Quill.register("modules/faster", CustomQuillModule);
Quill.register("modules/counter", function (quill, options) {
  var container = document.querySelector("#counter");
  quill.on("text-change", function () {
    var text = quill.getText();
    // There are a couple issues with counting words
    // this way but we'll fix these later
    container.innerText = text.split(/\s+/).length;
  });
});

const saveNote = async () => {
  const isUpdate = currentNote.value?.uid;
  const obj = isUpdate ? JSON.parse(JSON.stringify(currentNote.value)) : {}
  if (!isUpdate) {
    obj.uid =  uuidv4();
    obj.createTm = moment().format('YYYY-MM-DD hh:mm:ss');
    obj.updateTm = createTm
  }
  const delta = quill.getContents();
  const ops = delta?.ops
  // 图片等文件需要特殊处理存储下来
  obj.data = ops
  await store.set(obj.uid, JSON.stringify(obj))
  console.log('save Success');
  if (!isUpdate) currentNote.value = obj

};

const testGetData = async () => {
  const list = await store.getAll()
  const item = list[list.length - 1]
  try {
    currentNote.value = JSON.parse(item.value)
          quill.setContents(currentNote.value?.data, 'user')
    console.warn(currentNote.value)
  } catch (e) {
    console.error('parser data error', e)
  }
}

const initEditor = () => {
  // hljs.configure({   // optionally configure hljs
  //   languages: ['javascript', 'ruby', 'python']
  // });
  if (quill) return;
  quill = new Quill("#editor", {
    theme: "snow",
    // registry,
    modules: {
      syntax: { hljs },
      counter: true,
      faster: true,
      toolbar: [
        ["bold", "italic", "underline", "strike", "code-block"],
        [{ color: [] }, { background: [] }],
        // [{ list: "ordered" }, { list: "bullet" }],
        // [{ indent: "-1" }, { indent: "+1" }],
        // [{ align: [] }],
        // ["link", "image"],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["clean"],
      ],
    },
    placeholder: "Compose an epic...",
    // theme: "bubble",
  });
  // 快捷按键
  quill.keyboard.addBinding(
    {
      key: "b",
      shortKey: true,
    },
    function (range, context) {
      this.quill.formatText(range, "bold", true);
    }
  );
  quill.keyboard.addBinding(
    {
      key: "e",
      shortKey: true,
    },
    function (range, context) {
      this.quill.formatText(range, "code-block", true);
    }
  );
};

onMounted(async () => {
  initEditor();
  await testGetData()
});

defineExpose({ saveNote });
</script>

<template>
  <div class="editor-box">
    <div id="editor"></div>
    <div id="counter">0</div>
  </div>
</template>

<style lang="scss" scoped>
.editor-box {
  width: 100%;
  height: 100%;
  // padding: 10px 20px;
  box-sizing: border-box;
}
#editor {
  width: 100%;
  height: 100%;
}
</style>
