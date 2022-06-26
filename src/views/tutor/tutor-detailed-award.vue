<template>
  <el-dialog v-model="dialogVisible" :show-close="false" append-to-body>
    <template #title>
      <dialog-title title="荣誉详情" :icon="Trophy">
        <template #buttons>
          <el-button type="info" plain @click="close">返回</el-button>
        </template>
      </dialog-title>
    </template>
    <el-form>
      <el-form-item label="荣誉编号" label-width="120px">
        <span> {{ award.id }} </span>
      </el-form-item>
      <el-form-item label="荣誉名称" label-width="120px">
        <span> {{ award.title }} </span>
      </el-form-item>
      <el-form-item label="荣誉等级" label-width="120px">
        <span> {{ award.level }} </span>
      </el-form-item>
      <el-form-item label="获得时间" label-width="120px">
        <span> {{ parseDate(award.achieveTime) }} </span>
      </el-form-item>
      <el-form-item label="荣誉详情" label-width="120px">
        <markdown :source="award.description" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { parseDate } from "@/utils/date";
// eslint-disable-next-line no-undef
import TutorAwardDto = Components.Schemas.TutorAwardDto;
import DialogTitle from "@/components/dialog-title.vue";
import { Trophy } from "@element-plus/icons-vue";
import Markdown from "@/components/markdown.vue";

const props = defineProps({
  award: {
    type: Object as PropType<TutorAwardDto>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const dialogVisible = ref(false);

const emit = defineEmits(["updateTutorDetailedAwardVisible"]);

const close = () => (dialogVisible.value = false);

watch(props, (newValue) => {
  dialogVisible.value = newValue.visible;
});

watch(dialogVisible, function (newValue) {
  emit("updateTutorDetailedAwardVisible", newValue);
});
</script>
