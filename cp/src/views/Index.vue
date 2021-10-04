<template>
  <div class="Index">
    <a-calendar
      :fullscreen="false"
      @panelChange="onPanelChange"
      :value="$moment()"
    >
    </a-calendar>
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
    onPanelChange: function () {},
  },
};
</script>

<style lang="scss" scoped>
// .Index {
// }
</style>
