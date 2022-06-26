<template>
  <main-card class="admin template-list" title="管理模板" :icon="List">
    <el-tabs v-model="currentTab" @tab-change="tabChange">
      <el-tab-pane v-for="{ value, label } in options" :label="label" :name="value" :key="value"></el-tab-pane>
    </el-tabs>
    <list-page hide-buttons v-bind="pagination" @paginate="paginate">
      <el-table :data="templateList" stripe v-loading="fetchLoading" table-layout="auto">
        <el-table-column label="部门" fixed="left" prop="division.name" :show-overflow-tooltip="true" />
        <el-table-column label="考试数量" prop="examCount" :show-overflow-tooltip="true" />
        <el-table-column label="任务数量" prop="taskCount" :show-overflow-tooltip="true" />
        <el-table-column label="课程数量" prop="courseCount" :show-overflow-tooltip="true" />
        <el-table-column label="操作" fixed="right" align="center">
          <template v-slot="{ row }">
            <el-button plain size="small" type="primary" @click="updateTemplate(row.division)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </list-page>
    <edit-template v-bind="editTemplateProps" @updateEditDialogVisible="handleEditDialogClose" @updated="fetchData" />
  </main-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import DivisionDto = Components.Schemas.DivisionDto;
// eslint-disable-next-line no-undef
import TemplateBriefResponseDto = Components.Schemas.TemplateBriefResponseDto;
import { onMounted, ref, watch } from "vue";
import * as API from "@/api";
import { showError } from "@/api/error";
import EditTemplate from "@/views/admin/template-list/template-edit.vue";
import MainCard from "@/components/main-card.vue";
import ListPage from "@/components/list-page.vue";
import { Pagination } from "@/utils/pagination";
import { List } from "@element-plus/icons-vue";

const fetchLoading = ref(false);
const templateList = ref<Array<TemplateBriefResponseDto>>([]);
const pagination = ref<Pagination>(new Pagination());

const currentTab = ref<"tutor" | "newbie">("tutor");

const editTemplateProps = ref<{
  visible: boolean;
  division: DivisionDto;
  type: "tutor" | "newbie";
}>({
  visible: false,
  division: { name: "", id: 0 },
  type: "newbie",
});

const fetchData = () => {
  fetchLoading.value = true;
  API.getTemplateAll({ type: currentTab.value }, { ...pagination.value.get() })
    .then((res) => {
      templateList.value = res.templates!;
      pagination.value.total = res.count!;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

const paginate = (pageSiz: number, curPage: number) => {
  pagination.value.set(pageSiz, curPage);
  fetchData();
};

const updateTemplate = (division: DivisionDto) => {
  editTemplateProps.value.type = currentTab.value;
  editTemplateProps.value.division = division;
  editTemplateProps.value.visible = true;
};

const handleEditDialogClose = (newValue: boolean) => {
  editTemplateProps.value.visible = newValue;
};

onMounted(() => {
  fetchData();
});

const options = [
  { value: "newbie", label: "新人" },
  { value: "tutor", label: "导师" },
];

const tabChange = () => {
  pagination.value.currentPage = 1;
  fetchData();
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
