<template>
  <el-card class="course section list-item" shadow="hover" @click.passive="emit('toggle', !added)">
    <template #header>
      <div class="card-header">
        <div class="title-and-tags">
          <el-tag v-if="added" type="success">
            <el-icon>
              <check />
            </el-icon>
            已添加
          </el-tag>
          <span>{{ section.title }}</span>
          <el-tag v-if="section.type === 'video'" type="info">
            <el-icon>
              <VideoCamera />
            </el-icon>
            视频
          </el-tag>
          <el-tag v-else-if="section.type === 'slides'" type="info">
            <el-icon>
              <DataLine />
            </el-icon>
            课件
          </el-tag>
          <el-tag type="info" v-if="section.filename != null">{{ section.filename }}</el-tag>
        </div>

        <el-button-group>
          <el-tooltip content="从课程中移除" v-if="added">
            <el-button plain type="warning" :icon="Minus" @click.stop="emit('toggle', false)" />
          </el-tooltip>
          <el-tooltip content="添加到模板" v-else>
            <el-button plain type="success" :icon="Plus" @click.stop="emit('toggle', true)" />
          </el-tooltip>
          <el-tooltip content="下载文件" v-if="section.fileInfo != null">
            <el-button plain type="success" :icon="Download" @click.stop="download" />
          </el-tooltip>
          <el-tooltip content="编辑" v-if="editable">
            <el-button plain type="primary" @click.stop="emit('edit')" :icon="Edit" />
          </el-tooltip>
          <el-tooltip content="删除" v-if="editable">
            <el-button
              plain
              type="danger"
              :disabled="!removable"
              :icon="Delete"
              :loading="removeLoading"
              @click.stop="confirmRemove"
            />
          </el-tooltip>
        </el-button-group>
      </div>
    </template>
    <markdown :source="section.description" />
  </el-card>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import Markdown from "@/components/markdown.vue";
import { PropType, ref } from "vue";
import { Edit, Delete, Plus, Minus, Check, VideoCamera, DataLine, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { showError } from "@/api/error";
// eslint-disable-next-line no-undef
import CourseSectionDto = Components.Schemas.CourseSectionDto;

const props = defineProps({
  section: {
    type: Object as PropType<CourseSectionDto>,
    required: true,
  },
  added: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle", "edit", "removed"]);

const removeLoading = ref(false);
const remove = () => {
  removeLoading.value = true;
  API.deleteCourseSectionById({ id: props.section.id })
    .then(() => {
      ElMessage.success("删除成功");
      if (props.added) emit("toggle", false);
      emit("removed");
    })
    .catch(showError)
    .finally(() => (removeLoading.value = false));
};
const confirmRemove = () => {
  ElMessageBox.confirm("操作将导致所有使用此章节的课程损坏！是否继续？", "删除确认", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(remove)
    .catch(() => {
      /* do nothing */
    });
};

const download = () => {
  const a = document.createElement("a");
  a.href = props.section.fileInfo!.downloadLink;
  a.download = props.section.filename;
  a.click();
};
</script>
