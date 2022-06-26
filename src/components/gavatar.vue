<template>
  <el-avatar :size="size" :src="src" @error="() => true">
    <el-avatar :icon="UserFilled" :size="size" />
  </el-avatar>
</template>

<script setup lang="ts">
import { UserFilled } from "@element-plus/icons-vue";
import { computed } from "vue";
import md5 from "md5";

const props = defineProps({
  size: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const src = computed(() => {
  return (
    "https://gravatar.loli.net/avatar/" + md5(props.email.trim().toLowerCase()) + `?s=${props.size}` + `&d=mp` + `&r=g`
  );
});
</script>
