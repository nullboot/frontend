<template>
  <el-card class="course template-list" v-loading="loading">
    <template #header>
      <div class="title">
        <el-icon :size="24">
          <Notebook />
        </el-icon>
        <span>课程</span>
      </div>
    </template>
    <el-row :gutter="15" v-if="allowImport">
      <el-col :span="12">
        <el-button class="dashed import-button" @click="create" :icon="Plus">新建课程</el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="dashed import-button" @click="listVisible = true" :icon="DocumentAdd">导入课程</el-button>
      </el-col>
    </el-row>
    <template v-if="list?.length > 0">
      <template v-for="(course, index) in list" :key="index">
        <template-course-list-item
          :course="course"
          :up-movable="index !== 0"
          :down-movable="index !== list.length - 1"
          @update="(t) => update(index, t)"
          @edit="(tab) => edit(course, tab)"
          @remove="() => remove(index)"
          @move="(d) => move(index, d)"
        />
      </template>
    </template>
    <el-empty v-else description="暂无课程" />
  </el-card>
  <course-list
    :visible="listVisible"
    :selected="list.map((t) => t.id)"
    @update:visible="updateListVisible"
    @toggle="toggle"
    @updated="updated"
    @created="created"
  />
  <course-edit
    add-to-template-after-create-new
    v-bind="editProps"
    @update:visible="updateEditVisible"
    @updated="updated"
    @created="created"
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { DocumentAdd, Notebook, Plus } from "@element-plus/icons-vue";

// eslint-disable-next-line no-undef
import TemplateCourseResponseDto = Components.Schemas.TemplateCourseResponseDto;
// eslint-disable-next-line no-undef
import CourseBriefDto = Components.Schemas.CourseBriefDto;

import CourseList from "@/views/course/course-list.vue";
import CourseEdit from "@/views/course/course-edit.vue";
import TemplateCourseListItem from "@/views/course/template-course-list-item.vue";

const props = defineProps({
  courses: {
    type: Array as PropType<TemplateCourseResponseDto[]>,
    required: true,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  allowImport: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});

const emit = defineEmits(["update"]);
const list = ref<TemplateCourseResponseDto[]>([]);
watch(props, (newVal) => (list.value = newVal!.courses));
watch(list, (newVal) => emit("update", newVal), { deep: true });

const remove = (index: number) => {
  list.value.splice(index, 1);
};
const update = (index: number, course: any) => {
  list.value[index] = course;
};
const move = (index: number, direction: "up" | "down") => {
  const course = list.value[index];
  list.value.splice(index, 1);
  if (direction === "up") list.value.splice(index - 1, 0, course);
  else list.value.splice(index + 1, 0, course);
};
const add = (course: CourseBriefDto) => {
  if (list.value.every((t) => t.id !== course.id))
    list.value.push({
      id: course.id,
      title: course.title,
      description: course.description,
      day: 1,
      tags: course.tags,
      isOptional: false,
    });
};
const toggle = (course: CourseBriefDto, use: boolean) => {
  if (use) add(course);
  else remove(list.value.findIndex((t) => t.id === course.id));
};

const listVisible = ref<boolean>(false);
const updateListVisible = (v: boolean) => (listVisible.value = v);

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
const updateEditVisible = (v: boolean) => (editProps.value.visible = v);
const create = () => {
  editProps.value.initialTab = "editor";
  editProps.value.courseId = 0;
  editProps.value.tags = undefined;
  editProps.value.added = false;
  editProps.value.visible = true;
};
const edit = (course: TemplateCourseResponseDto, tab?: "editor" | "preview" | "sections") => {
  editProps.value.initialTab = tab || "editor";
  editProps.value.courseId = course.id;
  editProps.value.tags = course.tags;
  editProps.value.added = true;
  editProps.value.visible = true;
};
const updated = (course: CourseBriefDto) => {
  let index = list.value.findIndex((t) => t.id === course.id);
  if (index >= 0)
    list.value[index] = {
      ...course,
      day: list.value[index].day,
      isOptional: list.value[index].isOptional,
    };
  else add(course);
};
const created = (course: CourseBriefDto, oldCourseId: number) => {
  let index = list.value.findIndex((t) => t.id === oldCourseId);
  if (index >= 0)
    list.value[index] = {
      ...course,
      day: list.value[index].day,
      isOptional: list.value[index].isOptional,
    };
  else add(course);
};
</script>
