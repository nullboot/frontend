<template>
  <el-dialog v-model="_visible" append-to-body :show-close="false" width="60%" @open="resetFilter">
    <template #title>
      <dialog-title title="章节列表" :icon="Files">
        <template #buttons>
          <el-button plain type="primary" @click="create" :icon="Plus">新建</el-button>
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
            <el-select v-model="filterForm.type" placeholder="请选择类型" clearable @change="filtered">
              <el-option v-for="(item, index) in types" v-bind="item" :key="index" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <div class="list" v-loading="fetchLoading">
        <template v-if="list?.length > 0">
          <course-section-list-item
            v-for="(section, index) in list"
            :key="index"
            :section="section"
            :added="isAdded(section)"
            :editable="hasPermissionToEdit()"
            :removable="hasPermissionToRemove(section)"
            @toggle="(val) => emit('toggle', section, val)"
            @edit="edit(section)"
            @removed="fetchData"
          />
        </template>
        <el-empty v-else description="暂无章节" />
      </div>
    </training-list>
    <course-section-edit v-bind="editProps" @update:visible="updateEditVisible" @updated="updated" @created="created" />
  </el-dialog>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import DialogTitle from "@/components/dialog-title.vue";
import { PropType, reactive, ref, watch } from "vue";
import { showError } from "@/api/error";
import { useUserStore } from "@/stores/user";
import { Plus, Files, Search } from "@element-plus/icons-vue";
import CourseSectionEdit from "@/views/course/course-section-edit.vue";
import CourseSectionListItem from "@/views/course/course-section-list-item.vue";
import TrainingList from "@/components/training-list.vue";
import { Pagination } from "@/utils/pagination";
// eslint-disable-next-line no-undef
import CourseSectionDto = Components.Schemas.CourseSectionDto;
// eslint-disable-next-line no-undef
import Wildcard = Paths.TaskControllerGetTasks.Parameters.Wildcard;

const userStore = useUserStore();

const hasPermissionToEdit = () => {
  return userStore.isRoot || userStore.roles.includes("ADMIN");
};

const hasPermissionToRemove = (section: CourseSectionDto) => {
  return !section.isUsed && userStore.isRoot;
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
const list = ref<Array<CourseSectionDto>>([]);
const fetchLoading = ref(false);

const isAdded = (section: CourseSectionDto): boolean => {
  return props.selected && props.selected!.includes(section.id);
};

const fetchData = async () => {
  fetchLoading.value = true;
  API.getAllCourseSections({
    ...pagination.value.get(),
    ...filter.value,
  })
    .then(({ sections, count }) => {
      list.value = sections!;
      pagination.value.total = count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const editProps = ref<{
  visible: boolean;
  sectionId: number;
}>({
  visible: false,
  sectionId: 0,
});
const updateEditVisible = (visible: boolean) => (editProps.value.visible = visible);
const create = () => {
  editProps.value.sectionId = 0;
  editProps.value.visible = true;
};
const edit = (section: CourseSectionDto) => {
  editProps.value.sectionId = section.id;
  editProps.value.visible = true;
};
const updated = (section: CourseSectionDto) => {
  const index = list.value.findIndex((t) => t.id === section.id);
  if (index !== -1) list.value[index] = section;
  emit("updated", section);
};
const created = (section: CourseSectionDto, oldSectionId: number, updateCourse: boolean) => {
  list.value = [section, ...list.value];
  if (updateCourse) emit("created", section, oldSectionId, updateCourse);
};

const types = [
  { label: "视频", value: "video" },
  { label: "课件", value: "slides" },
];

const pagination = ref<Pagination>(new Pagination());
const filterForm = reactive({ title: "", type: "" as "video" | "slides" | "" });
const filter = ref<{
  keyword?: string;
  wildcard?: Wildcard;
  type?: "video" | "slides";
  ownerId?: number;
}>({});

const resetFilter = () => {
  filterForm.type = "";
  filterForm.title = "";
  filtered();
};

const paginate = (page: number) => {
  pagination.value.currentPage = page;
  fetchData();
};

const filtered = () => {
  filter.value.type = filterForm.type !== "" ? filterForm.type : undefined;
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
