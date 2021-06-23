<!--  -->
<template>
  <el-header class="widget-header flexbox vertical" height="">
    <div class="header-content flexbox align-center justify-center">
      <div class="status-header flex-fill flexbox align-center space-bt">
        <el-checkbox-group
          class="status-bar flexbox align-center"
          v-model="statusSelectedList"
          @change="onStatusChange"
        >
          <div class="status-item">
            <span class="f-16 color-6">{{ $t('F8ajl8cRW5u5VTPppipwP') }}</span>
            <div class="mt-ms">
              <span class="f-24 color-3">{{ headerData.total | empty }}</span>
              <span class="ml-s f-12">{{ $t('yjogpvwzsokMJ3FWJCJcr') }}</span>
            </div>
          </div>
          <div class="status-item flexbox align-center space-bt">
            <div class="ml-xs">
              <div class="">
                <el-checkbox-button label="reclaiming">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">正在开垦</div>
                    <div class="color-3">
                      {{ headerData.reclaiming | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
                <el-checkbox-button class="ml-xl" label="no_reclaiming">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">不在开垦</div>
                    <div class="color-3">
                      {{ headerData.noReclaiming | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
                <el-checkbox-button class="ml-xl" label="warning">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">开垦异常</div>
                    <div class="color-3">{{ headerData.warning | empty }}</div>
                  </div>
                </el-checkbox-button>
              </div>

              <el-checkbox-button class="mt-14" label="close">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">软件关闭</div>
                  <div class="color-3">{{ headerData.close | empty }}</div>
                </div>
              </el-checkbox-button>
              <el-checkbox-button class="ml-xl" label="offline">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">离线</div>
                  <div class="color-3">{{ headerData.offline | empty }}</div>
                </div>
              </el-checkbox-button>
            </div>
          </div>
          <div class="status-item">
            <span class="f-16 color-6">总容量</span>
            <div class="mt-ms">
              <span class="f-24 color-3">{{
                switchUnit(headerData.totalCalcRT, 'GiB', 3, 1024).value | empty
              }}</span>
              <span class="ml-s f-12 color-9">{{
                switchUnit(headerData.totalCalcRT, 'GiB', 3, 1024).unit
              }}</span>
            </div>
          </div>
          <div class="status-item">
            <span class="f-16 color-6">总文件数</span>
            <div class="mt-ms">
              <span class="f-24 color-3">{{
                headerData.totalFileCount | empty
              }}</span>
              <span class="ml-s f-12 color-9">{{
                $t('yjogpvwzsokMJ3FWJCJcr')
              }}</span>
            </div>
          </div>
          <div class="status-item">
            <span class="f-16 color-6">总闲置空间</span>
            <div class="mt-ms">
              <span class="f-24 color-3">{{
                switchUnit(headerData.totalFreeSpace, 'GiB', 3, 1024).value
                  | empty
              }}</span>
              <span class="ml-s f-12 color-9">{{
                switchUnit(headerData.totalFreeSpace, 'GiB', 3, 1024).unit
              }}</span>
            </div>
          </div>
        </el-checkbox-group>
        <div class="btn-group flexbox justify-center vertical">
          <el-select
            class="ml-s"
            size="small"
            v-model="minerNamePrefix"
            @change="onWorkerChange"
          >
            <el-option class="f-14" label="全部矿机" value></el-option>
            <el-option
              v-for="(item, index) in minerNamePrefixList"
              :label="item"
              :value="item"
              :key="index"
            >
            </el-option>
          </el-select>
          <el-button
            class="more-filter flexbox align-center f-14 ml-s mt-m"
            :class="[{ active: (queryLabels || []).length > 0 }]"
            @click.stop="onMoreFilters"
            size="small"
            plain
          >
            <div class="flexbox align-center">
              <span class="btn-name">{{ $t('sVmxi7B7z1AdfbxH9aIBQ') }}</span>
              <i class="iconfont icon-filter ml-s"></i>
            </div>
          </el-button>
        </div>
      </div>
    </div>
    <chia-filter @change="onFilterChange" ref="filter" />
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';
import { switchUnit } from '@/handle/index';
import { getMinerNameList } from '@/../common-module/api/chia';
import ChiaFilter from '@/views/components/ChiaFilter';

export default {
  props: {
    headerData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      statusSelectedList: [],
      minerNamePrefixList: [],
      minerNamePrefix: '',
      repairingOrderNum: 0,
      repairingMinerNum: 0,
      queryLabels: [],
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'farms',
      'userKey',
      'factoryId',
      'dataView',
      'isFieldWorker',
      'opsOwnership',
      'maintainType',
      'owner',
      'miner',
    ]),
  },
  watch: {
    $route: {
      handler(v) {
        this.statusSelectedList =
          v.query?.status?.split?.(',')?.filter?.(it => it) || [];
      },
      immediate: true,
    },
  },
  created() {
    this.minerNamePrefix = this.$route.query.minerNamePrefix || '';
    this.getMinerNamePrefixList();
  },
  components: { ChiaFilter },
  methods: {
    switchUnit,
    onStatusChange(items) {
      this.statusSelectedList =
        this.$route.query?.status?.split?.(',')?.filter?.(it => it) || [];
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            status: items.filter?.(it => it).join(','),
          },
        })
        .catch(err => err);
      this.$refs.filter.setSelectedValues();
      this.queryLabels = this.$refs.filter.getSelectedLabels() || [];
      this.$emit('filter-change');
    },
    toRepaireList() {},
    onWorkerChange() {
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            minerNamePrefix: this.minerNamePrefix,
          },
        })
        .catch(err => err);
      this.$emit('filter-change');
    },
    onMoreFilters() {
      this.$refs.filter.onDrawerShow();
    },
    onFilterChange(filter, labels) {
      this.queryLabels = labels;
      if (filter.status) {
        this.statusSelectedList = filter.status.split(',') || [];
      }
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            ...filter,
          },
        })
        .catch(err => err);
      this.$emit('filter-change');
    },
    getMinerNamePrefixList() {
      getMinerNameList().then(res => {
        this.minerNamePrefixList = res.data;
      });
    },
  },
  mounted() {
    const query = this.$refs.filter.getSelectedValues();
    const labels = this.$refs.filter.getSelectedLabels();
    this.onFilterChange(query, labels);
  },
};
</script>
<style lang="scss" scoped>
/* @import '~./index.scss'; 引入scss类 */
.widget-header {
  border-bottom: 1px solid rgba(235, 237, 242, 1);
  padding: 15px 0;
  padding-top: 0;
  width: 100%;
  .header-content {
    height: 127px;
  }
}

