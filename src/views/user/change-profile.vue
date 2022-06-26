<template>
  <el-form
    ref="domProfileForm"
    :model="profileForm"
    :rules="settingRoles"
    @keyup.enter="handleSetting"
    label-width="auto"
    label-position="top"
    :hide-required-asterisk="true"
  >
    <el-form-item prop="username" label="用户名">
      <el-input v-model="profileForm.username" type="text" :prefix-icon="User" />
    </el-form-item>
    <el-form-item prop="realname" label="真实姓名">
      <el-input v-model="profileForm.realname" type="text" :prefix-icon="User" :disabled="!userStore.isRoot" />
    </el-form-item>
    <el-form-item prop="email" label="邮箱">
      <el-input v-model="profileForm.email" type="text" :prefix-icon="Message" />
      <el-checkbox v-model="profileForm.publicEmail">公开邮箱地址</el-checkbox>
    </el-form-item>
    <el-form-item prop="divisionId" label="部门">
      <el-select v-model="profileForm.divisionId" placeholder="未设置部门" :disabled="!userStore.isRoot">
        <el-option v-for="(division, index) in divisions" :key="index" :label="division.name" :value="division.id" />
      </el-select>
    </el-form-item>
    <el-form-item prop="cityId" label="城市">
      <el-select v-model="profileForm.cityId" placeholder="未设置城市" :disabled="!userStore.isRoot">
        <el-option v-for="(city, index) in cities" :key="index" :label="city.name" :value="city.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSetting" :loading="isLoading">修改资料</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { User, Message } from "@element-plus/icons-vue";
import { PropType, reactive, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { showError } from "@/api/error";
import * as API from "@/api";
import { ElMessage } from "element-plus/es";
// eslint-disable-next-line no-undef
import UserProfileDto = Components.Schemas.UserProfileDto;

const props = defineProps({
  userProfile: {
    type: Object as PropType<UserProfileDto>,
    required: true,
  },
});

const emit = defineEmits(["updated"]);

const domProfileForm = ref<HTMLFormElement>();
const userStore = useUserStore();
const isLoading = ref(false);

interface ProfileForm {
  username: string;
  realname: string;
  email: string;
  publicEmail: boolean;
  divisionId: number | "";
  cityId: number | "";
}

const profileForm = reactive<ProfileForm>({
  username: "",
  realname: "",
  email: "",
  publicEmail: false,
  divisionId: "",
  cityId: "",
});

watch(props, (newVal) => {
  const profile = newVal.userProfile;
  if (!profile) return;
  profileForm.username = profile.username;
  profileForm.realname = profile.realname;
  profileForm.email = profile.email;
  profileForm.publicEmail = profile.publicEmail;
  profileForm.divisionId = profile.division?.id;
  profileForm.cityId = profile.city?.id;
  if (userStore.isRoot) {
    fetchDivisions();
    fetchCities();
  } else {
    divisions.value = profile.division ? [profile.division] : [];
    cities.value = profile.city ? [profile.city] : [];
  }
});

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

const settingRoles = reactive({
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
});

const handleSetting = () => {
  domProfileForm.value?.validate((valid: boolean) => {
    if (valid) {
      isLoading.value = true; // 按钮显示加载中
      const ProfileData = {
        username: profileForm.username,
        email: profileForm.email,
        publicEmail: profileForm.publicEmail,
        realname: userStore.isRoot ? profileForm.realname : undefined,
        divisionId: userStore.isRoot && profileForm.divisionId !== "" ? profileForm.divisionId : undefined,
        cityId: userStore.isRoot && profileForm.cityId !== "" ? profileForm.cityId : undefined,
      };
      API.updateUserProfile({ id: props.userProfile.id }, ProfileData)
        .then(() => {
          if (userStore.userId === props.userProfile.id) {
            userStore
              .getProfile()
              .then(() => {
                emit("updated");
                ElMessage.success("修改成功");
              })
              .catch(showError);
          } else {
            emit("updated");
            ElMessage.success("修改成功");
          }
        })
        .catch(showError)
        .finally(() => {
          isLoading.value = false;
        });
    }
  });
};
</script>
