const EchartsStore = {
  namespaced: true,
  state: {
    visible: false,
    viewTitle: "",
    legend: {},
    xAxis: [],
    series: [],
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
  },
  actions: {},
  getters: {},
};

export default EchartsStore;
