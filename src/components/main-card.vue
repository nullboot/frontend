<template>
  <el-card class="main-card" :body-style="bodyStyle">
    <template #header v-if="title !== ''">
      <div class="main-card-header">
        <div class="main-card-title">
          <el-icon v-if="icon" class="main-card-icon" :size="30">
            <component :is="icon" />
          </el-icon>
          <span class="main-card-title">{{ title }}</span>
        </div>
        <div class="main-card-actions">
          <slot name="actions" />
        </div>
      </div>
    </template>
    <slot name="default" />
  </el-card>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Edit } from "@element-plus/icons-vue";

defineProps({
  title: {
    type: String as PropType<string>,
    default: "",
  },
  icon: {
    type: Object as PropType<typeof Edit | undefined>,
    default: undefined,
  },
  bodyStyle: {
    type: String as PropType<string>,
    default: "padding: 20px 30px 30px;",
  },
});
</script>

<style lang="scss" scoped>
.main-card {
  .main-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .main-card-title {
      display: flex;
      align-items: center;

      .main-card-icon {
        margin-right: 5px;
      }

      .main-card-title {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
  }
}
</style>
