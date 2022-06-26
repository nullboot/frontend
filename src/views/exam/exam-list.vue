<template>
  <el-dialog v-model="_visible" append-to-body :show-close="false" width="60%" @open="resetFilter">
    <template #title>
      <dialog-title title="考试列表" :icon="List">
        <template #buttons>
          <el-button plain type="primary" @click="create" :icon="Plus">新建</el-button>
          <el-button plain type="info" @click="_visible = false">返回</el-button>
        </template>
      </dialog-title>
    </template>
    <training-list v-bind="pagination" @paginate="paginate" @reset="resetFilter">
      <template #filter>
        <el-form :model="filterForm" class="filter-form" :inline="true">
          <el-form-item label="标题">
            <el-input
              v-model="filterForm.title"
              placeholder="请输入标题"
              clearable
              @change="filtered"
              :prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item label="标签">
            <el-input
              v-model="filterForm.tag"
              placeholder="请输入标签"
              clearable
              @change="filtered"
              :prefix-icon="PriceTag"
            />
          </el-form-item>
        </el-form>
      </template>
      <div class="list" v-loading="fetchLoading">
        <template v-if="list?.length > 0">
          <exam-list-item
            v-for="(exam, index) in list"
            :key="index"
            :exam="exam"
            :added="isAdded(exam)"
            :editable="hasPermissionToEdit(exam)"
            :removable="hasPermissionToRemove(exam)"
            @toggle="(val) => emit('toggle', exam, val)"
            @edit="(tab) => edit(exam, tab)"
            @removed="fetchData"
          />
        </template>
        <el-empty v-else description="暂无考试" />
      </div>
    </training-list>
    <exam-edit v-bind="editProps" @update:visible="updateEditVisible" @updated="updated" @created="created" />
  </el-dialog>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import { PropType, reactive, ref, watch } from "vue";
import ExamEdit from "@/views/exam/exam-edit.vue";
import ExamListItem from "@/views/exam/exam-list-item.vue";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";
import { List, Plus, PriceTag, Search } from "@element-plus/icons-vue";
import TrainingList from "@/components/training-list.vue";
import { Pagination } from "@/utils/pagination";
// eslint-disable-next-line no-undef
import ExamDto = Components.Schemas.ExamDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TaskControllerGetTasks.Parameters.Wildcard;

const userStore = useUserStore();

const hasPermissionToEdit = (exam: ExamDto) => {
  return userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === exam.ownerProfile?.id);
};

const hasPermissionToRemove = (exam: ExamDto) => {
  return !exam.isUsed && hasPermissionToEdit(exam);
};

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  selected: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const _visible = ref(false);
const emit = defineEmits(["update:visible", "toggle", "updated", "created"]);
const list = ref<Array<ExamDto>>([]);
const fetchLoading = ref(false);

const isAdded = (exam: ExamDto): boolean => {
  return props.selected && props.selected!.includes(exam.id);
};

const fetchData = async () => {
  fetchLoading.value = true;
  API.getAllExams({
    ...pagination.value.get(),
    ...filter.value,
  })
    .then(({ exams, count }) => {
      list.value = exams!;
      pagination.value.total = count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

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
const updateEditVisible = (visible: boolean) => (editProps.value.visible = visible);
const create = () => {
  editProps.value.examId = 0;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const edit = (exam: ExamDto, tab: "editor" | "preview" | "problems" | undefined) => {
  editProps.value.initialTab = tab || "editor";
  editProps.value.examId = exam.id;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const updated = (exam: ExamDto) => {
  const index = list.value.findIndex((t) => t.id === exam.id);
  if (index !== -1) list.value[index] = exam;
  emit("updated", exam);
};
const created = (exam: ExamDto, oldExamId: number, updateTemplate: boolean) => {
  list.value = [exam, ...list.value];
  if (updateTemplate) emit("created", exam, oldExamId, updateTemplate);
};

const pagination = ref<Pagination>(new Pagination());
const filterForm = reactive({ title: "", tag: "" });
const filter = ref<{
  keyword?: string;
  wildcard?: Wildcard;
  tag?: string;
  ownerId?: number;
}>({});

const resetFilter = () => {
  filterForm.tag = "";
  filterForm.title = "";
  filtered();
};

const paginate = (page: number) => {
  pagination.value.currentPage = page;
  fetchData();
};

const filtered = () => {
  filter.value.tag = filterForm.tag !== "" ? filterForm.tag : undefined;
  if (filterForm.title !== "") {
    filter.value.keyword = filterForm.title;
    filter.value.wildcard = "BOTH";
  } else {
    filter.value.keyword = undefined;
    filter.value.wildcard = undefined;
  }
  pagination.value.currentPage = 1;
  fetchData();
};
</script>
