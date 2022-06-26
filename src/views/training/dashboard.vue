<template>
  <div class="newbie-dashboard">
    <el-alert v-if="readOnly" style="margin-bottom: 20px" type="warning"
      >你正在查看 {{ newbieProfile?.userProfile?.realname }} 的新人看板
    </el-alert>
    <el-result
      v-if="newbieProfile?.isAssigned === false"
      icon="warning"
      title="暂无任务"
      sub-title="请耐心等待导师分配任务"
    />
    <el-row :gutter="30" v-else>
      <el-col :span="24">
        <main-card title="学习进度" :icon="DataLine">
          <div style="height: 2vh" />
          <tutor-status-card
            v-if="roleWhenPageLoad === 'TUTOR'"
            :course-progress="courseProgress"
            :exam-progress="examProgress"
            :tutor-profile="tutorProfile"
            :task-progress="taskProgress"
            :read-only="readOnly"
          />
          <newbie-status-card
            v-if="roleWhenPageLoad === 'NEWBIE'"
            :course-progress="courseProgress"
            :exam-progress="examProgress"
            :newbie-comment="newbieComment"
            :newbie-profile="newbieProfile"
            :task-progress="taskProgress"
            :read-only="readOnly"
            @commented="refreshProfile"
          />
        </main-card>
      </el-col>
      <el-col :md="12" :lg="14" :xl="16">
        <main-card title="课程" :icon="Notebook" body-style="padding-left: 0; padding-right: 0;">
          <div class="course list" v-if="training?.courses?.length > 0">
            <div class="filter">
              <el-form :inline="true" class="filter-form-small">
                <el-form-item label="状态">
                  <el-select v-model="courseStatusFilter" placeholder="未筛选" clearable size="small">
                    <el-option v-for="(item, index) in statusOptions" :key="index" v-bind="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Day">
                  <el-select v-model="courseDayFilter" clearable placeholder="未筛选" size="small">
                    <el-option v-for="i in courseMaxDay" :key="i" :label="i" :value="i" />
                  </el-select>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="courseOptionalFilter" clearable placeholder="未筛选" size="small">
                    <el-option label="必修" :value="true" />
                    <el-option label="选修" :value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="标签">
                  <editable-tags :editable="true" :tags="courseTagFilter" />
                </el-form-item>
              </el-form>
              <el-button plain type="info" size="small" @click="resetCourseFilter" :icon="Refresh" class="reset-button"
                >重置筛选
              </el-button>
            </div>
            <el-divider />
            <dl v-if="training?.courses" style="margin-top: 0">
              <course-item v-for="idx in courseDisplayList" :course-id="idx" :key="idx" :read-only="readOnly" />
            </dl>
            <div class="pagination">
              <el-pagination
                v-model:currentPage="courseCurrentPage"
                layout="total,  prev, pager, next"
                :total="courseTotal"
              />
            </div>
          </div>
          <el-empty v-else description="没有课程" />
        </main-card>
      </el-col>
      <el-col :md="12" :lg="10" :xl="8">
        <main-card title="考试" :icon="EditPen" body-style="padding-left: 0; padding-right: 0;">
          <div class="exam list" v-if="training?.exams?.length > 0">
            <div class="filter">
              <el-form :inline="true" class="filter-form-small">
                <el-form-item label="状态">
                  <el-select v-model="examStatusFilter" placeholder="未筛选" clearable size="small">
                    <el-option v-for="(item, index) in statusOptions" :key="index" v-bind="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Day">
                  <el-select v-model="examDayFilter" clearable placeholder="未筛选" size="small">
                    <el-option v-for="i in examMaxDay" :key="i" :label="i" :value="i" />
                  </el-select>
                </el-form-item>
                <el-form-item label="标签">
                  <editable-tags :editable="true" :tags="examTagFilter" />
                </el-form-item>
              </el-form>
              <el-button plain type="info" size="small" @click="resetExamFilter" :icon="Refresh" class="reset-button"
                >重置筛选
              </el-button>
            </div>
            <el-collapse v-if="training?.exams">
              <exam-item
                v-for="idx in examDisplayList"
                :key="idx"
                :exam-id="idx"
                style="position: relative"
                :read-only="readOnly"
              />
            </el-collapse>
            <div class="pagination">
              <el-pagination
                v-model:currentPage="examCurrentPage"
                layout="total,  prev, pager, next"
                :total="examTotal"
              />
            </div>
          </div>
          <el-empty v-else description="没有考试" />
        </main-card>
        <main-card title="任务" :icon="Finished" body-style="padding-left: 0; padding-right: 0;">
          <div class="task list" v-if="training?.tasks?.length > 0">
            <div class="filter">
              <el-form :inline="true" class="filter-form-small">
                <el-form-item label="状态">
                  <el-select v-model="taskStatusFilter" placeholder="未筛选" clearable size="small">
                    <el-option v-for="(item, index) in statusOptions" :key="index" v-bind="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Day">
                  <el-select v-model="taskDayFilter" clearable placeholder="未筛选" size="small">
                    <el-option v-for="i in taskMaxDay" :key="i" :label="i" :value="i" />
                  </el-select>
                </el-form-item>
                <el-form-item label="标签">
                  <editable-tags :editable="true" :tags="taskTagFilter" />
                </el-form-item>
              </el-form>
              <el-button plain type="info" size="small" @click="resetTaskFilter" :icon="Refresh" class="reset-button"
                >重置筛选
              </el-button>
            </div>
            <el-collapse v-if="training?.tasks">
              <task-item
                v-for="idx in taskDisplayList"
                :key="idx"
                :task-id="idx"
                style="position: relative"
                :read-only="readOnly"
                @finished="finishedTask"
              />
            </el-collapse>
            <div class="pagination">
              <el-pagination
                v-model:currentPage="taskCurrentPage"
                layout="total, prev, pager, next"
                :total="taskTotal"
              />
            </div>
          </div>
          <el-empty v-else description="没有任务" />
        </main-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { computed, onMounted, ref } from "vue";
