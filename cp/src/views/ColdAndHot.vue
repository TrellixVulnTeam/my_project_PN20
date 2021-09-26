<template>
  <div class="ColdAndHot">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/ColdAndHotData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

export default {
  name: "ColdAndHot",
  components: { DataComponent, ViewComponent },
  inject: ["reload"],
  data: function () {
    return {};
  },
  created: function () {
    this.setAscription("ColdAndHotStore");
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
