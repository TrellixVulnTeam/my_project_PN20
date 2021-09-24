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
    <template v-for="item in dataTableInfo.red">
      <a-input-number
        v-if="item.selected == true"
        :key="item.key"
        v-model="item.value"
        size="small"
        :min="1"
        :max="Math.ceil(item.maxValue / 2)"
        @change="myEcharts"
      />{{ item.name }}
    </template>
    <template v-for="cell in dataTableInfo.blue">
      <a-input-number
        v-if="cell.selected == true"
        :key="cell.key"
        v-model="cell.value"
        size="small"
        :min="1"
        :max="Math.ceil(cell.maxValue / 2)"
        @change="myEcharts"
      />{{ cell.name }}
    </template>
  </a-drawer>
</template>

<script>
import * as echarts from "echarts";
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  name: "StandardView",
  data: function () {
    return {
      myChart: null,
    };
  },
  computed: {
    ...mapGetters("EchartsStore", {}),
    ...mapState("EchartsStore", {
      visible: "visible",
      viewTitle: "viewTitle",
      legend: "legend",
      xAxis: "xAxis",
      series: "series",
    }),
    ...mapState("QuotientStore", {
      dataTableInfo: "dataTableInfo",
    }),
  },
  watch: {
    visible(newVal) {
      console.log(this.dataTableInfo);
      if (newVal == true) {
        this.myEcharts();
      }
    },
  },
  created: function () {
    this.resetState();
  },
  methods: {
    ...mapMutations("EchartsStore", {
      resetState: "resetState",
      setVisible: "setVisible",
    }),
    myEcharts() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("main"));

        // 指定图表的配置项和数据
        var option = {
          legend: this.legend,
          xAxis: {
            data: this.xAxis,
          },
          yAxis: {},
          series: this.series,
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
    onClose: function () {
      this.setVisible(false);
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  height: 300px;
}
</style>
