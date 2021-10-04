<template>
  <div class="KillNumberData">
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

      <span slot="idHeader">
        {{ $t("language.SerialNumber") }}
      </span>

      <span slot="IssueNumberHeader">
        {{ $t("language.IssueNumber") }}
      </span>

      <a-button
        type="link"
        size="small"
        slot="redBalls"
        @click="analysisRedClick()"
      >
        {{ $t("language.RedBall") }}
      </a-button>

      <a-button
        type="link"
        size="small"
        slot="blueBalls"
        @click="analysisBlueClick()"
      >
        {{ $t("language.BlueBall") }}
      </a-button>

      <template v-for="h_item in dataTableInfo.red" :slot="h_item.key">
        <a-tooltip
          placement="topLeft"
          :title="h_item.name.slice(3)"
          :key="h_item.key"
        >
          <a-button
            type="link"
            size="small"
            @click="redAnalysisClick(h_item.index)"
          >
            {{ h_item.name.slice(3) | ellipsis }}
          </a-button>
        </a-tooltip>
      </template>

      <template v-for="h_cell in dataTableInfo.blue" :slot="h_cell.key">
        <a-tooltip
          placement="topLeft"
          :title="h_cell.name.slice(4)"
          :key="h_cell.key"
        >
          <a-button
            type="link"
            size="small"
            @click="blueAnalysisClick(h_cell.index)"
          >
            {{ h_cell.name.slice(4) | ellipsis }}
          </a-button>
        </a-tooltip>
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
        {{ $t("language." + baseInfo.name) }}
        <a-button type="link" @click="flashClick">
          {{ $t("language.Flash") }}
        </a-button>
        <a-button type="link" @click="analysisClick">
          {{ $t("language.FullDataAnalysis") }}
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import mixin from "@/mixins/DataMixins.js";

export default {
  mixins: [mixin],
  name: "KillNumberData",
  data: function () {
    return {
      columns: [],
    };
  },
  computed: {
    ...mapGetters("KillNumberStore", {
      getDataInfoItemByKey: "getDataInfoItemByKey",
      redAnalysisByIndex: "redAnalysisByIndex",
      redAnalysis: "redAnalysis",
      blueAnalysisByIndex: "blueAnalysisByIndex",
      blueAnalysis: "blueAnalysis",
      analysis: "analysis",
      getDataTableRedInfoByIndex: "getDataTableRedInfoByIndex",
      getDataTableBlueInfoByIndex: "getDataTableBlueInfoByIndex",
    }),
    ...mapState("KillNumberStore", {
      dataInfo: "dataInfo",
      baseInfo: "baseInfo",
      dataTableInfo: "dataTableInfo",
    }),
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
    this.theme = { name: "KillNumber", change: false };
    var KillNumberData = this;
    var dataWidth = 70;
    var idWidth = 50;
    var IssueNumberWidth = 60;

    this.columns = [
      {
        slots: { title: "idHeader" },
        width: idWidth,
        key: this.$t("language.SerialNumber"),
        align: "center",
        fixed: "left",
        //使用插槽
        scopedSlots: { customRender: "id" },
      },
      {
        slots: { title: "IssueNumberHeader" },
        width: IssueNumberWidth,
        dataIndex: "IssueNumber",
        key: this.$t("language.IssueNumber"),
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
    var redIndex = 1;
    var blueIndex = 1;
    for (var i = 0; i < this.baseInfo.killNumberRules.length; i++) {
      var item = this.baseInfo.killNumberRules[i];
      if (item.object == 0) {
        var redKey = "Red" + redIndex;
        var subObjRed = {
          key: redKey,
          width: dataWidth,
          slots: { title: redKey },
          scopedSlots: { customRender: redKey },
          align: "center",
          customCell: function (record, rowIndex) {
            return KillNumberData.renderRedCell(record, rowIndex, this.key);
          },
        };
        objRed.children.push(subObjRed);
        var redInfo = {
          name: "Red" + item.name,
          index: redIndex,
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
        redIndex++;
      } else if (item.object == 1) {
        var blueKey = "Blue" + blueIndex;
        var subObjBlue = {
          key: blueKey,
          width: dataWidth,
          slots: { title: blueKey },
          scopedSlots: { customRender: blueKey },
          align: "center",
          customCell: function (record, rowIndex) {
            return KillNumberData.renderBlueCell(record, rowIndex, this.key);
          },
        };
        objBlue.children.push(subObjBlue);
        var blueInfo = {
          name: "Blue" + item.name,
          index: blueIndex,
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
        blueIndex++;
      }
    }
    this.columns.push(objRed);
    this.columns.push(objBlue);
  },
  methods: {
    ...mapMutations("KillNumberStore", {
      addDataTableRedInfo: "addDataTableRedInfo",
      addDataTableBlueInfo: "addDataTableBlueInfo",
      setBaseInfo: "setBaseInfo",
      resetState: "resetState",
      setDataTableRedSelectedInfoByKey: "setDataTableRedSelectedInfoByKey",
      setDataTableBlueSelectedInfoByKey: "setDataTableBlueSelectedInfoByKey",
      setDataTableRedSelectedInfo: "setDataTableRedSelectedInfo",
      setDataTableBlueSelectedInfo: "setDataTableBlueSelectedInfo",
    }),
    ...mapActions("KillNumberStore", {
      setDataInfoAction: "setDataInfoAction",
    }),
    ...mapMutations("EchartsStore", {
      setVisible: "setVisible",
      setViewTitle: "setViewTitle",
      setLegend: "setLegend",
      setXAxis: "setXAxis",
      setSeries: "setSeries",
    }),
    renderRedCell: function (record, rowIndex, key) {
      var redBall = JSON.parse(record.redBall);
      var index = parseInt(key.slice(3)) - 1;
      var red = redBall[index];
      if (typeof record.lotteryStage_redBall == "undefined") {
        return;
      }
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
      var index = parseInt(key.slice(4)) - 1;
      var blue = blueBall[index];
      if (typeof record.lotteryStage_blueBall == "undefined") {
        return;
      }
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
</style>
