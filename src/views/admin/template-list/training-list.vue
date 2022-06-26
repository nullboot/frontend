<template>
  <el-dialog v-model="dialogVisible" append-to-body>
    <template #footer>
      <el-button @click="close" icon="close" size="large"> 关闭 </el-button>
    </template>
    <el-table :data="data" v-if="data.length > 0">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="简介" prop="description" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <markdown :source="scope.row.description" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button plain size="small" @click="addItem(scope.$index)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import * as API from "@/api";
// eslint-disable-next-line no-undef
import CourseBriefDto = Components.Schemas.CourseBriefDto;
// eslint-disable-next-line no-undef
import TaskDto = Components.Schemas.TaskDto;
// eslint-disable-next-line no-undef
import ExamDto = Components.Schemas.ExamDto;
import Markdown from "@/components/markdown.vue";

const dialogVisible = ref(false);

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  trainingType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["updateListVisible", "addItem"]);
const data = ref<Array<CourseBriefDto> | Array<TaskDto> | Array<ExamDto>>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const close = () => (dialogVisible.value = false);

const addItem = (idx: number) => {
  emit("addItem", data.value[idx]);
};

watch(props, (newValue) => {
  if (newValue.visible) {
    fetchData();
  } else {
    data.value = [];
  }
  dialogVisible.value = newValue.visible;
});

watch(dialogVisible, (newValue) => emit("updateListVisible", newValue));

const fetchData = () => {
  if (props.trainingType == "courses") {
    API.getAllCourses({
      skip: pageSize.value * (currentPage.value - 1),
      take: pageSize.value,
    }).then((res) => {
      data.value = res.courses!;
      total.value = res.count!;
    });
  }
  if (props.trainingType == "exams") {
    API.getAllExams({
      skip: pageSize.value * (currentPage.value - 1),
      take: pageSize.value,
    }).then((res) => {
      data.value = res.exams!;
      total.value = res.count!;
    });
  }
  if (props.trainingType == "tasks") {
    API.getAllTasks({
      skip: pageSize.value * (currentPage.value - 1),
      take: pageSize.value,
    }).then((res) => {
      data.value = res.tasks!;
      total.value = res.count!;
    });
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
