<template>
  <div class="KillNumber">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from "@/components/KillNumberData.vue";

export default {
  name: "KillNumber",
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
