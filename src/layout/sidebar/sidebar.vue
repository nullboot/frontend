<template>
  <div class="sidebar">
    <div class="welcome-section">
      <div>
        <gavatar :size="160" :email="useUserStore().email" />
      </div>
      <span>欢迎回来，{{ useUserStore().realname }}</span>
    </div>
    <div class="role-selector">
      <span class="label">当前身份</span>
      <el-select class="selector" v-model="selectedRole" teleported>
        <el-option v-for="item in userStore.roles" :key="item" :label="mapRoles(item)" :value="item" />
      </el-select>
    </div>
    <el-menu :default-active="activeItem" :key="menuKey">
      <sidebar-item
        v-for="(item, idx) in props.routeArray"
        :key="item.path"
        :route-item="item"
        :index="idx.toString()"
      />
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, PropType, ref, watch } from "vue";
import SidebarItem from "@/layout/sidebar/sidebar-item.vue";
import { RouteRecordRaw, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useRouteStore } from "@/stores/route";
import Gavatar from "@/components/gavatar.vue";

const mapRoles = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "管理员";
    case "HRBP":
      return "HRBP";
    case "TUTOR":
      return "导师";
    case "NEWBIE":
      return "新人";
    default:
      return "未知";
  }
};

const props = defineProps({
  routeArray: {
    type: Object as PropType<Array<RouteRecordRaw>>,
    required: true,
  },
});

const selectedRole = ref<"ADMIN" | "NEWBIE" | "TUTOR" | "HRBP" | "">("");
const router = useRouter();
const userStore = useUserStore();
const routeStore = useRouteStore();
const activeItem = ref("");
const menuKey = ref(0);

onBeforeMount(() => {
  selectedRole.value = userStore.selectedRole;
  const currentUrl = router.currentRoute.value.path;
  if (currentUrl != "") {
    props.routeArray.forEach((item, idx) => {
      if (item.path === currentUrl) {
        activeItem.value = idx.toString();
      }
    });
  } else {
    activeItem.value = "";
  }
});

watch(selectedRole, () => {
  if (selectedRole.value === "") return;
  userStore.$patch({
    selectedRole: selectedRole.value,
  });
  routeStore.generateSidebarRoutes();
  activeItem.value = "";
  menuKey.value += 1;
});
</script>

<style lang="scss" scoped>
.sidebar {
  height: calc(100vh - 50px);
  background-color: white;

  .welcome-section {
    padding-top: 20px;
    text-align: center;
  }

  .role-selector {
    padding-top: 20px;
    text-align: center;

    .label {
      margin-right: 5px;
    }

    .selector {
      width: 90px;
    }

    margin-bottom: 20px;
  }
}
</style>
