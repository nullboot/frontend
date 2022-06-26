<template>
  <section class="app-wrapper">
    <router-view v-slot="{ Component }">
      <div class="app-main">
        <!-- transition中的component必须在单一div下 -->
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" :key="key" />
        </transition>
      </div>
    </router-view>
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const key = computed(() => {
  return route.path;
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  /* 50 = navbar height  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;

  .app-main {
    padding: 20px;
  }
}
</style>
