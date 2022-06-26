<template>
  <div class="about">
    <br />
    <h1>About</h1>
    <div v-html="renderedHTML" class="markdown-body" style="background: none"></div>
  </div>
</template>

<script lang="ts" setup>
import MarkdownIt from "markdown-it";
import { ref } from "vue";

const md = new MarkdownIt();
const source = ref(
  "## :sparkles: *Hello world* :sparkles:\n" + "```python\n" + 'print("Hello World")\n' + "```\n" + "\n",
);
const renderedHTML = md.render(source.value);
</script>

<style lang="scss" scoped></style>
