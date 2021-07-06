<template>
  <div class="chiaBox flexbox vertical">
    <header class="page-header flexbox align-center justify-center">
      <custom-tabs
        v-model="activeTab"
        :tab-list="tabList"
        @tab-click="onChangeTab"
      />
    </header>
    <main class="page-body flex-fill flexbox vertical">
      <router-view :language="language"></router-view>
    </main>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CustomTabs from '@/views/components/CustomTabs';
import store from '@/stores/store';

export default {
  beforeRouteEnter(to, from, next) {
    if (
      store?.state?.companyList?.length != 0 &&
      store?.state?.companyList?.includes('gpu')
    ) {
      next();
    } else {
      next('/bypass');
    }
  },
  components: {
    CustomTabs,
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeTab: '',
      isShow: true,
      hasTasks: false,
      timer: null,
    };
  },
  computed: {
    ...mapGetters(['factoryId', 'chiaList', 'language']),
    tabList() {
      // const p_miner = {
      //   name: 'chialist',
      //   title: 'P盘监控',
      // };
      let tabs = [];
      // if (!this.chiaList) return tabs;
      // this.chiaList.forEach(it => {
      //   if (it === 'p_miner') {
      //     tabs.push(p_miner);
      //   }
      // });
      tabs = [
        // { name: 'graphicspool', title: '矿池' },
        { name: 'graphicslist', title: `${this.$t('home.graphics.qzynwn1')}` },
        { name: 'graphicserror', title: `${this.$t('home.graphics.qzynwn2')}` },
      ];
      return tabs;
    },
  },
  created() {
    // this.activeTab =
    //   this.$route.query.activeTab ||
    //   (this.tabList.length == 0 ? '' : this.tabList[0].name);
  },

  watch: {
    $route: {
      handler(v, o) {
        if (v.name !== o?.name) {
          this.activeTab = v.name || this.tabList[0].name;
          console.log(this.activeTab);
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChangeTab(name) {
      const m = {
        graphicspool: 'graphicspool',
        graphicslist: 'graphicslist',
        graphicserror: 'graphicserror',
      };
      this.$router
        .push({
          name: m[name],
          query: {},
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.chiaBox {
  .page-header {
    position: relative;
    .iconfont {
      position: absolute;
      right: 24px;
    }
  }
  .page-body {
    background-color: #f6f6f6;
  }
}
.tabs {
  width: 260px;
  font-weight: 500;
  color: rgba(51, 51, 51, 0.85);
  /deep/.el-tabs__item {
    height: 56px;
    font-size: 18px;
    line-height: 56px;
    text-align: center;
    &:hover {
      color: #0d2856;
    }
  }
  /deep/.el-tabs__header {
    margin: 0;
  }
  /deep/.is-active {
    color: #0d2856;
    font-size: 24px;
  }
  /deep/.el-tabs__active-bar {
    // width: 139px !important;
    height: 4px;
    background-color: #0d2856;
    // transform: translateX(138px) !important;
  }
  /deep/.el-tabs__nav-wrap::after {
    display: none;
  }
}
.task-icon {
  position: relative;
  font-size: 24px !important;
  &.active {
    &::after {
      position: absolute;
      content: '';
      top: -3px;
      right: -7px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ff4d4f;
    }
  }
}
</style>
