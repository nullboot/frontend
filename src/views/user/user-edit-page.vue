<template>
  <single-page :title="`修改用户资料 ${profile?.realname ?? '#' + id}`" class="user-edit-page">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="个人资料" name="profile">
        <change-profile :user-profile="profile" v-loading="fetchLoading" @updated="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="安全" name="security">
        <change-password :user-id="id" />
      </el-tab-pane>
      <el-tab-pane label="角色" name="role">
        <change-role :user-id="id" :roles="profile?.roles ?? []" v-loading="fetchLoading" @updated="fetchData" />
      </el-tab-pane>
    </el-tabs>
  </single-page>
</template>

<style lang="scss" scoped>
.user-edit-page {
  :deep(.el-form-item__label) {
    font-weight: bold;
  }
}
</style>

<script lang="ts" setup>
import * as API from "@/api/user";
import SinglePage from "@/layout/single-page/single-page.vue";
import ChangePassword from "@/views/user/change-password.vue";
import ChangeProfile from "@/views/user/change-profile.vue";
import ChangeRole from "@/views/user/change-role.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { showError } from "@/api/error";
// eslint-disable-next-line no-undef
import UserProfileDto = Components.Schemas.UserProfileDto;

const router = useRouter();
const id = Number(router.currentRoute.value.params.id);

const activeName = ref("profile");

const profile = ref<UserProfileDto>({} as UserProfileDto);

const fetchLoading = ref<boolean>(false);
const fetchData = () => {
  fetchLoading.value = true;
  API.getUserProfile({ id })
    .then((res) => (profile.value = res.profile!))
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

onMounted(() => {
  fetchData();
});
</script>
