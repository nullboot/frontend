<template>
  <div class="exam">
    <el-row>
      <el-col>
        <el-card v-if="alreadyFinished">
          <el-result icon="success" title="考试完成" sub-title="您已通过本次考试">
            <template #extra>
              <el-button type="primary" @click="router.back()">返回</el-button>
            </template>
          </el-result>
        </el-card>
        <el-card v-if="exam">
          <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px">
            <el-breadcrumb-item :to="'/' + userStore.selectedRole.toLowerCase() + '/dashboard'">
              {{ userStore.selectedRole === "NEWBIE" ? "新人看板" : "导师培训" }}
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: examPath }">考试：{{ exam.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h2>{{ exam.title }}</h2>
          <markdown :source="exam.description" />
          <div class="result" v-if="hasSubmitted">
            <el-divider />
            <div class="show-percentage">
              <el-row justify="center">
                <div>
                  <el-progress type="circle" :percentage="correctPercentage" class="circle" />
                  <p>正确率</p>
                </div>
              </el-row>
            </div>
            <el-divider />
          </div>
          <div v-for="(problem, idx) in exam.problems" :key="idx" class="problem">
            <h3>{{ idx + 1 }}. ({{ problem.type === "SINGLE_CHOICE" ? "单选题" : "多选题" }})</h3>
            <p>{{ problem.title }}</p>
            <div v-if="problem.type === 'SINGLE_CHOICE'">
              <el-radio-group v-model="choices[idx]">
                <el-radio v-for="(option, idx) in problem.options" :key="idx" :label="idx" :disabled="isDisabled"
                  >{{ fnum2char(idx) }}. {{ option }}
                </el-radio>
              </el-radio-group>
            </div>
            <div v-else>
              <el-checkbox-group v-model="choices[idx]">
                <el-checkbox v-for="(option, idx) in problem.options" :key="idx" :label="idx" :disabled="isDisabled">
                  {{ fnum2char(idx) }}. {{ option }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="not-chosen" v-if="isShowNotChosen && !isChosen(choices[idx])">
              <el-alert type="warning" title="此题未作答" show-icon />
            </div>
            <div class="problem-result" v-if="hasSubmitted">
              <el-alert
                :title="result[idx] ? '回答正确' : '回答错误'"
                :type="result[idx] ? 'success' : 'error'"
                :closable="false"
                show-icon
              >
                <template #default><span v-html="generateDescription(idx)"></span></template>
              </el-alert>
            </div>
          </div>
          <el-button
            class="submit-button"
            type="primary"
            size="large"
            icon="upload"
            :loading="isSubmitting"
            :auto-insert-space="true"
            :disabled="isDisabled"
            @click.prevent="allChosen ? clickSubmit() : (popoverVisible = true)"
            ref="buttonRef"
            >提交
          </el-button>
          <el-popover :virtual-ref="buttonRef" virtual-triggering :visible="popoverVisible">
            <p>未全部作答，是否提交？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="(popoverVisible = false), (isShowNotChosen = true)">否 </el-button>
              <el-button size="small" type="primary" @click="(popoverVisible = false), clickSubmit()">是</el-button>
            </div>
          </el-popover>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import ExamForTraineeDto = Components.Schemas.ExamForTraineeDto;
// eslint-disable-next-line no-undef
import TraineeSubmitExamResponseDto = Components.Schemas.TraineeSubmitExamResponseDto;
import { computed, onMounted, ref } from "vue";
import * as API from "@/api";
import { useRouter } from "vue-router";
import { showError } from "@/api/error";
import Markdown from "@/components/markdown.vue";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { fnum2char } from "@/utils/alphabet";
import { ArrowRight } from "@element-plus/icons-vue";

const router = useRouter();
const userStore = useUserStore();
const eid = Number(router.currentRoute.value.params.eid);
const exam = ref<ExamForTraineeDto>(undefined as any);
const examResult = ref<TraineeSubmitExamResponseDto>(undefined as any);
type ChoiceState = number | number[] | undefined;
const choices = ref<Array<ChoiceState>>([]);

const apiGetExam = userStore.selectedRole === "TUTOR" ? API.tutorGetExam : API.newbieGetExam;
const apiSubmitExam = userStore.selectedRole === "TUTOR" ? API.tutorSubmitExam : API.newbieSubmitExam;

const alreadyFinished = ref(false);
const hasSubmitted = ref(false);
const loadProblems = () => {
  apiGetExam({ id: userStore.userId, examId: eid })
    .then((res) => {
      // res.exam!.finished = false;
      if (res.exam?.finished) {
        alreadyFinished.value = true;
      } else {
        choices.value = new Array(res.exam!.problems.length).fill(undefined);
        exam.value = res.exam!;
      }
    })
    .catch((err) => {
      showError(err);
      router.push({ path: "/404" });
    });
};

onMounted(() => {
  loadProblems();
});

const isDisabled = ref(false);
const result = ref<boolean[]>([]);
const correctPercentage = ref(0);
const renderResult = () => {
  // 禁止修改
  isDisabled.value = true;
  // 判断正误
  result.value = choices.value.map((choice, idx) => {
    if (exam.value.problems[idx].type == "SINGLE_CHOICE") {
      return choices.value[idx] === examResult.value.results![idx].answers[0];
    } else {
      return (
        examResult.value.results![idx].answers.every((answer: number) =>
          (choices.value[idx] as number[]).includes(answer),
        ) && (choices.value[idx] as number[]).every((choice) => examResult.value.results![idx].answers.includes(choice))
      );
    }
  });
  // 计算正确率
  const nCorrect = result.value.filter((v) => v).length;
  correctPercentage.value = Math.floor((nCorrect / result.value.length) * 100);
  // 显示结果
  hasSubmitted.value = true;
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 显示答案
const generateDescription = (idx: number) => {
  if (exam.value.problems[idx].type === "SINGLE_CHOICE") {
    const answer_string = fnum2char(examResult.value.results![idx].answers[0]);
    return `答案：${answer_string}<br>原因：${examResult.value.results![idx].reason}`;
  } else {
    const answer_string = examResult.value.results![idx].answers.map(fnum2char).join(", ");
    return `答案：${answer_string}<br>原因：${examResult.value.results![idx].reason}`;
  }
};

// 生成提交答案的数据
const generateSubmission = () => {
  return choices.value.map((choice) => {
    if (typeof choice === "number") {
      return { answers: [choice] };
    } else if (choice instanceof Array) {
      return { answers: choice };
    } else {
      return { answers: [] };
    }
  });
};

// 向后端提交答案
const submit = () => {
  isDisabled.value = true;
  return apiSubmitExam({ id: userStore.userId, examId: eid }, { answers: generateSubmission() })
    .then((res) => {
      examResult.value = res;
      ElMessage.success("提交成功");
      if (examResult.value.passed) {
        ElMessageBox.alert("恭喜你通过考试！", "考试结果", {
          confirmButtonText: "确定",
        });
      } else {
        ElMessageBox.alert("很遗憾，你没有通过考试。", "考试结果", {
          confirmButtonText: "确定",
        });
      }
    })
    .catch(showError);
};

const buttonRef = ref();

const popoverVisible = ref(false);
const isShowNotChosen = ref(false);
const isSubmitting = ref(false);

const isChosen = (choice: ChoiceState) => {
  if (typeof choice === "number") {
    return true;
  } else if (choice instanceof Array) {
    return choice.length > 0;
  } else {
    return false;
  }
};
const allChosen = computed(() => {
  return choices.value.every(isChosen);
});

// 点击提交按钮
const clickSubmit = () => {
  isSubmitting.value = true;
  // 先向后端提交答案
  submit()
    .then(() => {
      // 再渲染答题结果
      renderResult();
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

const examPath = computed(() => location.pathname);
</script>

<style lang="scss" scoped>
.submit-button {
  margin-top: 40px;
}

.show-percentage p {
  text-align: center;
}

.not-chosen {
  margin-top: 10px;
}
</style>
