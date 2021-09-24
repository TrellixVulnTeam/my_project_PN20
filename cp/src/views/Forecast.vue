<template>
  <div class="Forecast">
    <DataView> </DataView>
  </div>
</template>

<script>
import DataView from "@/components/StandardView.vue";

export default {
  name: "Forecast",
  components: { DataView },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
</style>
