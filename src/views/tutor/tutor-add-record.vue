<template>
  <el-dialog v-model="dialogVisible" :show-close="false" append-to-body @open="open">
    <template #title>
      <dialog-title :title="`新人 ${newbieRealname} / 新建带新日志`">
        <template #buttons>
          <el-button plain type="info" @click="close">返回</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </template>
      </dialog-title>
    </template>
    <el-divider />
    <el-form ref="domCommentForm" :model="comment">
      <el-form-item label="内容" label-width="120px" prop="comment">
        <el-input type="textarea" :rows="3" v-model="comment.comment" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close" icon="close" size="large"> 取消</el-button>
      <el-button type="primary" icon="Edit" @click.prevent="submit" size="large" :loading="isLoading"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";

const domCommentForm = ref<HTMLFormElement>();

const props = defineProps({
  newbieId: {
    type: Number,
    required: true,
  },
  newbieRealname: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const isLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["updateTutorAddRecordVisible", "created"]);

interface Comment {
  score: number;
  comment: string;
}

const comment = reactive<Comment>({
  score: 0,
  comment: "",
});

const close = () => (dialogVisible.value = false);

const submit = () => {
  isLoading.value = true;
  API.newbieUpdateComment(
    { id: props.newbieId },
    {
      content: comment.comment,
      score: comment.score,
      type: "TutorRecord",
    },
  )
    .then((res) => {
      ElMessage.success("创建成功");
      dialogVisible.value = false;
      emit("created", res.comment);
    })
    .catch(showError)
    .finally(() => {
      dialogVisible.value = false;
      isLoading.value = false;
    });
};

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("updateTutorAddRecordVisible", newValue));

const open = () => {
  comment.score = 0;
  comment.comment = "";
};
</script>
