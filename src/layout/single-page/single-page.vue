<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header">
        <topbar />
      </el-header>
      <el-container>
        <el-main>
          <section class="app-wrapper">
            <div class="app-main" :style="{ width }">
              <el-card class="app-main-card">
                <template #header>
                  <el-page-header @back="goBack">
                    <template #content>
                      <div class="app-main-card-title">{{ title }}</div>
                    </template>
                  </el-page-header>
                </template>
                <slot name="default" />
              </el-card>
            </div>
          </section>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { Topbar } from "@/layout";
import router from "@/router";

defineProps({
  title: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "80%",
  },
});

const goBack = () => router.back();
</script>

<style lang="scss" scoped>
.app-wrapper {
  /* 50 = navbar height  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;

  .app-main {
    margin-left: auto;
    margin-right: auto;
    padding: 20px;

    .app-main-card {
      min-height: calc(100vh - 50px - 40px);

      .app-main-card-title {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
  }
}
</style>
