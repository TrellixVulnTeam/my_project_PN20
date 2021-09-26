<template>
  <div class="Quotient">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/QuotientData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

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
  created: function () {
    this.setAscription("QuotientStore");
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
