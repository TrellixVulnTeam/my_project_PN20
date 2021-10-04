<template>
  <div class="Index">
    <a-date-picker @change="onChange" @ok="onOk" size="default" />
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {},
  data: function () {
    return {};
  },
  created: function () {},
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
  },
};
</script>

<style lang="scss" scoped>
// .Index {
// }
</style>
