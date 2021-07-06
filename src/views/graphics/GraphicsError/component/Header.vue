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
            <span class="f-16 color-6">{{
              $t('home.graphics.GraphicsError.Header.qzynwz1')
            }}</span>
            <div class="mt-ms">
              <span class="f-24 color-3">{{
                headerData.generalError | empty
              }}</span>
              <span class="ml-s f-12">{{
                $t('home.graphics.GraphicsError.Header.qzynwz2')
              }}</span>
            </div>
          </div>
          <div class="status-item flexbox align-center space-bt">
            <div class="">
              <div class="">
                <el-checkbox-button label="temperature_anomaly">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">
                      {{ $t('home.graphics.GraphicsError.Header.qzynwz3') }}
                    </div>
                    <div class="color-3">
                      {{ headerData.temperatureAnomaly | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
              </div>
              <el-checkbox-button class="mt-14" label="high_reject_rate">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">
                    {{ $t('home.graphics.GraphicsError.Header.qzynwz4') }}
                  </div>
                  <div class="color-3">
                    {{ headerData.highRejectRate | empty }}
                  </div>
                </div>
              </el-checkbox-button>
            </div>
          </div>
          <div class="status-item flexbox align-center space-bt">
            <div class="">
              <span class="f-16 color-6">{{
                $t('home.graphics.GraphicsError.Header.qzynwz5')
              }}</span>
              <div class="mt-ms">
                <span class="f-24 color-3">{{
                  headerData.lowCalc | empty
                }}</span>
                <span class="ml-s f-12 color-9">{{
                  $t('home.graphics.GraphicsError.Header.qzynwz2')
                }}</span>
              </div>
            </div>
            <div class="ml-xl">
              <div class="">
                <el-checkbox-button label="low_calculation">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">
                      {{ $t('home.graphics.GraphicsError.Header.qzynwz6') }}
                    </div>
                    <div class="color-3">
                      {{ headerData.lowCalculation | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
              </div>
              <el-checkbox-button class="mt-14" label="un_calculation">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">
                    {{ $t('home.graphics.GraphicsError.Header.qzynwz7') }}
                  </div>
                  <div class="color-3">
                    {{ headerData.unCalculation | empty }}
                  </div>
                </div>
              </el-checkbox-button>
            </div>
          </div>
          <div class="status-item flexbox align-center space-bt">
            <div class="">
              <span class="f-16 color-6">{{
                $t('home.graphics.GraphicsError.Header.qzynwz8')
              }}</span>
              <div class="mt-ms">
                <span class="f-24 color-3">{{
                  headerData.invalid | empty
                }}</span>
                <span class="ml-s f-12 color-9">{{
                  $t('home.graphics.GraphicsError.Header.qzynwz2')
                }}</span>
              </div>
            </div>
            <div class="ml-xl">
              <div class="">
                <el-checkbox-button label="mining_stoppage">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">
                      {{ $t('home.graphics.GraphicsError.Header.qzynwz9') }}
                    </div>
                    <div class="color-3">
                      {{ headerData.miningStoppage | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
                <el-checkbox-button class="ml-xl" label="not_configure">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">
                      {{ $t('home.graphics.GraphicsError.Header.qzynwz10') }}
                    </div>
                    <div class="color-3">
                      {{ headerData.notConfigure | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
                <el-checkbox-button class="ml-xl" label="off_line">
                  <div class="btn-content flexbox align-center space-bt">
                    <div class="mr-m">
                      {{ $t('home.graphics.GraphicsError.Header.qzynwz11') }}
                    </div>
                    <div class="color-3">
                      {{ headerData.offLine | empty }}
                    </div>
                  </div>
                </el-checkbox-button>
              </div>
              <el-checkbox-button class="mt-14" label="stop_card">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">
                    {{ $t('home.graphics.GraphicsError.Header.qzynwz12') }}
                  </div>
                  <div class="color-3">{{ headerData.stopCard | empty }}</div>
                </div>
              </el-checkbox-button>
              <el-checkbox-button class="ml-xl" label="loss_card">
                <div class="btn-content flexbox align-center space-bt">
                  <div class="mr-m">
                    {{ $t('home.graphics.GraphicsError.Header.qzynwz13') }}
                  </div>
                  <div class="color-3">{{ headerData.lossCard | empty }}</div>
                </div>
              </el-checkbox-button>
            </div>
          </div>
        </el-checkbox-group>
        <div class="btn-group flexbox justify-center vertical" :class="language">
          <el-select
            class="ml-s"
            size="small"
            v-model="templateId"
            @change="onWorkerChange"
          >
            <el-option
              class="f-14"
              :label="$t('home.graphics.GraphicsError.Header.qzynwz14')"
              value
            ></el-option>
            <el-option
              v-for="(item, index) in templateIdList"
              :label="item.name"
              :value="item.id + ''"
              :key="index"
            >
            </el-option>
          </el-select>
          <el-button
            class="more-filter flexbox align-center f-14 ml-s mt-m"
            :class="[{ active: querySelected }]"
            @click.stop="onMoreFilters"
            size="small"
            plain
          >
            <div class="flexbox align-center">
              <span class="btn-name">{{
                $t('home.graphics.GraphicsError.Header.qzynwz15')
              }}</span>
              <i class="iconfont icon-filter iconBox ml-s"></i>
            </div>
          </el-button>
        </div>
      </div>
    </div>
    <Common-filter
      @change="onFilterChange"
      ref="filter"
      :filter-list="filterList"
      :filter-data="filterData"
      :show-labels="showLabels"
    />
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex';
import { switchUnit } from '@/handle/index';
import { getTemplateIdList } from '@/../common-module/api/graphics';
import CommonFilter from '@/views/components/CommonFilter';
import { $t } from '@/plugins/i18n';

export default {
  props: {
    headerData: {
      type: Object,
      default: () => {},
    },
    selectListData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      statusSelectedList: [],
      templateIdList: [],
      templateId: '',
      repairingOrderNum: 0,
      repairingMinerNum: 0,
      // 筛选内容
      filterList: [
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz16'),
          options: [],
          key: 'gpuTypes',
          type: 'Multiple',
          optionsKey: 'gpuTypeList', // 重新获取值使用，与data中对应
        },
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz17'),
          options: [],
          key: 'gpuModels',
          type: 'Multiple',
          optionsKey: 'gpuModelList',
        },
        // {
        //   title: $t('home.graphics.GraphicsError.Header.qzynwz18'),
        //   options: [],
        //   key: 'memoryModels',
        //   type: 'Multiple',
        //   optionsKey: 'memoryModelList',
        // },
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz19'),
          options: [],
          key: 'memorySizes',
          type: 'Multiple',
          optionsKey: 'memorySize',
        },
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz20'),
          options: [],
          key: 'coinTypes',
          type: 'Multiple',
          optionsKey: 'coinTypeList',
        },
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz21'),
          options: [],
          key: 'poolTypes',
          type: 'Multiple',
          optionsKey: 'poolTypeList',
        },
        {
          title: $t('home.graphics.GraphicsError.Header.qzynwz22'),
          options: [],
          key: 'statuses',
          type: 'Multiple',
          optionsKey: 'statusList',
        },
      ],
      // 选中项
      filterData: {},
      // tabs展示项
      showLabels: [
        'gpuTypes',
        'gpuModels',
        'memoryModels',
        'memorySizes',
        'coinTypes',
        'poolTypes',
      ],
      // 附加展示项
      // extraShowLabels: { statuses: { value: 'normal' } },
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'language',
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
    querySelected() {
      let flag = false;
      for (let item in this.filterData) {
        if (this.filterData[item]?.length > 0) {
          flag = true;
        }
      }
      return flag;
    },
  },
  watch: {
    $route: {
      handler(v) {
        const {
          gpuTypes,
          gpuModels,
          memoryModels,
          memorySizes,
          coinTypes,
          poolTypes,
          statuses,
        } = v.query;
        this.statusSelectedList =
          statuses?.split?.(',')?.filter?.(it => it) || [];
        // 遍历从路由获取数据，确保数据干净
        this.filterData = {
          gpuTypes,
          gpuModels,
          memoryModels,
          memorySizes,
          coinTypes,
          poolTypes,
          statuses,
        };
      },
      immediate: true,
    },
    selectListData: {
      deep: true,
      handler(selectListData) {
        // 给配置列filterList增加options
        this.filterList.forEach(item => {
          selectListData[item.optionsKey] &&
            (item.options = selectListData[item.optionsKey]);
        });
      },
      immediate: true,
    },
    factoryId: {
      handler(value) {
        if (value) {
          this.getTemplateIdList();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.templateId = this.$route.query.templateId || '';
  },
  components: { CommonFilter },
  methods: {
    switchUnit,
    // 数据总览点击
    onStatusChange(items) {
      if (items) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            abnormalOnly: undefined,
          },
        });
      }
      this.statusSelectedList =
        this.$route.query?.statuses?.split?.(',')?.filter?.(it => it) || [];
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            statuses: items.filter?.(it => it).join(','),
          },
        })
        .catch(err => err);
      //改变筛选项数据
      this.filterData = {
        ...this.filterData,
        statuses: items.filter?.(it => it).join(','),
      };
      this.$emit('filter-change');
    },
    onWorkerChange() {
      this.$router
        .replace({
          query: {
            ...this.$route.query,
            templateId: this.templateId,
          },
        })
        .catch(err => err);
      this.$emit('filter-change');
    },
    onMoreFilters() {
      this.$refs.filter.onDrawerShow();
    },
    onFilterChange(filter) {
      this.filterData = filter;
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
    getTemplateIdList() {
      getTemplateIdList({ factoryId: this.factoryId }).then(res => {
        this.templateIdList = res.data || [];
        this.templateId = '';
        this.$router.replace({
          query: {
            ...this.$route.query,
            templateId: undefined,
          },
        });
      });
    },
  },
  mounted() {
    // const query = this.$refs.filter.getSelectedValues();
    // const labels = this.$refs.filter.getSelectedLabels();
    // this.onFilterChange(query, labels);
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
    height: 28px;
    padding: 0;
    // background-color: rgba(246, 246, 246, 0.85);
    line-height: 28px;
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
    height: 28px;
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
  &.en {
    width: 148px;
  }
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
.more-filter{
  position: relative;
  .iconBox{
    position: absolute;
    right: 16px;
    top: -1px;
  }

}
</style>
