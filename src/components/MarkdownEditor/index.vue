<template>
  <editor
    :options="editorOptions"
    initialEditType="markdown"
    :height="height"
    @change="onEditorChange"
    ref="toastuiEditor"
  />
</template>

<script>
// deps for editor
import "codemirror/lib/codemirror.css"; // Editor's Dependency Style
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style

import { Editor } from "@toast-ui/vue-editor";
import defaultOptions from "./default-options";

export default {
  name: "MarkdownEditor",
  components: {
    editor: Editor,
  },
  props: {
    /* 占位符 */
    placeholder: {
      type: String,
      required: false
    },
    /* 编辑器高度 */
    height: {
      type: String,
      required: true,
      default: "500px"
    }
  },
  computed: {
    /* 编辑器操作设置 */
    editorOptions() {
      return {
        ...defaultOptions,
        placeholder: this.placeholder
      };
    },
  },
  methods: {
    /* 监听编辑器改变 */
    onEditorChange() {
      // 向父组件发射值改变事件
      this.$emit("inputContent", this.getHtml());
    },
    /* 获取输入文本  */
    getHtml() {
      return this.$refs.toastuiEditor.invoke("getHtml");
    },
  },
};
</script>
