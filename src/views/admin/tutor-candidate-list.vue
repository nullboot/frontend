<template>
  <main-card class="admin tutor-candidate user-list" title="提名导师" :icon="User">
    <list-page v-bind="pagination" @paginate="paginate" @reset="resetFilter">
      <template #filter>
        <el-form class="filter-form" :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="nameModel" clearable :prefix-icon="Search" @change="filtered" placeholder="姓名" />
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
      <el-table :data="tutorCandidateList" stripe table-layout="auto" v-loading="fetchLoading">
        <el-table-column
          fixed="left"
          label="姓名"
          prop="realname"
          :show-overflow-tooltip="true"
          sortable
        ></el-table-column>
        <el-table-column label="城市" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <span>{{ row.city?.name ?? "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <span>{{ row.division?.name ?? "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="邮箱" prop="email"></el-table-column>
        <el-table-column label="注册时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.registerTime) }}</template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template #default="{ $index: idx }">
            <div class="operations">
              <el-button plain size="small" type="primary" @click="nominate(idx)" :loading="loading[idx]"
                >提名
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </list-page>
  </main-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import UserProfileDto = Components.Schemas.UserProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TutorControllerGetTutors.Parameters.Wildcard;
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import { ElMessage } from "element-plus";
import { Search, User } from "@element-plus/icons-vue";
import ListPage from "@/components/list-page.vue";
import { parseDate } from "@/utils/date";
import { Pagination } from "@/utils/pagination";
import { useUserStore } from "@/stores/user";
import MainCard from "@/components/main-card.vue";

const userStore = useUserStore();

const fetchLoading = ref(false);
const tutorCandidateList = ref<Array<UserProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<{ value: number; label: string }[]>([]);
const divisionOptions = ref<{ value: number; label: string }[]>([]);

const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  cityId?: number;
  divisionId?: number;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const fetchData = () => {
  fetchLoading.value = true;
  API.getUserList({
    ...pagination.value.get(),
    currentRole: "ADMIN",
    role: "TUTOR",
    withoutRole: true,
    ...filter.value,
  })
    .then((res) => {
      tutorCandidateList.value = res.users!;
      loading.value = Array.from({ length: res.users!.length }, () => false);
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

const loading = ref<Array<boolean | null>>([]);
const nominate = (idx: number) => {
  loading.value[idx] = true;
  API.nominateTutor({ id: tutorCandidateList.value[idx].id! })
    .then(() => {
      ElMessage({
        message: "提名成功",
        type: "success",
      });
    })
    .catch(showError)
    .finally(() => {
      loading.value[idx] = false;
      fetchData();
    });
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
  (userStore.isRoot ? API.getDivisionTagList() : API.getPermissions({ role: "ADMIN", id: userStore.userId }))
    .then((res) => (divisionOptions.value = res.divisions!.map((d) => ({ value: d.id!, label: d.name! }))))
    .catch(showError)
    .finally(() => (divisionLoading.value = false));
};

onMounted(() => {
  fetchData();
  fetchCities();
  fetchDivisions();
});
</script>
