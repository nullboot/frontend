<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header">
        <topbar />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <sidebar :route-array="routeArray" />
        </el-aside>
        <el-main>
          <app-wrapper />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { Topbar, Sidebar } from "@/layout";
import AppWrapper from "@/layout/app-wrapper/app-wrapper.vue";
import { storeToRefs } from "pinia";
import { useRouteStore } from "@/stores/route";

const routeStore = useRouteStore();
const { sidebarRoutes: routeArray } = storeToRefs(routeStore);
</script>
<style lang="scss">
.main-layout {
  .header {
    padding: 0;
    height: 50px;
    z-index: 1;
  }

  .el-main {
    padding: 0;
  }
}
</style>
