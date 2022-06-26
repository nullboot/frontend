<template>
  <el-dialog v-model="dialogVisible" :show-close="false" @open="fetchData">
    <template #title>
      <dialog-title
        :title="`修改权限 ${realname} / ${mapRole(role)}`"
        :icon="SetUp"
        :submit-loading="submitLoading"
        @submit="submit"
        @close="dialogVisible = false"
      />
    </template>
    <el-transfer
      v-model="selected"
      filterable
      :titles="['未授权', '已授权']"
      :button-texts="['移除', '添加']"
      :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
      :data="divisions"
      :props="{ key: 'id', label: 'name' }"
      v-loading="submitLoading"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import * as API from "@/api";
import { ElMessage } from "element-plus";
import { showError } from "@/api/error";
import DialogTitle from "@/components/dialog-title.vue";
import { SetUp } from "@element-plus/icons-vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  realname: {
    type: String,
    required: true,
  },
  role: {
    type: String as PropType<"ADMIN" | "HRBP">,
    required: true,
  },
});

const mapRole = (role: "ADMIN" | "HRBP") => {
  if (role === "ADMIN") return "管理员";
  if (role === "HRBP") return "HRBP";
  return "";
};

const selected = ref<Array<number>>([]);

const submitLoading = ref(false);
const dialogVisible = ref(false);

const emit = defineEmits(["update:visible"]);

const close = () => (dialogVisible.value = false);

const submit = () => {
  submitLoading.value = true;
  API.setPermissions(
    { id: props.userId, role: props.role },
    {
      divisionIds: selected.value,
    },
  )
    .then(() => {
      ElMessage.success("修改成功");
      close();
    })
    .catch(showError)
    .finally(() => (submitLoading.value = false));
};

watch(props, (newVal) => (dialogVisible.value = newVal.visible));
watch(dialogVisible, (newVal) => emit("update:visible", newVal));

const divisions = ref<{ id: number; name: string }[]>([]);

// const fetchLoading = computed(() => fetchDivisionLoading.value || fetchPermissionsLoading);

const fetchDivisionLoading = ref(false);
const fetchDivisions = () => {
  fetchDivisionLoading.value = true;
  API.getDivisionTagList()
    .then((res) => (divisions.value = res.divisions!))
    .catch(showError)
    .finally(() => (fetchDivisionLoading.value = false));
};

const fetchPermissionsLoading = ref(false);
const fetchPermissions = () => {
  fetchPermissionsLoading.value = true;
  API.getPermissions({ id: props.userId, role: props.role })
    .then((res) => (selected.value = res.divisions!.map((d) => d.id)))
    .catch(showError)
    .finally(() => (fetchPermissionsLoading.value = false));
};

const fetchData = () => {
  selected.value = [];
  fetchDivisions();
  fetchPermissions();
};
</script>

<style lang="scss" scoped>
.el-transfer {
  text-align: center;
}
</style>
