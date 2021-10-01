import { requestUrl, request } from "@/utils/Http.js";

const ForecastStore = {
  namespaced: true,
  state: {
    dataInfo: {},
    baseInfo: {},
    dataTableInfo: { red: [], blue: [] },
  },
  mutations: {
    resetState(state) {
      state.dataInfo = {};
      state.baseInfo = {};
      state.dataTableInfo = { red: [], blue: [] };
    },
    setDataInfo(state, payload) {
      state.dataInfo = payload;
    },
    setBaseInfo(state, payload) {
      state.baseInfo = payload;
    },
    addDataTableRedInfo(state, payload) {
      state.dataTableInfo.red.push(payload);
    },
    addDataTableBlueInfo(state, payload) {
      state.dataTableInfo.blue.push(payload);
    },
    setDataTableRedSelectedInfoByKey(state, payload) {
      for (var i = 0; i < state.dataTableInfo.red.length; i++) {
        state.dataTableInfo.red[i].selected = false;
        if (state.dataTableInfo.red[i].key == payload) {
          state.dataTableInfo.red[i].selected = true;
        }
      }
    },
    setDataTableBlueSelectedInfoByKey(state, payload) {
      for (var i = 0; i < state.dataTableInfo.blue.length; i++) {
        state.dataTableInfo.blue[i].selected = false;
        if (state.dataTableInfo.blue[i].key == payload) {
          state.dataTableInfo.blue[i].selected = true;
        }
      }
    },
    setDataTableRedSelectedInfo(state, payload) {
      for (var i = 0; i < state.dataTableInfo.red.length; i++) {
        state.dataTableInfo.red[i].selected = payload;
      }
    },
    setDataTableBlueSelectedInfo(state, payload) {
      for (var i = 0; i < state.dataTableInfo.blue.length; i++) {
        state.dataTableInfo.blue[i].selected = payload;
      }
    },
  },
  actions: {
    setDataInfoAction(context, payload) {
      return new Promise((resolve) => {
        var param = {};
        if (Object.keys(context.state.dataInfo).length > 0) {
          param[context.state.dataInfo.pageQueryParam] = payload.pageQueryParam;
          param[context.state.dataInfo.pageSizeQueryParam] =
            payload.pageSizeQueryParam;
        }
        request(
          requestUrl(
            context.state.baseInfo.url,
            "get",
            context.state.baseInfo.ascription,
            param
          ),
          "get"
        ).then((response) => {
          // 2、处理正常的数据逻辑
          context.commit("setDataInfo", response.data);
          resolve(response.data);
        });
      });
    },
  },
  getters: {
    getDataInfoLength(state) {
      return Object.keys(state.dataInfo).length;
    },
    getDataInfoDataByIndex(state, getter) {
      return function (index) {
        if (getter.getDataInfoLength > 0) {
          return state.dataInfo.data[index];
        }
      };
    },
    getDataInfoItemByKey(state, getter) {
      return function (key) {
        if (getter.getDataInfoLength > 0) {
          return state.dataInfo[key];
        }
      };
    },
    redAnalysisByIndex(state, getter) {
      return function (index) {
        if (getter.getDataInfoLength > 0) {
          var name = state.dataTableInfo.red[index - 1].name;
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
            var red = JSON.parse(element.redBall);
            var IssueNumber = element.IssueNumber;
            echartsData.push({
              IssueNumber: IssueNumber,
              value: red[index - 1] % state.dataTableInfo.red[index - 1].value,
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
          return { legend: legend, xAxis: xAxis, series: series };
        }
      };
    },
    redAnalysis(state, getter) {
      return function () {
        if (getter.getDataInfoLength > 0) {
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
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
              var value = rv % state.dataTableInfo.red[i].value;
              redTempData[i] instanceof Array
                ? redTempData[i].push(value)
                : (redTempData[i] = [value]);
            });
          });

          redTempData.forEach((element, index) => {
            var name = state.dataTableInfo.red[index].name;
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
          return { legend: legend, xAxis: xAxis, series: series };
        }
      };
    },
    blueAnalysisByIndex(state, getter) {
      return function (index) {
        if (getter.getDataInfoLength > 0) {
          var name = state.dataTableInfo.blue[index - 1].name;
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
            var blue = JSON.parse(element.blueBall);
            var IssueNumber = element.IssueNumber;
            echartsData.push({
              IssueNumber: IssueNumber,
              value:
                blue[index - 1] % state.dataTableInfo.blue[index - 1].value,
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
          return { legend: legend, xAxis: xAxis, series: series };
        }
      };
    },
    blueAnalysis(state, getter) {
      return function () {
        if (getter.getDataInfoLength > 0) {
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
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
              var value = rv % state.dataTableInfo.blue[i].value;
              blueTempData[i] instanceof Array
                ? blueTempData[i].push(value)
                : (blueTempData[i] = [value]);
            });
          });

          blueTempData.forEach((element, index) => {
            var name = state.dataTableInfo.blue[index].name;
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
          return { legend: legend, xAxis: xAxis, series: series };
        }
      };
    },
    analysis(state, getter) {
      return function () {
        if (getter.getDataInfoLength > 0) {
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
            var red = JSON.parse(element.redBall);
            var blue = JSON.parse(element.blueBall);
            var IssueNumber = element.IssueNumber;
            echartsData.push({
              IssueNumber: IssueNumber,
              red: red,
              blue: blue,
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
              var value = rv % state.dataTableInfo.red[i].value;
              redTempData[i] instanceof Array
                ? redTempData[i].push(value)
                : (redTempData[i] = [value]);
            });
            element.blue.forEach((rv, i) => {
              var value = rv % state.dataTableInfo.blue[i].value;
              blueTempData[i] instanceof Array
                ? blueTempData[i].push(value)
                : (blueTempData[i] = [value]);
            });
          });

          redTempData.forEach((element, index) => {
            var name = state.dataTableInfo.red[index].name;
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
            var name = state.dataTableInfo.blue[index].name;
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
          return { legend: legend, xAxis: xAxis, series: series };
        }
      };
    },
    getDataTableRedInfoLength(state) {
      return state.dataTableInfo.red.length;
    },
    getDataTableRedInfo(state) {
      return state.dataTableInfo.red;
    },
    getDataTableRedInfoByIndex(state, getter) {
      return function (index) {
        if (getter.getDataTableRedInfoLength > 0) {
          return state.dataTableInfo.red[index];
        }
      };
    },
    getDataTableBlueInfoLength(state) {
      return state.dataTableInfo.blue.length;
    },
    getDataTableBlueInfo(state) {
      return state.dataTableInfo.blue;
    },
    getDataTableBlueInfoByIndex(state, getter) {
      return function (index) {
        if (getter.getDataTableBlueInfoLength > 0) {
          return state.dataTableInfo.blue[index];
        }
      };
    },
  },
};

export default ForecastStore;
