<template>
  <div v-html="renderedHTML" class="markdown-body"></div>
</template>

<script lang="ts" setup>
import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  source: {
    type: String,
    default: "",
  },
});

const markdownRenderer = new MarkdownIt().use(MarkdownItEmoji).use(MarkdownItHighlightjs).set({
  breaks: false, // Convert \n in paragraphs into <br>
  html: false, // Enable HTML tags in source
  langPrefix: "language-", // CSS language prefix for fenced blocks. Can be useful for external highlighters.
  linkify: false, // Autoconvert URL-like text to links
  quotes: "“”‘’", // Double + single quotes replacement pairs, when typographer enabled and smartquotes on.
  typographer: true, // Enable some language-neutral replacement + quotes beautification.
  xhtmlOut: false, // Use / to close single tags (<br />)
});

const renderedHTML = ref("");
const render = () => {
  renderedHTML.value = markdownRenderer.render(props.source);
};

onMounted(() => {
  render();
});

watch(
  () => props.source,
  () => {
    render();
  },
);
</script>

<style lang="scss" scoped>
@import "github-markdown-css/github-markdown.css";
@import "highlight.js/styles/github.css";

.markdown-body {
  background: none;
}
</style>
