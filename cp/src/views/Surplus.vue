<template>
  <div class="Surplus">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/SurplusData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

export default {
  name: "Surplus",
  components: {
    DataComponent,
    ViewComponent,
  },
  inject: ["reload"],
  data: function () {
    return {};
  },
  mounted: function () {
    console.log("Surplus");
    this.setAscription("SurplusStore");
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
