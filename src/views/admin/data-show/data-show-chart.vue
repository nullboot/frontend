<template>
  <el-card class="data-show-card chart">
    <template #header>
      <div class="card-header">
        <el-tooltip class="box-item" effect="dark" placement="top">
          <template #content>
            <span v-html="props.hint"></span>
          </template>
          <span>{{ props.name }}</span>
        </el-tooltip>
      </div>
    </template>
    <div class="main-chart" ref="myChart" />
  </el-card>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, PropType, ref, shallowRef } from "vue";
import * as echarts from "echarts";

class chartData {
  public name = "";
  public type = ""; //bar表示柱状图，line表示折线图
  public data: number[] = [];
  public yAxisIndex = 0; //表示y坐标的种类，0表示人数，1表示比例
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
  month: {
    type: Array as PropType<string[]>,
    required: true,
  },
  data: {
    type: Array as PropType<chartData[]>,
    required: true,
  },
});
const myChart = ref<HTMLElement>();
const myCharts = shallowRef<EChartsType>();
const draw = () => {
  //console.log(props.month);
  nextTick(() => {
    // 绘制图表
    myCharts.value!.setOption({
      tooltip: {
        formatter: function (params: any) {
          //标签内容
          let res = params.seriesName + "<br/>" + params.marker + params.name + "： " + params.value;
          //console.log(params);
          if (params.seriesName.indexOf("比例") !== -1) res = res + "%";
          return res;
        },
      },
      xAxis: {
        data: props.month,
      },
      yAxis: [
        {
          type: "value",
          name: "人数/人",
          axisLabel: { formatter: "{value}" }, //y轴上带的单位
          axisLine: { show: true }, //轴线
          splitLine: { show: true }, //分割线
        },
        {
          type: "value",
          name: "比例/%",
          axisLabel: { formatter: "{value}" }, //y轴上带的单位
          axisLine: { show: true }, //轴线
          splitLine: { show: true }, //分割线
        },
      ],
      series: props.data,
      legend: {
        orient: "horizontal",
        x: "center",
        y: "top",
      },
    });
  });
};
const reload = () => nextTick(() => myCharts.value!.resize());
import { debounce } from "lodash";
import { EChartsType } from "echarts";

onMounted(() => {
  myCharts.value = echarts.init(myChart.value!);
  draw();
  window.addEventListener(
    "resize",
    debounce(function (this: any) {
      myCharts.value!.resize();
    }, 50),
  );
});
defineExpose({ draw, reload });
</script>

<style lang="scss" scoped>
.data-show-card {
  .card-header {
    font-weight: bold;
  }

  .main-chart {
  }
}
</style>
