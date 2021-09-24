<template>
  <div class="QuotientData">
    <a-table
      :columns="columns"
      :data-source="dataInfo.data"
      :scroll="{ x: 'calc(30%)', y: 450 }"
      :pagination="pagination"
      size="small"
      bordered
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <!--text 表示当前行当前列的值, record 为每一条数据, index 索引-->
      <span slot="id" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <a-button
        type="link"
        size="small"
        slot="redBalls"
        @click="analysisRedClick()"
      >
        红球
      </a-button>

      <a-button
        type="link"
        size="small"
        slot="blueBalls"
        @click="analysisBlueClick()"
      >
        蓝球
      </a-button>

      <template v-for="h_item in dataTableInfo.red" :slot="h_item.key">
        <div :key="'hb_' + h_item.key">
          <a-button
            type="link"
            size="small"
            @click="redAnalysisClick(parseInt(h_item.key.slice(3)))"
          >
            {{ h_item.key.slice(3) }}
          </a-button>
          <a-input-number
            id="inputNumber"
            v-model="h_item.value"
            size="small"
            :min="1"
            :max="Math.ceil(h_item.maxValue / 2)"
          />
        </div>
      </template>

      <template v-for="h_cell in dataTableInfo.blue" :slot="h_cell.key">
        <div :key="'hb_' + h_cell.key">
          <a-button
            type="link"
            size="small"
            @click="blueAnalysisClick(parseInt(h_cell.key.slice(4)))"
          >
            {{ h_cell.key.slice(4) }}
          </a-button>
          <a-input-number
            id="inputNumber"
            v-model="h_cell.value"
            size="small"
            :min="1"
            :max="Math.ceil(h_cell.maxValue / 2)"
          />
        </div>
      </template>

      <template
        v-for="(item, i) in dataTableInfo.red"
        :slot="item.key"
        slot-scope="text, record"
      >
        <span :key="item.key">{{
          Math.ceil(JSON.parse(record.redBall)[i] / item.value)
        }}</span>
      </template>

      <template
        v-for="(cell, j) in dataTableInfo.blue"
        :slot="cell.key"
        slot-scope="text, record"
      >
        <span :key="cell.key">{{
          Math.ceil(JSON.parse(record.blueBall)[j] / cell.value)
        }}</span>
      </template>

      <template slot="title">
        {{ baseInfo.name }}
        <a-button type="link" @click="flashClick"> 刷新 </a-button>
        <a-button type="link" @click="analysisClick"> 全数据分析 </a-button>
      </template>
    </a-table>
    <a-drawer
      :title="viewTitle"
      placement="bottom"
      :closable="false"
      :visible="visible"
      :destroyOnClose="true"
      @close="onClose"
      height="400PX"
      ><div id="main"></div
    ></a-drawer>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { requestUrl, request } from "@/utils/Http.js";

