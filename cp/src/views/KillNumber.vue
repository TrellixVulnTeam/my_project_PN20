<template>
  <div class="KillNumber">
    <DataComponent></DataComponent>
    <ViewComponent></ViewComponent>
  </div>
</template>

<script>
import DataComponent from "@/components/KillNumberData.vue";
import ViewComponent from "@/components/StandardView.vue";
import { mapMutations } from "vuex";

export default {
  name: "KillNumber",
  components: {
    DataComponent,
    ViewComponent,
  },
  inject: ["reload"],
  data: function () {
    return {};
  },
  created: function () {
    this.setAscription("KillNumberStore");
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
