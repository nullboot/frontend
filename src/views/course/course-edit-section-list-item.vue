<template>
  <el-card class="template section list-item" shadow="never" @click="collapse = !collapse">
    <template #header>
      <div class="card-header">
        <div class="title-and-tags">
          <span>{{ data.title }}</span>
          <el-tag v-if="data.type === 'video'" type="info">
            <el-icon>
              <VideoCamera />
            </el-icon>
            视频
          </el-tag>
          <el-tag v-else-if="data.type === 'slides'" type="info">
            <el-icon>
              <DataLine />
            </el-icon>
            课件
          </el-tag>
          <el-tag type="info" v-if="data.filename != null">{{ data.filename }}</el-tag>
        </div>

        <el-button-group>
          <el-tooltip content="上移" v-if="upMovable">
            <el-button plain @click.stop="emit('move', 'up')" :icon="ArrowUpBold" />
          </el-tooltip>
          <el-tooltip content="下移" v-if="downMovable">
            <el-button plain @click.stop="emit('move', 'down')" :icon="ArrowDownBold" />
          </el-tooltip>
          <el-tooltip content="下载文件" v-if="data.fileInfo != null">
            <el-button plain type="success" :icon="Download" @click.stop="download" :loading="downloading" />
          </el-tooltip>
          <el-tooltip content="编辑">
            <el-button plain type="primary" @click.stop="emit('edit')" :icon="Edit" />
          </el-tooltip>
          <el-tooltip content="移除">
            <el-button plain type="warning" @click.stop="emit('remove')" :icon="CloseBold" />
          </el-tooltip>
        </el-button-group>
      </div>
    </template>
    <el-collapse-transition>
      <markdown :source="data.description" v-show="collapse" />
    </el-collapse-transition>
  </el-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import CourseSectionDto = Components.Schemas.CourseSectionDto;
import { PropType, ref, watch } from "vue";
import Markdown from "@/components/markdown.vue";
import { ArrowDownBold, ArrowUpBold, CloseBold, Edit, VideoCamera, DataLine, Download } from "@element-plus/icons-vue";
import { ElCollapseTransition } from "element-plus";

const props = defineProps({
  section: {
    type: Object as PropType<CourseSectionDto>,
    required: true,
  },
  upMovable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  downMovable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits(["update", "remove", "move", "edit"]);

const data = ref<CourseSectionDto>(props.section);
watch(props, (newVal) => (data.value = newVal.section));
watch(data, (newVal) => emit("update", newVal));

const collapse = ref(true);

const downloading = ref(false);
const download = () => {
  const a = document.createElement("a");
  a.href = props.section.fileInfo!.downloadLink;
  a.download = props.section.filename;
  a.click();
};
</script>
