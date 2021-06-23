<!-- chia矿机列表 -->
<template>
  <el-container class="widget router-page chiaList is-vertical">
    <Header
      :header-data="headerData"
      @filter-change="getList(true)"
      ref="header"
    />
    <el-main class="widget-body flex-fill flexbox vertical">
      <div class="flexbox space-bt mb-m align-center">
        <div class="flexbox align-center f-14">
          <el-dropdown
            trigger="click"
            class="flexbox align-center no-padding"
            @command="onIntervalChange"
          >
            <span class="el-dropdown-link color-6">
              <i class="iconfont icon-time color-9"></i>
              <count-down
                :duration="interval"
                ref="countdown"
                :auto-start="true"
                @time-up="onTimeUp"
              >
                <span slot-scope="{ countdown }" v-if="interval > 0">
                  <span class="fixed-width-label">{{ countdown }}</span>
                  {{ $t('minerList.vue0qTV8Bh4kZBuIzHcpUJMm') }}
                </span>
                <span v-else>{{
                  $t('minerList.vueh4zkYebcejBMOTXY1IEis')
                }}</span>
              </count-down>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">{{
                $t('minerList.vueh4zkYebcejBMOTXY1IEis')
              }}</el-dropdown-item>
              <el-dropdown-item command="60"
                >60
                {{ $t('minerList.vue4yrWAj8TzH1E-x2XCOSt1') }}</el-dropdown-item
              >
              <el-dropdown-item command="120"
                >120
                {{ $t('minerList.vue4yrWAj8TzH1E-x2XCOSt1') }}</el-dropdown-item
              >
              <el-dropdown-item command="180"
                >180
                {{ $t('minerList.vue4yrWAj8TzH1E-x2XCOSt1') }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="action-buttons flexbox align-center">
          <el-input
            v-model="keyword"
            placeholder="搜索矿机ID/IP地址"
            :clearable="true"
            class="keyword-input ml-s long-input"
            size="small"
            prefix-icon="iconfont icon-search"
            @input="onSearchBy"
            @clear="onSearchBy"
          />
          <el-button
            class="ml-s"
            size="medium"
            type="primary"
            @click="setAlter"
            plain
            v-if="['admin'].includes(this.userRole)"
          >
            设置告警
          </el-button>
          <el-button
            size="medium"
            type="primary"
            @click="openEditMachineId"
            v-if="['admin'].includes(this.userRole)"
          >
            编辑矿机ID
          </el-button>
        </div>
      </div>
      <CommonTable
        :table-data="tableData"
        :column="column"
        :row-key="getRowKey"
        v-loading="loading"
        @select="onSelectRow"
        @select-all="onSelectRow"
        @sort-change="onSortChange"
        @expand-change="onExpendChange"
        @row-click="onToggleExpand"
        :expand-row-keys="expands"
        ref="commonTable"
        class="commonTableBox"
      >
        <template #expand="{ row }">
          <chia-farm-details
            :row="row"
            @load-data="getDetails(row, $event)"
            ref="details"
          />
        </template>
        <template #empty>
          <span v-show="paramsIsNull"
            >，请先前往“<span
              class="highlight clickable"
              @click="onJump('ChiaExplanation')"
            >
              Chia矿机监控说明 </span
            >”中查看如何配置矿机</span
          >
        </template>
      </CommonTable>
      <div class="page-footer align-center flexbox">
        <div class="f-12 totalBox" v-if="checkedCount > 0">
          <span class>{{ $t('Uu66K9F20pkETVxZy2_0V') }}</span>
          <span class="theme-color"> {{ checkedCount }} </span>
          <span class>{{ $t('7_2BbTzOXwVHHwdGAw1IB') }}</span>
        </div>
        <div class="f-12 totalBox" v-else>
          <span class>{{ $t('BWtT53g_sYxCpfkrw22gX') }} </span>
          <span class="theme-color">{{ total }}</span>
          <span class>{{ $t('1cC3Z9BaHaBjLoFcXCBQ-') }}</span>
        </div>
        <custom-pager
          class="ml-auto"
          @size-change="getList()"
          @current-change="getList()"
          :current-page.sync="pageIndex"
          :page-size.sync="pageSize"
          :total="total"
        ></custom-pager>
      </div>
    </el-main>
 
    <chia-setup-alarm-dialog @success="getList()" ref="alarmDialog" />
  </el-container>
</template>

<script>
import Header from '@/views/home/chia/ChiaList/component/Header';
import debounce from 'lodash-es/debounce';
import { isIp } from '@/../common-module/utils';
import {
  getChiaList,
  getReclaimList,
  getDiskList,
  editChiaId,
  getChiaStatistics,
} from '@/../common-module/api/chia';
import CommonTable from '@/views/components/CommonTable';
import ChiaSetupAlarmDialog from '@/views/home/chia/ChiaList/component/ChiaSetupAlarmDialog';
import ChiaFarmDetails from '@/views/home/chia/ChiaList/component/ChiaFarmDetails';
import store from '@/stores/store';
import { mapGetters } from 'vuex';
import {
  setIntervalToLocalStorage,
  getIntervalToLocalStorage,
} from '@/handle/index';
import { noAllSpace } from '@/../common-module/fieldPatterns';
const statusMap = {
  reclaiming: {
    text: '正在开垦',
    color: '#16C36C',
  },
  warning: {
    text: '开垦异常',
    color: 'rgba(240, 86, 86, 0.9)',
  },
  offline: {
    text: '离线',
    color: '#9C9C9C',
  },
  close: {
    text: '软件关闭',
    color: '#8F96A7',
  },
  no_reclaiming: {
    text: '不在开垦',
    color: '#EE588E',
  },
};
let timeDelay = null;
export default {
  beforeRouteEnter(to, from, next) {
    if (store?.state?.chiaList?.length != 0) {
      next();
    } else {
      next('/chia');
    }
  },
  data() {
    return {
      interval: 60,
      keyword: '',
      searchType: 'minerName',
      tableData: [],
      expands: [],
      loading: false,
      headerData: {},
      pageSize: 30,
      total: 0,
      pageIndex: 1,
      paramsIsNull: false,
      editMachineDis: false,
      editForm: {
        prefix: '',
        suffix: '',
      },
      formRules: {
        prefix: [
          {
            required: true,
            // message: '请输入矿机ID',
            trigger: 'blur',
            validator: noAllSpace.validator,
          },
        ],
        suffix: [
          {
            required: false,
            message: '请输入后缀',
            trigger: 'blur',
          },
        ],
      },
      suffixList: [
        {
          label: 'IP后两位',
          value: 'ip2',
        },
        {
          label: 'IP后三位',
          value: 'ip3',
        },
        {
          label: 'IP后四位',
          value: 'ip4',
        },
      ],
      column: [
        {
          prop: '',
          label: '',
          minWidth: '100',
          columnType: 'cuntomSelect',
          onSelectRows: this.onSelectRows,
          option: this.setCheckAllOption,
        },
        {
          prop: 'expand',
          label: '',
          width: '20',
          type: 'expand',
        },
        {
          prop: 'minerName',
          label: '矿机ID',
          minWidth: '100',
          width: '179',
          columnType: 'edit',
          onClick: this.onClick,
          roleControl: 'admin',
        },
        {
          prop: 'ip',
          label: 'IP地址',
          minWidth: '100',
        },
        {
          prop: 'system',
          label: '系统',
          minWidth: '100',
        },
        {
          prop: 'publicFingerprint',
          label: '公共指纹',
          minWidth: '100',
        },
        {
          prop: 'calcRT',
          label: '容量',
          minWidth: '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'GiB',
          decimal: 3,
          multiple: 1024,
        },
        {
          prop: 'freeSpace',
          label: '闲置空间',
          minWidth: '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'GiB',
          decimal: 3,
          multiple: 1024,
        },
        {
          prop: 'fullDiskCount',
          label: '已满磁盘',
          minWidth: '100',
          sortable: 'custom',
        },
        {
          prop: 'notFullDiskCount',
          label: '未满磁盘',
          minWidth: '100',
          sortable: 'custom',
        },
        {
          prop: 'fileCount',
          label: '文件数',
          minWidth: '100',
          sortable: 'custom',
        },
        {
          prop: 'reclaimingCount',
          label: '开垦中',
          minWidth: '100',
          sortable: 'custom',
        },
        {
          prop: 'pendingCount',
          label: '排队中',
          minWidth: '100',
          sortable: 'custom',
        },
        {
          prop: 'cpuUsage',
          label: 'CPU使用率',
          minWidth: '100',
          sortable: 'custom',
          columnType: 'alterColor',
          isRedKey: 'cpuUsageError',
        },
        {
          prop: 'cacheUsage',
          label: '缓存盘占用率',
          minWidth: '100',
          sortable: 'custom',
          columnType: 'alterColor',
          isRedKey: 'cacheUsageError',
        },
        {
          prop: 'status',
          label: '状态',
          minWidth: '100',
          columnType: 'statusColor',
          statusMap,
          align: 'right',
        },
      ],
      checkAllOption: false, // 全选状态，
      selectAllPage: false, // false未所有页全选，
      orderType: '',
      orderMethod: '',
      singleMac: '',
    };
  },
  components: { Header, CommonTable, ChiaSetupAlarmDialog, ChiaFarmDetails },
  methods: {
    getChiaStatistics() {
      getChiaStatistics().then(res => {
        const {
          statusStat,
          totalCalcRT,
          totalFileCount,
          totalFreeSpace,
        } = res.data;
        this.headerData =
          { ...statusStat, totalCalcRT, totalFileCount, totalFreeSpace } || {};
      });
    },
    getList(resetPage) {
      if (resetPage) {
        this.pageIndex = 1;
      }
      const {
        publicFingerprints,
        statuses,
        systems,
        minerNamePrefix,
      } = this.query;
      let params = {
        ...this.query,
      };
      // 判断查询条件是否为空
      if (
        !this.keyword &&
        !statuses &&
        !systems &&
        !publicFingerprints &&
        !minerNamePrefix
      ) {
        this.paramsIsNull = true;
      } else {
        this.paramsIsNull = false;
      }
      this.loading = true;
      getChiaList(params)
        .then(res => {
          res.data &&
            res.data.forEach(item => {
              item.checked = this.checkAllOption === 2;
              item.dis = false;
              item.reclaimList = [];
              item.diskList = [];
            });
          this.tableData = res.data || [];
          this.total = res.total || 0;
          this.expands = [];
          this.$refs.commonTable?.$refs?.selectionCol?.[0]?.updateCheckedStatus();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onIntervalChange(cmd) {
      this.interval = +cmd;
      setIntervalToLocalStorage('chialist', this.interval);
      if (+cmd > 0) {
        this.$nextTick(() => {
          this.$refs.countdown.run();
        });
      }
    },
    // 倒计时时间到重置定时器
    onTimeUp() {
      // 列表有勾选不刷新列表,有展开项不刷新
      if (
        this.checkedRows.length === 0 &&
        this.$refs.commonTable?.$children?.[0]?.expandRowKeys?.length === 0
      ) {
        this.getList();
        this.getChiaStatistics();
      }
      this.$refs.countdown.run();
    },
    onSearchBy() {
      // 判断查询的类型1、ip => ip， 2、矿机id => minerName
      if (isIp(this.keyword)) {
        this.searchType = 'ip';
      } else {
        this.searchType = 'minerName';
      }
      this.getList(true);
    },
    setAlter() {
      this.$refs.alarmDialog.showDialog();
    },
    openEditMachineId() {
      if (!(this.checkedRows.length > 0 || this.singleMac)) {
        this.$message.warning('请选择矿机');
        return;
      }
      this.editMachineDis = true;
      this.editForm = { prefix: '', suffix: '' };
    },
    closeEditMachineId() {
      this.editMachineDis = false;
      this.singleMac = '';
    },
    confirm_edit() {
      this.$refs['addRuleForm'].validate(valid => {
        if (valid) {
          let params = {
            prefix: this.editForm.prefix,
            suffix: this.editForm.suffix || undefined,
          };
          // 获取勾选的mac
          let macs = [];
          if (this.singleMac) {
            macs.push(this.singleMac);
          } else if (this.selectAllPage) {
            params.all = true;
            params.query = {
              ...this.query,
            };
          } else {
            // 获取勾选的mac  
            this.tableData.forEach(item => {
              item.checked && macs.push(item.mac);
            });
          }
          if (macs.length > 0) {
            params.macs = macs;
          }
          editChiaId(params)
            .then(() => {
              this.closeEditMachineId();
              this.yfAlert('修改矿机ID成功', 'success');
              this.$router.replace({
                query: {
                  ...this.$route.query,
                  minerNamePrefix: '',
                },
              });
              if (timeDelay) {
                timeDelay = null;
              }
              this.loading = true;
              timeDelay = setTimeout(() => {
                this.$refs.header.minerNamePrefix = '';
                this.getList();
                this.getChiaStatistics();
                this.$refs.header.getMinerNamePrefixList();
              }, 1000);
            })
            .catch(() => {
              this.yfAlert('修改矿机ID失败', 'warning');
              // this.editMachineDis = false;
            });
        } else {
          return false;
        }
      });
    },
    onSelectRows(checked, value) {
      this.selectAllPage = value === 2;
      this.tableData.forEach(row => {
        row.checked = checked;
      });
    },
    onSelectRow() {
      // this.checkedRows = val;
    },
    getDetails(row, p = {}) {
      if (!row.mac) {
        return;
      }
      const params = {
        orderType: p.orderType,
        orderMethod: p.orderMethod,
        minerMac: row.mac,
      };
      if (!p.type || p.type === 'reclaim') {
        getReclaimList(params).then(res => {
          row.reclaimList = res.data || [];
        });
      }
      if (!p.type || p.type === 'disk') {
        getDiskList(params).then(res => {
          row.diskList = res.data || [];
        });
      }
    },
    setCheckAllOption(value = false) {
      this.checkAllOption = value;
    },
    // 点击矿机id中修改图标
    onClick(row = {}) {
      // row.checked = true;
      this.singleMac = row.mac;
      this.openEditMachineId();
    },
    switchType(type) {
      const map = {
        calcRT: 'calc_rt',
        freeSpace: 'free_space',
        pendingCount: 'pending_count',
        reclaimingCount: 'reclaiming_count',
        fileCount: 'file_count',
        fullDiskCount: 'full_disk_count',
        notFullDiskCount: 'not_full_disk_count',
        cpuUsage: 'cpu_usage',
        cacheUsage: 'cache_usage',
      };
      return map[type] || type;
    },
    switchOrder(method) {
      const map = {
        ascending: 'asc',
        descending: 'desc',
      };
      return map[method];
    },
    onSortChange(column) {
      this.orderType = this.switchType(column.prop);
      this.orderMethod = this.switchOrder(column.order);
      this.getList();
    },
    onExpendChange(row) {
      let index = this.expands.indexOf(row.mac);
      if (index > -1) {
        this.expands.splice(index, 1);
      } else {
        this.expands.push(row.mac);
        this.getDetails(row);
      }
    },
    onToggleExpand(row) {
      this.$refs.commonTable?.$children?.[0]?.toggleRowExpansion(row);
    },
    getRowKey(row) {
      return row.mac;
    },
    onJump(pathname) {
      this.$router.push({ name: pathname });
    },
  },
  created() {
    this.onSearchBy = debounce(this.onSearchBy, 500);
    this.getList();
    this.getChiaStatistics();
    this.interval = getIntervalToLocalStorage('chialist');
    if (!['admin'].includes(this.userRole)) {
      this.column.splice(0, 1);
      this.column[0].width = '30';
    }
  },
  computed: {
    ...mapGetters(['userRole']),
    checkedRows() {
      return this.tableData.filter(item => item.checked);
    },
    checkedCount() {
      return this.checkAllOption === 2 ? this.total : this.checkedRows.length;
    },
    // 查询参数转换
    query() {
      const {
        publicFingerprint,
        status,
        system,
        minerNamePrefix,
      } = this.$route.query;
      return {
        page: {
          // page 分页
          index: this.pageIndex,
          size: this.pageSize,
        },
        statuses: status || undefined,
        systems: system || undefined,
        publicFingerprints: publicFingerprint || undefined,
        minerNamePrefix: minerNamePrefix || undefined,
        orderType: this.orderType || undefined,
        orderMethod: this.orderMethod || undefined,
        minerName: this.searchType === 'minerName' ? this.keyword : undefined,
        ip: this.searchType === 'ip' ? this.keyword : undefined,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
/* @import '~./index.scss'; 引入scss类 */
.chiaList.widget.router-page {
  min-height: auto;
}
.widget.router-page .widget-body {
  margin: 0;
  padding-bottom: 0;
  padding-top: 16px;
}
.el-dropdown {
  &.no-padding {
    padding: 0;
  }
}
.action-buttons {
  .el-button {
    & + .el-button {
      margin-left: 8px;
    }
  }
}
.commonTableBox {
  /deep/ .el-table__row {
    cursor: pointer;
  }
  /deep/ .el-table__fixed {
    &::before {
      width: 0;
    }
  }
}
.editBox {
  /deep/ .el-dialog__body {
    min-height: 200px;
  }
  .colText {
    height: 40px;
    line-height: 55px;
    text-align: center;
    font-size: 24px;
  }
}
.highlight {
  color: #308af4;
  text-decoration: underline;
}
.page-footer {
  height: 53px;
}
</style>
