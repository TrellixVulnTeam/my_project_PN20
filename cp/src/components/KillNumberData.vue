<template>
  <div class="KillNumberData">
    <a-table
      :columns="columns"
      :data-source="dataInfo.data"
      :scroll="{ x: 'calc(30%)', y: 450 }"
      :pagination="pagination"
      size="small"
      :loading="loading"
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

      <template v-for="(h_item, h_i) in redKey" :slot="h_item">
        <a-tooltip placement="topLeft" :title="h_item.slice(1)" :key="h_item">
          <a-button
            type="link"
            size="small"
            @click="redAnalysisClick(h_i + 1, h_item.slice(1))"
          >
            {{ h_item.slice(1) | ellipsis }}
          </a-button>
        </a-tooltip>
      </template>

      <template v-for="(h_cell, h_j) in blueKey" :slot="h_cell">
        <a-tooltip placement="topLeft" :title="h_cell.slice(1)" :key="h_cell">
          <a-button
            type="link"
            size="small"
            @click="blueAnalysisClick(h_j + 1, h_cell.slice(1))"
          >
            {{ h_cell.slice(1) | ellipsis }}
          </a-button>
        </a-tooltip>
      </template>

      <template
        v-for="(item, i) in redKey"
        :slot="item"
        slot-scope="text, record"
      >
        <span :key="item">{{ JSON.parse(record.redBall)[i] }}</span>
      </template>

      <template
        v-for="(cell, j) in blueKey"
        :slot="cell"
        slot-scope="text, record"
      >
        <span :key="cell">{{ JSON.parse(record.blueBall)[j] }}</span>
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
  name: "KillNumberData",
  components: {},
  inject: ["reload"],
  data: function () {
    return {
      columns: [],
      baseInfo: {},
      dataInfo: {},
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
      redKey: [],
      blueKey: [],
      loading: false,
      visible: false,
      viewTitle: "",
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      var len = 3;
      if (value.length > len) {
        return value.slice(0, len) + "...";
      }
      return value;
    },
  },
  created: function () {
    this.baseInfo = this.$route.query;
    var KillNumberData = this;
    var idWidth = 50;
    var IssueNumberWidth = 80;
    var dataWidth = 70;

    this.columns = [
      {
        title: "序号",
        width: idWidth,
        key: "序号",
        align: "center",
        fixed: "left",
        //使用插槽
        scopedSlots: { customRender: "id" },
      },
      {
        title: "期号",
        width: IssueNumberWidth,
        dataIndex: "IssueNumber",
        key: "期号",
        align: "center",
        fixed: "left",
      },
    ];

    var objRed = {
      slots: { title: "redBalls" },
      align: "center",
      children: [],
    };
    var objBlue = {
      slots: { title: "blueBalls" },
      align: "center",
      children: [],
    };
    var redIndex = 0;
    var blueIndex = 0;
    this.baseInfo.killNumberRules.forEach((item) => {
      var name = "";
      if (item.object == 0) {
        name = "r" + item.name;
      } else if (item.object == 1) {
        name = "b" + item.name;
      }
      var subObj = {
        width: dataWidth,
        slots: { title: name },
        scopedSlots: { customRender: name },
        align: "center",
      };
      if (item.object == 0) {
        subObj.key = "red" + redIndex;
        subObj.customCell = function (record, rowIndex) {
          return KillNumberData.renderRedCell(record, rowIndex, this.key);
        };
        objRed.children.push(subObj);
        this.redKey.push(name);
        redIndex = redIndex + 1;
      } else if (item.object == 1) {
        subObj.key = "blue" + blueIndex;
        subObj.customCell = function (record, rowIndex) {
          return KillNumberData.renderBlueCell(record, rowIndex, this.key);
        };
        objBlue.children.push(subObj);
        this.blueKey.push(name);
        blueIndex = blueIndex + 1;
      }
    });
    this.columns.push(objRed);
    this.columns.push(objBlue);
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
      this.getData(page, pageSize);
    },
    //每页显示数量改变的事件
    changePageSize(current, pageSize) {
      console.log(current, "当前页.......");
      console.log(pageSize, "每页大小.......");
      this.getData(current, pageSize);
    },
    flashClick: function () {
      this.loading = true;
      request(
        requestUrl(this.baseInfo.url, "post", this.baseInfo.ascription),
        "post"
      ).then(() => {
        // 2、处理正常的数据逻辑
        this.reload();
        this.loading = false;
      });
    },
    redAnalysisClick: function (cell, name) {
      console.log("redAnalysisClick", cell);
      this.visible = true;
      this.viewTitle = name + "的分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var IssueNumber = element.IssueNumber;
        var rowValues = JSON.parse(element.lotteryStage_redBall);
        var echartsVal = 0;
        for (var value of rowValues) {
          if (red[cell - 1] == value) {
            echartsVal = 1;
            break;
          }
        }
        echartsData.push({ IssueNumber: IssueNumber, value: echartsVal });
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
    blueAnalysisClick: function (cell, name) {
      console.log("blueAnalysisClick", cell);
      this.visible = true;
      this.viewTitle = name + "的分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var blue = JSON.parse(element.blueBall);
        var IssueNumber = element.IssueNumber;
        var rowValues = JSON.parse(element.lotteryStage_blueBall);
        var echartsVal = 0;
        for (var value of rowValues) {
          if (blue[cell - 1] == value) {
            echartsVal = 1;
            break;
          }
        }
        echartsData.push({ IssueNumber: IssueNumber, value: echartsVal });
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
    analysisClick: function () {
      this.visible = true;
      this.viewTitle = "全数据分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var lotteryStage_redBall = JSON.parse(element.lotteryStage_redBall);
        var blue = JSON.parse(element.blueBall);
        var lotteryStage_blueBall = JSON.parse(element.lotteryStage_blueBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({
          IssueNumber: IssueNumber,
          red: red,
          blue: blue,
          lotteryStage_redBall: lotteryStage_redBall,
          lotteryStage_blueBall: lotteryStage_blueBall,
        });
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
          var echartsVal = 0;
          for (var value of element.lotteryStage_redBall) {
            if (rv == value) {
              echartsVal = 1;
              break;
            }
          }

          redTempData[i] instanceof Array
            ? redTempData[i].push(echartsVal)
            : (redTempData[i] = [echartsVal]);
        });
        element.blue.forEach((rv, i) => {
          var echartsVal = 0;
          for (var value of element.lotteryStage_blueBall) {
            if (rv == value) {
              echartsVal = 1;
              break;
            }
          }

          blueTempData[i] instanceof Array
            ? blueTempData[i].push(echartsVal)
            : (blueTempData[i] = [echartsVal]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = this.redKey[index].slice(1);
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
        var name = this.blueKey[index].slice(1);
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
    analysisRedClick: function () {
      this.visible = true;
      this.viewTitle = "红球数据分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var lotteryStage_redBall = JSON.parse(element.lotteryStage_redBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({
          IssueNumber: IssueNumber,
          red: red,
          lotteryStage_redBall: lotteryStage_redBall,
        });
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
          var echartsVal = 0;
          for (var value of element.lotteryStage_redBall) {
            if (rv == value) {
              echartsVal = 1;
              break;
            }
          }

          redTempData[i] instanceof Array
            ? redTempData[i].push(echartsVal)
            : (redTempData[i] = [echartsVal]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = this.redKey[index].slice(1);
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
        var lotteryStage_blueBall = JSON.parse(element.lotteryStage_blueBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({
          IssueNumber: IssueNumber,
          blue: blue,
          lotteryStage_blueBall: lotteryStage_blueBall,
        });
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
          var echartsVal = 0;
          for (var value of element.lotteryStage_blueBall) {
            if (rv == value) {
              echartsVal = 1;
              break;
            }
          }

          blueTempData[i] instanceof Array
            ? blueTempData[i].push(echartsVal)
            : (blueTempData[i] = [echartsVal]);
        });
      });

      blueTempData.forEach((element, index) => {
        var name = this.blueKey[index].slice(1);
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
          tooltip: {},
          legend: legend,
          xAxis: {
            data: xAxis,
          },
          yAxis: {},
          series: series,
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      });
    },
    onClose: function () {
      this.visible = false;
    },
    renderRedCell: function (record, rowIndex, key) {
      var redBall = JSON.parse(record.redBall);
      var index = parseInt(key.slice(3));
      var red = redBall[index];
      var rowValues = JSON.parse(record.lotteryStage_redBall);
      for (var value of rowValues) {
        if (red == value) {
          return {
            // 这个style就是我自定义的属性，也就是官方文档中的props
            style: {
              // 行背景色
              "background-color": "#FF0000",
            },
          };
        }
      }
    },
    renderBlueCell: function (record, rowIndex, key) {
      var blueBall = JSON.parse(record.blueBall);
      var index = parseInt(key.slice(4));
      var blue = blueBall[index];
      var rowValues = JSON.parse(record.lotteryStage_blueBall);
      for (var value of rowValues) {
        if (blue == value) {
          return {
            // 这个style就是我自定义的属性，也就是官方文档中的props
            style: {
              // 行背景色
              "background-color": "#FF0000",
            },
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.KillNumberData {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#main {
  width: 100%;
  height: 300px;
}
</style>
