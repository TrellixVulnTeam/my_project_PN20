<template>
  <div class="ForecastData">
    <a-table
      :columns="columns"
      :data-source="dataInfo.data"
      :scroll="{ x: 'calc(50%)', y: 450 }"
      :pagination="pagination"
      bordered
      size="small"
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
        <a-button
          :key="h_item.key"
          type="link"
          size="small"
          @click="redAnalysisClick(h_item.index)"
        >
          {{ h_item.index }}
        </a-button>
      </template>

      <template v-for="h_cell in dataTableInfo.blue" :slot="h_cell.key">
        <a-button
          :key="h_cell.key"
          type="link"
          size="small"
          @click="blueAnalysisClick(h_cell.index)"
        >
          {{ h_cell.index }}
        </a-button>
      </template>

      <template
        v-for="(item, i) in dataTableInfo.red"
        :slot="item.key"
        slot-scope="text, record"
      >
        <span :key="item.key">{{ JSON.parse(record.redBall)[i] }}</span>
      </template>

      <template
        v-for="(cell, j) in dataTableInfo.blue"
        :slot="cell.key"
        slot-scope="text, record"
      >
        <span :key="cell.key">{{ JSON.parse(record.blueBall)[j] }}</span>
      </template>

      <template slot="title">
        {{ baseInfo.name }}
        <a-button type="link" @click="flashClick"> 刷新 </a-button>
        <a-button type="link" @click="analysisClick"> 全数据分析 </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "ForecastData",
  components: {},
  inject: ["reload"],
  data: function () {
    return {
      columns: [],
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
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters("ColdAndHotStore", {
      getDataInfoItemByKey: "getDataInfoItemByKey",
      redAnalysisByIndex: "redAnalysisByIndex",
      redAnalysis: "redAnalysis",
      blueAnalysisByIndex: "blueAnalysisByIndex",
      blueAnalysis: "blueAnalysis",
      analysis: "analysis",
      getDataTableRedInfoByIndex: "getDataTableRedInfoByIndex",
      getDataTableBlueInfoByIndex: "getDataTableBlueInfoByIndex",
    }),
    ...mapState("ColdAndHotStore", {
      dataInfo: "dataInfo",
      baseInfo: "baseInfo",
      dataTableInfo: "dataTableInfo",
    }),
  },
  created: function () {
    this.resetState();
    this.setBaseInfo(this.$route.query);
    var ForecastData = this;
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
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
        customCell: function (record) {
          return ForecastData.renderRedCell(record, this.key);
        },
      };
      var redInfo = {
        name: "红球" + i,
        index: i,
        key: redKey,
        value: 1,
        selected: false,
        maxValue: this.baseInfo.rule
          ? this.baseInfo.rule.redBallMaxValue
            ? this.baseInfo.rule.redBallMaxValue
            : 35
          : 35,
      };
      this.addDataTableRedInfo(redInfo);
      objRed.children.push(subObjRed);
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
        key: blueKey,
        width: dataWidth,
        slots: { title: blueKey },
        scopedSlots: { customRender: blueKey },
        align: "center",
        customCell: function (record) {
          return ForecastData.renderBlueCell(record, this.key);
        },
      };
      var blueInfo = {
        name: "蓝球" + j,
        index: j,
        key: blueKey,
        value: 1,
        selected: false,
        maxValue: this.baseInfo.rule
          ? this.baseInfo.rule.blueBallMaxValue
            ? this.baseInfo.rule.blueBallMaxValue
            : 16
          : 16,
      };
      this.addDataTableBlueInfo(blueInfo);
      objBlue.children.push(subObjBlue);
    }
    this.columns.push(objBlue);

    this.currentPage = 1;
    this.setDataInfoAction().then((msg) => {
      this.pagination.total = msg.count;
      this.pagination.pageSize = msg.pageSize;
    });
  },
  watch: {
    $route() {
      this.reload();
    },
    "$route.path": function () {},
  },
  methods: {
    ...mapMutations("ColdAndHotStore", {
      addDataTableRedInfo: "addDataTableRedInfo",
      addDataTableBlueInfo: "addDataTableBlueInfo",
      setBaseInfo: "setBaseInfo",
      resetState: "resetState",
      setDataTableRedSelectedInfoByKey: "setDataTableRedSelectedInfoByKey",
      setDataTableBlueSelectedInfoByKey: "setDataTableBlueSelectedInfoByKey",
      setDataTableRedSelectedInfo: "setDataTableRedSelectedInfo",
      setDataTableBlueSelectedInfo: "setDataTableBlueSelectedInfo",
    }),
    ...mapActions("ColdAndHotStore", {
      setDataInfoAction: "setDataInfoAction",
    }),
    ...mapMutations("EchartsStore", {
      setVisible: "setVisible",
      setViewTitle: "setViewTitle",
      setLegend: "setLegend",
      setXAxis: "setXAxis",
      setSeries: "setSeries",
    }),
    //点击页码事件
    changePage(page, pageSize) {
      console.log(page, "当前页.......");
      console.log(pageSize, "每页大小.......");
      this.currentPage = page;
      this.setDataInfoAction({
        pageQueryParam: page,
        pageSizeQueryParam: pageSize,
      }).then((msg) => {
        this.pagination.total = msg.count;
        this.pagination.pageSize = msg.pageSize;
      });
    },
    //每页显示数量改变的事件
    changePageSize(current, pageSize) {
      console.log(current, "当前页.......");
      console.log(pageSize, "每页大小.......");
      this.currentPage = current;
      this.setDataInfoAction({
        pageQueryParam: current,
        pageSizeQueryParam: pageSize,
      }).then((msg) => {
        this.pagination.total = msg.count;
        this.pagination.pageSize = msg.pageSize;
      });
    },
    flashClick: function () {
      this.setDataInfoAction({
        pageQueryParam: this.currentPage,
        pageSizeQueryParam: this.getDataInfoItemByKey("pageSize"),
      }).then((msg) => {
        this.pagination.total = msg.count;
        this.pagination.pageSize = msg.pageSize;
      });
    },
    redAnalysisClick: function (cell) {
      console.log("redAnalysisClick", cell);
      var name = this.getDataTableRedInfoByIndex(cell - 1).name;
      this.setVisible(true);
      this.setViewTitle(name + "的冷热分析图");
      var data = this.redAnalysisByIndex(cell);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    blueAnalysisClick: function (cell) {
      console.log("blueAnalysisClick", cell);
      var name = this.getDataTableBlueInfoByIndex(cell - 1).name;
      this.setVisible(true);
      this.setViewTitle(name + "的冷热分析图");
      var data = this.blueAnalysisByIndex(cell);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisClick: function () {
      this.setVisible(true);
      this.setViewTitle("全数据冷热分析图");
      var data = this.analysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisRedClick: function () {
      this.setVisible(true);
      this.setViewTitle("红球数据冷热分析图");
      var data = this.redAnalysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisBlueClick: function () {
      this.setVisible(true);
      this.setViewTitle("蓝球数据冷热分析图");
      var data = this.blueAnalysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
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
  },
};
</script>

<style lang="scss" scoped>
.ForecastData {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
