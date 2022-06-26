<template>
  <el-tag
    v-for="(tag, i) in list"
    :key="i"
    :closable="editable"
    :disable-transitions="false"
    @close="remove(i)"
    type="info"
    effect="plain"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="visible && editable"
    ref="InputRef"
    v-model="input"
    size="small"
    @keyup.enter.stop="confirm"
    @blur.stop="confirm"
    class="new-tag"
    style="width: 80px"
  />
  <el-button
    v-else-if="editable"
    class="dashed new-tag"
    size="small"
    @click.stop="showInput"
    :icon="Plus"
    style="width: 80px"
    >添加标签
  </el-button>
</template>

<script lang="ts" setup>
import { nextTick, PropType, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElInput } from "element-plus";

const props = defineProps({
  tags: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update"]);

const list = ref<Array<string>>(props.tags);
const visible = ref<boolean>(false);
const input = ref<string>("");
const InputRef = ref<InstanceType<typeof ElInput>>();

const confirm = () => {
  if (input.value && !list.value.includes(input.value)) list.value.push(input.value);
  input.value = "";
  visible.value = false;
};
const remove = (index: number) => list.value.splice(index, 1);
const showInput = () => {
  visible.value = true;
  nextTick(() => InputRef.value!.input!.focus());
};

watch(props, (newVal) => (list.value = newVal.tags));
watch(list, (newVal) => emit("update", newVal), { deep: true });
</script>

<style lang="scss" scoped>
.new-tag {
  width: 80px;
  margin-left: 5px;
}

.el-tag {
  margin-left: 5px;
}

.el-divider + .el-tag {
  margin-left: 0;
}

.dashed {
  border: 1px dashed var(--el-border-color);
}
</style>
