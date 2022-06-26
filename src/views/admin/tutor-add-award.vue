<template>
  <el-dialog v-model="dialogVisible" title="新增荣誉" append-to-body :show-close="false" @open="open">
    <template #title>
      <dialog-title
        :title="`导师 ${realname} / 新增荣誉`"
        :icon="Trophy"
        :submit-loading="submitLoading"
        :allow-submit="errorMessage === ''"
        @close="dialogVisible = false"
        @submit="submit"
      />
    </template>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
    <el-form ref="domCommentForm" :model="award">
      <el-form-item label="荣誉名称">
        <el-input v-model="award.title" />
      </el-form-item>
      <el-form-item label="荣誉等级">
        <el-rate v-model="award.level" />
      </el-form-item>
      <el-form-item label="荣誉详情">
        <el-input type="textarea" :rows="3" v-model="award.description" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";
import { Trophy } from "@element-plus/icons-vue";

const domCommentForm = ref<HTMLFormElement>();

const props = defineProps({
  tutorId: {
    type: Number as PropType<number>,
    required: true,
  },
  realname: {
    type: String as PropType<string>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const submitLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["update:visible", "created"]);

interface Award {
  title: string;
  level: number;
  description: string;
}

const award = reactive<Award>({
  title: "",
  level: 0,
  description: "",
});

const submit = () => {
  submitLoading.value = true;
  //console.log({ id: props.newbieId, content: comment.comment, score: comment.score, type: "TutorToNewbie" });
  API.tutorGiveAward({ id: props.tutorId! }, award)
    .then((res) => {
      ElMessage({
        message: "新增荣誉成功",
        type: "success",
      });
      emit("created", res.award);
      dialogVisible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("update:visible", newValue));

const errorMessage = ref<string>("");
const validateForm = (form: Award) => {
  if (form.title.length === 0) return "请输入荣誉名称";
  if (form.level === 0) return "请设置荣誉等级";
  return "";
};

watch(award, (newVal) => (errorMessage.value = validateForm(newVal)));

const open = () => {
  award.title = "";
  award.level = 0;
  award.description = "";
  errorMessage.value = validateForm(award);
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  line-height: unset;
}

.el-alert {
  margin-bottom: 10px;
}
</style>
