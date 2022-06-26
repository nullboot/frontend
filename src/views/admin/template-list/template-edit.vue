<template>
  <el-dialog v-model="dialogVisible" :fullscreen="true" :show-close="false" @open="fetchData">
    <template #title>
      <dialog-title
        :title="`编辑模板 ${division.name} / ${type === 'newbie' ? '新人' : '导师'}`"
        @close="close"
        @submit="submit"
        :submit-loading="submitLoading"
      />
    </template>
    <el-row :gutter="30">
      <el-col :md="15" :lg="16" :xl="16">
        <template-course-list
          :courses="templateDetail.courses"
          :loading="fetchLoading"
          @update="(courses) => (templateDetail.courses = courses)"
        />
      </el-col>
      <el-col :md="9" :lg="8" :xl="8">
        <template-exam-list
          :exams="templateDetail.exams"
          :loading="fetchLoading"
          @update="(exams) => (templateDetail.exams = exams)"
        />
        <template-task-list
          :tasks="templateDetail.tasks"
          :loading="fetchLoading"
          @update="(tasks) => (templateDetail.tasks = tasks)"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import { PropType, ref, watch } from "vue";
// eslint-disable-next-line no-undef
import TemplateResponseDto = Components.Schemas.TemplateResponseDto;
// eslint-disable-next-line no-undef
import DivisionDto = Components.Schemas.DivisionDto;
import { showError } from "@/api/error";
import { ElMessage } from "element-plus";
import DialogTitle from "@/components/dialog-title.vue";
import TemplateTaskList from "@/views/task/template-task-list.vue";
import TemplateExamList from "@/views/exam/template-exam-list.vue";
import TemplateCourseList from "@/views/course/template-course-list.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String as PropType<"newbie" | "tutor">,
    required: true,
  },
  division: {
    type: Object as PropType<DivisionDto>,
    required: true,
  },
});

const dialogVisible = ref(false);
const emit = defineEmits(["updateEditDialogVisible", "updated"]);
const templateDetail = ref<TemplateResponseDto>({
  type: "newbie",
  division: { name: "", id: 0 },
  courses: [],
  tasks: [],
  exams: [],
});

const close = () => (dialogVisible.value = false);

const fetchLoading = ref(false);
const fetchData = () => {
  fetchLoading.value = true;
  API.getTemplateById({ type: props.type, id: props.division.id })
    .then((res) => (templateDetail.value = res.template!))
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("updateEditDialogVisible", newValue));

const submitLoading = ref(false);
const submit = () => {
  submitLoading.value = true;
  API.updateTemplate(
    { type: props.type, id: props.division.id },
    {
      exams: templateDetail.value!.exams.map(({ id, day, tags }) => ({ id, day, tags })),
      tasks: templateDetail.value!.tasks.map(({ id, day, tags }) => ({ id, day, tags })),
      courses: templateDetail.value!.courses.map(({ id, day, tags, isOptional }) => ({ id, day, tags, isOptional })),
    },
  )
    .then(() => {
      ElMessage.success("保存成功");
      dialogVisible.value = false;
      emit("updated");
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
</script>
