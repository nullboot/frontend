<template>
  <div class="course-edit-section-list">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-button class="dashed import-button" @click="create" :icon="Plus">新建章节</el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="dashed import-button" @click="listVisible = true" :icon="DocumentAdd">导入章节</el-button>
      </el-col>
    </el-row>
    <template v-if="list?.length > 0">
      <course-edit-section-list-item
        v-for="(section, index) in list"
        :key="index"
        :section="section"
        :up-movable="index !== 0"
        :down-movable="index !== list.length - 1"
        @update="(t) => update(index, t)"
        @edit="edit(section)"
        @remove="() => remove(index)"
        @move="(d) => move(index, d)"
      />
    </template>
    <el-empty v-else description="暂无章节" v-loading="loading" />
  </div>
  <course-section-list
    :visible="listVisible"
    :selected="list.map((t) => t.id)"
    @update:visible="updateListVisible"
    @toggle="toggle"
    @updated="updated"
    @created="created"
  />
  <course-section-edit
    add-to-course-after-created
    v-bind="editProps"
    @update:visible="updateEditVisible"
    @updated="updated"
    @created="created"
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { DocumentAdd, Plus } from "@element-plus/icons-vue";

// eslint-disable-next-line no-undef
import CourseSectionDto = Components.Schemas.CourseSectionDto;
import CourseSectionList from "@/views/course/course-section-list.vue";
import CourseSectionEdit from "@/views/course/course-section-edit.vue";
import CourseEditSectionListItem from "@/views/course/course-edit-section-list-item.vue";

const props = defineProps({
  sections: {
    type: Array as PropType<CourseSectionDto[]>,
    required: true,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits(["update"]);
const list = ref<CourseSectionDto[]>([]);
watch(props, (newVal) => (list.value = newVal!.sections));
watch(list, (newVal) => emit("update", newVal), { deep: true });

const remove = (index: number) => {
  list.value.splice(index, 1);
};
const update = (index: number, course: any) => {
  list.value[index] = course;
};
const move = (index: number, direction: "up" | "down") => {
  const section = list.value[index];
  list.value.splice(index, 1);
  if (direction === "up") list.value.splice(index - 1, 0, section);
  else list.value.splice(index + 1, 0, section);
};
const add = (section: CourseSectionDto) => {
  if (list.value.every((t) => t.id !== section.id)) list.value.push(section);
};
const toggle = (section: CourseSectionDto, use: boolean) => {
  if (use) add(section);
  else remove(list.value.findIndex((t) => t.id === section.id));
};

const listVisible = ref<boolean>(false);
const updateListVisible = (v: boolean) => (listVisible.value = v);

const editProps = ref<{
  visible: boolean;
  sectionId: number;
}>({
  visible: false,
  sectionId: 0,
});
const updateEditVisible = (v: boolean) => (editProps.value.visible = v);
const create = () => {
  editProps.value.sectionId = 0;
  editProps.value.visible = true;
};
const edit = (section: CourseSectionDto) => {
  editProps.value.sectionId = section.id;
  editProps.value.visible = true;
};
const updated = (section: CourseSectionDto) => {
  let index = list.value.findIndex((t) => t.id === section.id);
  if (index >= 0) list.value[index] = section;
  else add(section);
};
const created = (section: CourseSectionDto, oldSectionId: number) => {
  let index = list.value.findIndex((t) => t.id === oldSectionId);
  if (index >= 0) list.value[index] = section;
  else add(section);
};
</script>
