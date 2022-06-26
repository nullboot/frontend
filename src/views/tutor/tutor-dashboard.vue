<template>
  <div class="newbie-list">
    <el-alert v-if="readOnly" style="margin-bottom: 20px" type="warning"
      >你正在查看 {{ tutorProfile?.userProfile?.realname }} 的带新看板
    </el-alert>
    <el-result v-if="tutorProfile?.isGraduate === false" icon="error" title="尚未上岗" sub-title="请先完成导师培训" />
    <el-row :gutter="30" v-else>
      <el-col :md="12">
        <main-card title="带新概览" :icon="DataBoard" style="height: 300px">
          <el-descriptions :column="2" border size="large">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <user />
                  </el-icon>
                  当前带新
                </div>
              </template>
              {{ tutorProfile.totalNewbieCount - tutorProfile.graduateNewbieCount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <avatar />
                  </el-icon>
                  总计带新
                </div>
              </template>
              {{ tutorProfile.totalNewbieCount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <calendar />
                  </el-icon>
                  上岗日期
                </div>
              </template>
              {{ parseDate(tutorProfile.graduationTime) }}
            </el-descriptions-item>
          </el-descriptions>
          <el-empty :image-size="50" style="padding-top: 10px; padding-bottom: 4px">
            <template #description>
              <p>加油！</p>
            </template>
          </el-empty>
        </main-card>
      </el-col>
      <el-col :md="12">
        <main-card title="荣誉展示" :icon="Trophy" style="height: 300px">
          <el-carousel v-if="numberOfAwards > 0" :interval="2000" ref="carousel" type="card" height="160px">
            <el-carousel-item v-for="item in awards" :key="item" style="text-align: center">
              <img
                v-if="item.level >= 4"
                src="@/assets/award-gold-small.png"
                alt="logo-award"
                @click="showDetailedAward(item)"
              />
              <img v-else src="@/assets/award-silver-small.png" alt="logo-award" @click="showDetailedAward(item)" />
              <p>{{ item.title }}</p>
              <p>等级：{{ item.level }}</p>
            </el-carousel-item>
          </el-carousel>
          <el-empty v-if="numberOfAwards === 0" description="尚未获得荣誉" :image-size="65" />
        </main-card>
      </el-col>
      <el-col :span="24">
        <main-card title="新人列表" :icon="User" class="tutor newbie-list">
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
            <el-table class="newbie-table" :data="newbieList" stripe table-layout="auto" v-loading="fetchLoading">
              <el-table-column
                fixed="left"
                label="姓名"
                prop="userProfile.realname"
                :show-overflow-tooltip="true"
                sortable
              />
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
              <el-table-column label="入职状态" align="center">
                <template v-slot="{ row }">
                  <el-tag type="success" v-if="row.onBoarding">已入职</el-tag>
                  <el-tag type="info" v-else>未入职</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="培训状态" prop="isAssigned" align="center">
                <template v-slot="{ row }">
                  <el-tag v-if="row.isGraduate" type="success">已结业</el-tag>
                  <el-tag v-else-if="row.isAssigned">培训中</el-tag>
                  <el-tag v-else type="warning">未分配</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" :show-overflow-tooltip="true">
                <template #default="{ row }">{{ parseDate(row.assignedTime) }}</template>
              </el-table-column>
              <el-table-column label="结业时间" :show-overflow-tooltip="true">
                <template #default="{ row }">{{ parseDate(row.graduationTime) }}</template>
              </el-table-column>
              <el-table-column label="评价" align="center">
                <template v-slot="{ $index: idx }">
                  <el-tag type="success" v-if="commentList[idx] != null">已评价</el-tag>
                  <el-tag type="info" v-else>未评价</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="带新日志" align="center">
                <template v-slot="{ row }">
                  <el-button plain size="small" type="primary" @click="openTutorRecord(row)" :disabled="!row.isAssigned"
                    >点击查看
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right">
                <template v-slot="{ row }">
                  <el-button
                    v-if="row.isAssigned"
                    plain
                    size="small"
                    type="success"
                    @click="openTutorComment(row)"
                    :disabled="readOnly"
                    :icon="StarFilled"
                    >填写评价
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    plain
                    @click="editTemplate(row)"
                    :disabled="readOnly"
                    :icon="Edit"
                    size="small"
                    >分配培训
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </list-page>
        </main-card>
      </el-col>
    </el-row>
    <edit-newbie-template-dialog
      v-bind="editNewbieTemplateProps"
      @updateEditDialogVisible="onEditNewbieTemplateVisibleUpdated"
      @assigned="fetchNewbieList"
    />
    <tutor-comment
      v-bind="tutorCommentProps"
      @updateTutorCommentVisible="handleTutorCommentClose"
      @commented="fetchNewbieList"
    />
    <tutor-detailed-award
      :award="detailedAward"
      :visible="detailedAwardVisible"
      @updateTutorDetailedAwardVisible="handleTutorDetailedAwardClose($event)"
    />
    <tutor-record v-bind="tutorRecordProps" @updateTutorRecordVisible="handleTutorRecordClose" />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import NewbieProfileDto = Components.Schemas.NewbieProfileDto;
// eslint-disable-next-line no-undef
import TutorProfileDto = Components.Schemas.TutorProfileDto;
// eslint-disable-next-line no-undef
import TutorAwardDto = Components.Schemas.TutorAwardDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.NewbieControllerGetNewbies.Parameters.Wildcard;
// eslint-disable-next-line no-undef
import NewbieCommentDto = Components.Schemas.NewbieCommentDto;
import { onMounted, ref } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";
import { Avatar, Calendar, User, Trophy, DataBoard, Search, Edit, StarFilled } from "@element-plus/icons-vue";
import { parseDate } from "@/utils/date";
import EditNewbieTemplateDialog from "@/views/tutor/edit-newbie-template-dialog.vue";
import TutorComment from "@/views/tutor/tutor-comment.vue";
import TutorDetailedAward from "@/views/tutor/tutor-detailed-award.vue";
import TutorRecord from "@/views/tutor/tutor-record.vue";
import MainCard from "@/components/main-card.vue";
import { useRouter } from "vue-router";
import ListPage from "@/components/list-page.vue";
import { Pagination } from "@/utils/pagination";

const userStore = useUserStore();

const fetchLoading = ref(false);
const newbieList = ref<Array<NewbieProfileDto>>([]);
const commentList = ref<Array<NewbieCommentDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const cityOptions = ref<Array<{ value: number; label: string }>>([]);
const divisionOptions = ref<Array<{ value: number; label: string }>>([]);
const statusOptions = [
  { value: "preparing", label: "未分配" },
  { value: "training", label: "培训中" },
  { value: "graduated", label: "已结业" },
];

const statusModel = ref<"preparing" | "training" | "graduated" | "">("");
const cityModel = ref<number | "">("");
const divisionModel = ref<number | "">("");
const nameModel = ref<string>("");
const filter = ref<{
  status?: "preparing" | "training" | "graduated";
  cityId?: number;
  divisionId?: number;
  keyword?: string;
  wildcard?: Wildcard;
}>({});

const tutorProfile = ref<TutorProfileDto>({} as any);
const awards = ref<Array<TutorAwardDto>>([]);
const carousel = ref<any>();
const numberOfAwards = ref<number>(0);
const detailedAwardVisible = ref(false);
const detailedAward = ref<TutorAwardDto>({} as any);

const showDetailedAward = (item: TutorAwardDto) => {
  detailedAward.value = item;
  detailedAwardVisible.value = true;
};

const tutorCommentProps = ref<{
  visible: boolean;
  newbieId: number;
  newbieRealname: string;
  tutorRealname: string;
}>({ visible: false, newbieId: 0, newbieRealname: "", tutorRealname: "" });

const openTutorComment = (newbie: NewbieProfileDto) => {
  tutorCommentProps.value.newbieId = newbie.userId;
  tutorCommentProps.value.newbieRealname = newbie.userProfile.realname;
  tutorCommentProps.value.tutorRealname = tutorProfile.value.userProfile.realname;
  tutorCommentProps.value.visible = true;
};
const handleTutorCommentClose = (newValue: boolean) => {
  tutorCommentProps.value.visible = newValue;
};

const handleTutorDetailedAwardClose = (newValue: boolean) => {
  detailedAwardVisible.value = newValue;
};

const tutorRecordProps = ref<{
  visible: boolean;
  readOnly: boolean;
  newbieId: number;
  newbieRealname: string;
  tutorRealname: string;
}>({
  visible: false,
  readOnly: false,
  newbieId: 0,
  newbieRealname: "",
  tutorRealname: "",
});

const openTutorRecord = (newbie: NewbieProfileDto) => {
  tutorRecordProps.value.newbieId = newbie.userId;
  tutorRecordProps.value.newbieRealname = newbie.userProfile.realname;
  tutorRecordProps.value.tutorRealname = tutorProfile.value.userProfile.realname;
  tutorRecordProps.value.readOnly = readOnly.value;
  tutorRecordProps.value.visible = true;
};

const handleTutorRecordClose = (newValue: boolean) => {
  tutorRecordProps.value.visible = newValue;
};

// admin相关
const router = useRouter();
const tid = Number(router.currentRoute.value.params.tid);
const readOnly = ref(!isNaN(tid));
const apiId = isNaN(tid) ? userStore.userId : tid;

const fetchNewbieList = () => {
  fetchLoading.value = true;
  API.tutorGetNewbieList({
    ...pagination.value.get(),
    tutorId: apiId,
    currentRole: userStore.selectedRole,
    getComments: true,
    ...filter.value,
  })
    .then((res) => {
      newbieList.value = res.newbies!;
      pagination.value.total = res.count!;
      commentList.value = res.comments!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const paginate = (pageSiz: number, curPage: number) => {
  pagination.value.set(pageSiz, curPage);
  fetchNewbieList();
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
  fetchNewbieList();
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
  API.getDivisionTagList()
    .then((res) => (divisionOptions.value = res.divisions!.map((d) => ({ value: d.id!, label: d.name! }))))
    .catch(showError)
    .finally(() => (divisionLoading.value = false));
};

const fetchAwardsLoading = ref<boolean>(false);
const fetchAwards = () => {
  fetchAwardsLoading.value = true;
  API.tutorGetAward({ id: apiId })
    .then((res) => {
      awards.value = res.awards!;
      numberOfAwards.value = awards.value.length;
    })
    .catch(showError)
    .finally(() => (fetchAwardsLoading.value = false));
};

const fetchTutorProfile = () => {
  return API.tutorGetProfile({ id: apiId })
    .then((res) => {
      tutorProfile.value = res.profile!;
    })
    .catch((err) => {
      router.push({ path: "/404" });
      throw err;
    });
};

onMounted(async () => {
  await fetchTutorProfile();
  // 若执行失败，则不继续执行
  fetchNewbieList();
  fetchAwards();
  fetchCities();
  fetchDivisions();
});

const onEditNewbieTemplateVisibleUpdated = (newValue: boolean) => {
  editNewbieTemplateProps.value.visible = newValue;
};

const editNewbieTemplateProps = ref<{
  visible: boolean;
  realname: string;
  newbieId: number;
}>({ visible: false, realname: "", newbieId: 0 });

const editTemplate = (newbie: NewbieProfileDto) => {
  editNewbieTemplateProps.value.newbieId = newbie.userId;
  editNewbieTemplateProps.value.realname = newbie.userProfile.realname;
  editNewbieTemplateProps.value.visible = true;
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cell-item {
  display: flex;
  align-items: center;
}

.el-carousel__item:not(.is-in-stage) {
  background-color: #fff;
  display: none;
}
</style>
