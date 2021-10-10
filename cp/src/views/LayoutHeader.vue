<template>
  <div class="LayoutHeader">
    <a-row type="flex" justify="space-around">
      <a-col :span="1">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="onClickCollapsedCallBack"
        />
      </a-col>
      <a-col :span="16">
        <CustomAudio></CustomAudio>
      </a-col>
      <a-col :span="6">
        <a-space :size="size">
          <a-switch default-checked @change="onChangLanguage" />
          <span
            >{{ $t("language.Characters") }}/{{ $t("language.Language") }}</span
          >
          <a-date-picker @change="onChange" size="default" />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CustomAudio from "@/components/CustomAudio.vue";

export default {
  name: "LayoutHeader",
  components: {
    CustomAudio,
  },
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
  },
};
</script>

<style lang="scss" scoped>
.LayoutHeader {
  width: 100%;
  height: 100%;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>
