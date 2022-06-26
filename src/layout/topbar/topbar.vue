<template>
  <div class="topbar">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.png" class="logo-img" alt="Logo" />
      </router-link>
    </div>
    <div class="right-menu">
      <gavatar :size="34" :email="userStore.email" class="right-menu-item" />
      <el-dropdown class="right-menu-item">
        <span class="right-menu-item"> {{ realName }} </span>
        <el-tag>{{ division }}</el-tag>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userEdit">修改资料</el-dropdown-item>
            <el-dropdown-item @click="rootPage" v-if="userStore.isRoot">系统管理</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { showError } from "@/api/error";
import { authLogout } from "@/api/auth";
import { clearAllStore } from "@/stores";
import { useUserStore } from "@/stores/user";
import { cookieClear } from "@/utils/cookies";
import Gavatar from "@/components/gavatar.vue";

const userStore = useUserStore();
const router = useRouter();

const realName = computed(() => {
  if (userStore.realname === "") return "RealName";
  return userStore.realname;
});

const division = computed(() => {
  if (!userStore.division?.name) return "未知部门";
  return userStore.division.name;
});

const userEdit = () => {
  router.push({ path: `/user/${userStore.userId}/edit` });
};
const rootPage = () => {
  router.push({ path: "/root-page" });
};
const logout = () => {
  authLogout({ userId: userStore.userId })
    .then(() => {
      cookieClear();
      clearAllStore();
      router.push({ path: "/login" }); // 直接跳转到"/"会出现同步问题
    })
    .catch(showError);
};
</script>

<style lang="scss" scoped>
.topbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--el-box-shadow-light);

  .logo-container {
    float: left;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #5a5e66;
    padding-top: 17px;
    padding-left: 1.5vw;

    .logo-link {
      height: 100%;
      width: 80px;

      .logo-img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .right-menu {
    float: right;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #5a5e66;

    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
