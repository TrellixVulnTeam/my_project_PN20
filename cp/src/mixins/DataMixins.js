var DataMixins = {
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
  watch: {
    $route() {
      this.reload();
    },
    "$route.path": function () {},
  },
  methods: {},
};

export default DataMixins;
