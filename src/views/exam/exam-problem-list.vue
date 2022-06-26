<template>
  <div class="exam-problem-list" v-loading="loading">
    <template v-if="list?.length > 0">
      <exam-problem
        v-for="(problem, index) in list"
        :problem="problem"
        :key="index"
        :up-movable="index !== 0"
        :down-movable="index !== list.length - 1"
        @update="(p) => update(index, p)"
        @remove="() => remove(index)"
        @move="(d) => move(index, d)"
        @create="(d) => create(index, d)"
      />
    </template>

    <el-upload v-else class="upload" drag :show-file-list="false" :http-request="upload" v-loading="uploading">
      <el-icon class="el-icon--upload">
        <UploadFilled />
      </el-icon>
      <div>暂无题目</div>
      <div style="margin: 10px">将题目模板拖拽到此处或点击以上传</div>
      <div style="display: flex; align-items: center; justify-content: center">
        <el-button plain type="primary" class="dashed download-button" @click.stop="download" :icon="Download"
          >下载模板
        </el-button>
        <span style="margin-left: 10px; margin-right: 10px">或</span>
        <el-button plain type="primary" class="dashed create-button" @click.stop="create(0, 'before')" :icon="Plus"
          >添加题目
        </el-button>
      </div>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
// eslint-disable-next-line no-undef
import ProblemDto = Components.Schemas.ProblemDto;
import * as API from "@/api";
import ExamProblem from "@/views/exam/exam-problem.vue";
import { PropType, ref, watch } from "vue";
import { Plus, UploadFilled, Download } from "@element-plus/icons-vue";
import { ElMessage, UploadRequestOptions } from "element-plus";
import { showError } from "@/api/error";
import { saveAs } from "@/api";

const props = defineProps({
  problems: {
    type: Array as PropType<ProblemDto[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update"]);

const list = ref<ProblemDto[]>([]);
watch(props, (newVal) => (list.value = newVal.problems));
watch(list, (newVal) => emit("update", newVal), { deep: true });

const create = (index: number, position: "before" | "after") => {
  if (position === "after") ++index;
  list.value.splice(index, 0, {
    title: "新建题目",
    answers: [0],
    type: "SINGLE_CHOICE",
    options: ["选项 A", "选项 B", "选项 C", "选项 D"],
    reason: "",
  });
};
const update = (index: number, problem: ProblemDto) => {
  list.value[index] = problem;
};
const remove = (index: number) => {
  list.value.splice(index, 1);
};
const move = (index: number, direction: "up" | "down") => {
  const newIndex = direction === "up" ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= list.value.length) return;
  const tmp = list.value[index];
  list.value[index] = list.value[newIndex];
  list.value[newIndex] = tmp;
};

const uploading = ref(false);
const upload = (options: UploadRequestOptions) => {
  const { file } = options;
  // valid file type: excel, csv
  if (
    ![
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ].includes(file.type)
  ) {
    ElMessage.error("请上传题目模板文件");
    return;
  }

  uploading.value = true;
  API.parseExamProblems(options.file)
    .then((res) => (list.value = res.problems!))
    .catch(showError)
    .finally(() => (uploading.value = false));
};

const download = () => {
  API.getExamTemplate()
    .then((res) => saveAs(res as any as Blob, "exam_template.csv"))
    .catch(showError);
};
</script>

<style lang="scss" scoped>
.exam-problem-list {
  .dashed {
    border: 1px dashed var(--el-border-color);
  }

  .upload {
    :deep(.el-upload) {
      width: 100%;
    }

    :deep(.el-upload-dragger) {
      width: 100%;
      height: 240px;
    }
  }
}
</style>
