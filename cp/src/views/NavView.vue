<template>
  <div class="nav">
    <a-menu
      mode="inline"
      theme="dark"
      :open-keys="openKeys"
      @openChange="onOpenChange"
    >
      <template v-for="(item, index) in navList">
        <a-menu-item
          v-if="typeof item.children == 'undefined'"
          :key="index + 1"
        >
          <span
            ><a-icon :type="item.type" /><span @click="menuClick(item)">{{
              item.name
            }}</span></span
          >
        </a-menu-item>
        <a-sub-menu v-else :key="index + 1">
          <span slot="title"
            ><a-icon :type="item.type" /><span>{{ item.name }}</span></span
          >
          <a-menu-item
            v-for="(cell, cellIndex) in item.children"
            :key="cellIndex"
          >
            <span
              ><a-icon :type="cell.type" /><span
                @click="titleClick(cell, item)"
                >{{ cell.name }}</span
              ></span
            >
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
export default {
  name: "NavView",
  props: {
    navList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data: function () {
    return { rootSubmenuKeys: [], openKeys: [1] };
  },
  watch: {
    "$route.path": function () {},
    navList: function (val) {
      val.forEach((element, index) => {
        this.rootSubmenuKeys.push(index + 1);
      });
      console.log("this.rootSubmenuKeys", this.rootSubmenuKeys);
    },
  },
  created: function () {},
  methods: {
    menuClick: function (obj) {
      console.log("menuClick", obj);
      this.$router.push({
        path: obj.localPath,
        query: {
          url: obj.netPath,
          ascription: obj.ascriptionType,
          rule: obj.rule,
          name: obj.name,
          reptile: obj.reptile,
          killNumberRules: obj.killNumberRules,
        },
      });
    },
    titleClick: function (obj, item) {
      console.log("titleClick", obj);
      this.$router.push({
        path: obj.localPath,
        query: {
          url: obj.netPath,
          ascription: obj.ascription,
          rule: item.rule,
          name: item.name,
          reptile: item.reptile,
          killNumberRules: item.killNumberRules,
        },
      });
    },
    onOpenChange(openKeys) {
      console.log("openKeys", openKeys);
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 100%;
}
</style>
