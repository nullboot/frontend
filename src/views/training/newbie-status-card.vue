<template>
  <div class="study-progress-main-div">
    <div class="study-progress-circles">
      <div style="width: fit-content">
        <el-progress
          class="three-circles"
          type="circle"
          :percentage="courseProgress"
          :status="courseStatus"
          :width="126"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">课程</span>
          </template>
        </el-progress>
        <el-progress class="three-circles" type="circle" :percentage="examProgress" :status="examStatus" :width="126">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">考试</span>
          </template>
        </el-progress>
        <el-progress class="three-circles" type="circle" :percentage="taskProgress" :status="taskStatus" :width="126">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
            <span class="percentage-label">任务</span>
          </template>
        </el-progress>
      </div>
      <div class="progress-card-blank" />
      <div class="footer" style="padding-top: 0">培训</div>
      <div style="margin-top: 26px" />
    </div>
    <div style="width: 10px" />
    <div class="study-progress-line"></div>
    <div style="width: 10px" />
    <div class="study-progress-circles">
      <el-progress
        type="circle"
        :percentage="newbieComment ? 100 : 0"
        :status="newbieComment ? 'success' : ''"
        :width="126"
      >
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage.toFixed(0) }}%</span>
          <span class="percentage-label">评价</span>
        </template>
      </el-progress>
      <div class="progress-card-blank" />
      <div class="footer" style="padding-top: 0">
        <div>评价</div>
        <el-button
          v-if="!newbieProfile.isGraduate"
          style="margin-top: 10px"
          type="primary"
          icon="edit"
          :auto-insert-space="true"
          :disabled="!newbieProfile?.isAssigned || newbieProfile?.isGraduate || readOnly"
          @click="openNewbieComment"
          >进入评价
        </el-button>
        <div v-else style="margin-top: 26px" />
      </div>
    </div>
    <div style="width: 10px" />
    <div class="study-progress-line"></div>
    <div style="width: 10px" />
    <el-result v-if="newbieProfile?.isGraduate" icon="success" title="已毕业" />
    <el-result v-else icon="error" title="尚未毕业" sub-title="请继续参加培训" />
  </div>
  <newbie-comment
    v-bind="newbieCommentProps"
    @updateNewbieCommentVisible="handleNewbieCommentClose"
    @commented="emit('commented')"
  />
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import NewbieCommentDto = Components.Schemas.NewbieCommentDto;
// eslint-disable-next-line no-undef
import NewbieProfileDto = Components.Schemas.NewbieProfileDto;
import NewbieComment from "@/views/training/newbie-comment.vue";
import { computed, PropType, ref } from "vue";

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
  newbieComment: {
    type: Object as PropType<NewbieCommentDto>,
  },
  newbieProfile: {
    type: Object as PropType<NewbieProfileDto>,
    required: true,
  },
  readOnly: {
    type: Boolean,
    required: true,
  },
});

const courseStatus = computed(() => (props.courseProgress == 100 ? "success" : ""));
const examStatus = computed(() => (props.examProgress == 100 ? "success" : ""));
const taskStatus = computed(() => (props.taskProgress == 100 ? "success" : ""));

const emit = defineEmits(["commented"]);

const handleNewbieCommentClose = (newValue: boolean) => (newbieCommentProps.value.visible = newValue);

const newbieCommentProps = ref<{
  visible: boolean;
  newbieId: number;
  realname: string;
  tutorRealname: string;
}>({ visible: false, newbieId: 0, realname: "", tutorRealname: "" });

const openNewbieComment = () => {
  newbieCommentProps.value.newbieId = props.newbieProfile.userId;
  newbieCommentProps.value.realname = props.newbieProfile.userProfile.realname;
  newbieCommentProps.value.tutorRealname = props.newbieProfile.tutorProfile?.userProfile.realname || "";
  newbieCommentProps.value.visible = true;
};
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
  margin-top: -70px;
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
</style>
