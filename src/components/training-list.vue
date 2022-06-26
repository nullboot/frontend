<template>
  <div class="training-list">
    <div class="filter">
      <slot name="filter" />
      <div class="option-buttons">
        <slot name="buttons">
          <el-button plain type="info" @click="emit('reset')" :icon="Refresh">重置筛选</el-button>
        </slot>
      </div>
    </div>
    <el-divider />
    <div class="pagination">
      <el-pagination
        v-model:currentPage="curPage"
        hide-on-single-page
        layout="prev, pager, next"
        :total="total"
        @current-change="(val) => emit('paginate', val)"
      />
    </div>
    <slot name="default" />
    <div class="pagination">
      <el-pagination v-model:currentPage="curPage" hide-on-single-page layout="prev, pager, next" :total="total" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { Refresh } from "@element-plus/icons-vue";

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["paginate", "reset"]);

const curPage = ref(props.currentPage);
watch(props, (newVal) => (curPage.value = newVal.currentPage));
watch(curPage, (newVal) => emit("paginate", newVal));
</script>

<style lang="scss" scoped>
.filter {
  display: inline;
  align-items: center;
  width: 100%;

  :deep(.el-form) {
    margin-bottom: -10px;
  }

  .option-buttons {
    float: right;
    margin-bottom: 10px;

    .el-button + .el-button {
      margin-left: 10px;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
}

.pagination + .list {
  margin-top: 20px;
}

.list + .pagination {
  margin-top: 20px;
}
</style>
