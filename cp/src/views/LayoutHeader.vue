<template>
  <div class="LayoutHeader">
    <a-row type="flex" justify="space-around">
      <a-col :flex="99">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="onClickCollapsedCallBack"
        />
      </a-col>
      <a-col :flex="1">
        <a-space :size="size">
          <a-switch default-checked @change="onChangLanguage" />
          <span
            >{{ $t("language.Characters") }}/{{ $t("language.Language") }}</span
          >
          <a-date-picker @change="onChange" @ok="onOk" size="default" />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Index",
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      size: "small",
    };
  },
  created: function () {},
  methods: {
    onChangLanguage() {
      this.$i18n.locale = this.$i18n.locale == "zh" ? "en" : "zh";
    },
    onClickCollapsedCallBack: function () {
      this.$emit("changeCllapsed", this.collapsed);
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
  },
};
</script>

<style lang="scss" scoped>
// .Index {
// }
</style>
