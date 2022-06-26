<template>
  <el-card class="task template list-item" shadow="never" @click="collapse = !collapse">
    <template #header>
      <div class="card-header">
        <span>{{ data.title }}</span>

        <el-button-group>
          <el-tooltip content="上移" v-if="upMovable">
            <el-button plain @click.stop="emit('move', 'up')" :icon="ArrowUpBold" />
          </el-tooltip>
          <el-tooltip content="下移" v-if="downMovable">
            <el-button plain @click.stop="emit('move', 'down')" :icon="ArrowDownBold" />
          </el-tooltip>
          <el-tooltip content="编辑">
            <el-button plain type="primary" @click.stop="emit('edit')" :icon="Edit" />
          </el-tooltip>
          <el-tooltip content="移除">
            <el-button plain type="warning" @click.stop="emit('remove')" :icon="CloseBold" />
          </el-tooltip>
        </el-button-group>
      </div>
      <el-divider />
      <div class="card-tags">
        <span>Day </span>
        <el-input-number v-model="data.day" controls-position="right" :min="1" style="width: 75px" size="small" />
        <el-divider direction="vertical" />
        <editable-tags :tags="data.tags" @update="(newVal) => (data.tags = newVal)" />
      </div>
    </template>
    <el-collapse-transition>
      <markdown :source="data.description" v-show="collapse" />
    </el-collapse-transition>
  </el-card>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import Markdown from "@/components/markdown.vue";
import { ArrowDownBold, ArrowUpBold, CloseBold, Edit } from "@element-plus/icons-vue";
import EditableTags from "@/components/editable-tags.vue";
import { ElCollapseTransition } from "element-plus";
// eslint-disable-next-line no-undef
import TemplateTaskResponseDto = Components.Schemas.TemplateTaskResponseDto;

const props = defineProps({
  task: {
    type: Object as PropType<TemplateTaskResponseDto>,
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

const data = ref<TemplateTaskResponseDto>(props.task);
watch(props, (newVal) => (data.value = newVal.task));
watch(data, (newVal) => emit("update", newVal));

const collapse = ref(true);
</script>
