<template>
  <a-drawer
    :title="viewTitle"
    placement="bottom"
    :closable="false"
    :visible="visible"
    :destroyOnClose="true"
    @close="onClose"
    height="400PX"
  >
    <a-row>
      <a-col :span="myChartSpan">
        <a-affix :offset-top="10">
          <div id="main"></div>
        </a-affix>
      </a-col>
      <a-col :span="24 - myChartSpan">
        <template v-for="item in dataTableInfo.red">
          <div v-if="item.selected == true" :key="item.key" class="rowItem">
            <a-row>
              <a-col :span="13">
                <a-input-number
                  v-model="item.value"
                  size="small"
                  :min="1"
                  :max="Math.ceil(item.maxValue / 2)"
                  @change="onChange(item.index, 'red')"
                />
              </a-col>
              <a-col :span="11">
                <a-tooltip placement="topLeft" :title="item.name">{{
                  item.name | ellipsis
                }}</a-tooltip>
              </a-col>
            </a-row>
          </div>
        </template>
        <template v-for="cell in dataTableInfo.blue">
          <div v-if="cell.selected == true" :key="cell.key" class="rowItem">
            <a-row>
              <a-col :span="13">
                <a-input-number
                  v-model="cell.value"
                  size="small"
                  :min="1"
                  :max="Math.ceil(cell.maxValue / 2)"
                  @change="onChange(cell.index, 'blue')"
                />
              </a-col>
              <a-col :span="11">
                <a-tooltip placement="topLeft" :title="cell.name">{{
                  cell.name | ellipsis
                }}</a-tooltip>
              </a-col>
            </a-row>
          </div>
        </template>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import * as echarts from "echarts";
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  name: "StandardView",
  props: [],
  data: function () {
    return {
      myChart: null,
      myChartSpan: 21,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      var len = 5;
      if (value.length > len) {
        return value.slice(0, len) + "...";
      }
      return value;
    },
  },
  computed: {
    ...mapState("EchartsStore", {
      visible: "visible",
      viewTitle: "viewTitle",
      legend: "legend",
      xAxis: "xAxis",
      series: "series",
    }),
    ...mapGetters("EchartsStore", {
      dataTableInfo: "getDataTableInfo",
      redAnalysisByIndex: "redAnalysisByIndex",
      blueAnalysisByIndex: "blueAnalysisByIndex",
    }),
  },
  watch: {
    visible(newVal) {
      console.log(this.dataTableInfo);
      if (newVal == true) {
        var hasFind = false;
        for (var item of this.dataTableInfo.red) {
          if (item.selected == true) {
            hasFind = true;
            break;
          }
        }
        if (hasFind == false) {
          for (var cell of this.dataTableInfo.blue) {
            if (cell.selected == true) {
              hasFind = true;
              break;
            }
          }
        }
        if (hasFind == true) {
          this.myChartSpan = 21;
        } else {
          this.myChartSpan = 24;
        }
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
      setLegend: "setLegend",
      setXAxis: "setXAxis",
      setSeries: "setSeries",
    }),
    myEcharts() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById("main"));

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
            right: 50,
            feature: {
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
              start: 0,
              end: 100,
              xAxisIndex: [0, 1],
            },
            {
              type: "inside",
              realtime: true,
              start: 0,
              end: 100,
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
        this.myChart.setOption(option);
      });
    },
    onChange: function (index, type) {
      var data = null;
      if (type == "red") {
        data = this.redAnalysisByIndex(index);
      } else {
        data = this.blueAnalysisByIndex(index);
      }
      var option = this.myChart.getOption();
      option.series = data.series;
      this.myChart.setOption(option);
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

.rowItem {
  margin-bottom: 2px;
}
</style>
