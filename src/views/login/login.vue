<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <img src="@/assets/logo-wide.png" alt="logo-wide" />
      </div>
      <div class="content">
        <el-form ref="domLoginForm" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
          <el-form-item prop="usernameOrEmail">
            <el-input
              v-model="loginForm.usernameOrEmail"
              placeholder="用户名/邮箱"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <br />
          <el-form-item prop="password" style="margin-bottom: 50px">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>
          <el-button
            :loading="isLoading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
            :auto-insert-space="true"
            >登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Lock, User } from "@element-plus/icons-vue";
import * as API from "@/api";
import { cookieSetToken, cookieSetId } from "@/utils/cookies";
import { showError } from "@/api/error";

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}

const router = useRouter();

const domLoginForm = ref<HTMLFormElement>();
const isLoading = ref(false);

const loginForm = reactive<LoginForm>({
  usernameOrEmail: "",
  password: "",
});
const loginRules = reactive({
  usernameOrEmail: [
    {
      required: true,
      message: "请输入用户名或邮箱",
      trigger: "blur", // 何时检查合法性：blur, change
    },
    {
      //表示识别用户名或邮箱，具体规则见changeProfile文件
      pattern: /^(([A-Za-z\u4e00-\u9fa5][-A-Za-z0-9\u4e00-\u9fa5_]*)|(([a-zA-Z0-9]+[-_.]?)+@([a-zA-Z0-9]+[-_.]?)+))$/,
      message: "输入的用户名或邮箱不符合规范",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
});

// 处理登录
const handleLogin = () => {
  domLoginForm.value?.validate((valid: boolean) => {
    if (valid) {
      isLoading.value = true; // 按钮显示加载中
      const LoginData =
        loginForm.usernameOrEmail.search("@") == -1 // 用是否含有@来判断是用户名还是邮箱
          ? { username: loginForm.usernameOrEmail, password: loginForm.password }
          : { email: loginForm.usernameOrEmail, password: loginForm.password };

      API.authLogin(LoginData)
        .then((res) => {
          // 储存信息
          cookieSetToken(res.token!);
          cookieSetId(res.profile!.id);
          // 跳转
          router.push({ path: "/" });
        })
        .catch(showError)
        .finally(() => {
          isLoading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;

  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;

      img {
        height: 100%;
      }
    }

    .content {
      padding: 20px 50px 50px 50px;
    }
  }
}
</style>
