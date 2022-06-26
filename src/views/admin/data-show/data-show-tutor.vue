<template>
  <div class="tutor data-show-tab">
    <el-row :gutter="30">
      <el-col :md="12">
        <data-show-chart
          ref="showBasis"
          :name="'概况'"
          :month="props.month"
          :data="props.basis"
          :hint="' 部门导师总数：截至当月之前部门具有导师身份的人数<br />审核通过导师总数：截至当月之前部门被审核通过的导师人数<br />正式上岗导师总数：截至当月之前部门正式上岗的导师人数'"
        ></data-show-chart>
      </el-col>
      <el-col :md="12">
        <data-show-score
          ref="showScore"
          :name="'导师平均分'"
          :data="props.score"
          :hint="'部门导师平均分：当前部门导师的平均分<br />全平台导师平均分：当前全平台导师的平均分'"
        ></data-show-score>
      </el-col>
      <el-col :md="12">
        <data-show-chart
          ref="showWork"
          :name="'导师上岗情况'"
          :month="props.month"
          :data="props.approval"
          :hint="'新增导师人数：当月部门新被提名的导师人数<br />正式上岗导师数：当月部门新被提名且截至目前已正式上岗的导师人数<br />正式上岗导师比例：正式上岗导师数/新增导师人数'"
        ></data-show-chart>
      </el-col>
      <el-col :md="12">
        <data-show-chart
          ref="showAssignment"
          :name="'导师分配情况'"
          :month="props.month"
          :data="props.assignment"
          :hint="'已分配新人数：截至当月月末以前，部门已分配导师的新人数<br />未分配新人数：截至当月月末以前，部门未分配导师的新人数<br />导师分配率：已分配新人数/(已分配新人数+未分配新人数)'"
        ></data-show-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import DataShowChart from "@/views/admin/data-show/data-show-chart.vue";
import DataShowScore from "@/views/admin/data-show/data-show-score.vue";
import { PropType, ref } from "vue";

const showBasis = ref<any>();
const showScore = ref<any>();
const showWork = ref<any>();
const showAssignment = ref<any>();

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
  approval: {
    //导师上岗情况
    type: Array as PropType<chartData[]>,
    required: true,
  },
  assignment: {
    //导师分配情况
    type: Array as PropType<chartData[]>,
    required: true,
  },
  score: {
    //导师平均分
    type: Array as PropType<scoreData[]>,
  },
});
const refresh = () => {
  //console.log("&&&");
  //console.log(props.basis);
  //console.log(props.score);
  showBasis.value.draw();
  showWork.value.draw();
  showAssignment.value.draw();
};
const reload = () => {
  showBasis.value.reload();
  showWork.value.reload();
  showAssignment.value.reload();
};
defineExpose({ refresh, reload });
</script>