.status-header {
  padding: 0;
  // padding-top: 8px;
  padding-right: 24px;
  // border-bottom: 1px solid #ecf0f7;
}
.status-bar {
  /deep/.el-checkbox-button__inner {
    min-width: 142px;
    height: 36px;
    padding: 0;
    // background-color: rgba(246, 246, 246, 0.85);
    line-height: 36px;
    border: 1px solid #fff;
    box-shadow: none;
    border-radius: 2px;
    color: #999;
    &:hover {
      background-color: rgba(61, 126, 255, 0.1);
      color: #999;
    }
    border: none;
  }
  /deep/.is-checked .el-checkbox-button__inner {
    height: 36px;
    background-color: rgba(61, 126, 255, 0.1);
    color: #3d7eff;
    .color-3 {
      color: #3d7eff;
    }
  }
  .mt-14 {
    margin-top: 14px;
  }
  .status-item {
    padding: 0 40px;
    font-weight: 500;
    &:not(:first-child) {
      border-left: 1px solid #ecf0f7;
    }
  }
  .btn-content {
    padding: 0 8px;
    border-radius: 2px;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-2 {
    flex: 1.5;
  }
}
.btn-group {
  width: 128px;
}
.el-select {
  /deep/.el-input__inner {
    padding: 0 20px;
  }
  /deep/.el-input__suffix {
    margin-right: 8px;
  }
  /deep/.el-icon-arrow-up::before {
    content: '\e6c1';
    color: #666;
  }
  &:hover {
    /deep/ .el-input__inner,
    /deep/.el-icon-arrow-up::before {
      border-color: #308af4;
      color: #308af4 !important;
    }
  }
}
</style>