export default {
  name: "QuotientData",
  components: {},
  inject: ["reload"],
  data: function () {
    return {
      columns: [],
      dataInfo: {},
      baseInfo: {},
      //表格分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "20", "50", "100"], // 每页数量选项
        showTotal: (total) => `共 ${total} 条数据`, // 显示总数
        onShowSizeChange: (current, pageSize) =>
          this.changePageSize(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.changePage(page, pageSize), //点击页码事件
        total: 0, //总条数
        showQuickJumper: true, //显示跳转输入框
      },
      visible: false,
      viewTitle: "",
      currentPage: 1,
      dataTableInfo: { red: [], blue: [] },
    };
  },
  created: function () {
    this.baseInfo = this.$route.query;

    var idWidth = 50;
    var IssueNumberWidth = 80;
    var dataWidth = 50;

    this.columns = [
      {
        title: "序号",
        width: idWidth,
        key: "序号",
        align: "center",
        //使用插槽
        scopedSlots: { customRender: "id" },
      },
      {
        title: "期号",
        width: IssueNumberWidth,
        dataIndex: "IssueNumber",
        key: "期号",
        align: "center",
      },
    ];
    var redBallNum = this.baseInfo.rule
      ? this.baseInfo.rule.redBallNum
        ? this.baseInfo.rule.redBallNum
        : 5
      : 5;
    var objRed = {
      slots: { title: "redBalls" },
      align: "center",
      children: [],
    };
    for (var i = 1; i < redBallNum + 1; i++) {
      var redKey = "red" + i;
      var subObjRed = {
        // title: i,
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
      };
      objRed.children.push(subObjRed);
      var redInfo = {
        key: redKey,
        value: 1,
        maxValue: this.baseInfo.rule
          ? this.baseInfo.rule.redBallMaxValue
            ? this.baseInfo.rule.redBallMaxValue
            : 35
          : 35,
      };
      this.dataTableInfo.red.push(redInfo);
    }
    this.columns.push(objRed);

    var blueBallNum = this.baseInfo.rule
      ? this.baseInfo.rule.blueBallNum
        ? this.baseInfo.rule.blueBallNum
        : 2
      : 2;
    var objBlue = {
      slots: { title: "blueBalls" },
      align: "center",
      children: [],
    };
    for (var j = 1; j < blueBallNum + 1; j++) {
      var blueKey = "blue" + j;
      var subObjBlue = {
        // title: j,
        key: blueKey,
        width: dataWidth,
        slots: { title: blueKey },
        scopedSlots: { customRender: blueKey },
        align: "center",
      };
      objBlue.children.push(subObjBlue);
      var blueInfo = {
        key: blueKey,
        value: 1,
        maxValue: this.baseInfo.rule
          ? this.baseInfo.rule.blueBallMaxValue
            ? this.baseInfo.rule.blueBallMaxValue
            : 16
          : 16,
      };
      this.dataTableInfo.blue.push(blueInfo);
    }
    this.columns.push(objBlue);

    this.currentPage = 1;
    this.getData();
  },
  watch: {
    $route() {
      this.reload();
    },
    "$route.path": function () {},
  },
  methods: {
    getData: function (pageQueryParam, pageSizeQueryParam) {
      var param = {};
      if (Object.keys(this.dataInfo).length > 0) {
        param[this.dataInfo.pageQueryParam] = pageQueryParam;
        param[this.dataInfo.pageSizeQueryParam] = pageSizeQueryParam;
      }
      request(
        requestUrl(this.baseInfo.url, "get", this.baseInfo.ascription, param),
        "get"
      ).then((response) => {
        // 2、处理正常的数据逻辑
        this.dataInfo = response.data;
        this.pagination.total = this.dataInfo.count;
        this.pagination.pageSize = this.dataInfo.pageSize;
      });
    },
    //点击页码事件
    changePage(page, pageSize) {
      console.log(page, "当前页.......");
      console.log(pageSize, "每页大小.......");
      this.currentPage = page;
      this.getData(page, pageSize);
    },
    //每页显示数量改变的事件
    changePageSize(current, pageSize) {
      console.log(current, "当前页.......");
      console.log(pageSize, "每页大小.......");
      this.currentPage = current;
      this.getData(current, pageSize);
    },
    flashClick: function () {
      this.getData(this.currentPage, this.dataInfo.pageSize);
    },
    redAnalysisClick: function (cell) {
      console.log("redAnalysisClick", cell);
      var name = "红球号码" + cell;
      this.visible = true;
      this.viewTitle = name + "的冷热分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({
          IssueNumber: IssueNumber,
          value: Math.ceil(
            red[cell - 1] / this.dataTableInfo.red[cell - 1].value
          ),
        });
      });
      echartsData.sort((a, b) => {
        return a.IssueNumber - b.IssueNumber;
      });
      var legend = { data: [], selected: {} };
      legend.selected[name] = true;
      legend.data.push(name);
      var xAxis = [];
      var series = [
        {
          name: name,
          type: "line",
          smooth: true,
          data: [],
        },
      ];

      echartsData.forEach((element) => {
        xAxis.push(element.IssueNumber);
        series[0].data.push(element.value);
      });

      this.myEcharts(legend, xAxis, series);
    },
    blueAnalysisClick: function (cell) {
      console.log("blueAnalysisClick", cell);
      var name = "蓝球号码" + cell;
      this.visible = true;
      this.viewTitle = name + "的冷热分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var blue = JSON.parse(element.blueBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({
          IssueNumber: IssueNumber,
          value: Math.ceil(
            blue[cell - 1] / this.dataTableInfo.blue[cell - 1].value
          ),
        });
      });
      echartsData.sort((a, b) => {
        return a.IssueNumber - b.IssueNumber;
      });
      var legend = { data: [], selected: {} };
      legend.selected[name] = true;
      legend.data.push(name);
      var xAxis = [];
      var series = [
        {
          name: name,
          type: "line",
          smooth: true,
          data: [],
        },
      ];

      echartsData.forEach((element) => {
        xAxis.push(element.IssueNumber);
        series[0].data.push(element.value);
      });

      this.myEcharts(legend, xAxis, series);
    },
    analysisRedClick: function () {
      this.visible = true;
      this.viewTitle = "红球数据分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({ IssueNumber: IssueNumber, red: red });
      });
      echartsData.sort((a, b) => {
        return a.IssueNumber - b.IssueNumber;
      });
      var legend = { data: [], selected: {} };
      var xAxis = [];
      var series = [];

      var redTempData = [];
      echartsData.forEach((element) => {
        xAxis.push(element.IssueNumber);
        element.red.forEach((rv, i) => {
          var value = Math.ceil(rv / this.dataTableInfo.red[i].value);
          redTempData[i] instanceof Array
            ? redTempData[i].push(value)
            : (redTempData[i] = [value]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = this.dataTableInfo.red[index].key.slice(3);
        var temp = {
          name: name,
          type: "line",
          smooth: true,
          data: element,
        };
        legend.selected[name] = false;
        legend.data.push(name);
        series.push(temp);
      });

      this.myEcharts(legend, xAxis, series);
    },
    analysisBlueClick: function () {
      this.visible = true;
      this.viewTitle = "蓝球数据分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var blue = JSON.parse(element.blueBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({ IssueNumber: IssueNumber, blue: blue });
      });
      echartsData.sort((a, b) => {
        return a.IssueNumber - b.IssueNumber;
      });
      var legend = { data: [], selected: {} };
      var xAxis = [];
      var series = [];

      var blueTempData = [];
      echartsData.forEach((element) => {
        xAxis.push(element.IssueNumber);
        element.blue.forEach((rv, i) => {
          var value = Math.ceil(rv / this.dataTableInfo.blue[i].value);
          blueTempData[i] instanceof Array
            ? blueTempData[i].push(value)
            : (blueTempData[i] = [value]);
        });
      });

      blueTempData.forEach((element, index) => {
        var name = this.dataTableInfo.blue[index].key.slice(4);
        var temp = {
          name: name,
          type: "line",
          smooth: true,
          data: element,
        };
        legend.selected[name] = false;
        legend.data.push(name);
        series.push(temp);
      });

      this.myEcharts(legend, xAxis, series);
    },
    analysisClick: function () {
      this.visible = true;
      this.viewTitle = "全数据分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var blue = JSON.parse(element.blueBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({ IssueNumber: IssueNumber, red: red, blue: blue });
      });
      echartsData.sort((a, b) => {
        return a.IssueNumber - b.IssueNumber;
      });
      var legend = { data: [], selected: {} };
      var xAxis = [];
      var series = [];

      var redTempData = [];
      var blueTempData = [];
      echartsData.forEach((element) => {
        xAxis.push(element.IssueNumber);
        element.red.forEach((rv, i) => {
          var value = Math.ceil(rv / this.dataTableInfo.red[i].value);
          redTempData[i] instanceof Array
            ? redTempData[i].push(value)
            : (redTempData[i] = [value]);
        });
        element.blue.forEach((rv, i) => {
          var value = Math.ceil(rv / this.dataTableInfo.blue[i].value);
          blueTempData[i] instanceof Array
            ? blueTempData[i].push(value)
            : (blueTempData[i] = [value]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = this.dataTableInfo.red[index].key;
        var temp = {
          name: name,
          type: "line",
          smooth: true,
          data: element,
        };
        legend.selected[name] = false;
        legend.data.push(name);
        series.push(temp);
      });

      blueTempData.forEach((element, index) => {
        var name = this.dataTableInfo.blue[index].key;
        var temp = {
          name: name,
          type: "line",
          smooth: true,
          data: element,
        };
        legend.selected[name] = false;
        legend.data.push(name);
        series.push(temp);
      });

      this.myEcharts(legend, xAxis, series);
    },
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
    onClose: function () {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.QuotientData {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#main {
  width: 100%;
  height: 300px;
}
</style>
