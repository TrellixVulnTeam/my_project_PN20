<template>
  <div class="Surplus">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from "@/components/SurplusData.vue";

export default {
  name: "Surplus",
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
