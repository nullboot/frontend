<template>
  <el-dialog v-model="_visible" :show-close="false" append-to-body @open="fetchData" width="80%">
    <template #title>
      <dialog-title :title="courseId ? `编辑课程 #${courseId}` : '新建课程'">
        <template #buttons>
          <el-button type="info" plain @click="_visible = false">取消</el-button>
          <el-button
            v-if="courseId"
            plain
            type="warning"
            :loading="submitLoading"
            :disabled="!submittable || errorMessage !== ''"
            @click="confirmSubmit"
            >保存
          </el-button>
          <el-button type="primary" :loading="createLoading" @click="confirmCreate" :disabled="errorMessage !== ''"
            >{{ courseId ? "另存为新课程" : "提交" }}
          </el-button>
        </template>
      </dialog-title>
    </template>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
    <el-tabs v-model="selectedTab" type="card" v-loading="fetchLoading">
      <el-tab-pane label="基本信息" name="editor">
        <el-form :model="form" @submit.prevent>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="课程标题" minlength="1" maxlength="80" show-word-limit />
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <editable-tags :tags="form.tags" @update="(v) => (form.tags = v)" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="课程描述" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="章节" name="sections">
        <course-edit-section-list
          :sections="form.sections"
          :loading="fetchLoading"
          @update="(sections) => (form.sections = sections)"
        />
      </el-tab-pane>
      <el-tab-pane label="预览" name="preview">
        <el-card class="course-preview" shadow="never">
          <template #header>
            <div class="card-header">
              <div class="title-and-tags">
                <span>{{ form.title }}</span>
                <el-tag type="info">
                  <el-icon>
                    <List />
                  </el-icon>
                  共 {{ form.sections.length }} 章
                </el-tag>
                <el-divider direction="vertical" v-if="form.tags.length > 0" />
                <editable-tags :tags="form.tags" :editable="false" />
              </div>
            </div>
          </template>
          <markdown :source="form.description" />
        </el-card>
        <el-divider />
        <course-section-preview v-for="(section, index) in form.sections" :section="section" :key="index" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import { PropType, reactive, ref, watch } from "vue";
import { Action, ElMessage, ElMessageBox } from "element-plus";
import { List } from "@element-plus/icons-vue";

import * as API from "@/api";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";

// eslint-disable-next-line no-undef
import CourseRequestDto = Components.Schemas.CourseRequestDto;
// eslint-disable-next-line no-undef
import CourseSectionDto = Components.Schemas.CourseSectionDto;

import DialogTitle from "@/components/dialog-title.vue";
import EditableTags from "@/components/editable-tags.vue";
import Markdown from "@/components/markdown.vue";

import CourseEditSectionList from "@/views/course/course-edit-section-list.vue";
import CourseSectionPreview from "@/views/course/course-section-preview.vue";
// eslint-disable-next-line no-undef
import CourseBriefDto = Components.Schemas.CourseBriefDto;
// eslint-disable-next-line no-undef
import CourseDto = Components.Schemas.CourseDto;

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  courseId: {
    type: Number as PropType<number>,
    default: 0, // 0 means create new course
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
    type: String as PropType<"editor" | "preview" | "sections">,
    default: "editor",
  },
});
const emit = defineEmits(["update:visible", "updated", "created"]);

const selectedTab = ref("editor");

interface CourseForm {
  title: string;
  description: string;
  tags: string[];
  sections: CourseSectionDto[];
}

const form = reactive<CourseForm>({
  title: "",
  description: "",
  tags: [],
  sections: [],
});
const _visible = ref(false);
watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const submittable = ref(false);

const fetchLoading = ref(false);
const fetchData = () => {
  selectedTab.value = props.initialTab;
  errorMessage.value = "";
  if (props.courseId === 0) {
    // create new course
    form.tags = [];
    form.title = "";
    form.description = "";
    form.sections = [];
    submittable.value = false;
    return;
  }
  fetchLoading.value = true;
  API.getCourseById({ id: props.courseId })
    .then((res) => {
      const course = res.course!;
      form.title = course.title;
      form.description = course.description;
      form.tags = props.tags || course.tags; // use props.tags first
      form.sections = course.sections;
      submittable.value =
        userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === course.ownerProfile.id);
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const saved = ref(false);
const errorMessage = ref("");
const validateForm = (newVal: CourseForm) => {
  if (newVal.title.length === 0) return "请输入标题";
  if (newVal.sections.length === 0) return "请至少添加一个章节";
  return "";
};
watch(form, (newVal) => {
  errorMessage.value = validateForm(newVal);
  saved.value = false;
});

const toRequestDto = (): CourseRequestDto => ({
  title: form.title,
  description: form.description,
  tags: form.tags,
  sectionIds: form.sections.map((s) => s.id),
});
const toBriefDto = (course: CourseDto): CourseBriefDto => ({
  id: course.id,
  title: course.title,
  description: course.description,
  tags: course.tags,
  isUsed: course.isUsed,
  ownerProfile: course.ownerProfile,
  sectionCount: course.sections.length,
});

const submitLoading = ref(false);
const submit = () => {
  submitLoading.value = true;
  API.updateCourseById({ id: props.courseId }, toRequestDto())
    .then((res) => {
      saved.value = true;
      emit("updated", toBriefDto(res.course!));
      ElMessage.success("保存成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
const confirmSubmit = () => {
  ElMessageBox.confirm("操作将对所有使用此课程的培训产生影响！是否继续？", "保存确认", {
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
  API.createCourse(toRequestDto())
    .then((res) => {
      saved.value = true;
      emit("created", toBriefDto(res.course!), props.courseId, updateTemplate);
      ElMessage.success("创建成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (createLoading.value = false));
};
const confirmCreate = () => {
  if (props.courseId === 0 && props.addToTemplateAfterCreateNew) return create(true);

  ElMessageBox.confirm(props.courseId && props.added ? "是否替换原课程？" : "是否将此课程添加到培训？", "提交选项", {
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
