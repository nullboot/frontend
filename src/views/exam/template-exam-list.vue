<template>
  <el-card class="exam template-list" v-loading="loading">
    <template #header>
      <div class="title">
        <el-icon :size="24">
          <EditPen />
        </el-icon>
        <span>考试</span>
      </div>
    </template>
    <el-row :gutter="15" v-if="allowImport">
      <el-col :span="12">
        <el-button class="dashed import-button" @click="create" :icon="Plus">新建考试</el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="dashed import-button" @click="listVisible = true" :icon="DocumentAdd">导入考试</el-button>
      </el-col>
    </el-row>
    <template v-if="list?.length > 0">
      <template-exam-list-item
        v-for="(exam, index) in list"
        :key="index"
        :exam="exam"
        :up-movable="index !== 0"
        :down-movable="index !== list.length - 1"
        @update="(t) => update(index, t)"
        @edit="(tab) => edit(exam, tab)"
        @remove="() => remove(index)"
        @move="(d) => move(index, d)"
      />
    </template>
    <el-empty v-else description="暂无任务" />
  </el-card>
  <exam-list
    :visible="listVisible"
    :selected="list.map((t) => t.id)"
    @update:visible="updateListVisible"
    @toggle="toggle"
    @updated="updated"
    @created="created"
  />
  <exam-edit
    add-to-template-after-create-new
    v-bind="editProps"
    @update:visible="updateEditVisible"
    @updated="updated"
    @created="created"
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { DocumentAdd, EditPen, Plus } from "@element-plus/icons-vue";

// eslint-disable-next-line no-undef
import TemplateExamResponseDto = Components.Schemas.TemplateExamResponseDto;
// eslint-disable-next-line no-undef
import ExamDto = Components.Schemas.ExamDto;

import ExamList from "@/views/exam/exam-list.vue";
import ExamEdit from "@/views/exam/exam-edit.vue";
import TemplateExamListItem from "@/views/exam/template-exam-list-item.vue";

const props = defineProps({
  exams: {
    type: Array as PropType<TemplateExamResponseDto[]>,
    required: true,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  allowImport: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});

const emit = defineEmits(["update"]);
const list = ref<TemplateExamResponseDto[]>([]);
watch(props, (newVal) => (list.value = newVal!.exams));
watch(list, (newVal) => emit("update", newVal), { deep: true });

const remove = (index: number) => {
  list.value.splice(index, 1);
};
const update = (index: number, exam: any) => {
  list.value[index] = exam;
};
const move = (index: number, direction: "up" | "down") => {
  const exam = list.value[index];
  list.value.splice(index, 1);
  if (direction === "up") list.value.splice(index - 1, 0, exam);
  else list.value.splice(index + 1, 0, exam);
};
const add = (exam: ExamDto) => {
  if (list.value.every((t) => t.id !== exam.id)) {
    list.value.push({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      day: 1,
      tags: exam.tags,
    });
  }
};
const toggle = (exam: ExamDto, use: boolean) => {
  if (use) add(exam);
  else remove(list.value.findIndex((t) => t.id === exam.id));
};

const listVisible = ref<boolean>(false);
const updateListVisible = (v: boolean) => (listVisible.value = v);

const editProps = ref<{
  visible: boolean;
  examId: number;
  tags: string[] | undefined;
  added: boolean;
  initialTab: "editor" | "preview" | "problems";
}>({
  visible: false,
  examId: 0,
  tags: undefined,
  added: false,
  initialTab: "editor",
});
const updateEditVisible = (v: boolean) => (editProps.value.visible = v);
const create = () => {
  editProps.value.initialTab = "editor";
  editProps.value.examId = 0;
  editProps.value.tags = undefined;
  editProps.value.added = false;
  editProps.value.visible = true;
};
const edit = (exam: TemplateExamResponseDto, tab?: "editor" | "preview" | "problems") => {
  editProps.value.initialTab = tab || "editor";
  editProps.value.examId = exam.id;
  editProps.value.tags = exam.tags;
  editProps.value.added = true;
  editProps.value.visible = true;
};
const updated = (exam: ExamDto) => {
  let index = list.value.findIndex((t) => t.id === exam.id);
  if (index >= 0) list.value[index] = { ...exam, day: list.value[index].day };
};
const created = (exam: ExamDto, oldExamId: number) => {
  let index = list.value.findIndex((t) => t.id === oldExamId);

  if (index >= 0) list.value[index] = { ...exam, day: list.value[index].day };
  else add(exam);
};
</script>
