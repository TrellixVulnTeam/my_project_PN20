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
        <a-space size="25">
          {{ $t("language." + baseInfo.name) }}
          <a-button type="link" @click="flashClick">
            {{ $t("language.Flash") }}
          </a-button>
          <a-button type="link" @click="analysisClick">
            {{ $t("language.FullDataAnalysis") }}
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import mixin from "@/mixins/DataMixins.js";

export default {
  mixins: [mixin],
  name: "SurplusData",
  data: function () {
    return {
      columns: [],
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
    this.theme = { name: "Surplus", change: true };
    var idWidth = 50;
    var IssueNumberWidth = 80;
    var dataWidth = 50;

    this.columns = [
      {
        slots: { title: "idHeader" },
        width: idWidth,
        key: this.$t("language.SerialNumber"),
        align: "center",
        //使用插槽
        scopedSlots: { customRender: "id" },
      },
      {
        slots: { title: "IssueNumberHeader" },
        width: IssueNumberWidth,
        dataIndex: "IssueNumber",
        key: this.$t("language.IssueNumber"),
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
      var redKey = "Red" + i;
      var subObjRed = {
        key: redKey,
        width: dataWidth,
        slots: { title: redKey },
        scopedSlots: { customRender: redKey },
        align: "center",
      };
      objRed.children.push(subObjRed);
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
      var blueKey = "Blue" + j;
      var subObjBlue = {
        key: blueKey,
        width: dataWidth,
        slots: { title: blueKey },
        scopedSlots: { customRender: blueKey },
        align: "center",
      };
      objBlue.children.push(subObjBlue);
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
    }
    this.columns.push(objBlue);
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
