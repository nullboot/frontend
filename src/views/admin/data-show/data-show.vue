<template>
  <main-card title="查看数据" class="data-show" :icon="DataAnalysis">
    <div class="head">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <template #label>
            <el-tooltip content="查询区间最大长度：12个月">
              <span>时间范围</span>
            </el-tooltip>
          </template>
          <span>从</span>
          <el-date-picker
            v-model="startMonth"
            type="month"
            format="YYYY [年] MM [月]"
            value-format="YYYY-MM"
            placeholder="起始月"
            :disabled-date="disabledMonthStart"
            :clearable="false"
            @change="refresh(false)"
          />
          <span>到</span>
          <el-date-picker
            v-model="endMonth"
            type="month"
            format="YYYY [年] MM [月]"
            value-format="YYYY-MM"
            placeholder="终止月"
            :disabled-date="disabledMonthEnd"
            :clearable="false"
            @change="refresh(false)"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" class="data-tabs" @tab-change="changeTab" v-loading="isRefreshing">
      <el-tab-pane label="新人数据" name="newbieData">
        <data-show-newbie
          ref="showNewbie"
          :month="month"
          :basis="newbieData.basis"
          :training="newbieData.training"
          :graduate="newbieData.graduate"
          :score="newbieData.score"
        />
      </el-tab-pane>
      <el-tab-pane label="导师数据" name="tutorData">
        <data-show-tutor
          ref="showTutor"
          :month="month"
          :basis="tutorData.basis"
          :approval="tutorData.approval"
          :assignment="tutorData.assignment"
          :score="tutorData.score"
        />
      </el-tab-pane>
    </el-tabs>
  </main-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import DataShowNewbie from "@/views/admin/data-show/data-show-newbie.vue";
import DataShowTutor from "@/views/admin/data-show/data-show-tutor.vue";
import { ElMessage } from "element-plus";
import * as API from "@/api";
import { showError } from "@/api/error";
import MainCard from "@/components/main-card.vue";
import { DataAnalysis } from "@element-plus/icons-vue";

const showNewbie = ref<any>();
const showTutor = ref<any>();

class chartData {
  public name? = "";
  public type? = ""; //bar表示柱状图(y坐标种类为0)，line表示折线图(y坐标种类为1)
  public data?: number[] = [];
  public yAxisIndex? = 0; //表示y坐标的种类，0表示人数，1表示比例
}

class scoreData {
  public name? = "";
  public score? = 0;
  public totalScore? = 0;
}

let month = ref<string[]>([]);
let newbieData = ref<{ basis: chartData[]; training: chartData[]; graduate: chartData[]; score: scoreData[] }>({
  basis: [], //概况
  training: [], //培训参与情况
  graduate: [], //培训完成情况
  score: [], //新人平均分
});
let tutorData = ref<{ basis: chartData[]; approval: chartData[]; assignment: chartData[]; score: scoreData[] }>({
  basis: [], //概况
  approval: [], //导师上岗情况
  assignment: [], //导师分配情况
  score: [], //导师平均分
});

let activeName = ref("newbieData");
const getNowMonth = (isStart: boolean) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (isStart) {
    month -= 3;
    if (month < 0) {
      month += 12;
      ++year;
    }
  }
  let str = year + "-";
  if (month <= 9) str = str + "0";
  str = str + month;
  return str;
};
//初始设置时间跨度为4个月
const startMonth = ref(getNowMonth(true));
const endMonth = ref(getNowMonth(false));
const isRefreshing = ref(false);
const disabledMonth = (time: Date) => {
  return time.getTime() > Date.now();
};

function chkMonth(startY: number, startM: number, endY: number, endM: number): boolean {
  //检查月份合理性：要求所含月份数量在1~12之间
  if (startY > endY || (startY === endY && startM > endM)) return false; //起始月份在终止月份之后，不合法
  if (startY < endY - 1 || (startY === endY - 1 && startM <= endM)) return false; //二者间隔>12个月，不合法
  return true;
}

const disabledMonthStart = (time: Date) => {
  if (disabledMonth(time)) return true;
  if (endMonth.value === "" || endMonth.value == null) return false;
  const endYear = parseInt(endMonth.value.substring(0, 4));
  const endMon = parseInt(endMonth.value.substring(5, 7));
  return !chkMonth(time.getFullYear(), time.getMonth() + 1, endYear, endMon);
};
const disabledMonthEnd = (time: Date) => {
  if (disabledMonth(time)) return true;
  if (startMonth.value === "" || startMonth.value == null) return false;
  const startYear = parseInt(startMonth.value.substring(0, 4));
  const startMon = parseInt(startMonth.value.substring(5, 7));
  return !chkMonth(startYear, startMon, time.getFullYear(), time.getMonth() + 1);
};
//time.getMonth()返回的月份是从0开始的

const getNextMonth = (nowMonth: string) => {
  let year = parseInt(nowMonth.substring(0, 4));
  let mon = parseInt(nowMonth.substring(5, 7));
  if (mon === 12) {
    ++year;
    mon = 1;
  } else {
    ++mon;
  }
  return year + "-" + (mon < 10 ? "0" : "") + mon;
};

