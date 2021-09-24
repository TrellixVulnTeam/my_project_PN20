<template>
  <div class="Summary">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from "@/components/SummaryData.vue";

export default {
  name: "Summary",
  components: {
    DataView,
  },
  inject: ["reload"],
  data: function () {
    return {};
  },
  created: function () {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
