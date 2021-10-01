<template>
  <div class="Forecast">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/ForecastData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

export default {
  name: "Forecast",
  components: { DataComponent, ViewComponent },
  inject: ["reload"],
  data: function () {
    return {};
  },
  mounted: function () {
    console.log("Forecast");
    this.setAscription("ForecastStore");
  },
  watch: {},
  methods: {
    ...mapMutations("EchartsStore", {
      setAscription: "setAscription",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
