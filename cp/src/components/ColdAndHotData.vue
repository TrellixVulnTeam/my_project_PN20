<template>
  <div class="ColdAndHotData">
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
  name: "ColdAndHotData",
  data: function () {
    return {
      columns: [],
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
    this.theme = { name: "ColdAndHot", change: false };
    var ColdAndHotData = this;
    var dataWidth = 50;
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

    var redBallMaxValue = this.baseInfo.rule
      ? this.baseInfo.rule.redBallMaxValue
        ? this.baseInfo.rule.redBallMaxValue
        : 35
      : 35;
    var objRed = { slots: { title: "redBalls" }, children: [] };
    for (var i = 1; i < redBallMaxValue + 1; i++) {
      var redKey = "Red" + i;
      var subObjRed = {
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
        customCell: function (record) {
          return ColdAndHotData.renderRedCell(record, this.key);
        },
      };
      var redInfo = {
        name: redKey,
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
      var blueKey = "Blue" + j;
      var subObjBlue = {
        key: blueKey,
        width: dataWidth,
        slots: { title: blueKey },
        scopedSlots: { customRender: blueKey },
        align: "center",
        customCell: function (record) {
          return ColdAndHotData.renderBlueCell(record, this.key);
        },
      };
      var blueInfo = {
        name: blueKey,
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
.ColdAndHotData {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
