<template>
  <div class="ColdAndHot">
    <DataView></DataView>
  </div>
</template>

<script>
import DataView from "@/components/FullData.vue";

export default {
  name: "ColdAndHot",
  components: { DataView },
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
