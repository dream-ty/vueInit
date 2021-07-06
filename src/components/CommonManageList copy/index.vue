<!-- 管理列表项组件 -->
<template>
  <el-popover trigger="click" placement="bottom">
    <div class="content">
      <el-checkbox v-model="checkAll" @change="onCheckAll">{{
        $t('components.CommonManageList.uuas9d6')
      }}</el-checkbox>
      <el-checkbox-group v-model="checkedList" @change="onCheckChange">
        <template v-for="(item, index) in manageList">
          <template>
            <div class="group-title" :key="item.title + index">
              {{ item.title || '-' }}
            </div>
            <template v-for="(childrenItem, indexItem) in item.children || []">
              <el-checkbox
                :label="childrenItem.prop"
                :key="childrenItem.prop + indexItem"
                >{{ childrenItem.label || '-' }}</el-checkbox
              >
            </template>
          </template>
        </template>
      </el-checkbox-group>
    </div>
    <div class="flexbox clickable align-center inline-space" slot="reference">
      <div class="color-6 clickable f-14">
        <i class="iconfont icon-list"></i>
        {{ $t('components.CommonManageList.uuas9d7') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    // 渲染的list
    manageList: {
      type: Array,
      default: () => [],
    },
    // 全选状态下的值
    allManageList: {
      type: Array,
      default: () => [],
    },
    // 存在缓存中的值
    localStorageKey: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      checkAll: false,
      checkedList: [],
    };
  },
  methods: {
    onCheckAll(value) {
      this.checkedList = value ? this.allManageList : [];
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.checkedList)
      );
      this.$emit('onChange', this.checkedList);
    },
    onCheckChange() {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.checkedList)
      );
      this.$emit('onChange', this.checkedList);
    },
  },
  created() {
    // 拿缓存
    if (this.localStorageKey) {
      this.checkedList =
        JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    }
    // 初始化外部数据
    this.$emit('onChange', this.checkedList);
  },
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.group-title {
  color: #000;
  font-size: 14px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 8px;
}
</style>