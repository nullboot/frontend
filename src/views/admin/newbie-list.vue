<template>
  <main-card class="admin newbie-list" title="新人列表" :icon="User">
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
      <el-table :data="newbieList" stripe table-layout="auto" v-loading="fetchLoading">
        <el-table-column fixed="left" label="姓名" prop="userProfile.realname" :show-overflow-tooltip="true" sortable />
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
        <el-table-column label="邮箱" prop="userProfile.email" :show-overflow-tooltip="true" />
        <el-table-column
          label="导师"
          align="center"
          prop="tutorProfile.userProfile.realname"
          :show-overflow-tooltip="false"
        >
          <template v-slot="{ row }">
            <div v-if="row.tutorProfile">{{ row.tutorProfile.userProfile.realname }}</div>
            <div v-else>
              <el-button plain size="small" @click="assignTutor(row)">分配导师</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入职状态" align="center">
          <template v-slot="{ row }">
            <el-tag type="success" v-if="row.onBoarding">已入职</el-tag>
            <el-tag type="info" v-else>未入职</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="培训状态" align="center">
          <template v-slot="{ row }">
            <el-tag v-if="row.isGraduate" type="success">已结业</el-tag>
            <el-tag v-else-if="row.isAssigned">培训中</el-tag>
            <el-tooltip v-else-if="row.tutorProfile" content="导师未发布培训任务给新人" placement="right">
              <el-tag type="info">未开始</el-tag>
            </el-tooltip>
            <el-tag v-else type="warning">无导师</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.assignedTime) }}</template>
        </el-table-column>
        <el-table-column label="结业时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.graduationTime) }}</template>
        </el-table-column>
        <el-table-column label="看板" align="center">
          <template v-slot="{ row }">
            <el-button plain size="small" type="primary" @click="openDashboard(row.userId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <assign-tutor-dialog v-bind="assignProps" @update:visible="updateAssignVisible" @updated="updated" />
    </list-page>
  </main-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import NewbieProfileDto = Components.Schemas.NewbieProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TutorControllerGetTutors.Parameters.Wildcard;
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import { parseDate } from "@/utils/date";
import AssignTutorDialog from "@/views/admin/assign-tutor-dialog.vue";
import ListPage from "@/components/list-page.vue";
import { Pagination } from "@/utils/pagination";
import { useUserStore } from "@/stores/user";
import { Search, User } from "@element-plus/icons-vue";
import MainCard from "@/components/main-card.vue";

const userStore = useUserStore();

const fetchLoading = ref(false);
const newbieList = ref<Array<NewbieProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);
const statusOptions = [
  { value: "pending", label: "无导师" },
  { value: "preparing", label: "待开始" },
  { value: "training", label: "培训中" },
  { value: "graduated", label: "已结业" },
];

const statusModel = ref<"pending" | "preparing" | "training" | "graduated" | "">("");
const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  status?: "pending" | "preparing" | "training" | "graduated";
  cityId?: number;
  divisionId?: number;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const fetchData = () => {
  fetchLoading.value = true;
  API.getNewbieList({
    ...pagination.value.get(),
    currentRole: "ADMIN",
    ...filter.value,
  })
    .then((res) => {
      newbieList.value = res.newbies!;
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

// -------- 分配导师 --------

const assignProps = ref<{
  newbieId: number;
  realname: string;
  visible: boolean;
}>({
  newbieId: 0,
  realname: "",
  visible: false,
});
const updateAssignVisible = (newVal: boolean) => (assignProps.value.visible = newVal);

const assignTutor = (newbie: NewbieProfileDto) => {
  assignProps.value.newbieId = newbie.userId;
  assignProps.value.realname = newbie.userProfile.realname;
  assignProps.value.visible = true;
};

const updated = (newbie: NewbieProfileDto) => {
  const index = newbieList.value.findIndex((n) => n.userId === newbie.userId);
  if (index !== -1) newbieList.value[index] = newbie;
};

// -------- 查看看板 --------

const openDashboard = (userId: number) => {
  window.open(`/admin/newbie/${userId}/dashboard`);
};
</script>
