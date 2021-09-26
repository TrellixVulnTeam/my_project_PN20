<template>
  <div class="SurplusData">
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
        <div :key="h_item.key">
          <a-button
            type="link"
            size="small"
            @click="redAnalysisClick(h_item.index)"
          >
            {{ h_item.index }}
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
        <div :key="h_cell.key">
          <a-button
            type="link"
            size="small"
            @click="blueAnalysisClick(h_cell.index)"
          >
            {{ h_cell.index }}
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
          JSON.parse(record.redBall)[i] % item.value
        }}</span>
      </template>

      <template
        v-for="(cell, j) in dataTableInfo.blue"
        :slot="cell.key"
        slot-scope="text, record"
      >
        <span :key="cell.key">{{
          JSON.parse(record.blueBall)[j] % cell.value
        }}</span>
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
  name: "SurplusData",
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
    ...mapGetters("SurplusStore", {
      getDataInfoItemByKey: "getDataInfoItemByKey",
      redAnalysisByIndex: "redAnalysisByIndex",
      redAnalysis: "redAnalysis",
      blueAnalysisByIndex: "blueAnalysisByIndex",
      blueAnalysis: "blueAnalysis",
      analysis: "analysis",
      getDataTableRedInfoByIndex: "getDataTableRedInfoByIndex",
      getDataTableBlueInfoByIndex: "getDataTableBlueInfoByIndex",
    }),
    ...mapState("SurplusStore", {
      dataInfo: "dataInfo",
      baseInfo: "baseInfo",
      dataTableInfo: "dataTableInfo",
    }),
  },
  created: function () {
    this.resetState();
    this.setBaseInfo(this.$route.query);
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
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
      };
      objRed.children.push(subObjRed);
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
    ...mapMutations("SurplusStore", {
      addDataTableRedInfo: "addDataTableRedInfo",
      addDataTableBlueInfo: "addDataTableBlueInfo",
      setBaseInfo: "setBaseInfo",
      resetState: "resetState",
      setDataTableRedSelectedInfoByKey: "setDataTableRedSelectedInfoByKey",
      setDataTableBlueSelectedInfoByKey: "setDataTableBlueSelectedInfoByKey",
      setDataTableRedSelectedInfo: "setDataTableRedSelectedInfo",
      setDataTableBlueSelectedInfo: "setDataTableBlueSelectedInfo",
    }),
    ...mapActions("SurplusStore", {
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
      var key = this.getDataTableRedInfoByIndex(cell - 1).key;
      this.setVisible(true);
      this.setViewTitle(name + "的取余分析图");
      this.setDataTableRedSelectedInfoByKey(key);
      this.setDataTableBlueSelectedInfo(false);
      var data = this.redAnalysisByIndex(cell);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    blueAnalysisClick: function (cell) {
      console.log("blueAnalysisClick", cell);
      var name = this.getDataTableBlueInfoByIndex(cell - 1).name;
      var key = this.getDataTableBlueInfoByIndex(cell - 1).key;
      this.setVisible(true);
      this.setViewTitle(name + "的取余分析图");
      this.setDataTableBlueSelectedInfoByKey(key);
      this.setDataTableRedSelectedInfo(false);
      var data = this.blueAnalysisByIndex(cell);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisRedClick: function () {
      this.setVisible(true);
      this.setViewTitle("红球数据取余分析图");
      this.setDataTableRedSelectedInfo(true);
      this.setDataTableBlueSelectedInfo(false);
      var data = this.redAnalysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisBlueClick: function () {
      this.setVisible(true);
      this.setViewTitle("蓝球数据取余分析图");
      this.setDataTableBlueSelectedInfo(true);
      this.setDataTableRedSelectedInfo(false);
      var data = this.blueAnalysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisClick: function () {
      this.setVisible(true);
      this.setViewTitle("全数据取余分析图");
      this.setDataTableBlueSelectedInfo(true);
      this.setDataTableRedSelectedInfo(true);
      var data = this.analysis();
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
  },
};
</script>

<style lang="scss" scoped>
.SurplusData {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
