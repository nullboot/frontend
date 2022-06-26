<template>
  <div class="dialog-title">
    <div class="title">
      <el-icon :size="30">
        <component :is="icon" />
      </el-icon>
      <span>{{ title }}</span>
    </div>
    <div class="buttons">
      <slot name="buttons">
        <el-button type="info" plain @click="emit('close')">取消</el-button>
        <el-button type="primary" @click.prevent="emit('submit')" :loading="submitLoading" :disabled="!allowSubmit"
          >保存
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Edit } from "@element-plus/icons-vue";
import { PropType } from "vue";

defineProps({
  title: {
    type: String,
    default: "编辑",
  },
  icon: {
    type: Object as PropType<typeof Edit>,
    default: Edit,
  },
  submitLoading: {
    type: Boolean,
    default: false,
  },
  allowSubmit: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close", "submit"]);
</script>

<style lang="scss" scoped>
.dialog-title {
  .title {
    display: inline-flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;

    .el-icon {
      margin-right: 5px;
    }
  }

  .buttons {
    float: right;
    align-items: center;
    margin-right: -16px;
  }
}
</style>
