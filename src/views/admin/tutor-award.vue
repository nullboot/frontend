<template>
  <el-dialog v-model="_visible" :show-close="false" append-to-body @open="fetchData" width="60%">
    <template #title>
      <dialog-title :title="`导师 ${realname} / 荣誉列表`" :icon="Trophy">
        <template #buttons>
          <el-button plain type="primary" @click="addAwardVisible = true" :icon="Plus">新增</el-button>
          <el-button plain type="info" @click="_visible = false">返回</el-button>
        </template>
      </dialog-title>
    </template>
    <div class="list" v-loading="fetchLoading">
      <template v-if="awards.length > 0">
        <el-form v-for="item in awards" :key="item">
          <el-form-item label="荣誉编号" label-width="120px" prop="score">
            <span> {{ item.id }} </span>
          </el-form-item>
          <el-form-item label="荣誉名称" label-width="120px" prop="score">
            <span> {{ item.title }} </span>
          </el-form-item>
          <el-form-item label="荣誉等级" label-width="120px" prop="score">
            <span> {{ item.level }} </span>
          </el-form-item>
          <el-form-item label="获得时间" label-width="120px" prop="score">
            <span> {{ parseDate(item.achieveTime) }} </span>
          </el-form-item>
          <el-form-item label="荣誉详情" label-width="120px" prop="score">
            <markdown :source="item.description" />
          </el-form-item>
          <el-divider />
        </el-form>
      </template>
      <el-empty v-else description="尚未获得荣誉" :image-size="100" />
    </div>
  </el-dialog>
  <tutor-add-award
    :visible="addAwardVisible"
    :realname="realname"
    :tutor-id="tutorId"
    @update:visible="updateAddAwardVisible"
    @created="created"
  />
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import TutorAwardDto = Components.Schemas.TutorAwardDto;
import { PropType, ref, watch } from "vue";
import * as API from "@/api";
import { parseDate } from "@/utils/date";
import { showError } from "@/api/error";
import Markdown from "@/components/markdown.vue";
import TutorAddAward from "@/views/admin/tutor-add-award.vue";
import DialogTitle from "@/components/dialog-title.vue";
import { Trophy, Plus } from "@element-plus/icons-vue";

const awards = ref<TutorAwardDto[]>([]);
const numberOfAwards = ref(0);

const updateAddAwardVisible = (newVal: boolean) => (addAwardVisible.value = newVal);

const props = defineProps({
  tutorId: {
    type: Number as PropType<number>,
    required: true,
  },
  realname: {
    type: String as PropType<string>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const _visible = ref(false);
const addAwardVisible = ref(false);

const emit = defineEmits(["update:visible"]);

const fetchLoading = ref<boolean>(false);
const fetchData = () => {
  fetchLoading.value = true;
  API.tutorGetAward({ id: props.tutorId })
    .then((res) => {
      awards.value = res.awards!;
      numberOfAwards.value = awards.value.length;
    })
    .catch(showError)
    .finally(() => (fetchLoading.value = false));
};

watch(props, (newVal) => (_visible.value = newVal.visible));
watch(_visible, (newVal) => emit("update:visible", newVal));

const created = (award: TutorAwardDto) => (awards.value = [award, ...awards.value]);
</script>
