<template>
  <el-card class="exam problem preview list-item" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="title-and-tags">
          <el-tag type="info">{{ problem.type === "SINGLE_CHOICE" ? "单选" : "多选" }}</el-tag>
          <span>{{ problem.title }}</span>
        </div>
      </div>
    </template>
    <el-checkbox-group v-if="problem.type === 'MULTIPLE_CHOICE'" v-model="answers">
      <el-checkbox v-for="(option, index) in problem.options" :key="index" :label="index">
        {{ toAlpha(index) + ". " + option }}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-else v-model="singleAnswer">
      <el-radio v-for="(option, index) in problem.options" :key="index" :label="index">
        {{ toAlpha(index) + ". " + option }}
      </el-radio>
    </el-radio-group>
    <el-alert
      v-if="problem.reason !== ''"
      title="题目解释"
      type="success"
      :description="problem.reason"
      :closable="false"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
// eslint-disable-next-line no-undef
import ProblemDto = Components.Schemas.ProblemDto;

const props = defineProps({
  problem: {
    type: Object as PropType<ProblemDto>,
    required: true,
  },
});

const singleAnswer = ref<number>(props.problem.answers[0]);
const answers = ref<number[]>(props.problem.answers);
watch(props, (newVal) => {
  singleAnswer.value = newVal.problem.answers.length > 0 ? newVal.problem.answers[0] : -1;
  answers.value = newVal.problem.answers;
});

const toAlpha = (index: number): string => {
  return (index < 26 ? "" : toAlpha(Math.floor(index / 26) - 1)) + String.fromCharCode(65 + (index % 26));
};
</script>

<style lang="scss" scoped>
.exam-problem-preview {
  .el-alert {
    margin-top: 10px;
  }
}
</style>
