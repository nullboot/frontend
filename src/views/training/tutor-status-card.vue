<template>
  <div class="study-progress-main-div">
    <div class="study-progress-circles">
      <el-result v-if="tutorProfile?.isApproved" icon="success" title="已提名审核" />
      <el-result v-else icon="error" title="尚未通过提名" sub-title="请等待HRBP审核" />
    </div>
    <div style="width: 10px" />
    <div class="study-progress-line"></div>
    <div style="width: 10px" />
    <div class="study-progress-circles">
      <div style="width: fit-content">
        <el-progress type="circle" :percentage="courseProgress" :status="courseStatus" size="100">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">课程</span>
          </template>
        </el-progress>
        <el-progress type="circle" :percentage="examProgress" :status="examStatus" size="100">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">考试</span>
          </template>
        </el-progress>
        <el-progress type="circle" :percentage="taskProgress" :status="taskStatus" size="100">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">任务</span>
          </template>
        </el-progress>
      </div>
      <div class="progress-card-blank" />
      <span class="footer"> 培训 </span>
    </div>
    <div style="width: 10px" />
    <div class="study-progress-line"></div>
    <div style="width: 10px" />
    <el-result v-if="tutorProfile?.isGraduate" icon="success" title="已毕业" />
    <el-result v-else icon="error" title="尚未毕业" sub-title="请继续参加培训" />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import TutorProfileDto = Components.Schemas.TutorProfileDto;
import { computed, PropType } from "vue";

const props = defineProps({
  courseProgress: {
    type: Number,
    required: true,
  },
  examProgress: {
    type: Number,
    required: true,
  },
  taskProgress: {
    type: Number,
    required: true,
  },
  tutorProfile: {
    type: Object as PropType<TutorProfileDto>,
    required: true,
  },
  readOnly: {
    type: Boolean,
    required: true,
  },
});
const courseStatus = computed(() => (props.courseProgress === 100 ? "success" : ""));
const examStatus = computed(() => (props.examProgress === 100 ? "success" : ""));
const taskStatus = computed(() => (props.taskProgress === 100 ? "success" : ""));
</script>

<style lang="scss" scoped>
.progress-container {
  justify-content: center;
  align-items: center;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 24px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.progress-card-blank {
  height: 1vh;
}

.study-progress-line {
  width: 12vw;
  height: 2px;
  background: #e0e0e0;
  margin-top: -40px;
}

.study-progress-circles {
  width: fit-content;
  text-align: center;

  .el-progress--circle {
    margin-right: 10px;
  }

  .footer {
    padding-top: 5vh;
  }
}

.study-progress-main-div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-result {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
