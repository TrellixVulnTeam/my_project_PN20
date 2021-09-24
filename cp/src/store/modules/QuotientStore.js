import { requestUrl, request } from "@/utils/Http.js";

const QuotientStore = {
  namespaced: true,
  state: {
    dataInfo: {},
    baseInfo: {},
    dataTableInfo: { red: [], blue: [] },
  },
  mutations: {
    setDataInfo(state, payload) {
      state.dataInfo = payload;
    },
    setBaseInfo(state, payload) {
      state.baseInfo = payload;
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
          var name = "红球号码" + index;
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
            var red = JSON.parse(element.redBall);
            var IssueNumber = element.IssueNumber;
            echartsData.push({
              IssueNumber: IssueNumber,
              value: Math.ceil(
                red[index - 1] / state.dataTableInfo.red[index - 1].value
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
              var value = Math.ceil(rv / state.dataTableInfo.red[i].value);
              redTempData[i] instanceof Array
                ? redTempData[i].push(value)
                : (redTempData[i] = [value]);
            });
          });

          redTempData.forEach((element, index) => {
            var name = state.dataTableInfo.red[index].key.slice(3);
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
          var name = "蓝球号码" + index;
          var echartsData = [];
          state.dataInfo.data.forEach((element) => {
            var blue = JSON.parse(element.blueBall);
            var IssueNumber = element.IssueNumber;
            echartsData.push({
              IssueNumber: IssueNumber,
              value: Math.ceil(
                blue[index - 1] / state.dataTableInfo.blue[index - 1].value
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
              var value = Math.ceil(rv / state.dataTableInfo.blue[i].value);
              blueTempData[i] instanceof Array
                ? blueTempData[i].push(value)
                : (blueTempData[i] = [value]);
            });
          });

          blueTempData.forEach((element, index) => {
            var name = state.dataTableInfo.blue[index].key.slice(4);
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
              var value = Math.ceil(rv / state.dataTableInfo.red[i].value);
              redTempData[i] instanceof Array
                ? redTempData[i].push(value)
                : (redTempData[i] = [value]);
            });
            element.blue.forEach((rv, i) => {
              var value = Math.ceil(rv / state.dataTableInfo.blue[i].value);
              blueTempData[i] instanceof Array
                ? blueTempData[i].push(value)
                : (blueTempData[i] = [value]);
            });
          });

          redTempData.forEach((element, index) => {
            var name = state.dataTableInfo.red[index].key;
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
            var name = state.dataTableInfo.blue[index].key;
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
  },
};

export default QuotientStore;
