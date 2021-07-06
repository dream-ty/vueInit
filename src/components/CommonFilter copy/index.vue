<template>
  <div class="chia-filter">
    <!-- 选中的tabs -->
    <div
      class="filter-bar flexbox align-center"
      v-if="selectedLabelsShow.length"
    >
      <div class="flex-fill flexbox end">
        <div
          class="filter-item flexbox align-center"
          v-for="(item, index) in selectedLabelsShow"
          :key="index"
        >
          {{ item.text }}
          <span
            class="ml-s iconfont icon-close clickable"
            @click="onRemoveLabel(item.prop, item.value)"
          ></span>
        </div>
      </div>
      <div
        class="clickable theme-color ml-m clear-btn"
        v-show="selectedLabelsShow.length > 0"
        @click="onClearLabels"
      >
        {{$t('components.CommonFilter.uuas9d1')}}
      </div>
    </div>
    <!-- 弹窗抽屉 -->
    <el-drawer
      :title="$t('components.CommonFilter.uuas9d2')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="448px"
    >
      <div class="filter-title" slot="title">
        <span class="">{{$t('components.CommonFilter.uuas9d2')}}</span>
      </div>
      <div class="filter-container flexbox vertical">
        <div class="filter-content flex-fill">
          <template v-for="(item, index) in filterList">
            <section
              :class="index === 0 ? '' : 'mt-xl'"
              :key="item.key + index"
            >
              <div class="filter-label">
                {{ item.title }}
                <span class="font-size-tiny" v-if="item.type === 'Multiple'"
                  >{{$t('components.CommonFilter.uuas9d3')}}</span
                >
              </div>
              <custom-checkbox-group
                v-model="filterSelected[item.key]"
                :options="item.options || []"
                :is-single="item.type !== 'Multiple'"
              />
            </section>
          </template>
        </div>
        <div class="filter-footer flexbox align-center end">
          <el-button class="mr-m" type="text" @click="onReset">{{$t('components.CommonFilter.uuas9d4')}}</el-button>
          <el-button type="primary" @click="onConfirm">{{$t('components.CommonFilter.uuas9d5')}}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import CustomCheckboxGroup from '@/components/CustomCheckboxGroup';
