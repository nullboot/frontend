<template>
  <el-dialog v-model="_visible" :show-close="false" append-to-body @open="fetchData" width="60%">
    <template #title>
      <dialog-title :title="examId ? `编辑考试 #${examId}` : '新建考试'">
        <template #buttons>
          <el-button type="info" plain @click="_visible = false">取消</el-button>
          <el-button
            v-if="examId"
            plain
            type="warning"
            :loading="submitLoading"
            :disabled="!submittable || errorMessage !== ''"
            @click="confirmSubmit"
            >保存
          </el-button>
          <el-button type="primary" :loading="createLoading" @click="confirmCreate" :disabled="errorMessage !== ''"
            >{{ examId ? "另存为新考试" : "提交" }}
          </el-button>
        </template>
      </dialog-title>
    </template>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
    <el-tabs v-model="selectedTab" type="card" v-loading="fetchLoading">
      <el-tab-pane label="基本信息" name="editor">
        <el-form :model="form" @submit.prevent>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="考试标题" minlength="1" maxlength="80" show-word-limit />
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <editable-tags :tags="form.tags" @update="(v) => (form.tags = v)" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="考试描述" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="题目" name="problems">
        <exam-problem-list :problems="form.problems" :loading="fetchLoading" @update="(v) => (form.problems = v)" />
      </el-tab-pane>
      <el-tab-pane label="预览" name="preview">
        <el-card class="exam-preview" shadow="never">
          <template #header>
            <div class="card-header">
              <div class="title-and-tags">
                <span>{{ form.title }}</span>
                <el-tag type="info">
                  <el-icon>
                    <List />
                  </el-icon>
                  共 {{ form.problems.length }} 题
                </el-tag>
                <el-divider direction="vertical" v-if="form.tags.length > 0" />
                <editable-tags :tags="form.tags" :editable="false" />
              </div>
            </div>
          </template>
          <markdown :source="form.description" />
        </el-card>
        <el-divider />
        <exam-problem-preview v-for="(problem, index) in form.problems" :key="index" :problem="problem" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
// eslint-disable-next-line no-undef
import UpdateExamRequestDto = Components.Schemas.UpdateExamRequestDto;
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import EditableTags from "@/components/editable-tags.vue";
import { PropType, reactive, ref, watch } from "vue";
import { showError } from "@/api/error";
import Markdown from "@/components/markdown.vue";
import { Action, ElMessage, ElMessageBox } from "element-plus";
import { List } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import ExamProblemList from "@/views/exam/exam-problem-list.vue";
import ExamProblemPreview from "@/views/exam/exam-problem-preview.vue";

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  examId: {
    type: Number as PropType<number>,
    default: 0, // 0 means create new exam
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
  initialTab: {
    type: String as PropType<"editor" | "preview" | "problems">,
    default: "editor",
  },
});
const emit = defineEmits(["update:visible", "updated", "created"]);

const selectedTab = ref("editor");
const form = reactive<UpdateExamRequestDto>({
  title: "",
  description: "",
  tags: [],
  problems: [],
});
const _visible = ref(false);
watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const submittable = ref(false);

const fetchLoading = ref(false);
const fetchData = () => {
  selectedTab.value = props.initialTab;
  errorMessage.value = "";
  if (props.examId === 0) {
    // create new exam
    form.tags = [];
    form.title = "";
    form.description = "";
    form.problems = [];
    submittable.value = false;
    return;
  }
  fetchLoading.value = true;
  API.getExamById({ id: props.examId })
    .then((res) => {
      const exam = res.exam!;
      form.title = exam.title;
      form.description = exam.description;
      form.tags = props.tags || exam.tags; // use props.tags first
      form.problems = exam.problems;
      submittable.value =
        userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === exam.ownerProfile.id);
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const saved = ref(false);
const errorMessage = ref("");
const validateForm = (newVal: UpdateExamRequestDto) => {
  if (newVal.title.length === 0) return "请输入标题";
  if (newVal.problems.length === 0) return "请添加至少一道题目";
  return "";
};
watch(form, (newVal) => {
  errorMessage.value = validateForm(newVal);
  saved.value = false;
});

const submitLoading = ref(false);
const submit = () => {
  submitLoading.value = true;
  API.updateExamById({ id: props.examId }, form)
    .then((res) => {
      saved.value = true;
      emit("updated", res.exam);
      ElMessage.success("保存成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
const confirmSubmit = () => {
  ElMessageBox.confirm("操作将对所有使用此考试的培训产生影响！是否继续？", "保存确认", {
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
  API.createExam(form)
    .then((res) => {
      saved.value = true;
      emit("created", res.exam, props.examId, updateTemplate);
      ElMessage.success("创建成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (createLoading.value = false));
};
const confirmCreate = () => {
  if (props.examId === 0 && props.addToTemplateAfterCreateNew) return create(true);

  ElMessageBox.confirm(props.examId && props.added ? "是否替换原考试？" : "是否将此考试添加到培训？", "提交选项", {
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
