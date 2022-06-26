<template>
  <el-dialog v-model="_visible" append-to-body :show-close="false" width="60%" @open="resetFilter">
    <template #title>
      <dialog-title title="任务列表" :icon="List">
        <template #buttons>
          <el-button plain type="primary" @click="create" :icon="Plus"> 新建</el-button>
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
          <task-list-item
            v-for="(task, index) in list"
            :key="index"
            :task="task"
            :added="isAdded(task)"
            :editable="hasPermissionToEdit(task)"
            :removable="hasPermissionToRemove(task)"
            @toggle="(val) => emit('toggle', task, val)"
            @edit="edit(task)"
            @removed="fetchData"
          />
        </template>
        <el-empty v-else description="暂无任务" />
      </div>
    </training-list>
    <task-edit v-bind="editProps" @update:visible="updateEditVisible" @updated="updated" @created="created" />
  </el-dialog>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import { PropType, reactive, ref, watch } from "vue";
import TaskEdit from "@/views/task/task-edit.vue";
import TaskListItem from "@/views/task/task-list-item.vue";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";
import { Plus, List, Search, PriceTag } from "@element-plus/icons-vue";
import TrainingList from "@/components/training-list.vue";
import { Pagination } from "@/utils/pagination";
// eslint-disable-next-line no-undef
import TaskDto = Components.Schemas.TaskDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TaskControllerGetTasks.Parameters.Wildcard;

const userStore = useUserStore();

const hasPermissionToEdit = (task: TaskDto) => {
  return userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === task.ownerProfile?.id);
};

const hasPermissionToRemove = (task: TaskDto) => {
  return !task.isUsed && hasPermissionToEdit(task);
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
const list = ref<Array<TaskDto>>([]);
const fetchLoading = ref(false);

const isAdded = (task: TaskDto): boolean => {
  return props.selected && props.selected!.includes(task.id);
};

const fetchData = async () => {
  fetchLoading.value = true;
  API.getAllTasks({
    ...pagination.value.get(),
    ...filter.value,
  })
    .then(({ tasks, count }) => {
      list.value = tasks!;
      pagination.value.total = count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const editProps = ref<{
  visible: boolean;
  taskId: number;
  tags: string[] | undefined;
  added: boolean;
}>({
  visible: false,
  taskId: 0,
  tags: undefined,
  added: false,
});
const updateEditVisible = (visible: boolean) => (editProps.value.visible = visible);
const create = () => {
  editProps.value.taskId = 0;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const edit = (task: TaskDto) => {
  editProps.value.taskId = task.id;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const updated = (task: TaskDto) => {
  const index = list.value.findIndex((t) => t.id === task.id);
  if (index !== -1) list.value[index] = task;
  emit("updated", task);
};
const created = (task: TaskDto, oldTaskId: number, updateTemplate: boolean) => {
  list.value = [task, ...list.value];
  if (updateTemplate) emit("created", task, oldTaskId, updateTemplate);
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
