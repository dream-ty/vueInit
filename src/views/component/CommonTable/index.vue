<!--  -->
<template>
  <el-table
    class="flex-fill responsive-table"
    :data="tableData"
    @cell-mouse-enter="mouseEnterTable"
    @cell-mouse-leave="mouseLeaveTable"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="(item, index) in column">
      <template>
        <el-table-column
          v-bind="{ ...item }"
          v-if="!item.type || typeLists.indexOf(item.type) > -1"
          :key="item.prop + index"
          :align="item.align ? item.align : 'center'"
          :type="typeNativeList.indexOf(item.type) > -1 ? item.type : undefined"
        >
          <template slot-scope="scope">
            <template v-if="!item.type">
              {{
                scope.row[item.prop] || (scope.row[item.prop] === 0 ? 0 : '-')
              }}
            </template>
            <slot
              v-else-if="item.type === 'slot' || item.type === 'expand'"
              :name="item.prop"
              :row="scope.row"
            >
            </slot>
            <!-- 添加后缀单位 unit-单位 decimal-小数位 -->
            <CalcSuffix
              v-else-if="item.type === 'calcSuffix'"
              :text="scope.row[item.prop] || ''"
              :unit="item.unit"
              :decimal="item.decimal"
            />
            <!-- 百分百过高颜色 isRed-异常红色 -->
            <AlterColor
              v-else-if="item.type === 'alterColor'"
              :text="scope.row[item.prop] || ''"
              :isRed="scope.row[item.isRedKey] || false"
            />
            <!-- 文字背景色动态显示 -->
            <StatusColor
              v-else-if="item.type === 'statusColor'"
              :text="
                (item.statusMap[scope.row[item.prop]] &&
                  item.statusMap[scope.row[item.prop]].text) ||
                ''
              "
              :color="
                (item.statusMap[scope.row[item.prop]] &&
                  item.statusMap[scope.row[item.prop]].color) ||
                ''
              "
            />
            <!-- 显示编辑按钮或者修改文字的组件 数据需要dis属性 -->
            <EditColumn
              v-else-if="item.type === 'edit' || item.type === 'editText'"
              :row="scope.row"
              :type="item.type"
              :text="scope.row[item.prop] || ''"
              @onClick="item.onClick"
            />
          </template>
        </el-table-column>
        <!-- 自定义的全选组件， checked这个属性需要在数据中给出否则勾选状态会出错 -->
        <!-- <custom-selection-column
          :key="item.prop + index"
          width="40"
          fixed
          @select-rows="item.onSelectRows"
          @option="item.option"
          ref="selectionCol"
          class-name="fixed-width"
          :unProtect="true"
          v-else-if="item.type === 'cuntomSelect'"
        ></custom-selection-column> -->
      </template>
    </template>
  </el-table>
</template>

<script>
import EditColumn from './component/EditColumn';
import CalcSuffix from './component/CalcSuffix';
import AlterColor from './component/AlterColor';
import StatusColor from './component/StatusColor';
export default {
  data() {
    return {
      typeLists: [
        'slot',
        'edit',
        'calcSuffix',
        'alterColor',
        'statusColor',
        'expand', // element自带的类型
      ], // 注册type类型
      typeNativeList: ['selection', 'index', 'expand'], // element中自带的类型，非自带需设置undefined避免冲突
    };
  },
  props: {
    tableData: {
      type: Array,
      defaultL: [],
    },
    column: {
      type: Array,
      defaultL: [],
    },
  },
  components: { EditColumn, CalcSuffix, AlterColor, StatusColor },
  methods: {
    // 进入table，找到定位
    mouseEnterTable(row, column) {
      // 显示修改
      if (column.type === 'edit') {
        row.dis = true;
      }
    },
    mouseLeaveTable(row, column) {
      // 隐藏修改
      if (column.type === 'edit') {
        row.dis = false;
      }
    },
  },
  created() {
    this.$listeners.clickLog();
  },
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
</style>