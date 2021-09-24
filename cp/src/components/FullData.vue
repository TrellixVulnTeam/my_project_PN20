<template>
  <div class="FullData">
    <a-table
      :columns="columns"
      :data-source="dataInfo.data"
      :scroll="{ x: 'calc(50%)', y: 450 }"
      :pagination="pagination"
      bordered
      size="small"
      :loading="loading"
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

      <template v-for="h_item in redKey" :slot="h_item">
        <a-button
          :key="'hb_' + h_item"
          type="link"
          size="small"
          @click="redAnalysisClick(parseInt(h_item.slice(3)))"
        >
          {{ h_item.slice(3) }}
        </a-button>
      </template>

      <template v-for="h_cell in blueKey" :slot="h_cell">
        <a-button
          :key="'hb_' + h_cell"
          type="link"
          size="small"
          @click="blueAnalysisClick(parseInt(h_cell.slice(4)))"
        >
          {{ h_cell.slice(4) }}
        </a-button>
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
  name: "FullData",
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
  created: function () {
    this.baseInfo = this.$route.query;
    var FullData = this;
    var idWidth = 60;
    var IssueNumberWidth = 80;
    var dataWidth = 50;

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
    var redBallMaxValue = this.baseInfo.rule
      ? this.baseInfo.rule.redBallMaxValue
        ? this.baseInfo.rule.redBallMaxValue
        : 35
      : 35;
    var objRed = { slots: { title: "redBalls" }, children: [] };
    for (var i = 1; i < redBallMaxValue + 1; i++) {
      var redKey = "red" + i;
      var subObjRed = {
        // title: i,
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
        customCell: function (record) {
          return FullData.renderRedCell(record, this.key);
        },
      };
      objRed.children.push(subObjRed);
      this.redKey.push(redKey);
    }
    this.columns.push(objRed);

    var blueBallMaxValue = this.baseInfo.rule
      ? this.baseInfo.rule.blueBallMaxValue
        ? this.baseInfo.rule.blueBallMaxValue
        : 12
      : 12;
    var objBlue = { slots: { title: "blueBalls" }, children: [] };
    for (var j = 1; j < blueBallMaxValue + 1; j++) {
      var blueKey = "blue" + j;
      var subObjBlue = {
        // title: j,
        key: blueKey,
        width: dataWidth,
        slots: { title: blueKey },
        scopedSlots: { customRender: blueKey },
        align: "center",
        customCell: function (record) {
          return FullData.renderBlueCell(record, this.key);
        },
      };
      objBlue.children.push(subObjBlue);
      this.blueKey.push(blueKey);
    }
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
    redAnalysisClick: function (cell) {
      console.log("redAnalysisClick", cell);
      var name = "红球号码" + cell;
      this.visible = true;
      this.viewTitle = name + "的冷热分析图";
      var echartsData = [];
      this.dataInfo.data.forEach((element) => {
        var red = JSON.parse(element.redBall);
        var IssueNumber = element.IssueNumber;
        echartsData.push({ IssueNumber: IssueNumber, value: red[cell - 1] });
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
        echartsData.push({ IssueNumber: IssueNumber, value: blue[cell - 1] });
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
          redTempData[i] instanceof Array
            ? redTempData[i].push(rv)
            : (redTempData[i] = [rv]);
        });
        element.blue.forEach((rv, i) => {
          blueTempData[i] instanceof Array
            ? blueTempData[i].push(rv)
            : (blueTempData[i] = [rv]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = "红球号码" + (index + 1);
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
        var name = "蓝球号码" + (index + 1);
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
          redTempData[i] instanceof Array
            ? redTempData[i].push(rv)
            : (redTempData[i] = [rv]);
        });
      });

      redTempData.forEach((element, index) => {
        var name = this.redKey[index].slice(3);
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
          blueTempData[i] instanceof Array
            ? blueTempData[i].push(rv)
            : (blueTempData[i] = [rv]);
        });
      });

      blueTempData.forEach((element, index) => {
        var name = this.blueKey[index].slice(4);
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
    renderRedCell: function (record, key) {
      var redBall = JSON.parse(record.redBall);
      var index = parseInt(key.slice(3)) - 1;
      var red = redBall[index];
      if (red == 1) {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#FF0000",
          },
        };
      } else if (red == 0) {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#FFD700",
          },
        };
      } else {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#228B22",
          },
        };
      }
    },
    renderBlueCell: function (record, key) {
      var blueBall = JSON.parse(record.blueBall);
      var index = parseInt(key.slice(4)) - 1;
      var blue = blueBall[index];
      if (blue == 1) {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#FF0000",
          },
        };
      } else if (blue == 0) {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#FFD700",
          },
        };
      } else {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            "background-color": "#228B22",
          },
        };
      }
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
  },
};
</script>

<style lang="scss" scoped>
.FullData {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#main {
  width: 100%;
  height: 300px;
}
</style>
