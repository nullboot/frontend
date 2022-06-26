<template>
  <el-card class="course section preview list-item" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="title-and-tags">
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
          <el-tag type="info" v-if="section.filename">{{ section.filename }}</el-tag>
        </div>
        <el-tooltip content="下载文件" v-if="section.fileInfo != null">
          <el-button plain type="success" :icon="Download" @click.stop="download" :loading="downloading" />
        </el-tooltip>
      </div>
    </template>
    <markdown :source="section.description" />
  </el-card>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { VideoCamera, DataLine, Download } from "@element-plus/icons-vue";
import Markdown from "@/components/markdown.vue";
import { SectionForm } from "@/views/course/course-section-edit.vue";
import { fileDownload, saveAs } from "@/api";
import { showError } from "@/api/error";

const props = defineProps({
  section: {
    type: Object as PropType<SectionForm>,
    required: true,
  },
});

const downloading = ref(false);
const download = () => {
  downloading.value = true;
  fileDownload(props.section.fileInfo!)
    .then((res) => saveAs(res.data, props.section.filename!))
    .catch(showError)
    .finally(() => (downloading.value = false));
};
</script>
