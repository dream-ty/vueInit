<template>
  <!-- 开垦列表 && 磁盘列表 -->
  <div class="chia-farm-details">
    <header class="table-tab flexbox align-center bold">
      <div
        class="tab-item"
        :class="{ active: 'reclaim' === activeTab }"
        @click="onTabChange('reclaim')"
      >
        开垦列表
      </div>
      <div
        class="tab-item ml-xl"
        :class="{ active: 'disk' === activeTab }"
        @click="onTabChange('disk')"
      >
        磁盘列表
      </div>
    </header>
    <main class="table-content">
      <el-table
        class=""
        :data="tableData"
        :default-sort="{ prop: 'plottingSize', order: 'ascending' }"
        @sort-change="onSortChange"
        @filter-change="onFilterChange"
      >
        <template v-if="activeTab === 'reclaim'">
          <el-table-column
            label="K值大小"
            prop="plottingSize"
            sortable="custom"
          >
            <template slot-scope="scope">
              <div class="">
                <span class="">{{ scope.row.plottingSize | empty }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="队列名" prop="">
            <template slot-scope="scope">
              <div class="">
                <span class="">{{ scope.row.queueName | empty }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="路径">
            <template slot-scope="scope">
              <div class="">
                <span class="" v-if="false">-</span>
                <span
                  class=""
                  v-else-if="(scope.row.filePath || '').length < 15"
                  >{{ scope.row.filePath }}
                </span>
                <el-tooltip
                  v-else
                  :content="scope.row.filePath"
                  placement="top"
                >
                  <span class="clickable">{{
                    scope.row.ellipsisFilePath
                  }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="250" label="状态" align="right">
            <template slot-scope="scope">
              <div class="status-content">
                <div class="" style="text-align: left">
                  <el-progress
                    :percentage="getProgress(scope.row)"
                    :color="processColor[scope.row.statusName]"
                    :show-text="scope.row.statusName !== 'SUBMITTED'"
                  ></el-progress>
                </div>
                <div
                  class="status-label"
                  :class="{ warning: scope.row.statusName === 'REMOVING' }"
                >
                  {{ statusLabel[scope.row.statusName] }}
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="磁盘" prop="">
            <template slot-scope="scope">
              <div class="">
                <span class="">{{ scope.row.diskName | empty }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="容量" prop="diskCapacity" sortable="custom">
            <template slot-scope="scope">
              <div class="">
                <span class="">{{
                  switchUnit(scope.row.diskCapacity, 'GiB', 3, 1024).value
                    | empty
                }}</span>
                <span class="ml-xs color-9">{{
                  switchUnit(scope.row.diskCapacity, 'GiB', 3, 1024).unit
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="闲置空间" prop="freeSize" sortable="custom">
            <template slot-scope="scope">
              <div class="">
                <span class="">{{
                  switchUnit(scope.row.freeSize, 'GiB', 3, 1024).value | empty
                }}</span>
                <span class="ml-xs color-9">{{
                  switchUnit(scope.row.freeSize, 'GiB', 3, 1024).unit
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="状态"
            align="right"
            prop="diskStatusName"
            column-key="diskStatusName"
            :filters="statusOptions"
            :filtered-value="filterParams"
            key="xxx"
          >
            <template slot-scope="scope">
              <div
                class="disk-status"
                :class="
                  scope.row.diskStatusName === 'FULL' ? 'full' : 'not-full'
                "
              >
                <span class="">{{ statusName[scope.row.diskStatusName] }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <div
          class="empty-table flexbox vertical align-center justify-center"
          slot="empty"
        >
          <div class="">暂无数据</div>
        </div>
      </el-table>
    </main>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { switchUnit } from '@/handle/index';

export default {
  name: 'ChiaFarmDetails',
  components: {},
  filters: {},
  mixins: [],
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeTab: 'reclaim', // reclaim 开垦 disk 磁盘
      orderType: '',
      orderMethod: '',
      filterParams: [],
    };
  },
  computed: {
    ...mapGetters(['factoryId']),
    tableData() {
      if (this.activeTab === 'reclaim') {
        return (this.row.reclaimList || []).map(item => {
          return {
            ...item,
            ellipsisFilePath:
              (item.filePath || '').length > 15
                ? item.filePath.slice(0, 15) + '...'
                : item.url,
          };
        });
      }
      return (this.row.diskList || [])
        .filter(item => {
          if (this.filterParams.length === 0) {
            return true;
          }
          return this.filterParams.includes(item.diskStatusName);
        })
        .map(item => {
          return {
            ...item,
          };
        });
    },
    statusOptions() {
      return [
        {
          text: '未满',
          value: 'NOTFULL',
        },
        {
          text: '已满',
          value: 'FULL',
        },
      ];
    },
    statusName() {
      return {
        FULL: '已满',
        NOTFULL: '未满',
      };
    },
    statusLabel() {
      return {
        SUBMITTED: '排队中...',
        RUNNING: '正在开垦',
        REMOVING: '开垦异常',
        FINISHED: '开垦完成',
      };
    },
    processColor() {
      return {
        SUBMITTED: '#E6E6E6',
        RUNNING: '#2DC97B',
        REMOVING: '#F16666',
      };
    },
  },
  watch: {},
  created() {},
  methods: {
    switchUnit,
    switchType(type) {
      const kv = {
        plottingSize: 'PLOTT_TYPE',
        diskCapacity: 'CAPACITY_DISK',
        freeSize: 'FREE_DISK',
      };
      return kv[type];
    },
    switchOrder(method) {
      const kv = {
        ascending: 'asc',
        descending: 'desc',
      };
      return kv[method];
    },
    onTabChange(type) {
      this.activeTab = type;
      this.$emit('tab-change');
    },
    onSortChange(column) {
      this.orderType = this.switchType(column.prop);
      this.orderMethod = this.switchOrder(column.order);
      this.getList();
    },
    onFilterChange(filters) {
      const key = Object.keys(filters)[0];
      const params = Object.values(filters)[0];
      if (key === 'diskStatusName') {
        this.filterParams = params;
      }
    },
    getProgress(row) {
      return Math.ceil(row.plottingProgress * 100);
    },
    getList() {
      this.$emit('load-data', {
        type: this.activeTab,
        orderType: this.orderType,
        orderMethod: this.orderMethod,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chia-farm-details {
  .table-tab {
    height: 40px;
    padding-left: 69px;
    background-color: #f6f6f6;
    .tab-item {
      width: 109px;
      border-bottom: 2px solid transparent;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
      color: #666;
      font-size: 16px;
      &.active {
        border-bottom-color: #308af4;
        color: #308af4;
      }
    }
  }
  .table-content {
  }
}
.status-content {
  width: 150px;
  height: 40px;
  padding: 0;
  padding-top: 4px;
  .status-label {
    width: 150px;
    height: 12px;
    padding: 0;
    line-height: 17px;
    font-size: 12px;
    // margin-left: 4px;
    text-align: left;
    color: #333;
    &.warning {
      color: #f05656;
    }
  }
}
.disk-status {
  height: 24px;
  padding: 0 8px;
  line-height: 24px;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  &.not-full {
    background-color: #2dc97b;
  }
  &.full {
    background-color: #f16666;
  }
}
/deep/.el-table__header-wrapper {
  tr {
    .is-leaf:first-child {
      .cell {
        padding-left: 90px;
      }
    }
  }
}
/deep/.el-table__body-wrapper {
  td {
    &:first-child {
      .cell {
        padding-left: 90px !important;
      }
    }
  }
}

/deep/.el-table td {
  padding-top: 6px;
  padding-bottom: 6px;
  &.is-right {
    padding: 0;
  }
}
/deep/.el-table .cell {
  color: #666;
}
/deep/.el-table__row {
  background-color: #fcfcfc;
  cursor: default !important;
}

/deep/.el-progress-bar__outer {
  border-radius: 0;
}
/deep/.el-progress-bar__outer {
  width: 100px;
}
.empty-table {
  height: 80px;
}
</style>
