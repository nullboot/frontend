<template>
  <el-card class="task list-item" shadow="hover" @click.passive="emit('toggle', !added)">
    <template #header>
      <div class="card-header">
        <div class="title-and-tags">
          <el-tag v-if="added" type="success">
            <el-icon>
              <check />
            </el-icon>
            已添加
          </el-tag>
          <span>{{ task.title }}</span>
          <el-divider direction="vertical" v-if="task.tags.length > 0" />
          <editable-tags :tags="task.tags" :editable="false" />
        </div>

        <el-button-group>
          <el-tooltip content="从模板中移除" v-if="added">
            <el-button plain type="warning" :icon="Minus" @click.stop="emit('toggle', false)" />
          </el-tooltip>
          <el-tooltip content="添加到模板" v-else>
            <el-button plain type="success" :icon="Plus" @click.stop="emit('toggle', true)" />
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
    <markdown :source="task.description" />
  </el-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import TaskDto = Components.Schemas.TaskDto;
import * as API from "@/api";
import EditableTags from "@/components/editable-tags.vue";
import Markdown from "@/components/markdown.vue";
import { PropType, ref } from "vue";
import { Edit, Delete, Plus, Minus, Check } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { showError } from "@/api/error";

const props = defineProps({
  task: {
    type: Object as PropType<TaskDto>,
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
  API.deleteTaskById({ id: props.task.id })
    .then(() => {
      ElMessage.success("删除成功");
      if (props.added) emit("toggle", false);
      emit("removed");
    })
    .catch(showError)
    .finally(() => (removeLoading.value = false));
};
const confirmRemove = () => {
  ElMessageBox.confirm("操作将导致所有使用此任务的培训损坏！是否继续？", "删除确认", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(remove)
    .catch(() => {
      /* do nothing */
    });
};
</script>
