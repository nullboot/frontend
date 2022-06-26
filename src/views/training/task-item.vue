<template>
  <el-collapse-item v-if="taskDetail?.title" class="task-item">
    <template #title>
      <div class="header">
        <el-tag v-if="taskDetail.finished" type="success">已完成</el-tag>
        <el-tag v-else type="warning">未完成</el-tag>
        <span class="title">{{ taskDetail.title }}</span>
        <el-tag type="info">{{ `Day ${taskDetail.day}` }}</el-tag>
        <editable-tags :tags="taskDetail.tags" :editable="false" />
      </div>
      <el-button
        v-if="!taskDetail.finished"
        class="item-right"
        type="text"
        @click.stop="finishTask"
        :disabled="readOnly"
        :loading="isLoading"
        >完成任务
      </el-button>
    </template>
    <markdown :source="taskDetail.description" />
  </el-collapse-item>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { useUserStore } from "@/stores/user";
import Markdown from "@/components/markdown.vue";
import EditableTags from "@/components/editable-tags.vue";
import { useRouter } from "vue-router";
import { showError } from "@/api/error";
// eslint-disable-next-line no-undef
import TaskForTraineeDto = Components.Schemas.TaskForTraineeDto;

const props = defineProps({
  taskId: {
    type: Number,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const taskDetail = ref<TaskForTraineeDto>();

const apiGetTask = !props.readOnly && userStore.selectedRole == "TUTOR" ? API.tutorGetTask : API.newbieGetTask;
const apiSubmitTask = userStore.selectedRole == "TUTOR" ? API.tutorSubmitTask : API.newbieSubmitTask;

const nid = Number(useRouter().currentRoute.value.params.nid);
const apiID = props.readOnly ? nid : useUserStore().userId;

const emit = defineEmits(["finished"]);

const isLoading = ref(false);
const finishTask = () => {
  isLoading.value = true;
  apiSubmitTask({ id: userStore.userId, taskId: props.taskId })
    .then(() => {
      fetchTaskDetail();
      emit("finished", props.taskId);
    })
    .catch(showError)
    .finally(() => (isLoading.value = false));
};

const fetchTaskDetail = () => {
  apiGetTask({
    id: apiID,
    taskId: props.taskId,
  }).then((res) => {
    taskDetail.value = res.task;
  });
};

onMounted(() => {
  fetchTaskDetail();
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