const sampleData = [
  [195, 208, 221, 229, 244, 256, 288, 312, 336, 345, 379, 402], //部门新人总数
  [161, 172, 179, 212, 220, 223, 231, 234, 245, 269, 281, 307], //参与培训人数
  [93, 112, 126, 133, 149, 157, 178, 201, 206, 212, 225, 233], //已毕业人数
  [19, 13, 13, 18, 15, 12, 32, 24, 24, 9, 34, 23], //新入职人数
  [7, 10, 5, 2, 6, 3, 7, 2, 10, 9, 11, 20], //参与培训人数
  [37, 77, 38, 11, 40, 25, 22, 8, 42, 100, 32, 87], //参与培训比例
  [15, 12, 9, 7, 11, 8, 6, 14, 15, 10, 13, 22], //新毕业人数
  [53, 77, 85, 61, 73, 67, 25, 33, 33, 89, 56, 83], //入职新人毕业比例
  [4.21, 4.42, 4.35, 4.06, 4.47, 4.86, 4.77, 4.81, 4.21, 4.03, 4.06, 3.95], //部门新人平均分
  [4.68, 3.97, 3.95, 4.22, 4.37, 4.61, 4.57, 4.44, 4.89, 4.3, 4.01, 3.75], //全平台新人平均分
  [18, 24, 29, 31, 33, 35, 36, 36, 38, 41, 42, 47], //部门导师总数
  [11, 16, 17, 21, 24, 25, 31, 32, 34, 36, 38, 40], //审核通过导师总数
  [10, 15, 16, 17, 20, 21, 22, 25, 28, 30, 32, 36], //正式上岗导师总数
  [5, 6, 5, 2, 2, 2, 1, 0, 2, 3, 1, 5], //新增导师人数
  [3, 2, 2, 1, 1, 1, 1, 0, 1, 2, 1, 3], //正式上岗导师数
  [60, 33, 40, 50, 50, 50, 100, 0, 50, 67, 100, 60], //正式上岗导师比例
  [163, 181, 194, 216, 239, 241, 253, 278, 302, 309, 331, 347], //已分配新人数
  [32, 27, 27, 13, 5, 15, 35, 34, 34, 36, 48, 55], //未分配新人数
  [84, 87, 88, 94, 98, 94, 88, 89, 90, 90, 87, 86], //导师分配率
  [4.88, 4.85, 4.82, 4.79, 4.71, 4.64, 4.69, 4.77, 4.8, 4.75, 4.78, 4.76], //部门导师平均分
  [4.43, 4.54, 4.57, 4.62, 4.55, 4.61, 4.57, 4.66, 4.7, 4.71, 4.62, 4.68], //全平台导师平均分
];
let isSample = false;
const updateSampleData = () => {
  const cnt = month.value.length;
  newbieData.value.basis[0].data = sampleData[0].slice(0, cnt);
  newbieData.value.basis[1].data = sampleData[1].slice(0, cnt);
  newbieData.value.basis[2].data = sampleData[2].slice(0, cnt);

  newbieData.value.training[0].data = sampleData[3].slice(0, cnt);
  newbieData.value.training[1].data = sampleData[4].slice(0, cnt);
  newbieData.value.training[2].data = sampleData[5].slice(0, cnt);

  newbieData.value.graduate[0].data = sampleData[6].slice(0, cnt);
  newbieData.value.graduate[1].data = sampleData[7].slice(0, cnt);

  newbieData.value.score[0].score = sampleData[8][cnt - 1];
  newbieData.value.score[1].score = sampleData[9][cnt - 1];

  tutorData.value.basis[0].data = sampleData[10].slice(0, cnt);
  tutorData.value.basis[1].data = sampleData[11].slice(0, cnt);
  tutorData.value.basis[2].data = sampleData[12].slice(0, cnt);

  tutorData.value.approval[0].data = sampleData[13].slice(0, cnt);
  tutorData.value.approval[1].data = sampleData[14].slice(0, cnt);
  tutorData.value.approval[2].data = sampleData[15].slice(0, cnt);

  tutorData.value.assignment[0].data = sampleData[16].slice(0, cnt);
  tutorData.value.assignment[1].data = sampleData[17].slice(0, cnt);
  tutorData.value.assignment[2].data = sampleData[18].slice(0, cnt);

  tutorData.value.score[0].score = sampleData[19][cnt - 1];
  tutorData.value.score[1].score = sampleData[20][cnt - 1];

  //console.log(month.value);
  //console.log(newbieData.value);
  //console.log(tutorData.value);
};

