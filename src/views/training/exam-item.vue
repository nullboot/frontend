<template>
  <el-collapse-item v-if="examDetail?.title" class="task-item">
    <template #title>
      <div class="header">
        <el-tag v-if="examDetail.finished" type="success">已完成</el-tag>
        <el-tag v-else type="warning">未完成</el-tag>
        <span class="title">{{ examDetail.title }}</span>
        <el-tag type="info">{{ `Day ${examDetail.day}` }}</el-tag>
        <editable-tags :tags="examDetail.tags" :editable="false" />
      </div>
      <el-button v-if="!examDetail.finished" class="item-right" type="text" @click.stop="gotoExam" :disabled="readOnly"
        >参加考试
      </el-button>
    </template>
    <markdown :source="examDetail.description" />
  </el-collapse-item>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import ExamForTraineeDto = Components.Schemas.ExamForTraineeDto;
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { useUserStore } from "@/stores/user";
import Markdown from "@/components/markdown.vue";
import router from "@/router";
import EditableTags from "@/components/editable-tags.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  examId: {
    type: Number,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const examDetail = ref<ExamForTraineeDto>();
const apiGetExam = !props.readOnly && userStore.selectedRole == "TUTOR" ? API.tutorGetExam : API.newbieGetExam;

const nid = Number(useRouter().currentRoute.value.params.nid);
const apiID = props.readOnly ? nid : useUserStore().userId;

const gotoExam = () => {
  if (props.readOnly) {
    return;
  }
  if (userStore.selectedRole == "NEWBIE") {
    router.push(`/newbie/take-exam/${props.examId}`);
  } else {
    router.push(`/tutor/take-exam/${props.examId}`);
  }
};

const fetchExamDetail = () => {
  apiGetExam({
    id: apiID,
    examId: props.examId,
  }).then((res) => {
    examDetail.value = res.exam;
  });
};

onMounted(() => {
  fetchExamDetail();
});
</script>

<style lang="scss" scoped>
.task-item {
  margin-left: 20px;

  .header {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;

    .el-tag + .title {
      margin-left: 10px;
    }

    .title + .el-tag {
      margin-left: 10px;
    }

    .el-tag + .el-tag {
      margin-left: 5px;
    }
  }

  .item-right {
    margin-left: 10px;
    margin-right: 5px;
  }
}
</style>
