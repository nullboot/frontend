<template>
  <el-dialog v-model="dialogVisible" title="新增用户" :show-close="false" @open="fetchData">
    <template #title>
      <dialog-title
        title="创建用户"
        :icon="User"
        :submit-loading="isLoading"
        @submit="submit"
        @close="dialogVisible = false"
      />
    </template>
    <el-form ref="domProfileForm" :model="profileForm" :rules="settingRules" label-position="top">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profileForm.username" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model="profileForm.realname" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" />
        <el-checkbox v-model="profileForm.publicEmail">在个人资料中公开邮箱</el-checkbox>
      </el-form-item>
      <el-form-item prop="divisionId" label="部门">
        <el-select v-model="profileForm.divisionId" placeholder="请设置部门">
          <el-option v-for="(division, index) in divisions" :key="index" :label="division.name" :value="division.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="cityId" label="城市">
        <el-select v-model="profileForm.cityId" placeholder="请设置城市">
          <el-option v-for="(city, index) in cities" :key="index" :label="city.name" :value="city.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="profileForm.password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="profileForm.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item label="角色">
        <div class="role-list">
          <span class="role-item">
            <span class="role-item-label">新人</span>
            <el-switch v-model="profileForm.isNewbie" />
          </span>
          <span class="role-item">
            <span class="role-item-label">导师</span>
            <el-switch v-model="profileForm.isTutor" />
          </span>
          <span class="role-item">
            <span class="role-item-label">HRBP</span>
            <el-switch v-model="profileForm.isHRBP" />
          </span>
          <span class="role-item">
            <span class="role-item-label">管理员</span>
            <el-switch v-model="profileForm.isAdmin" />
          </span>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";
import { User } from "@element-plus/icons-vue";

const domProfileForm = ref<HTMLFormElement>();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const isLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["update:visible", "created"]);

interface ProfileForm {
  username: string;
  realname: string;
  email: string;
  publicEmail: boolean;
  divisionId: number | "";
  cityId: number | "";
  password: string;
  confirmPassword: string;
  isNewbie: boolean;
  isTutor: boolean;
  isHRBP: boolean;
  isAdmin: boolean;
}

enum Role {
  Newbie = "NEWBIE",
  Tutor = "TUTOR",
  HRBP = "HRBP",
  Admin = "ADMIN",
}

const profileForm = reactive<ProfileForm>({
  username: "",
  realname: "",
  email: "",
  publicEmail: false,
  password: "",
  confirmPassword: "",
  divisionId: "",
  cityId: "",
  isNewbie: false,
  isTutor: false,
  isHRBP: false,
  isAdmin: false,
});

const equalToPassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请确认密码"));
  } else if (value !== profileForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

// const close = () => (dialogVisible.value = false);

const submit = () => {
  domProfileForm.value?.validate((valid: boolean) => {
    if (valid) {
      isLoading.value = true;
      const ProfileData = {
        username: profileForm.username,
        realname: profileForm.realname,
        email: profileForm.email,
        publicEmail: profileForm.publicEmail,
        divisionId: profileForm.divisionId as number,
        cityId: profileForm.cityId as number,
        roles: [] as Role[],
        password: profileForm.password,
      };
      if (profileForm.isNewbie) ProfileData.roles.push(Role.Newbie);
      if (profileForm.isTutor) ProfileData.roles.push(Role.Tutor);
      if (profileForm.isHRBP) ProfileData.roles.push(Role.HRBP);
      if (profileForm.isAdmin) ProfileData.roles.push(Role.Admin);

      API.createUser(ProfileData)
        .then((res) => {
          emit("created", res.profile!);
          ElMessage.success("添加成功");
          dialogVisible.value = false;
        })
        .catch(showError)
        .finally(() => (isLoading.value = false));
    }
  });
};

const settingRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur", // 何时检查合法性：blur, change
    },
    {
      // TODO:用户名规则：字母、数字、中文，不允许特殊符号，不允许数字开头，建议前后端统一
      pattern: /^[A-Za-z\u4e00-\u9fa5][-A-Za-z0-9\u4e00-\u9fa5_]*$/,
      message: "用户名不符合规范",
      trigger: "blur",
    },
  ],
  divisionId: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === "" || typeof value !== "number") callback(new Error("请选择部门"));
        else callback();
      },
      trigger: "blur",
    },
  ],
  cityId: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === "" || typeof value !== "number") callback(new Error("请选择城市"));
        else callback();
      },
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      // TODO:邮箱规则：中间用@连接，左右为数字、字母，可以用单个“-”或“_”或“.”分隔，建议前后端统一
      pattern: /^([a-zA-Z0-9]+[-_.]?)+@([a-zA-Z0-9]+[-_.]?)+$/,
      message: "邮箱不符合规范",
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

watch(props, (newVal) => (dialogVisible.value = newVal.visible));
watch(dialogVisible, (newVal) => emit("update:visible", newVal));

const divisions = ref<{ id: number; name: string }[]>([]);
const cities = ref<{ id: number; name: string }[]>([]);

const fetchDivisions = () => {
  API.getDivisionTagList()
    .then((res) => (divisions.value = res.divisions!))
    .catch(showError);
};

const fetchCities = () => {
  API.getCityTagList()
    .then((res) => (cities.value = res.cities!))
    .catch(showError);
};

const fetchData = () => {
  profileForm.username = "";
  profileForm.realname = "";
  profileForm.email = "";
  profileForm.publicEmail = false;
  profileForm.divisionId = "";
  profileForm.cityId = "";
  profileForm.password = "";
  profileForm.confirmPassword = "";
  profileForm.isNewbie = false;
  profileForm.isTutor = false;
  profileForm.isAdmin = false;
  profileForm.isHRBP = false;
  fetchDivisions();
  fetchCities();
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
