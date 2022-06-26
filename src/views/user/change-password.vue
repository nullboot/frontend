<template>
  <el-form
    ref="domPasswordForm"
    :model="passwordForm"
    :rules="settingRoles"
    @keyup.enter="submit"
    label-width="auto"
    label-position="top"
    :hide-required-asterisk="true"
  >
    <el-form-item v-show="!userStore.isRoot" prop="oldPassword" label="原密码">
      <el-input v-model="passwordForm.oldPassword" type="password" :prefix-icon="Key" show-password />
    </el-form-item>
    <el-form-item prop="password" label="新密码">
      <el-input v-model="passwordForm.password" type="password" :prefix-icon="Key" show-password />
    </el-form-item>
    <el-form-item prop="confirmPassword" label="确认密码">
      <el-input v-model="passwordForm.confirmPassword" type="password" :prefix-icon="Key" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" :loading="isLoading">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { Key } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useUserStore } from "@/stores/user";
import * as API from "@/api";
import { showError } from "@/api/error";

import { ElMessage } from "element-plus";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const domPasswordForm = ref<HTMLFormElement>();
const userStore = useUserStore();
const isLoading = ref(false);

interface PasswordForm {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

const passwordForm = reactive<PasswordForm>({
  oldPassword: "",
  password: "",
  confirmPassword: "",
});
const equalToPassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认密码"));
  } else if (value !== passwordForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const settingRoles = reactive({
  oldPassword: [
    {
      required: !userStore.isRoot,
      message: "请输入原密码",
      trigger: "change",
    },
    {
      // TODO:密码长度限制建议前后端统一
      min: 6,
      max: 18,
      message: "长度应在 6 到 18 个字符之间",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "change",
    },
    {
      min: 6,
      max: 18,
      message: "长度应在 6 到 18 个字符之间",
      trigger: "change",
    },
  ],
  confirmPassword: [
    {
      validator: equalToPassword,
      trigger: "blur",
    },
    {
      required: true,
      message: "请确认密码",
      trigger: "change",
    },
  ],
});
const submit = () => {
  domPasswordForm.value?.validate((valid: boolean) => {
    if (valid) {
      isLoading.value = true; // 按钮显示加载中

      const data = {
        oldPassword: userStore.isRoot ? undefined : passwordForm.oldPassword,
        password: passwordForm.password,
      };

      API.updateUserPassword({ id: props.userId }, data)
        .then(() => {
          ElMessage.success("修改成功");
        })
        .catch(showError)
        .finally(() => (isLoading.value = false));
    }
  });
};
</script>
