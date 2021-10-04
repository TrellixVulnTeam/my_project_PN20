var DataMixins = {
  inject: ["reload"],
  data: function () {
    return {
      //表格分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["100", "200", "500", "2000"], // 每页数量选项
        showTotal: (total) => this.$t("language.ShowTotal").format(total), // 显示总数
        onShowSizeChange: (current, pageSize) =>
          this.changePageSize(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.changePage(page, pageSize), //点击页码事件
        total: 0, //总条数
        showQuickJumper: true, //显示跳转输入框
      },
      currentPage: 1,
      theme: {},
    };
  },
  created: function () {
    this.resetState();
    this.setBaseInfo(this.$route.query);
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
      if (this.theme.change == true) {
        var key = this.getDataTableRedInfoByIndex(cell - 1).key;
        this.setDataTableRedSelectedInfoByKey(key);
        this.setDataTableBlueSelectedInfo(false);
      }
      var data = this.redAnalysisByIndex(cell);
      this.setVisible(true);
      this.setViewTitle(data.name);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    blueAnalysisClick: function (cell) {
      console.log("blueAnalysisClick", cell);
      if (this.theme.change == true) {
        var key = this.getDataTableBlueInfoByIndex(cell - 1).key;
        this.setDataTableBlueSelectedInfoByKey(key);
        this.setDataTableRedSelectedInfo(false);
      }
      var data = this.blueAnalysisByIndex(cell);
      this.setVisible(true);
      this.setViewTitle(data.name);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisClick: function () {
      if (this.theme.change == true) {
        this.setDataTableBlueSelectedInfo(true);
        this.setDataTableRedSelectedInfo(true);
      }
      var data = this.analysis();
      this.setVisible(true);
      this.setViewTitle(data.name);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisRedClick: function () {
      if (this.theme.change == true) {
        this.setDataTableRedSelectedInfo(true);
        this.setDataTableBlueSelectedInfo(false);
      }
      var data = this.redAnalysis();
      this.setVisible(true);
      this.setViewTitle(data.name);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
    analysisBlueClick: function () {
      if (this.theme.change == true) {
        this.setDataTableBlueSelectedInfo(true);
        this.setDataTableRedSelectedInfo(false);
      }
      var data = this.blueAnalysis();
      this.setVisible(true);
      this.setViewTitle(data.name);
      this.setLegend(data.legend);
      this.setXAxis(data.xAxis);
      this.setSeries(data.series);
    },
  },
};

export default DataMixins;