import * as API from "@/api";
import TaskItem from "@/views/training/task-item.vue";
import ExamItem from "@/views/training/exam-item.vue";
import CourseItem from "@/views/training/course-item.vue";
import EditableTags from "@/components/editable-tags.vue";
import NewbieStatusCard from "@/views/training/newbie-status-card.vue";
import TutorStatusCard from "@/views/training/tutor-status-card.vue";
import { useRouter } from "vue-router";
import MainCard from "@/components/main-card.vue";
import { DataLine, Notebook, EditPen, Finished, Refresh } from "@element-plus/icons-vue";
import { showError } from "@/api/error";
// eslint-disable-next-line no-undef
import TrainingDto = Components.Schemas.TrainingDto;
// eslint-disable-next-line no-undef
import NewbieProfileDto = Components.Schemas.NewbieProfileDto;
// eslint-disable-next-line no-undef
import NewbieCommentDto = Components.Schemas.NewbieCommentDto;
// eslint-disable-next-line no-undef
import TutorProfileDto = Components.Schemas.TutorProfileDto;

const tutorProfile = ref<TutorProfileDto>({} as any);
const userStore = useUserStore();
const newbieProfile = ref<NewbieProfileDto>({} as any);
const training = ref<TrainingDto>({ courses: [], exams: [], tasks: [] });
const newbieComment = ref<NewbieCommentDto>({} as any);
const courseStatusFilter = ref<boolean | "">("");
const examStatusFilter = ref<boolean | "">("");
const taskStatusFilter = ref<boolean | "">("");
const courseTagFilter = ref<string[]>([]);
const examTagFilter = ref<string[]>([]);
const taskTagFilter = ref<string[]>([]);
const courseCurrentPage = ref(1);
const coursePageSize = ref(10);
const courseTotal = computed(() => courseFilteredList.value.length);
const examCurrentPage = ref(1);
const examPageSize = ref(10);
const examTotal = computed(() => examFilteredList.value.length);
const taskCurrentPage = ref(1);
const taskPageSize = ref(10);
const taskTotal = computed(() => taskFilteredList.value.length);
const statusOptions = [
  { value: false, label: "未完成" },
  { value: true, label: "已完成" },
];

const courseOptionalFilter = ref<boolean | "">("");
const courseMaxDay = computed(() => {
  if (!training.value?.courses) return 0;
  return Math.max(...training.value.courses.map((course) => course.day));
});
const courseDayFilter = ref<number | "">("");
const examMaxDay = computed(() => {
  if (!training.value?.exams) return 0;
  return Math.max(...training.value.exams.map((exam) => exam.day));
});
const examDayFilter = ref<number | "">("");
const taskMaxDay = computed(() => {
  if (!training.value?.tasks) return 0;
  return Math.max(...training.value.tasks.map((task) => task.day));
});
const taskDayFilter = ref<number | "">("");

// admin相关
const router = useRouter();
const nid = Number(router.currentRoute.value.params.nid);
const readOnly = ref(!isNaN(nid));
const roleWhenPageLoad = ref(readOnly.value ? "NEWBIE" : userStore.selectedRole);

const refreshProfile = () => {
  if (readOnly.value) {
    API.newbieGetProfile({ id: nid })
      .then((res) => {
        training.value = res.training || { courses: [], exams: [], tasks: [] };
        newbieProfile.value = res.profile!;
        newbieComment.value = res.comment!;
      })
      .catch(showError);
  } else if (userStore.selectedRole == "NEWBIE") {
    API.newbieGetProfile({ id: userStore.userId })
      .then((res) => {
        training.value = res.training || { courses: [], exams: [], tasks: [] };
        newbieProfile.value = res.profile!;
        newbieComment.value = res.comment!;
      })
      .catch(showError);
  } else if (userStore.selectedRole == "TUTOR") {
    API.tutorGetProfile({ id: userStore.userId })
      .then((res) => {
        tutorProfile.value = res.profile!;
        training.value = res.training || { courses: [], exams: [], tasks: [] };
      })
      .catch(showError);
  }
};

