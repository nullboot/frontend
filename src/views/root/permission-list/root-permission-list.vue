<template>
  <el-tabs v-model="roleModel" @tab-change="filtered">
    <el-tab-pane v-for="{ value, label } in options" :label="label" :name="value" :key="value" />
  </el-tabs>
  <list-page v-bind="pagination" @paginate="paginate" @reset="resetFilter">
    <template #filter>
      <el-form class="filter-form" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="nameModel" clearable :prefix-icon="Search" @change="filtered" placeholder="姓名" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-tooltip content="用户所属部门，而非管理的部门">
              <span>部门</span>
            </el-tooltip>
          </template>
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
      <el-table-column :show-overflow-tooltip="true" label="部门" prop="division.name" />
      <el-table-column :show-overflow-tooltip="true" label="城市" prop="city.name" />
      <el-table-column :show-overflow-tooltip="true" label="注册时间">
        <template v-slot="scope">
          {{ parseDate(scope.row.registerTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template v-slot="{ row }">
          <el-button plain type="primary" size="small" icon="Edit" @click="edit(row)">修改权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <set-permission-dialog v-bind="setPermissionProps" @update:visible="updateSetPermissionVisible" />
  </list-page>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import UserProfileDto = Components.Schemas.UserProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.UserControllerGetUsers.Parameters.Wildcard;
import { parseDate } from "@/utils/date";
import * as API from "@/api";
import { showError } from "@/api/error";
import { onMounted, ref } from "vue";
import ListPage from "@/components/list-page.vue";
import { Search } from "@element-plus/icons-vue";
import { Pagination } from "@/utils/pagination";
import SetPermissionDialog from "@/views/root/permission-list/set-permission-dialog.vue";

const setPermissionProps = ref<{
  visible: boolean;
  userId: number;
  realname: string;
  role: "ADMIN" | "HRBP";
}>({ visible: false, userId: 0, realname: "", role: "ADMIN" });

const options = [
  { label: "管理员", value: "ADMIN" },
  { label: "HRBP", value: "HRBP" },
];

const fetchLoading = ref(false);
const userList = ref<Array<UserProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);

const roleModel = ref<"ADMIN" | "HRBP">("ADMIN");
const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  cityId?: number;
  divisionId?: number;
  role: "ADMIN" | "HRBP";
  keyword?: string;
  wildcard?: Wildcard;
}>({ role: "ADMIN" });

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
  filter.value.role = roleModel.value;
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

const edit = (user: UserProfileDto) => {
  setPermissionProps.value.role = roleModel.value;
  setPermissionProps.value.userId = user.id;
  setPermissionProps.value.realname = user.realname;
  setPermissionProps.value.visible = true;
};

onMounted(() => {
  fetchData();
  fetchCities();
  fetchDivisions();
});

const updateSetPermissionVisible = (newVal: boolean) => (setPermissionProps.value.visible = newVal);
</script>
