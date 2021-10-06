<template>
  <div class="nav">
    <a-menu
      mode="inline"
      theme="dark"
      :open-keys="openKeys"
      :selectedKeys="selectedKeys"
      @openChange="onOpenChange"
    >
      <template v-for="(item, index) in navList">
        <a-menu-item
          v-if="
            typeof item.children == 'undefined' || item.children.length <= 0
          "
          :key="'menu' + index"
        >
          <span
            ><a-icon :type="item.type" /><span
              @click="menuClick(item, 'menu' + index)"
              >{{ $t("language." + item.name) }}</span
            ></span
          >
        </a-menu-item>
        <a-sub-menu v-else :key="'menu' + index">
          <span slot="title"
            ><a-icon :type="item.type" /><span>{{
              $t("language." + item.name)
            }}</span></span
          >
          <a-menu-item
            v-for="(cell, cellIndex) in item.children"
            :key="cellIndex"
          >
            <span
              ><a-icon :type="cell.type" /><span
                @click="titleClick(cell, item, 'menu' + index, cellIndex)"
                >{{ $t("language." + cell.name) }}</span
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
    return {
      rootSubmenuKeys: [],
      openKeys: ["menu0"],
      selectedKeys: ["menu0"],
    };
  },
  watch: {
    "$route.path": function () {},
    navList: function (val) {
      val.forEach((element, index) => {
        this.rootSubmenuKeys.push("menu" + index);
      });
      console.log("this.rootSubmenuKeys", this.rootSubmenuKeys);
    },
  },
  created: function () {},
  methods: {
    menuClick: function (obj, key) {
      console.log("menuClick", obj, key);
      this.openKeys = [];
      this.selectedKeys = [key];
      this.$router.push({
        path: typeof obj.localPath == "undefined" ? "/" : obj.localPath,
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
    titleClick: function (obj, item, key, index) {
      console.log("titleClick", obj, item, key, index);
      this.selectedKeys = [key, index];
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
      var latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );

      if (typeof latestOpenKey != "undefined") {
        this.selectedKeys = [latestOpenKey, 0];
        var item = this.navList[parseInt(latestOpenKey.slice(4))];
        this.titleClick(item.children[0], item, latestOpenKey, 0);
      }

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
