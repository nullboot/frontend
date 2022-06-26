<template>
  <el-dialog v-model="dialogVisible" :fullscreen="true" :show-close="false" @open="fetchData">
    <template #title>
      <dialog-title :title="`新人 ${realname} / 编辑培训`">
        <template #buttons>
          <el-button type="info" plain @click="close">取消</el-button>
          <el-button type="primary" plain @click="submit(false)" :loading="submitLoading" :disabled="assignLoading"
            >暂存
          </el-button>
          <el-button type="primary" @click="assign" :loading="assignLoading" :disabled="submitLoading">发布</el-button>
        </template>
      </dialog-title>
    </template>
    <el-row :gutter="30">
      <el-col :md="15" :lg="16" :xl="16">
        <template-course-list
          v-if="templateDetail?.courses"
          :courses="templateDetail.courses"
          :loading="fetchLoading"
          :allow-import="allowImport"
          @update="(courses) => (templateDetail.courses = courses)"
        />
      </el-col>
      <el-col :md="9" :lg="8" :xl="8">
        <template-exam-list
          v-if="templateDetail?.exams"
          :exams="templateDetail.exams"
          :loading="fetchLoading"
          :allow-import="allowImport"
          @update="(exams) => (templateDetail.exams = exams)"
        />
        <template-task-list
          v-if="templateDetail?.tasks"
          :tasks="templateDetail.tasks"
          :loading="fetchLoading"
          :allow-import="allowImport"
          @update="(tasks) => (templateDetail.tasks = tasks)"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import { ref, watch } from "vue";
import { showError } from "@/api/error";
import { ElMessage, ElMessageBox } from "element-plus";
import DialogTitle from "@/components/dialog-title.vue";
import TemplateTaskList from "@/views/task/template-task-list.vue";
import TemplateExamList from "@/views/exam/template-exam-list.vue";
import TemplateCourseList from "@/views/course/template-course-list.vue";
import { useUserStore } from "@/stores/user";
// eslint-disable-next-line no-undef
import TemplateResponseDto = Components.Schemas.TemplateResponseDto;

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  newbieId: {
    type: Number,
    required: true,
  },
  realname: {
    type: String,
    required: true,
  },
});

const dialogVisible = ref(false);
const emit = defineEmits(["updateEditDialogVisible", "assigned"]);
const templateDetail = ref<TemplateResponseDto>({
  type: "newbie",
  division: { name: "", id: 0 },
  courses: [],
  exams: [],
  tasks: [],
});
const fetchLoading = ref(false);
const submitLoading = ref(false);
const assignLoading = ref(false);

const close = () => (dialogVisible.value = false);

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("updateEditDialogVisible", newValue));

const fetchData = () => {
  fetchLoading.value = true;
  templateDetail.value = {} as TemplateResponseDto;
  API.newbieGetTemplate({ id: props.newbieId })
    .then((res) => (templateDetail.value = res.template!))
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const submit = (assign = false) => {
  if (assign) assignLoading.value = true;
  else submitLoading.value = true;
  API.newbieUpdateTemplate(
    { id: props.newbieId },
    {
      exams: templateDetail.value!.exams.map(({ id, day, tags }) => ({ id, day, tags })),
      tasks: templateDetail.value!.tasks.map(({ id, day, tags }) => ({ id, day, tags })),
      courses: templateDetail.value!.courses.map(({ id, day, tags, isOptional }) => ({ id, day, tags, isOptional })),
      assignToNewbie: assign,
    },
  )
    .then(() => {
      ElMessage.success(assign ? "培训分配成功" : "培训暂存成功");
      if (assign) emit("assigned");
      close();
    })
    .catch(showError)
    .finally(() => (assignLoading.value = submitLoading.value = false));
};

const assign = () => {
  ElMessageBox.confirm("培训分配给新人后无法再修改！是否分配？", "确认分配", {
    confirmButtonText: "分配",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => submit(true))
    .catch(() => {
      /* do nothing */
    });
};

const allowImport = userStore.isRoot || userStore.roles.includes("ADMIN");
</script>
