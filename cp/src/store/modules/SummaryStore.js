const SummaryStore = {
  namespaced: true,
  state: {
    dataInfo: [],
    baseInfo: [],
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
        setTimeout(() => {
          context.commit("setDataInfo", payload);
          resolve(); //resolve   ---》对应then
        }, 1000);
      });
    },
    setBaseInfoAction(context, payload) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("setBaseInfo", payload);
          resolve(); //resolve   ---》对应then
        }, 1000);
      });
    },
  },
  getters: {
    getRowByIndex(state, getter) {
      return function (index) {
        if (getter.getDataInfoLen > 0) {
          return state.dataInfo.data[index];
        }
      };
    },
    getItemByKey(state, getter) {
      return function (key) {
        if (getter.getDataInfoLen > 0) {
          return state.dataInfo[key];
        }
      };
    },
    getDataInfoLen(state) {
      return Object.keys(state.dataInfo).length;
    },
  },
};

export default SummaryStore;
