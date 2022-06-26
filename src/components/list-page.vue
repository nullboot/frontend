<template>
  <div class="list-page">
    <div class="filter">
      <slot name="filter" />
      <div class="option-buttons" v-if="!hideButtons">
        <slot name="buttons">
          <el-button plain type="info" @click="emit('reset')" :icon="Refresh">重置筛选</el-button>
        </slot>
      </div>
    </div>
    <slot name="default" />
    <div class="pagination">
      <el-pagination
        v-model:currentPage="curPage"
        v-model:page-size="pageSiz"
        :page-sizes="[5, 10, 20, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        hide-on-single-page
      />
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
  pageSize: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  hideButtons: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["reset", "paginate"]);

const curPage = ref(props.currentPage);
const pageSiz = ref(props.pageSize);
watch(props, (newVal) => {
  curPage.value = newVal.currentPage;
  pageSiz.value = newVal.pageSize;
});
watch(curPage, (newVal) => emit("paginate", pageSiz.value, newVal));
watch(pageSiz, (newVal) => emit("paginate", newVal, curPage.value));
</script>

<style lang="scss" scoped>
.filter {
  display: inline;
  align-items: center;
  width: 100%;

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
  margin-top: 10px;
}
</style>
