<template>
  <el-dialog v-model="_visible" :show-close="false" width="80%" append-to-body @open="resetFilter">
    <template #title>
      <dialog-title :title="`新人 ${realname} / 分配导师`" :icon="Avatar">
        <template #buttons>
          <el-button type="info" plain @click="_visible = false">取消</el-button>
          <el-button type="primary" @click.prevent="submit" :loading="submitLoading" :disabled="!currentRow">
            分配
          </el-button>
        </template>
      </dialog-title>
    </template>
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
      <el-table
        :data="tutorList"
        stripe
        table-layout="auto"
        v-loading="fetchLoading"
        highlight-current-row
        @current-change="currentChange"
      >
        <el-table-column
          fixed="left"
          label="姓名"
          prop="userProfile.realname"
          :show-overflow-tooltip="true"
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
        <el-table-column label="上岗时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.graduationTime) }}</template>
        </el-table-column>
        <el-table-column label="提名时间" :show-overflow-tooltip="true">
          <template #default="{ row }">{{ parseDate(row.nominateTime) }}</template>
        </el-table-column>
        <el-table-column label="带新总数" prop="totalNewbieCount"></el-table-column>
        <el-table-column label="毕业新人数" prop="graduateNewbieCount"></el-table-column>
        <el-table-column label="评分">
          <template #default="{ row }"
            >{{ row.graduateNewbieCount ? (row.totalScore / row.graduateNewbieCount).toFixed(2) : "N/A" }}
          </template>
        </el-table-column>
      </el-table>
    </list-page>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import { ElMessage } from "element-plus";
import DialogTitle from "@/components/dialog-title.vue";
import { useUserStore } from "@/stores/user";
import { Pagination } from "@/utils/pagination";
import ListPage from "@/components/list-page.vue";
import { parseDate } from "@/utils/date";
import { Search, Avatar } from "@element-plus/icons-vue";
// eslint-disable-next-line no-undef
import TutorProfileDto = Components.Schemas.TutorProfileDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TutorControllerGetTutors.Parameters.Wildcard;

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  newbieId: {
    type: Number as PropType<number>,
    required: true,
  },
  realname: {
    type: String as PropType<string>,
    default: "",
  },
});

// 信号逻辑：只能由父组件修改visible，visibleRef与visible单向同步
const emit = defineEmits(["update:visible", "updated"]);

const _visible = ref(false);
watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const userStore = useUserStore();

const fetchLoading = ref(false);
const tutorList = ref<Array<TutorProfileDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);

const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  cityId?: number;
  divisionId?: number;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const currentRow = ref<TutorProfileDto | undefined>(undefined);
const currentChange = (val: TutorProfileDto | undefined) => (currentRow.value = val);

const fetchData = () => {
  fetchLoading.value = true;
  API.getTutorList({
    ...pagination.value.get(),
    currentRole: "ADMIN",
    status: "graduated",
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

// 提交分配导师的结果
const submitLoading = ref<boolean>(false);
const submit = () => {
  submitLoading.value = true;
  API.assignTutor({ id: props.newbieId }, { tutorId: currentRow.value!.userId! })
    .then((res) => {
      emit("updated", res.profile);
      ElMessage.success("分配成功");
      _visible.value = false;
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};
</script>
