<!-- 公共表格组件 column - 表头 noEmpty - 空数据容器-->
<!-- 公共配置属性，全继承element属性，额外的：
   isUnShow - 控制当前列是否显示
   align - 内容位置
   isWhiteSpace - 内容是否自动换行
   columnType - 自定义column的类型
 -->
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
          v-if="
            !item.isUnShow &&
            (!item.columnType || typeLists.indexOf(item.columnType) > -1)
          "
          :key="item.prop + index"
          :align="item.align ? item.align : 'left'"
          :class-name="item['class-name'] + ' ' + (item.isWhiteSpace ? 'whiteSpace' : '')"
        >
          <template slot-scope="scope">
            <template v-if="!item.columnType && !item.type">
              {{
                scope.row[item.prop] || (scope.row[item.prop] === 0 ? 0 : scope.row[item.prop] === undefined ? '' : '-')
              }}
            </template>
            <slot
              v-else-if="item.columnType === 'slot' || item.type === 'expand'"
              :name="item.prop"
              :row="scope.row"
            >
            </slot>
            <!-- 添加后缀单位 unit-单位 decimal-小数位 multiple-计算间距 -->
            <CalcSuffix
              v-else-if="item.columnType === 'calcSuffix'"
              :text="scope.row[item.prop] || ''"
              :unit="item.unit"
              :decimal="item.decimal"
              :multiple="item.multiple"
            />
            <!-- 百分百过高颜色 isRed-异常红色 -->
            <AlterColor
              v-else-if="item.columnType === 'alterColor'"
              :text="scope.row[item.prop]"
              :is-red="scope.row[item.isRedKey] || false"
            />
            <!-- 图标加文字 -->
            <ImgText
              v-else-if="item.columnType === 'imgText'"
              :text="scope.row[item.prop] === null ? null :  scope.row[item.prop] === undefined ? undefined : (scope.row[item.prop].name || scope.row[item.prop])"
            />
            <!-- 文字背景色动态显示 -->
            <StatusColor
              v-else-if="item.columnType === 'statusColor'"
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
            <!-- 显示编辑按钮或者修改文字的组件 数据需要dis属性, roleControl角色权限控制 -->
            <EditColumn
              v-else-if="
                item.columnType === 'edit' || item.columnType === 'editText'
              "
              :row="scope.row"
              :column-type="item.columnType"
              :text="scope.row[item.prop] || ''"
              @onClick="item.onClick"
              :name="item.roleControl ? item.roleControl : 'unRoleControl'"
            />
          </template>
        </el-table-column>
        <!-- 自定义的全选组件， checked这个属性需要在数据中给出否则勾选状态会出错 -->
        <custom-selection-column
          :key="item.prop + index"
          width="40"
          @select-rows="item.onSelectRows"
          @option="item.option"
          ref="selectionCol"
          class-name="fixed-width"
          :un-protect="!item.protect"
          v-else-if="item.columnType === 'cuntomSelect'"
        ></custom-selection-column>
      </template>
    </template>
    <!-- 空数据插槽 -->
    <div
      class="empty flexbox vertical align-center justify-center"
      slot="empty"
      v-if="!noEmpty"
    >
      <div class="emptyBox">
        {{ $t('a-YZmHC-e8C7goNLrLBI0') }}<slot name="empty"> </slot>
      </div>
    </div>
  </el-table>
</template>

<script>
import EditColumn from './component/EditColumn';
import CalcSuffix from './component/CalcSuffix';
import AlterColor from './component/AlterColor';
import StatusColor from './component/StatusColor';
import ImgText from './component/ImgText.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      typeLists: [
        'slot',
        'edit',
        'editText',
        'calcSuffix',
        'alterColor',
        'statusColor',
        'imgText',
        'expand', // element自带的类型
      ], // 注册type类型
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    column: {
      type: Array,
      default: () => [],
    },
    noEmpty: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['userRole']),
  },
  components: { EditColumn, CalcSuffix, AlterColor, StatusColor, ImgText },
  methods: {
    // 进入table，找到定位
    mouseEnterTable(row, column, element) {
      let editName =
        element.children?.[0]?.children?.[0]?.getAttribute?.('name');
      // 角色控制显示
      if (
        editName === 'unRoleControl' ||
        editName?.split(',').includes(this.userRole)
      ) {
        row.dis = true;
      }
    },
    mouseLeaveTable(row) {
      // 隐藏修改
      row.dis = false;
      // let editName =
      //   element.children?.[0]?.children?.[0]?.getAttribute?.('name');
      // if (
      //   editName === 'unRoleControl' ||
      //   editName?.split(',').includes(this.userRole)
      // ) {
      //   row.dis = false;
      // }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
/* @import '~./index.scss'; 引入scss类 */
.emptyBox {
  margin-top: 120px;
}
/deep/.el-table__empty-text {
  height: 100%;
  // display: flex;
  // flex-shrink: 1;
  // align-items: center;
  // justify-items: center;
}
/deep/ .whiteSpace .cell {
  white-space: normal !important;
}
</style>
