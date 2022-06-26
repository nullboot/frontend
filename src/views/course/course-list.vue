<template>
  <el-dialog v-model="_visible" append-to-body :show-close="false" width="60%" @open="resetFilter">
    <template #title>
      <dialog-title title="课程列表" :icon="List">
        <template #buttons>
          <el-button plain type="primary" @click="create" :icon="Plus"> 新建</el-button>
          <el-button plain type="info" @click="_visible = false">返回</el-button>
        </template>
      </dialog-title>
    </template>
    <training-list v-bind="pagination" @paginate="paginate" @reset="resetFilter">
      <template #filter>
        <el-form :model="filterForm" class="filter-form" :inline="true">
          <el-form-item label="标题">
            <el-input
              v-model="filterForm.title"
              placeholder="请输入标题"
              clearable
              @change="filtered"
              :prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item label="标签">
            <el-input
              v-model="filterForm.tag"
              placeholder="请输入标签"
              clearable
              @change="filtered"
              :prefix-icon="PriceTag"
            />
          </el-form-item>
        </el-form>
      </template>
      <div class="list" v-loading="fetchLoading">
        <template v-if="list?.length > 0">
          <course-list-item
            v-for="(course, index) in list"
            :key="index"
            :course="course"
            :added="isAdded(course)"
            :editable="hasPermissionToEdit(course)"
            :removable="hasPermissionToRemove(course)"
            @toggle="(val) => emit('toggle', course, val)"
            @edit="(tab) => edit(course, tab)"
            @removed="fetchData"
          />
        </template>
        <el-empty v-else description="暂无课程" />
      </div>
    </training-list>
    <course-edit v-bind="editProps" @update:visible="updateEditVisible" @updated="updated" @created="created" />
  </el-dialog>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import CourseBriefDto = Components.Schemas.CourseBriefDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TaskControllerGetTasks.Parameters.Wildcard;
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import { PropType, reactive, ref, watch } from "vue";
import CourseEdit from "@/views/course/course-edit.vue";
import CourseListItem from "@/views/course/course-list-item.vue";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";
import { Plus, List, Search, PriceTag } from "@element-plus/icons-vue";
import TrainingList from "@/components/training-list.vue";
import { Pagination } from "@/utils/pagination";

const userStore = useUserStore();

const hasPermissionToEdit = (course: CourseBriefDto) => {
  return userStore.isRoot || (userStore.roles.includes("ADMIN") && userStore.userId === course.ownerProfile?.id);
};

const hasPermissionToRemove = (course: CourseBriefDto) => {
  return !course.isUsed && hasPermissionToEdit(course);
};

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  selected: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const _visible = ref(false);
const emit = defineEmits(["update:visible", "toggle", "updated", "created"]);
const list = ref<Array<CourseBriefDto>>([]);
const fetchLoading = ref(false);

const isAdded = (course: CourseBriefDto): boolean => {
  return props.selected && props.selected!.includes(course.id);
};

const fetchData = async () => {
  fetchLoading.value = true;
  API.getAllCourses({
    ...pagination.value.get(),
    ...filter.value,
  })
    .then(({ courses, count }) => {
      list.value = courses!;
      pagination.value.total = count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const editProps = ref<{
  visible: boolean;
  courseId: number;
  tags: string[] | undefined;
  added: boolean;
  initialTab: "editor" | "preview" | "sections";
}>({
  visible: false,
  courseId: 0,
  tags: undefined,
  added: false,
  initialTab: "editor",
});
const updateEditVisible = (visible: boolean) => (editProps.value.visible = visible);
const create = () => {
  editProps.value.initialTab = "editor";
  editProps.value.courseId = 0;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const edit = (course: CourseBriefDto, tab?: "editor" | "preview" | "sections") => {
  editProps.value.initialTab = tab || "editor";
  editProps.value.courseId = course.id;
  editProps.value.tags = undefined;
  editProps.value.visible = true;
};
const updated = (course: CourseBriefDto) => {
  const index = list.value.findIndex((t) => t.id === course.id);
  if (index !== -1) list.value[index] = course;
  emit("updated", course);
};
const created = (course: CourseBriefDto, oldCourseId: number, updateTemplate: boolean) => {
  list.value = [course, ...list.value];
  if (updateTemplate) emit("created", course, oldCourseId, updateTemplate);
};

const pagination = ref<Pagination>(new Pagination());
const filterForm = reactive({ title: "", tag: "" });
const filter = ref<{
  keyword?: string;
  wildcard?: Wildcard;
  tag?: string;
  ownerId?: number;
}>({});

const resetFilter = () => {
  filterForm.tag = "";
  filterForm.title = "";
  filtered();
};

const paginate = (page: number) => {
  pagination.value.currentPage = page;
  fetchData();
};

const filtered = () => {
  filter.value.tag = filterForm.tag !== "" ? filterForm.tag : undefined;
  if (filterForm.title !== "") {
    filter.value.keyword = filterForm.title;
    filter.value.wildcard = "BOTH";
  } else {
    filter.value.keyword = undefined;
    filter.value.wildcard = undefined;
  }
  pagination.value.currentPage = 1;
  fetchData();
};
</script>
