<template>
  <main-card class="admin tutor-list" title="导师列表" :icon="UserFilled">
    <list-page v-bind="pagination" @paginate="paginate" @reset="resetFilter">
      <template #filter>
        <el-form class="filter-form" :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="nameModel" clearable :prefix-icon="Search" @change="filtered" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="statusModel" clearable placeholder="全部" @change="filtered">
              <el-option v-for="(item, idx) in statusOptions" :key="idx" v-bind="item" />
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
      <el-table :data="tutorList" stripe table-layout="auto" v-loading="fetchLoading">
        <el-table-column
          fixed="left"
          label="姓名"
          prop="userProfile.realname"
          :show-overflow-tooltip="true"
          sortable
        ></el-table-column>
        <el-table-column label="城市" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <span>{{ row.userProfile.city?.name ?? "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <span>{{ row.userProfile.division?.name ?? "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="邮箱" prop="userProfile.email"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <el-tag v-if="row.isGraduate === true" type="success">已上岗</el-tag>
            <el-tag v-else-if="row.isApproved === true">培训中</el-tag>
            <el-tag v-else-if="row.isApproved === false" type="danger">已拒绝</el-tag>
            <el-tag v-else-if="row.isApproved == null" type="warning">待审核</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上岗时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.graduationTime) }}</template>
        </el-table-column>
        <el-table-column label="提名时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.nominateTime) }}</template>
        </el-table-column>
        <el-table-column label="带新总数" prop="totalNewbieCount" sortable></el-table-column>
        <el-table-column label="毕业新人数" prop="graduateNewbieCount" sortable></el-table-column>
        <el-table-column label="评分">
          <template #default="{ row }"
            >{{ row.graduateNewbieCount ? (row.totalScore / row.graduateNewbieCount).toFixed(2) : "N/A" }}
          </template>
        </el-table-column>
        <el-table-column label="看板" align="center">
          <template v-slot="{ row }">
            <el-button plain size="small" type="primary" @click="openDashboard(row.userId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="荣誉" align="center">
          <template v-slot="{ row }">
            <el-button plain size="small" type="primary" @click="showAward(row)" :disabled="!row.isGraduate"
              >查看荣誉
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </list-page>
    <tutor-award v-bind="awardProps" @update:visible="updateAwardVisible" />
  </main-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import TutorProfileDto = Components.Schemas.TutorProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TutorControllerGetTutors.Parameters.Wildcard;
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import ListPage from "@/components/list-page.vue";
import { Pagination } from "@/utils/pagination";
import { useUserStore } from "@/stores/user";
import { parseDate } from "@/utils/date";
import { Search, UserFilled } from "@element-plus/icons-vue";
import TutorAward from "@/views/admin/tutor-award.vue";
import MainCard from "@/components/main-card.vue";

const userStore = useUserStore();

const fetchLoading = ref(false);
const tutorList = ref<Array<TutorProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);
const statusOptions = [
  { value: "pending", label: "待审核" },
  { value: "rejected", label: "已拒绝" },
  { value: "training", label: "培训中" },
  { value: "graduated", label: "已上岗" },
];

const statusModel = ref<"pending" | "rejected" | "training" | "graduated" | "">("");
const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  status?: "pending" | "rejected" | "training" | "graduated";
  cityId?: number;
  divisionId?: number;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const fetchData = () => {
  fetchLoading.value = true;
  API.getTutorList({
    ...pagination.value.get(),
    currentRole: "ADMIN",
    ...filter.value,
  })
    .then((res) => {
      tutorList.value = res.tutors!;
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
  filter.value.status = statusModel.value === "" ? undefined : statusModel.value;
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
  statusModel.value = "";
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

const awardProps = ref<{
  tutorId: number;
  realname: string;
  visible: boolean;
}>({
  tutorId: 0,
  realname: "",
  visible: false,
});

const updateAwardVisible = (newVal: boolean) => (awardProps.value.visible = newVal);

const showAward = (tutor: TutorProfileDto) => {
  awardProps.value.tutorId = tutor.userId;
  awardProps.value.realname = tutor.userProfile.realname;
  awardProps.value.visible = true;
};

const openDashboard = (tutorId: number) => {
  window.open(`/admin/tutor/${tutorId}/dashboard`);
};
</script>
