<template>
  <el-dialog v-model="_visible" :show-close="false" append-to-body @open="fetchData">
    <template #title>
      <dialog-title :title="taskId ? `编辑任务 #${taskId}` : '新建任务'">
        <template #buttons>
          <el-button type="info" plain @click="_visible = false">取消</el-button>
          <el-button
            v-if="taskId"
            plain
            type="warning"
            :loading="submitLoading"
            :disabled="!submittable || errorMessage !== ''"
            @click="confirmSubmit"
            >保存
          </el-button>
          <el-button type="primary" :loading="createLoading" @click="confirmCreate" :disabled="errorMessage !== ''"
            >{{ taskId ? "另存为新任务" : "提交" }}
          </el-button>
        </template>
      </dialog-title>
    </template>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
    <el-tabs v-model="selectedTab" type="card" v-loading="fetchLoading">
      <el-tab-pane label="编辑" name="editor">
        <el-form :model="form" @submit.prevent>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="任务标题" minlength="1" maxlength="80" show-word-limit />
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <editable-tags :tags="form.tags" @update="(v) => (form.tags = v)" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="任务描述" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="预览" name="preview">
        <el-card class="task-preview" shadow="never">
          <template #header>
            <div class="card-header">
              <div class="title-and-tags">
                <span>{{ form.title }}</span>
                <editable-tags :tags="form.tags" :editable="false" />
              </div>
            </div>
          </template>
          <markdown :source="form.description" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
// eslint-disable-next-line no-undef
import UpdateTaskRequestDto = Components.Schemas.UpdateTaskRequestDto;
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import EditableTags from "@/components/editable-tags.vue";
import { PropType, reactive, ref, watch } from "vue";
import { showError } from "@/api/error";
import Markdown from "@/components/markdown.vue";
import { Action, ElMessage, ElMessageBox } from "element-plus";

import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  taskId: {
    type: Number as PropType<number>,
    default: 0, // 0 means create new task
  },
  tags: {
    type: Array as PropType<string[]> | undefined,
    default: undefined,
  },
  addToTemplateAfterCreateNew: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  added: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});
const emit = defineEmits(["update:visible", "updated", "created"]);

const selectedTab = ref("editor");
const form = reactive<UpdateTaskRequestDto>({
  title: "",
  description: "",
  tags: [],
});
const _visible = ref(false);
watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const submittable = ref(false);

const fetchLoading = ref(false);
const fetchData = () => {
  selectedTab.value = "editor";
  errorMessage.value = "";
  if (props.taskId === 0) {
    // create new task
    form.tags = [];
    form.title = "";
    form.description = "";
    submittable.value = false;
    return;
  }
  fetchLoading.value = true;
  API.getTaskById({ id: props.taskId })
    .then((res) => {
      const task = res.task!;
      form.title = task.title;
      form.description = task.description;
      form.tags = props.tags || task.tags; // use props.tags first
      submittable.value =
        userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === task.ownerProfile.id);
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const saved = ref(false);
const errorMessage = ref("");
const validateForm = (newVal: UpdateTaskRequestDto) => {
  if (newVal.title.length === 0) return "请输入标题";
  return "";
};
watch(form, (newVal) => {
  errorMessage.value = validateForm(newVal);
  saved.value = false;
});

const submitLoading = ref(false);
const submit = () => {
  submitLoading.value = true;
  API.updateTaskById({ id: props.taskId }, form)
    .then((res) => {
      saved.value = true;
      emit("updated", res.task);
      ElMessage.success("保存成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
const confirmSubmit = () => {
  ElMessageBox.confirm("操作将对所有使用此任务的培训产生影响！是否继续？", "保存确认", {
    confirmButtonText: "保存",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(submit)
    .catch(() => {
      /* do nothing */
    });
};

const createLoading = ref(false);
const create = (updateTemplate: boolean) => {
  createLoading.value = true;
  API.createTask(form)
    .then((res) => {
      saved.value = true;
      emit("created", res.task, props.taskId, updateTemplate);
      ElMessage.success("创建成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (createLoading.value = false));
};
const confirmCreate = () => {
  if (props.taskId === 0 && props.addToTemplateAfterCreateNew) return create(true);

  ElMessageBox.confirm(props.taskId && props.added ? "是否替换原任务？" : "是否将此任务添加到培训？", "提交选项", {
    distinguishCancelAndClose: true,
    icon: "question-filled",
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "info",
  })
    .then(() => create(true))
    .catch((action: Action) => {
      if (action === "cancel") create(false);
    });
};
</script>
