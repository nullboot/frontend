<template>
  <el-dialog v-model="dialogVisible" append-to-body :show-close="false" @open="fetchData">
    <template #title>
      <dialog-title :title="`新人 ${newbieRealname} / 带新日志`" :icon="List">
        <template #buttons>
          <el-button plain type="primary" @click="addRecord" :icon="Plus" :disabled="readOnly">新建</el-button>
          <el-button plain type="info" @click="close">返回</el-button>
        </template>
      </dialog-title>
    </template>
    <el-form v-for="(item, index) in records" :key="index">
      <el-form-item label="时间" label-width="120px" prop="score">
        <span>{{ parseDate(item.updateTime) }}</span>
      </el-form-item>
      <el-form-item label="内容" label-width="120px" prop="score">
        <span>{{ item.content }}</span>
      </el-form-item>
      <el-divider />
    </el-form>
    <el-empty v-if="numberOfRecords === 0" description="没有带新记录" :image-size="100" />
  </el-dialog>
  <tutor-add-record
    v-bind="addRecordProps"
    @created="created"
    @updateTutorAddRecordVisible="handleTutorAddRecordClose($event)"
  />
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import NewbieCommentDto = Components.Schemas.NewbieCommentDto;
import { ref, watch } from "vue";
import * as API from "@/api";
import { parseDate } from "@/utils/date";
import TutorAddRecord from "@/views/tutor/tutor-add-record.vue";
import DialogTitle from "@/components/dialog-title.vue";
import { showError } from "@/api/error";
import { List, Plus } from "@element-plus/icons-vue";

const records = ref<NewbieCommentDto[]>([]);
const numberOfRecords = ref(0);

const handleTutorAddRecordClose = (newValue: boolean) => {
  addRecordProps.value.visible = newValue;
};

const created = (comment: NewbieCommentDto) => {
  records.value = [comment, ...records.value];
};

const props = defineProps({
  newbieId: {
    type: Number,
    required: true,
  },
  newbieRealname: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: () => false,
  },
});

const addRecordProps = ref<{ visible: boolean; newbieId: number; newbieRealname: string }>({
  visible: false,
  newbieId: 0,
  newbieRealname: "",
});

const isLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["updateTutorRecordVisible"]);

const addRecord = () => {
  addRecordProps.value.newbieRealname = props.newbieRealname;
  addRecordProps.value.newbieId = props.newbieId;
  addRecordProps.value.visible = true;
};

const close = () => (dialogVisible.value = false);

const fetchData = () => {
  isLoading.value = true;
  API.newbieGetComment({ id: props.newbieId }, { type: "TutorRecord" })
    .then((res) => {
      if (res.comments) {
        records.value = res.comments;
        numberOfRecords.value = records.value.length;
      }
    })
    .catch(showError)
    .finally(() => (isLoading.value = false));
};

watch(props, (newValue) => (dialogVisible.value = newValue.visible));

watch(dialogVisible, (newValue) => emit("updateTutorRecordVisible", newValue));
</script>