const taskProgress = computed(() => {
  const tasks = training.value?.tasks;
  if (!tasks) return 0;
  let finished = 0;
  tasks.forEach((task) => (finished += task.finished ? 1 : 0));
  return tasks.length ? (finished * 100) / tasks.length : 100;
});

const examProgress = computed(() => {
  const exams = training.value?.exams;
  if (!exams) return 0;
  let finished = 0;
  exams.forEach((exam) => (finished += exam.finished ? 1 : 0));
  return exams.length ? (finished * 100) / exams.length : 100;
});

const courseProgress = computed(() => {
  const courses = training.value?.courses;
  if (!courses) return 0;
  let finished = 0;
  courses.forEach((course) => (finished += course.finished ? 1 : 0));
  return courses.length ? (finished * 100) / courses.length : 100;
});

const courseFilteredList = computed(() => {
  let ret = Array.from({ length: training.value?.courses?.length || 0 }, (_, i) => i);
  if (courseStatusFilter.value !== "")
    ret = ret.filter((i) => training.value.courses[i].finished === courseStatusFilter.value);
  if (courseOptionalFilter.value !== "")
    ret = ret.filter((i) => training.value.courses[i].isOptional === courseOptionalFilter.value);
  if (courseDayFilter.value !== "") ret = ret.filter((i) => training.value.courses[i].day === courseDayFilter.value);
  if (courseTagFilter.value.length !== 0)
    ret = ret.filter((idx) => courseTagFilter.value.some((tag) => training.value.courses[idx].tags.includes(tag)));
  return ret;
});

const courseDisplayList = computed(() =>
  courseFilteredList.value.slice(
    (courseCurrentPage.value - 1) * coursePageSize.value,
    courseCurrentPage.value * coursePageSize.value,
  ),
);

const examFilteredList = computed(() => {
  let ret = Array.from({ length: training.value?.exams?.length || 0 }, (_, i) => i);
  if (examStatusFilter.value !== "")
    ret = ret.filter((i) => training.value.exams[i].finished === examStatusFilter.value);
  if (examDayFilter.value !== "") ret = ret.filter((i) => training.value.exams[i].day === examDayFilter.value);
  if (examTagFilter.value.length !== 0)
    ret = ret.filter((idx) => examTagFilter.value.some((tag) => training.value.exams[idx].tags.includes(tag)));
  return ret;
});

const examDisplayList = computed(() =>
  examFilteredList.value.slice(
    (examCurrentPage.value - 1) * examPageSize.value,
    examCurrentPage.value * examPageSize.value,
  ),
);

const taskFilteredList = computed(() => {
  let ret = Array.from({ length: training.value?.tasks?.length || 0 }, (_, i) => i);
  if (taskStatusFilter.value !== "")
    ret = ret.filter((i) => training.value.tasks[i].finished === taskStatusFilter.value);
  if (taskDayFilter.value !== "") ret = ret.filter((i) => training.value.tasks[i].day === taskDayFilter.value);
  if (taskTagFilter.value.length !== 0)
    ret = ret.filter((idx) => taskTagFilter.value.some((tag) => training.value.tasks[idx].tags.includes(tag)));
  return ret;
});

const taskDisplayList = computed(() =>
  taskFilteredList.value.slice(
    (taskCurrentPage.value - 1) * taskPageSize.value,
    taskCurrentPage.value * taskPageSize.value,
  ),
);

const finishedTask = (id: number) => {
  if (!training.value?.tasks[id]) return;
  training.value.tasks[id].finished = true;
};

const resetCourseFilter = () => {
  courseStatusFilter.value = "";
  courseOptionalFilter.value = "";
  courseDayFilter.value = "";
  courseTagFilter.value = [];
};

const resetExamFilter = () => {
  examStatusFilter.value = "";
  examDayFilter.value = "";
  examTagFilter.value = [];
};

const resetTaskFilter = () => {
  taskStatusFilter.value = "";
  taskDayFilter.value = "";
  taskTagFilter.value = [];
};

onMounted(() => {
  refreshProfile();
});
</script>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 0;
}

.newbie-dashboard {
  .el-row-container {
    width: 100%;
  }

  .filter {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;

    .filter-form-small {
      flex: 1;
    }

    .reset-button {
      margin-left: 10px;
      margin-bottom: 5px;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-card {
  margin-bottom: 20px;
}
</style>
