<template>
  <el-rate v-model="displayScore" disabled show-score score-template="{value} / 5 分" disabled-void-color="#C6D1DE" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
});

const displayScore = computed(() => {
  return Number(((props.score / props.totalScore) * 5).toFixed(1));
});
</script>
