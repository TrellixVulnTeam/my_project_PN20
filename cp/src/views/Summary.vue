<template>
  <div class="Summary">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/SummaryData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

export default {
  name: "Summary",
  components: {
    DataComponent,
    ViewComponent,
  },
  inject: ["reload"],
  data: function () {
    return {};
  },
  mounted: function () {
    console.log("Summary");
    this.setAscription("SummaryStore");
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
