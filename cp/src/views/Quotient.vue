<template>
  <div class="Quotient">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from "@/components/QuotientData.vue";

export default {
  name: "Quotient",
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
