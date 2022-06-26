<template>
  <el-dialog v-model="_visible" :show-close="false" append-to-body @open="fetchData">
    <template #title>
      <dialog-title :title="sectionId ? `编辑课程章节 #${sectionId}` : '新建课程章节'">
        <template #buttons>
          <el-button type="info" plain @click="_visible = false">取消</el-button>
          <el-button
            v-if="sectionId"
            plain
            type="warning"
            :loading="submitLoading"
            :disabled="!submittable || errorMessage !== ''"
            @click="confirmSubmit"
            >保存
          </el-button>
          <el-button
            v-else
            type="primary"
            :loading="createLoading"
            @click="confirmCreate"
            :disabled="errorMessage !== ''"
            >提交
          </el-button>
        </template>
      </dialog-title>
    </template>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
    <el-tabs v-model="selectedTab" type="card" v-loading="fetchLoading">
      <el-tab-pane label="编辑" name="editor">
        <el-form class="section edit-form" :model="form" @submit.prevent>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="章节标题" minlength="1" maxlength="80" show-word-limit />
          </el-form-item>
          <el-form-item label="文件" prop="title">
            <div class="file-field">
              <el-input
                v-model="filename"
                placeholder="文件名"
                minlength="1"
                :maxlength="256 - suffix.length"
                show-word-limit
                :disabled="form.fileInfo == null"
              >
                <template #append v-if="suffix !== ''">{{ suffix }}</template>
              </el-input>
              <el-upload class="upload-button" :show-file-list="false" :http-request="preUpload">
                <el-button type="primary" :icon="Upload" :loading="uploading">上传文件</el-button>
              </el-upload>
            </div>
            <div class="upload-progress" v-if="uploading">
              <el-progress :percentage="indeterminate ? 100 : progress" :indeterminate="indeterminate">
                <template #default>
                  <span>{{ formattedProgress }}</span>
                </template>
              </el-progress>
              <el-button circle text size="small" :icon="CloseBold" @click="cancel" />
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="章节描述" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="预览" name="preview">
        <course-section-preview :section="form" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface SectionForm {
  title: string;
  description: string;
  filename: string;
  type?: "video" | "slides";
  fileInfo?: FileInfoDto;
}
// eslint-disable-next-line no-undef
import FileInfoDto = Components.Schemas.FileInfoDto;
// eslint-disable-next-line no-undef
import CourseSectionRequestDto = Components.Schemas.CourseSectionRequestDto;
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import { computed, PropType, reactive, ref, watch } from "vue";

import { showError } from "@/api/error";
import { Action, ElMessage, ElMessageBox, UploadRequestOptions } from "element-plus";

import { useUserStore } from "@/stores/user";
import { Upload, CloseBold } from "@element-plus/icons-vue";
import CourseSectionPreview from "@/views/course/course-section-preview.vue";
import { upload } from "@/utils/file-upload";
import axios, { Canceler } from "axios";

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  sectionId: {
    type: Number as PropType<number>,
    default: 0, // 0 means create new section
  },
  addToCourseAfterCreated: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});
const emit = defineEmits(["update:visible", "updated", "created"]);

const selectedTab = ref("editor");

const form = reactive<SectionForm>({
  title: "",
  description: "",
  filename: "",
});
const _visible = ref(false);
watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const submittable = ref(false);

