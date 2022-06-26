<template>
  <el-menu-item v-if="isLeaf" @click="router.push(routeItem.path)" :index="index">
    <el-icon>
      <component :is="props.routeItem.meta.icon" />
    </el-icon>
    <span>{{ props.routeItem.meta.name }}</span>
  </el-menu-item>
  <el-sub-menu v-else>
    <template #title>
      <el-icon>
        <component :is="props.routeItem.meta.icon" />
      </el-icon>
      <span>{{ props.routeItem.meta.name }}</span>
    </template>
    <sidebar-item
      v-for="(child, idx) in props.routeItem.children"
      :route-item="child"
      :key="child.path"
      :index="index + '-' + idx.toString()"
    />
  </el-sub-menu>
</template>

<script lang="ts" setup>
import { computed, PropType } from "vue";
import { RouteRecordRaw, useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  routeItem: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
});

const isLeaf = computed(() => {
  return !props.routeItem.children;
});
</script>
