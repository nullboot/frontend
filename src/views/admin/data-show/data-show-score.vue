<template>
  <el-card class="data-show-card score">
    <template #header>
      <div class="card-header">
        <el-tooltip class="box-item" effect="dark" placement="top">
          <template #content>
            <span v-html="props.hint"></span>
          </template>
          <span>{{ props.name }}</span>
        </el-tooltip>
      </div>
    </template>
    <el-descriptions border :column="1" direction="vertical" size="large">
      <el-descriptions-item
        v-for="(item, index) in props.data"
        :label="item.name"
        label-align="center"
        align="center"
        :key="index"
      >
        <data-show-score-item :name="item.name" :score="item.score" :total-score="item.totalScore" />
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import DataShowScoreItem from "@/views/admin/data-show/data-show-score-item.vue";

class scoreData {
  public name = "";
  public score = 0;
  public totalScore = 0;
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
  data: {
    type: Array as PropType<scoreData[]>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.el-descriptions {
  :deep(.el-descriptions__cell) {
    line-height: unset;
  }
}
</style>
