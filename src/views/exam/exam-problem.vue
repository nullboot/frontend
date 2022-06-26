<template>
  <el-card
    class="exam-problem"
    shadow="never"
    :style="errorMessage !== '' ? 'border-color: var(--el-color-danger-dark-2); ' : ''"
  >
    <template #header>
      <div class="nowrap card-header">
        <el-input v-model="data.title" placeholder="题目" />

        <div class="buttons">
          <el-button-group>
            <el-tooltip content="上移" v-if="upMovable">
              <el-button plain @click.stop="emit('move', 'up')" :icon="ArrowUpBold" />
            </el-tooltip>
            <el-tooltip content="下移" v-if="downMovable">
              <el-button plain @click.stop="emit('move', 'down')" :icon="ArrowDownBold" />
            </el-tooltip>
            <el-tooltip content="移除">
              <el-button plain type="warning" @click.stop="emit('remove')" :icon="CloseBold" />
            </el-tooltip>
          </el-button-group>

          <el-dropdown>
            <el-button plain type="primary" @click.stop :icon="Plus" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Top" @click.stop="emit('create', 'before')">在此之前</el-dropdown-item>
                <el-dropdown-item :icon="Bottom" @click.stop="emit('create', 'after')">在此之后</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
    <div class="buttons">
      <el-switch
        v-model="data.type"
        active-text="多选"
        active-value="MULTIPLE_CHOICE"
        inactive-text="单选"
        inactive-value="SINGLE_CHOICE"
        @change="changeType"
      />
      <el-divider direction="vertical" />
      <el-button plain size="small" type="primary" @click.stop="createOption" :icon="Plus">添加选项</el-button>
    </div>
    <div class="options">
      <el-checkbox-group v-if="data.type === 'MULTIPLE_CHOICE'" v-model="data.answers" @change="changeAnswers">
        <el-checkbox v-for="(_, index) in data.options" :key="index" :label="index">
          <el-input v-model="data.options[index]" />
          <el-button-group>
            <el-button plain circle v-if="index !== 0" :icon="ArrowUpBold" @click.stop="moveOption(index, 'up')" />
            <el-button
              plain
              circle
              v-if="index !== data.options.length - 1"
              :icon="ArrowDownBold"
              @click.stop="moveOption(index, 'down')"
            />
            <el-button plain circle type="warning" :icon="CloseBold" @click.stop="removeOption(index)" />
          </el-button-group>
        </el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-else v-model="singleAnswer" @change="changeSingleAnswer">
        <el-radio v-for="(_, index) in data.options" :key="index" :label="index">
          <el-input v-model="data.options[index]" />
          <el-button-group>
            <el-button plain circle v-if="index !== 0" :icon="ArrowUpBold" @click.stop="moveOption(index, 'up')" />
            <el-button
              plain
              circle
              v-if="index !== data.options.length - 1"
              :icon="ArrowDownBold"
              @click.stop="moveOption(index, 'down')"
            />
            <el-button plain circle type="warning" :icon="CloseBold" @click.stop="removeOption(index)" />
          </el-button-group>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="reason">
      <span>题目解释</span>
      <el-input v-model="data.reason" label="题目解释" />
    </div>
    <el-alert v-if="errorMessage !== ''" :title="errorMessage" type="error" show-icon :closable="false" />
  </el-card>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import ProblemDto = Components.Schemas.ProblemDto;
import { computed, PropType, ref, watch } from "vue";
import { ArrowUpBold, ArrowDownBold, Plus, Top, Bottom, CloseBold } from "@element-plus/icons-vue";

const props = defineProps({
  problem: {
    type: Object as PropType<ProblemDto>,
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
const emit = defineEmits(["update", "move", "create", "remove"]);

const data = ref<ProblemDto>(props.problem);
const singleAnswer = ref<number | undefined>(props.problem?.answers?.length ? props.problem.answers[0] : undefined);
watch(props, (newVal) => {
  data.value = newVal.problem;
  singleAnswer.value = newVal.problem.answers.length ? newVal.problem.answers[0] : undefined;
});
watch(data, (newVal) => emit("update", newVal));

const changeType = (type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE") => {
  data.value.type = type;
  if (type === "SINGLE_CHOICE") data.value.answers = singleAnswer.value === undefined ? [] : [singleAnswer.value];
};
const changeAnswers = (answers: number[]) => {
  data.value.answers = answers;
  singleAnswer.value = answers.length ? answers[0] : undefined;
};
const changeSingleAnswer = (answer: number) => {
  data.value.answers = [answer];
  singleAnswer.value = answer;
};

const toAlpha = (index: number): string => {
  return (index < 26 ? "" : toAlpha(Math.floor(index / 26) - 1)) + String.fromCharCode(65 + (index % 26));
};
const createOption = () => data.value.options.push(`选项 ${toAlpha(data.value.options.length)}`);
const removeOption = (index: number) => {
  data.value.options.splice(index, 1);
  changeAnswers(data.value.answers.filter((a) => a !== index).map((a) => (a > index ? a - 1 : a)));
};
const moveOption = (index: number, direction: "up" | "down") => {
  const newIndex = direction === "up" ? index - 1 : index + 1;
  const temp = data.value.options[index];
  data.value.options[index] = data.value.options[newIndex];
  data.value.options[newIndex] = temp;
  changeAnswers(data.value.answers.map((a) => (a === index ? newIndex : a === newIndex ? index : a)));
};

const errorMessage = computed(() => {
  if (data.value.title === "") return "题目不能为空";
  if (data.value.options.length === 0) return "未设置选项";
  if (data.value.options.some((o) => o === "")) return "选项不能为空";
  // array unique:
  if (new Set(data.value.options).size !== data.value.options.length) return "选项不能重复";
  if (data.value.answers.length === 0) return "未设置答案";
  if (data.value.answers.some((a) => a < 0 || a > data.value.options.length))
    return "[Internal Error] 答案不在选项范围内";
  if (data.value.type === "SINGLE_CHOICE" && data.value.answers.length !== 1)
    return "[Internal Error] 单选题只能有一个答案";
  return "";
});
</script>

<style lang="scss" scoped>
.exam-problem {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .buttons {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .el-button-group {
    display: flex;
    margin-left: 10px;
  }

  .el-dropdown {
    margin-left: 10px;
  }

  .el-switch {
    display: inline-flex;
  }

  .el-checkbox-group {
    width: 100%;
  }

  .el-checkbox {
    display: flex;
    width: 100%;
    margin-top: 10px;
    margin-right: 0;

    :deep(.el-checkbox__label) {
      display: inline-flex;
      align-items: center;
      width: 100%;
    }
  }

  .el-radio-group {
    width: 100%;
  }

  .el-radio {
    display: flex;
    width: 100%;
    margin-top: 10px;
    margin-right: 0;

    :deep(.el-radio__label) {
      display: inline-flex;
      align-items: center;
      width: 100%;
    }
  }

  .reason {
    span {
      margin-right: 5px;
      width: 75px;
    }

    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .el-alert {
    margin-top: 10px;
  }
}

.exam-problem:last-child {
  margin-bottom: 0;
}
</style>