const fetchLoading = ref(false);
const fetchData = () => {
  selectedTab.value = "editor";
  errorMessage.value = "";
  if (props.sectionId === 0) {
    // create new course
    form.title = "";
    form.description = "";
    form.filename = "";
    form.type = undefined;
    form.fileInfo = undefined;
    suffix.value = "";
    return;
  }
  fetchLoading.value = true;
  API.getCourseSectionById({ id: props.sectionId })
    .then((res) => {
      const section = res.section!;
      form.title = section.title;
      form.description = section.description;
      form.filename = section.filename;
      suffix.value = section.filename.substring(section.filename.lastIndexOf(".")) || "";
      form.type = section.type;
      form.fileInfo = section.fileInfo;
      submittable.value = userStore.isRoot || userStore.roles.includes("ADMIN");
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const saved = ref(false);
const errorMessage = ref("");
const validateForm = (newVal: SectionForm) => {
  if (newVal.title.length === 0) return "请输入标题";
  if (newVal.fileInfo == undefined) return "请上传文件";
  return "";
};

watch(form, (newVal) => {
  errorMessage.value = validateForm(newVal);
  saved.value = false;
});

const toRequestDto = (): CourseSectionRequestDto => ({
  title: form.title,
  description: form.description,
  filename: form.filename,
  type: form.type!,
  fileId: form.fileInfo!.id,
});

const submitLoading = ref(false);
const submit = () => {
  submitLoading.value = true;
  API.updateCourseSectionById({ id: props.sectionId }, toRequestDto())
    .then((res) => {
      saved.value = true;
      emit("updated", res.section);
      ElMessage.success("保存成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
const confirmSubmit = () => {
  ElMessageBox.confirm("操作将对所有使用此章节的课程产生影响！是否继续？", "保存确认", {
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
const create = (updateCourse: boolean) => {
  createLoading.value = true;
  API.createCourseSection(toRequestDto())
    .then((res) => {
      saved.value = true;
      emit("created", res.section, props.sectionId, updateCourse);
      ElMessage.success("创建成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (createLoading.value = false));
};
const confirmCreate = () => {
  if (props.sectionId === 0 && props.addToCourseAfterCreated) return create(true);

  ElMessageBox.confirm("是否将此章节添加到培训？", "提交选项", {
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

const suffix = ref("");
const filename = computed({
  get: () => form.filename.substring(0, form.filename.length - suffix.value.length),
  set: (val) => (form.filename = val + suffix.value),
});

const uploading = ref(false);
const progress = ref(0);
const indeterminate = ref(false);
const canceler = ref<Canceler | undefined>();
const formattedProgress = ref("");

const formatSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  size /= 1024;
  if (size < 1024) return `${size.toFixed(2)}KB`;
  size /= 1024;
  if (size < 1024) return `${size.toFixed(2)}MB`;
  size /= 1024;
  return `${size.toFixed(2)}GB`;
};

// 预检文件
const preUpload = (options: UploadRequestOptions) => {
  progress.value = 0;
  indeterminate.value = true;
  formattedProgress.value = "预检中";
  uploading.value = true;
  const { file } = options;
  if (file.size > 1024 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过1G");
    uploading.value = false;
    return;
  }
  // validate file type: ppt, pptx, pdf; mp4, flv, mov
  if (
    [
      "application/vnd.ms-powerpoint", // ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
      "application/pdf", // pdf
    ].includes(file.type) &&
    [".ppt", ".pptx", ".pdf"].includes(file.name.substring(file.name.lastIndexOf(".")).toLowerCase())
  ) {
    formattedProgress.value = "准备中";
    uploadFile(file);
    return;
  }

  if (
    [
      "video/mp4", // mp4
      "video/x-flv", // flv
      "video/quicktime", // mov
    ].includes(file.type) &&
    [".mp4", ".flv", ".mov"].includes(file.name.substring(file.name.lastIndexOf(".")).toLowerCase())
  ) {
    const videoUrl = URL.createObjectURL(file);
    const audio = new Audio(videoUrl);
    audio.addEventListener("loadedmetadata", () => {
      let duration = audio.duration;
      if (duration < 15) {
        ElMessage.error("视频时长不能小于15秒");
        uploading.value = false;
        return;
      }
      if (duration > 3 * 60 * 60) {
        ElMessage.error("视频时长不能大于3小时");
        uploading.value = false;
        return;
      }
      formattedProgress.value = "准备中";
      URL.revokeObjectURL(videoUrl);
      uploadFile(file);
    });
    return;
  }

  ElMessage.error("不支持的文件类型");
  uploading.value = false;
};

const uploadFile = (file: File) => {
  upload(
    file,
    (loaded, total) => {
      console.log("upload progress: ", loaded, "of", total);
      progress.value = (loaded * 100) / total;
      indeterminate.value = false;
      formattedProgress.value = `${formatSize(loaded)} / ${formatSize(total)}`;
    },
    (c) => (canceler.value = c),
  )
    .then((res) => {
      //上传成功
      formattedProgress.value = "已上传";
      form.fileInfo = res.fileInfo;
      form.filename = file.name;
      suffix.value = file.name.substring(file.name.lastIndexOf(".")) || "";
      form.type = [".pptx", ".ppt", ".pdf"].includes(suffix.value) ? "slides" : "video";
      ElMessage.success("上传成功");
    })
    .catch((err) => {
      if (err instanceof axios.Cancel) ElMessage.info("取消上传");
      else showError(err);
    })
    .finally(() => {
      uploading.value = false;
      indeterminate.value = false;
    });
};
const cancel = () => {
  if (canceler.value) canceler.value("用户取消");
};
</script>

<style lang="scss" scoped>
.edit-form {
  .file-field {
    display: flex;
    align-items: center;
    width: 100%;

    .upload-button {
      margin-left: 10px;
      display: flex;
    }
  }

  .upload-progress {
    margin-top: 10px;
    display: flex;
    align-items: center;
    width: 100%;

    .el-progress {
      width: 100%;

      :deep(.el-progress__text) {
        min-width: 0;
      }
    }
  }
}
</style>
