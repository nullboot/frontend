<template>
  <el-form
    ref="domRoleForm"
    :model="roleForm"
    @keyup.enter="submit"
    label-width="auto"
    :hide-required-asterisk="true"
    :disabled="!userStore.isRoot"
  >
    <el-form-item>
      <div class="role-list">
        <span class="role-item">
          <span class="role-item-label">新人</span>
          <el-switch v-model="roleForm.isNewbie" />
        </span>
        <span class="role-item">
          <span class="role-item-label">导师</span>
          <el-switch v-model="roleForm.isTutor" />
        </span>
        <span class="role-item">
          <span class="role-item-label">HRBP</span>
          <el-switch v-model="roleForm.isHRBP" />
        </span>
        <span class="role-item">
          <span class="role-item-label">管理员</span>
          <el-switch v-model="roleForm.isAdmin" />
        </span>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" :loading="isLoading">修改角色</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import * as API from "@/api";
import { showError } from "@/api/error";

import { ElMessage } from "element-plus";

enum Role {
  Newbie = "NEWBIE",
  Tutor = "TUTOR",
  HRBP = "HRBP",
  Admin = "ADMIN",
}

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  roles: {
    type: Array as PropType<Role[]>,
    required: true,
  },
});

const emit = defineEmits(["updated"]);

const userStore = useUserStore();
const isLoading = ref(false);

interface RoleForm {
  isNewbie: boolean;
  isTutor: boolean;
  isAdmin: boolean;
  isHRBP: boolean;
}

const roleForm = reactive<RoleForm>({ isNewbie: false, isAdmin: false, isHRBP: false, isTutor: false });

watch(props, (newVal) => {
  roleForm.isNewbie = newVal.roles.includes(Role.Newbie);
  roleForm.isTutor = newVal.roles.includes(Role.Tutor);
  roleForm.isAdmin = newVal.roles.includes(Role.Admin);
  roleForm.isHRBP = newVal.roles.includes(Role.HRBP);
});

const submit = () => {
  isLoading.value = true; // 按钮显示加载中

  const roles: Role[] = [];
  if (roleForm.isNewbie) roles.push(Role.Newbie);
  if (roleForm.isTutor) roles.push(Role.Tutor);
  if (roleForm.isHRBP) roles.push(Role.HRBP);
  if (roleForm.isAdmin) roles.push(Role.Admin);

  API.updateUserRoles({ id: props.userId }, { roles })
    .then(() => {
      emit("updated");
      ElMessage.success("修改成功");
    })
    .catch(showError)
    .finally(() => (isLoading.value = false));
};
</script>

<style lang="scss" scoped>
.role-list {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;

  .role-item {
    display: flex;
    align-items: center;

    .role-item-label {
      margin-right: 5px;
    }
  }
}
</style>