const updateData = (res: any) => {
  month.value = [];
  for (let nowMon = startMonth.value; nowMon !== endMonth.value; nowMon = getNextMonth(nowMon)) {
    month.value.push(nowMon);
  }
  month.value.push(endMonth.value);

  newbieData.value.basis = res[0].basis;
  newbieData.value.basis[0].type = "bar";
  newbieData.value.basis[0].yAxisIndex = 0;
  newbieData.value.basis[1].type = "bar";
  newbieData.value.basis[1].yAxisIndex = 0;
  newbieData.value.basis[2].type = "bar";
  newbieData.value.basis[2].yAxisIndex = 0;

  newbieData.value.training = res[0].training;
  newbieData.value.training[0].type = "bar";
  newbieData.value.training[0].yAxisIndex = 0;
  newbieData.value.training[1].type = "bar";
  newbieData.value.training[1].yAxisIndex = 0;
  newbieData.value.training[2].type = "line";
  newbieData.value.training[2].yAxisIndex = 1;

  newbieData.value.graduate = res[0].graduate;
  newbieData.value.graduate[0].type = "bar";
  newbieData.value.graduate[0].yAxisIndex = 0;
  newbieData.value.graduate[1].type = "line";
  newbieData.value.graduate[1].yAxisIndex = 1;

  newbieData.value.score = [{}, {}];
  newbieData.value.score[0].name = res[0].score[0].name;
  newbieData.value.score[0].score = res[0].score[0].data;
  newbieData.value.score[0].totalScore = 5;
  newbieData.value.score[1].name = res[0].score[1].name;
  newbieData.value.score[1].score = res[0].score[1].data;
  newbieData.value.score[1].totalScore = 5;

  tutorData.value.basis = res[1].basis;
  tutorData.value.basis[0].type = "bar";
  tutorData.value.basis[0].yAxisIndex = 0;
  tutorData.value.basis[1].type = "bar";
  tutorData.value.basis[1].yAxisIndex = 0;
  tutorData.value.basis[2].type = "bar";
  tutorData.value.basis[2].yAxisIndex = 0;

  tutorData.value.approval = res[1].approval;
  tutorData.value.approval[0].type = "bar";
  tutorData.value.approval[0].yAxisIndex = 0;
  tutorData.value.approval[1].type = "bar";
  tutorData.value.approval[1].yAxisIndex = 0;
  tutorData.value.approval[2].type = "line";
  tutorData.value.approval[2].yAxisIndex = 1;

  tutorData.value.assignment = res[1].assignment;
  tutorData.value.assignment[0].type = "bar";
  tutorData.value.assignment[0].yAxisIndex = 0;
  tutorData.value.assignment[1].type = "bar";
  tutorData.value.assignment[1].yAxisIndex = 0;
  tutorData.value.assignment[2].type = "line";
  tutorData.value.assignment[2].yAxisIndex = 1;

  tutorData.value.score = [{}, {}];
  tutorData.value.score[0].name = res[1].score[0].name;
  tutorData.value.score[0].score = res[1].score[0].data;
  tutorData.value.score[0].totalScore = 5;
  tutorData.value.score[1].name = res[1].score[1].name;
  tutorData.value.score[1].score = res[1].score[1].data;
  tutorData.value.score[1].totalScore = 5;

  if (isSample) {
    updateSampleData();
  }

  //console.log(month.value);
  //console.log(newbieData.value);
  //console.log(tutorData.value);
};

const refresh = (flag: boolean) => {
  isRefreshing.value = true;
  //console.log(startMonth.value);
  //console.log(endMonth.value);
  if (startMonth.value === "" || startMonth.value == null || endMonth.value === "" || endMonth.value == null) {
    ElMessage({
      message: "时间范围无效",
      type: "error",
    });
    isRefreshing.value = false;
    return;
  }
  const startYear = parseInt(startMonth.value.substring(0, 4));
  const startMon = parseInt(startMonth.value.substring(5, 7));
  const endYear = parseInt(endMonth.value.substring(0, 4));
  const endMon = parseInt(endMonth.value.substring(5, 7));
  if (!chkMonth(startYear, startMon, endYear, endMon)) {
    ElMessage({
      message: "时间范围无效",
      type: "error",
    });
    isRefreshing.value = false;
    return;
  }

  //console.log(startMonth.value);
  //console.log(endMonth.value);

  const req = [
    API.newbieGetDataShow({ startTime: startMonth.value, endTime: endMonth.value }),
    API.tutorGetDataShow({ startTime: startMonth.value, endTime: endMonth.value }),
  ];
  Promise.all(req)
    .then((res) => {
      //console.log(res);
      updateData(res);
      if (flag)
        ElMessage({
          message: "刷新成功",
          type: "success",
        });
    })
    .catch(showError)
    .finally(() => {
      showNewbie.value.refresh();
      showTutor.value.refresh();
      isRefreshing.value = false;
    });
};

onMounted(() => {
  //TODO: 正式发布时，注释掉下面这句即可
  isSample = true;
  refresh(false);
});

const changeTab = (tab: string) => {
  if (tab === "newbieData") {
    showNewbie.value.reload();
  } else {
    showTutor.value.reload();
  }
};
</script>

<style lang="scss" scoped>
.data-show {
  .head {
    padding-bottom: 5px;
  }

  .data-tabs {
    color: #6b778c;
    width: 100%;
  }
}
</style>
