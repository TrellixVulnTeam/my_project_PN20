<template>
  <a-drawer
    :title="viewTitle"
    placement="bottom"
    :closable="false"
    :visible="visible"
    :destroyOnClose="true"
    @close="onClose"
    height="400PX"
    ><div id="main"></div>
    <a-input-number
      id="inputNumber"
      v-model="h_item.value"
      size="small"
      :min="1"
      :max="Math.ceil(h_item.maxValue / 2)"
  /></a-drawer>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "StandardView",
  props: {
    dataInfo: {},
    dataTableInfo: {},
  },
  data: function () {
    return {
      visible: false,
      viewTitle: "",
    };
  },
  methods: {
    myEcharts(legend, xAxis, series) {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("main"));

        // 指定图表的配置项和数据
        var option = {
          legend: legend,
          xAxis: {
            data: xAxis,
          },
          yAxis: {},
          series: series,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              animation: false,
            },
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              restore: {},
              saveAsImage: {},
            },
          },
          axisPointer: {
            link: [
              {
                xAxisIndex: "all",
              },
            ],
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: [0, 1],
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: [0, 1],
            },
          ],
          grid: [
            {
              left: 60,
              right: 50,
              height: "55%",
            },
            {
              left: 60,
              right: 50,
              top: "55%",
              height: "55%",
            },
          ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      });
    },
    onShow: function () {
      this.visible = true;
    },
    onClose: function () {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
