<template>
  <single-page title="系统管理" class="root-page">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="用户管理" name="user">
        <root-user-list />
      </el-tab-pane>
      <el-tab-pane label="部门管理" name="division">
        <root-division-list />
      </el-tab-pane>
      <el-tab-pane label="城市管理" name="city">
        <root-city-list />
      </el-tab-pane>
      <el-tab-pane label="权限管理" name="permission">
        <root-permission-list />
      </el-tab-pane>
    </el-tabs>
  </single-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import RootUserList from "@/views/root/user-list/root-user-list.vue";
import RootDivisionList from "@/views/root/division-list/root-division-list.vue";
import RootCityList from "@/views/root/city-list/root-city-list.vue";
import RootPermissionList from "@/views/root/permission-list/root-permission-list.vue";
import SinglePage from "@/layout/single-page/single-page.vue";

const activeName = ref("user");
</script>
