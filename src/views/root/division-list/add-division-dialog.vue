<template>
  <el-dialog v-model="dialogVisible" :show-close="false" width="360px" @open="open">
    <template #title>
      <dialog-title title="新增部门" :icon="Edit" @submit="submit" @close="close" :submit-loading="isLoading" />
    </template>
    <div class="dialog-body">
      <span class="title"> 部门名称 </span>
      <el-input v-model="divisionName" @keyup.enter="submit" />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";
import { Edit } from "@element-plus/icons-vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const isLoading = ref(false);
const dialogVisible = ref(false);
const divisionName = ref("");

const emit = defineEmits(["updateAddDialogVisible"]);
const open = () => (divisionName.value = "");
const close = () => (dialogVisible.value = false);

const submit = () => {
  if (divisionName.value.length == 0) {
    ElMessage({ message: "部门名称不能为空", type: "error" });
    return;
  }
  isLoading.value = true;
  API.addDivision({ name: divisionName.value })
    .then(() => {
      ElMessage({ message: "部门添加成功", type: "success" });
      dialogVisible.value = false;
    })
    .catch(showError)
    .finally(() => (isLoading.value = false));
};

watch(props, (newValue) => {
  dialogVisible.value = newValue.visible;
});

watch(dialogVisible, function (newValue) {
  emit("updateAddDialogVisible", newValue);
});
</script>

<style lang="scss" scoped>
.dialog-body {
  display: flex;
  align-items: center;

  .title {
    margin: auto;
    width: 80px;
  }
}
</style>
