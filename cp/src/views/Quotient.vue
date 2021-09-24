<template>
  <div class="Quotient">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/QuotientData.vue";
import ViewComponent from "@/components/StandardView.vue";

export default {
  name: "Quotient",
  components: {
    DataComponent,
    ViewComponent,
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
