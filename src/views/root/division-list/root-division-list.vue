<template>
  <el-button plain type="primary" class="right-button" icon="DocumentAdd" @click="addDialogVisible = true">
    新增部门
  </el-button>
  <el-table :data="divisionList" stripe v-loading="isLoading">
    <el-table-column label="#" fixed="left" prop="id" />
    <el-table-column label="部门名称" :show-overflow-tooltip="true" prop="name" sortable />
    <el-table-column :show-overflow-tooltip="true" label="删除" width="90px">
      <template v-slot="scope">
        <el-button plain type="danger" size="small" :icon="'Delete'" @click="deleteDivision(scope.$index)" />
      </template>
    </el-table-column>
  </el-table>
  <add-division-dialog :visible="addDialogVisible" @updateAddDialogVisible="handleAddDialogClose($event)" />
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import DivisionDto = Components.Schemas.DivisionDto;
import * as API from "@/api";
import { showError } from "@/api/error";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import AddDivisionDialog from "@/views/root/division-list/add-division-dialog.vue";

const divisionList = ref<Array<DivisionDto>>([]);
const addDialogVisible = ref(false);

const isLoading = ref(false);
const refresh = () => {
  isLoading.value = true;
  API.getDivisionTagList()
    .then((res) => {
      divisionList.value = res.divisions!;
    })
    .catch(showError)
    .finally(() => (isLoading.value = false));
};

onMounted(() => {
  refresh();
});

const handleAddDialogClose = (newValue: boolean) => {
  addDialogVisible.value = newValue;
  if (!newValue) {
    refresh();
  }
};

const deleteDivision = (idx: number) => {
  API.deleteDivision({ id: divisionList.value[idx].id })
    .then(() => {
      ElMessage({ message: "删除成功", type: "success" });
      refresh();
    })
    .catch(showError);
};
</script>

<style lang="scss" scoped>
.right-button {
  float: right;
}
</style>
