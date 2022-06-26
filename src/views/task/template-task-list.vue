<template>
  <el-card class="task template-list" v-loading="loading">
    <template #header>
      <div class="title">
        <el-icon :size="24">
          <Finished />
        </el-icon>
        <span>任务</span>
      </div>
    </template>
    <el-row :gutter="15" v-if="allowImport">
      <el-col :span="12">
        <el-button class="dashed import-button" @click="create" :icon="Plus">新建任务</el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="dashed import-button" @click="listVisible = true" :icon="DocumentAdd">导入任务</el-button>
      </el-col>
    </el-row>
    <template v-if="list?.length > 0">
      <template-task-list-item
        v-for="(task, index) in list"
        :key="index"
        :task="task"
        :up-movable="index !== 0"
        :down-movable="index !== list.length - 1"
        @update="(t) => update(index, t)"
        @edit="edit(task)"
        @remove="() => remove(index)"
        @move="(d) => move(index, d)"
      />
    </template>
    <el-empty v-else description="暂无任务" />
  </el-card>
  <task-list
    :visible="listVisible"
    :selected="list.map((t) => t.id)"
    @update:visible="updateListVisible"
    @toggle="toggle"
    @updated="updated"
    @created="created"
  />
  <task-edit
    add-to-template-after-create-new
    v-bind="editProps"
    @update:visible="updateEditVisible"
    @updated="updated"
    @created="created"
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { DocumentAdd, Finished, Plus } from "@element-plus/icons-vue";

// eslint-disable-next-line no-undef
import TemplateTaskResponseDto = Components.Schemas.TemplateTaskResponseDto;
// eslint-disable-next-line no-undef
import TaskDto = Components.Schemas.TaskDto;

import TaskList from "@/views/task/task-list.vue";
import TaskEdit from "@/views/task/task-edit.vue";
import TemplateTaskListItem from "@/views/task/template-task-list-item.vue";

const props = defineProps({
  tasks: {
    type: Array as PropType<TemplateTaskResponseDto[]>,
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
const list = ref<TemplateTaskResponseDto[]>([]);
watch(props, (newVal) => (list.value = newVal!.tasks));
watch(list, (newVal) => emit("update", newVal), { deep: true });

const remove = (index: number) => {
  list.value.splice(index, 1);
};
const update = (index: number, task: any) => {
  list.value[index] = task;
};
const move = (index: number, direction: "up" | "down") => {
  const task = list.value[index];
  list.value.splice(index, 1);
  if (direction === "up") list.value.splice(index - 1, 0, task);
  else list.value.splice(index + 1, 0, task);
};
const add = (task: TaskDto) => {
  if (list.value.every((t) => t.id !== task.id))
    list.value.push({
      id: task.id,
      title: task.title,
      description: task.description,
      day: 1,
      tags: task.tags,
    });
};
const toggle = (task: TaskDto, use: boolean) => {
  if (use) add(task);
  else remove(list.value.findIndex((t) => t.id === task.id));
};

const listVisible = ref<boolean>(false);
const updateListVisible = (v: boolean) => (listVisible.value = v);

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
const updateEditVisible = (v: boolean) => (editProps.value.visible = v);
const create = () => {
  editProps.value.taskId = 0;
  editProps.value.tags = undefined;
  editProps.value.added = false;
  editProps.value.visible = true;
};
const edit = (task: TemplateTaskResponseDto) => {
  editProps.value.taskId = task.id;
  editProps.value.tags = task.tags;
  editProps.value.added = true;
  editProps.value.visible = true;
};
const updated = (task: TaskDto) => {
  let index = list.value.findIndex((t) => t.id === task.id);
  if (index >= 0) list.value[index] = { ...task, day: list.value[index].day };
};
const created = (task: TaskDto, oldTaskId: number) => {
  let index = list.value.findIndex((t) => t.id === oldTaskId);

  if (index >= 0) list.value[index] = { ...task, day: list.value[index].day };
  else add(task);
};
</script>
