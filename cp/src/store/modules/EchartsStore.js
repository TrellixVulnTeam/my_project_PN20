const EchartsStore = {
  namespaced: true,
  state: {
    visible: false,
    viewTitle: "",
    legend: {},
    xAxis: [],
    series: [],
    ascription: "",
  },
  mutations: {
    resetState(state) {
      state.visible = false;
      state.viewTitle = "";
      state.legend = {};
      state.xAxis = [];
      state.series = [];
    },
    setVisible(state, payload) {
      state.visible = payload;
    },
    setViewTitle(state, payload) {
      state.viewTitle = payload;
    },
    setLegend(state, payload) {
      state.legend = payload;
    },
    setXAxis(state, payload) {
      state.xAxis = payload;
    },
    setSeries(state, payload) {
      state.series = payload;
    },
    setAscription(state, payload) {
      state.ascription = payload;
    },
  },
  actions: {},
  getters: {
    getDataTableInfo(state, getter, rootState) {
      return rootState[state.ascription].dataTableInfo;
    },
    redAnalysisByIndex(state, getter, rootState, rootGetters) {
      return rootGetters[state.ascription + "/redAnalysisByIndex"];
    },
    blueAnalysisByIndex(state, getter, rootState, rootGetters) {
      return rootGetters[state.ascription + "/blueAnalysisByIndex"];
    },
  },
};

export default EchartsStore;
