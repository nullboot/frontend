<template>
  <el-dialog v-model="dialogVisible" @open="fetchData" append-to-body :show-close="false">
    <template #title>
      <dialog-title :title="`导师 ${tutorRealname} - 评价 - 新人 ${newbieRealname}`" :icon="Comment">
        <template #buttons>
          <el-button type="info" plain @click="close">取消</el-button>
          <el-button type="primary" @click.prevent="submit" :loading="isLoading">提交</el-button>
        </template>
      </dialog-title>
    </template>
    <el-form ref="domCommentForm" :model="comment">
      <el-form-item label="分数" label-width="120px" prop="score">
        <el-rate v-model="comment.score" />
      </el-form-item>
      <el-form-item label="评价" label-width="120px" prop="comment">
        <el-input type="textarea" :rows="3" v-model="comment.comment" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { APIError, showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";
import { Comment } from "@element-plus/icons-vue";

const domCommentForm = ref<HTMLFormElement>();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  newbieId: {
    type: Number,
    required: true,
  },
  tutorRealname: {
    type: String,
    required: true,
  },
  newbieRealname: {
    type: String,
    required: true,
  },
});

const isLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["updateTutorCommentVisible", "commented"]);

interface CommentForm {
  score: number;
  comment: string;
}

const comment = reactive<CommentForm>({
  score: 0,
  comment: "",
});

const close = () => (dialogVisible.value = false);

const fetchData = () => {
  comment.score = 0;
  comment.comment = "";
  API.newbieGetComment({ id: props.newbieId }, { type: "TutorToNewbie" })
    .then((res) => {
      if (res.comment) {
        comment.score = res.comment.score;
        comment.comment = res.comment.content;
      }
    })
    .catch((err) => {
      if (err instanceof APIError && err.message === "NO_SUCH_COMMENT") {
        comment.score = 0;
        comment.comment = "";
      } else showError(err);
    });
};

const submit = () => {
  isLoading.value = true;
  API.newbieUpdateComment(
    { id: props.newbieId },
    { content: comment.comment, score: comment.score, type: "TutorToNewbie" },
  )
    .then(() => {
      ElMessage.success("评价成功");
      dialogVisible.value = false;
      emit("commented");
    })
    .catch(showError)
    .finally(() => {
      isLoading.value = false;
    });
};

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("updateTutorCommentVisible", newValue));
</script>
