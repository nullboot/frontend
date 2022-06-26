<template>
  <div class="newbie data-show-tab">
    <el-row :gutter="30">
      <el-col :md="12">
        <data-show-chart
          ref="showNewbieBasis"
          :name="'概况'"
          :month="props.month"
          :data="props.basis"
          :hint="'部门新人总数：截至当月之前部门总计新人数<br />参与培训人数：截至当月之前部门参与培训的新人数<br />已毕业人数：截至当月之前部门毕业的新人数'"
        ></data-show-chart>
      </el-col>
      <el-col :md="12">
        <data-show-score
          ref="showNewbieScore"
          :name="'新人平均分'"
          :data="props.score"
          :hint="'部门新人平均分：部门在所选时间范围内毕业、且至今导师已评价的新人的平均分<br />全平台新人平均分：全平台在所选时间范围内毕业、且至今导师已评价的新人的平均分'"
        ></data-show-score>
      </el-col>
      <el-col :md="12">
        <data-show-chart
          ref="showNewbieTraining"
          :name="'培训参与情况'"
          :month="props.month"
          :data="props.training"
          :hint="'当月新增新人数：当月当前部门新加入的新人数<br />已参与培训人数：当月当前部门新加入并截至目前参与培训的新人数<br />参与培训比例：已参与培训人数/当月新增新人数'"
        ></data-show-chart>
      </el-col>
      <el-col :md="12">
        <data-show-chart
          ref="showNewbieGraduate"
          :name="'培训完成情况'"
          :month="props.month"
          :data="props.graduate"
          :hint="'毕业新人数：当月当前部门毕业的人数<br />当月新人毕业比例：当月当前部门新加入的新人中，截至目前已毕业的人数比例'"
        ></data-show-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import DataShowChart from "@/views/admin/data-show/data-show-chart.vue";
import DataShowScore from "@/views/admin/data-show/data-show-score.vue";
import { PropType, ref } from "vue";

const showNewbieBasis = ref<any>();
const showNewbieScore = ref<any>();
const showNewbieTraining = ref<any>();
const showNewbieGraduate = ref<any>();

class chartData {
  public name = "";
  public type = ""; //bar表示柱状图，line表示折线图
  public data: number[] = [];
  public yAxisIndex = 0; //表示y坐标的种类，0表示人数，1表示比例
}

class scoreData {
  public name = "";
  public score = 0;
  public totalScore = 0;
}

const props = defineProps({
  month: {
    type: Array as PropType<string[]>,
    required: true,
  },
  basis: {
    //概况
    type: Array as PropType<chartData[]>,
    required: true,
  },
  training: {
    //培训参与情况
    type: Array as PropType<chartData[]>,
    required: true,
  },
  graduate: {
    //培训完成情况
    type: Array as PropType<chartData[]>,
    required: true,
  },
  score: {
    //新人平均分
    type: Array as PropType<scoreData[]>,
    required: true,
  },
});
const refresh = () => {
  //console.log("***");
  //console.log(props.basis);
  //console.log(props.score);
  showNewbieBasis.value.draw();
  showNewbieTraining.value.draw();
  showNewbieGraduate.value.draw();
};
const reload = () => {
  showNewbieBasis.value.reload();
  showNewbieTraining.value.reload();
  showNewbieGraduate.value.reload();
};
defineExpose({ refresh, reload });
</script>
