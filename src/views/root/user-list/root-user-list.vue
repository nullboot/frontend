<template>
  <list-page v-bind="pagination" @paginate="paginate">
    <template #buttons>
      <el-button plain type="info" @click="resetFilter" :icon="Refresh">重置筛选</el-button>
      <el-button plain type="primary" :icon="DocumentAdd" @click="addDialogVisible = true">新增用户</el-button>
    </template>
    <template #filter>
      <el-form class="filter-form" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="nameModel" clearable :prefix-icon="Search" @change="filtered" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleModel" clearable placeholder="全部" @change="filtered">
            <el-option v-for="(item, idx) in roleOptions" :key="idx" v-bind="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="divisionModel" filterable clearable placeholder="全部" @change="filtered">
            <el-option v-for="(item, idx) in divisionOptions" :key="idx" v-bind="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="cityModel" filterable clearable placeholder="全部" @change="filtered">
            <el-option v-for="(item, idx) in cityOptions" :key="idx" v-bind="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <el-table :data="userList" stripe table-layout="auto" v-loading="fetchLoading">
      <el-table-column label="#" fixed="left" prop="id" />
      <el-table-column :show-overflow-tooltip="true" label="用户名" prop="username" sortable />
      <el-table-column :show-overflow-tooltip="true" label="姓名" prop="realname" sortable />
      <el-table-column :show-overflow-tooltip="true" label="邮箱" prop="email" />
      <el-table-column :show-overflow-tooltip="true" label="角色" prop="roles" sortable>
        <template v-slot="{ row }">
          <el-tag v-for="(role, index) in row.roles" :key="index" type="success" size="small"
            >{{ mapRole(role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="部门" prop="division.name" />
      <el-table-column :show-overflow-tooltip="true" label="城市" prop="city.name" />
      <el-table-column :show-overflow-tooltip="true" label="注册时间">
        <template v-slot="scope">
          {{ parseDate(scope.row.registerTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template v-slot="{ row }">
          <!-- 修改按钮 -->
          <el-button plain type="primary" size="small" icon="Edit" @click="edit(row.id)"> 修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-user-dialog :visible="addDialogVisible" @update:visible="handleAddDialogClose" @created="created" />
  </list-page>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import UserProfileDto = Components.Schemas.UserProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.UserControllerGetUsers.Parameters.Wildcard;
import { parseDate } from "@/utils/date";
import AddUserDialog from "@/views/root/user-list/add-user-dialog.vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import { onMounted, ref } from "vue";
import router from "@/router";
import ListPage from "@/components/list-page.vue";
import { DocumentAdd, Refresh, Search } from "@element-plus/icons-vue";
import { Pagination } from "@/utils/pagination";

const addDialogVisible = ref(false);

enum Role {
  Newbie = "NEWBIE",
  Tutor = "TUTOR",
  HRBP = "HRBP",
  Admin = "ADMIN",
}

const mapRole = (role: Role) => {
  if (role === Role.Newbie) return "新人";
  if (role === Role.Tutor) return "导师";
  if (role === Role.HRBP) return "HRBP";
  if (role === Role.Admin) return "管理员";
  return "未知";
};

const edit = (id: number) => {
  router.push({ name: "userEdit", params: { id } });
};

const fetchLoading = ref(false);
const userList = ref<Array<UserProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const roleOptions = [
  { label: "新人", value: Role.Newbie },
  { label: "导师", value: Role.Tutor },
  { label: "HRBP", value: Role.HRBP },
  { label: "管理员", value: Role.Admin },
];
const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);

const roleModel = ref<Role | "">("");
const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  cityId?: number;
  divisionId?: number;
  role?: Role;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const fetchData = () => {
  fetchLoading.value = true;
  API.getUserList({
    ...pagination.value.get(),
    ...filter.value,
  })
    .then((res) => {
      userList.value = res.users!;
      pagination.value.total = res.count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const paginate = (pageSiz: number, curPage: number) => {
  pagination.value.set(pageSiz, curPage);
  fetchData();
};

const filtered = () => {
  filter.value.cityId = cityModel.value === "" ? undefined : cityModel.value;
  filter.value.divisionId = divisionModel.value === "" ? undefined : divisionModel.value;
  filter.value.role = roleModel.value === "" ? undefined : roleModel.value;
  if (nameModel.value === "") {
    filter.value.keyword = undefined;
    filter.value.wildcard = undefined;
  } else {
    filter.value.keyword = nameModel.value;
    filter.value.wildcard = "BOTH";
  }
  pagination.value.currentPage = 1;
  fetchData();
};

const resetFilter = () => {
  cityModel.value = "";
  divisionModel.value = "";
  nameModel.value = "";
  fetchDivisions();
  fetchCities();
  filtered();
};

const cityLoading = ref<boolean>(false);
const fetchCities = () => {
  cityLoading.value = true;
  API.getCityTagList()
    .then((res) => (cityOptions.value = res.cities!.map((c) => ({ value: c.id!, label: c.name! }))))
    .catch(showError)
    .finally(() => (cityLoading.value = false));
};

const divisionLoading = ref<boolean>(false);
const fetchDivisions = () => {
  divisionLoading.value = true;
  API.getDivisionTagList()
    .then((res) => (divisionOptions.value = res.divisions!.map((d) => ({ value: d.id!, label: d.name! }))))
    .catch(showError)
    .finally(() => (divisionLoading.value = false));
};

onMounted(() => {
  fetchData();
  fetchCities();
  fetchDivisions();
});

const handleAddDialogClose = (newVal: boolean) => {
  addDialogVisible.value = newVal;
};

const created = (user: UserProfileDto) => {
  userList.value = [user, ...userList.value];
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}
</style>