export default {
  data() {
    return {
      drawerVisible: false,
      operatingSystemOptions: [],
      publicFingerprintOptions: [],
      selectedLabels: [],
      filterSelected: {}, //传递给抽屉的选中数据
    };
  },
  props: {
    // 筛选内容
    filterList: {
      type: Array,
      default: () => [],
    },
    // 选中项
    filterData: {
      type: Object,
      default: () => {},
    },
    // tabs展示项
    showLabels: {
      type: Array,
      default: () => [],
    },
    // 附加展示项
    extraShowLabels: {
      type: Object,
      default: () => {},
    },
  },
  components: { CustomCheckboxGroup },
  computed: {
    // 展示的tabs，用showLabels控制哪些类型可以展示, 默认全展示
    selectedLabelsShow() {
      let selectedLabels = this.selectedLabels;
      let showLabels = this.showLabels;
      if (this.showLabels.length === 0) {
        showLabels = Object.keys(this.filterListMapToKey);
      }
      return selectedLabels.filter(item => {
        if (this.extraShowLabels?.[item.prop]?.value === item.value) {
          return true;
        }
        return showLabels.includes(item.prop);
      });
    },
    // 生成filterList的map对象,方便查找数据
    filterListMapToKey() {
      const list = this.filterList;
      let mapData = this.getMapByList('key', list);
      return mapData;
    },
  },
  watch: {
    filterData: {
      deep: true,
      handler(value) {
        this.toFilterDataMap(value);
        this.selectedLabels = this.getSelectedLabels(this.filterSelected);
      },
      immediate: true,
    },
    filterList: {
      deep: true,
      handler() {
        this.selectedLabels = this.getSelectedLabels(this.filterSelected);
      },
      immediate: true,
    },
  },
  created() {
    // 初始化值
    // this.toFilterDataMap(this.filterData);
    // this.selectedLabels = this.getSelectedLabels(this.filterSelected);
    // this.$emit(
    //   'change',
    //   this.getSelectedValues(this.filterSelected),
    //   this.selectedLabels
    // );
  },
  methods: {
    onDrawerShow() {
      this.drawerVisible = true;
      this.toFilterDataMap(this.filterData);
    },
    onDrawerClose() {},
    // 数据转换，进入的数据逗号分割转成数组
    toFilterDataMap(filterData = {}) {
      let data = {};
      // 原有数据转换
      for (let key in filterData) {
        data[key] = filterData[key]?.split(',') || [];
      }
      // 数据补全
      this.filterList.forEach(item => {
        !data[item.key] && (data[item.key] = []);
      });
      this.filterSelected = data;
    },
    onReset() {
      this.toFilterDataMap();
    },
    onConfirm() {
      this.drawerVisible = false;
      // 设置tabs
      this.selectedLabels = this.getSelectedLabels(this.filterSelected);
      this.$emit(
        'change',
        this.getSelectedValues(this.filterSelected),
        this.selectedLabels
      );
    },
    // 清除单个tabs
    onRemoveLabel(prop, value) {
      this.removeQuery(prop, value);
      this.selectedLabels = this.getSelectedLabels(this.filterSelected);
      this.$emit(
        'change',
        this.getSelectedValues(this.filterSelected),
        this.selectedLabels
      );
    },
    // 清除所以tabs
    onClearLabels() {
      this.selectedLabels = this.getSelectedLabels();
      this.$emit('change', this.getSelectedValues(), this.getSelectedLabels());
    },
    // filterSelected删除部分
    removeQuery(prop, value) {
      if (Array.isArray(this.filterSelected[prop])) {
        this.filterSelected[prop].splice(
          this.filterSelected[prop].indexOf(value),
          1
        );
      } else {
        this.filterSelected[prop] = [];
      }
    },
    // values转换, 输出的数组转成逗号分割
    getSelectedValues(filterSelected = {}) {
      let values = { ...filterSelected };
      for (let key in values) {
        values[key] = values[key]?.join(',') || '';
      }
      // 数据补全
      this.filterList.forEach(item => {
        !values[item.key] && (values[item.key] = '');
      });
      return values;
    },
    // labels转换
    getSelectedLabels(filterSelected = {}) {
      const labels = [];
      for (let key in filterSelected) {
        // 找到数据的子对象
        let filterListItem = this.filterListMapToKey[key] || {};
        const { options = [], title = '' } = filterListItem;
        let optionsMap = this.getMapByList('value', options);
        // 通过选中的key从options中找到label
        filterSelected[key]?.forEach(valueItem => {
          valueItem &&
            labels.push({
              prop: key,
              value: valueItem,
              text: `${title}: ${optionsMap[valueItem]?.label || ''}`,
            });
        });
      }
      return labels;
    },
    // 从list提取map对象
    getMapByList(key = '', list = []) {
      if (!key) return {};
      let mapData = {};
      list.forEach(item => {
        item?.[key] && (mapData[item[key]] = item);
      });
      return mapData;
    },
  },
};
</script>
<style lang="scss" scoped>
$aaa: 57px;
.chia-filter {
  margin-bottom: -16px;
  .filter-bar {
    height: 40px;
    padding: 8px 24px;
    border-top: 1px solid #ecf0f7;
    .filter-item {
      height: 22px;
      padding: 4px 8px;
      background-color: rgba(61, 126, 255, 0.1);
      border-radius: 2px;
      line-height: 22px;
      border: 1px solid #3d7eff;
      color: #308af4;
      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }
}
.filter-title {
  font-size: 20px;
  font-weight: 500;
  color: #1b243f;
}
/deep/ .el-drawer__body{
  // height: calc(100% -57px);

  height: 100%;
}
.filter-container {
  position: relative;
  height: 100%;
  overflow: auto;
  padding-bottom: 117px;
  .filter-content {
    overflow: auto;
    // flex-grow: 1;
    // flex-shrink: 1;
    padding: 32px 24px;
    .filter-label {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .filter-footer {
    position: fixed;
    bottom: 0;
    width: 400px;
    height: 60px;
    padding: 0 24px;
    box-shadow: inset 0px 1px 0px #ecf0f7;
    background-color: #fff;
  }
}
/deep/.el-drawer__header {
  padding: 16px 24px;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.01);
  box-shadow: inset 0px -1px 0px #ecf0f7;
}

</style>
