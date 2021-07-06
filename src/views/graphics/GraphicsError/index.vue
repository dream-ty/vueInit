<!-- GraphicsError矿机列表 -->
<template>
  <el-container class="widget router-page graphicsList is-vertical">
    <Header
      :header-data="headerData"
      :select-list-data="selectListData"
      @filter-change="getList(true)"
      ref="header"
    />
    <el-main class="widget-body flex-fill flexbox vertical">
      <div class="flexbox space-bt mb-m align-center">
        <div class="flexbox align-center f-14">
          <CommonManageList
            :manage-list="manageList"
            :local-storage-key="localStorageKey"
            :all-manage-list="allManageList"
            @onChange="setManageList"
          />
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
          <el-popover
            placement="bottom"
            width="280"
            popper-class="input-option"
            trigger="manual"
            :visible-arrow="false"
            v-model="showHint"
          >
            <ul>
              <!-- <li class="am-list-item" @click="onDeside('position')">
                机位
              </li> -->
              <li class="am-list-item" @click="onDeside('worker')">
                {{ this.$t('home.graphics.GraphicsError.qzynwn3') }}
              </li>
            </ul>
            <el-input
              slot="reference"
              class="keyword-input ml-s long-input"
              size="small"
              v-model="keyword"
              :placeholder="$t('home.graphics.GraphicsError.qzynwn4')"
              :clearable="true"
              prefix-icon="iconfont icon-search"
              @input="onSearchBy"
              @clear="onSearchBy"
            >
            </el-input>
          </el-popover>
          <el-button
            size="medium"
            type="primary"
            class="ml-s"
            @click="forbidGraphics"
          >
            {{ $t('home.graphics.GraphicsError.qzynwn66') }}
          </el-button>
        </div>
      </div>
      <CommonTable
        :table-data="tableData"
        :column="column"
        v-loading="loading"
        @sort-change="onSortChange"
        @row-click="openDetail"
        height="528px"
        ref="commonTable"
        class="commonTableBox"
      >
        <template #protect="{ row }">
          <el-tooltip
            class="item"
            popper-class="pad-small"
            effect="dark"
            placement="top-start"
            v-show="!!row.protect"
          >
            <div class slot="content">
              <span>{{
                protectReasonMap[(row.protect || {}).reason] || ''
              }}</span>
              <span>
                {{ (row.protect || {}).createTime | ago(true) }}
              </span>
            </div>
            <i class="iconfont icon-loading rotating"></i>
          </el-tooltip>
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
    <el-dialog
      :title="$t('home.graphics.GraphicsError.qzynwn67')"
      :visible.sync="alterDis"
      width="500px"
      class="alterDialogBox"
    >
      <div>
        {{ $t('home.graphics.GraphicsError.qzynwn68') }}{{ checkedCount
        }}{{ $t('home.graphics.GraphicsError.qzynwn69') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterDis = false" plain>{{
          $t('home.graphics.GraphicsError.qzynwn70')
        }}</el-button>
        <el-button type="primary" @click="confirm_alter">{{
          $t('home.graphics.GraphicsError.qzynwn71')
        }}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Header from '@/views/home/graphics/GraphicsError/component/Header';
import debounce from 'lodash-es/debounce';
import CommonManageList from '@/views/components/CommonManageList';
import CommonTable from '@/views/components/CommonTable';
import { getTimespan } from '@/filters';
import moment from 'moment';
import {
  setIntervalToLocalStorage,
  getIntervalToLocalStorage,
  switchUnit,
} from '@/handle/index';
import { mapGetters } from 'vuex';
import {
  getGraphicsErrorStatistics,
  getGraphicsErrorSelectList,
  getGraphicsErrorList,
  forbidGraphics,
  getDefaultModel,
} from '@/../common-module/api/graphics';
import {
  isIp,
  isMac,
  isIpRange,
  isIpRanges,
  removeCommaAndSpace,
} from '@/../common-module/utils';
import { $t } from '@/plugins/i18n';
const statusMap = {
  normal: {
    text: $t('home.graphics.GraphicsError.qzynwn5'),
    color: '#3566F0',
  },
  temperature_anomaly: {
    text: $t('home.graphics.GraphicsError.qzynwn6'),
    color: '#FF824E',
  },
  high_reject_rate: {
    text: $t('home.graphics.GraphicsError.qzynwn7'),
    color: '#865BE3',
  },
  low_calculation: {
    text: $t('home.graphics.GraphicsError.qzynwn8'),
    color: '#EB5E75',
  },
  un_calculation: {
    text: $t('home.graphics.GraphicsError.qzynwn9'),
    color: ' #F05656',
  },
  mining_stoppage: {
    text: $t('home.graphics.GraphicsError.qzynwn10'),
    color: '#CA5CE6',
  },
  not_configure: {
    text: $t('home.graphics.GraphicsError.qzynwn11'),
    color: '#EF9F03',
  },
  stop_card: {
    text: $t('home.graphics.GraphicsError.qzynwn12'),
    color: '#666666',
  },
  loss_card: {
    text: $t('home.graphics.GraphicsError.qzynwn13'),
    color: '#B9B9B9',
  },
  off_line: {
    text: $t('home.graphics.GraphicsError.qzynwn14'),
    color: '#7E89A8',
  },
};

const protectReasonMap = {
  change_template: $t('home.graphics.GraphicsError.qzynwn15'),
  update_worker: $t('home.graphics.GraphicsError.qzynwn16'),
  restart_excavate: $t('home.graphics.GraphicsError.qzynwn17'),
  stop_excavate: $t('home.graphics.GraphicsError.qzynwn18'),
  restart_miner: $t('home.graphics.GraphicsError.qzynwn19'),
  disable_card: $t('home.graphics.GraphicsError.qzynwn20'),
  shutdown_miner: $t('home.graphics.GraphicsError.qzynwn21'),
};
export default {
  data() {
    return {
      headerData: {},
      selectListData: {},
      interval: 60,
      hasDefaultModel: false, // 是否有默认模板
      msgbox: null,
      alterDis: false,
      manageList: [
        {
          title: $t('home.graphics.GraphicsError.qzynwn22'),
          children: [
            {
              prop: 'statusSince',
              label: $t('home.graphics.GraphicsError.qzynwn23'),
            },
            {
              prop: 'powerWaste',
              label: $t('home.graphics.GraphicsError.qzynwn24'),
            },
            // {
            //   prop: 'voltage',
            //   label: $t('home.graphics.GraphicsError.qzynwn25'),
            // },
            {
              prop: 'frequency',
              label: $t('home.graphics.GraphicsError.qzynwn26'),
            },
            {
              prop: 'memoryFrequency',
              label: $t('home.graphics.GraphicsError.qzynwn27'),
            },
            {
              prop: 'gpuType',
              label: $t('home.graphics.GraphicsError.qzynwn28'),
            },
            {
              prop: 'gpuModel',
              label: $t('home.graphics.GraphicsError.qzynwn29'),
            },
            // {
            //   prop: 'memoryModel',
            //   label: $t('home.graphics.GraphicsError.qzynwn30'),
            // },
            {
              prop: 'memorySize',
              label: $t('home.graphics.GraphicsError.qzynwn31'),
            },
          ],
        },
        {
          title: $t('home.graphics.GraphicsError.qzynwn32'),
          children: [
            {
              prop: 'coinType',
              label: $t('home.graphics.GraphicsError.qzynwn33'),
            },
            {
              prop: 'poolType',
              label: $t('home.graphics.GraphicsError.qzynwn34'),
            },
          ],
        },
        {
          title: $t('home.graphics.GraphicsError.qzynwn35'),
          children: [
            {
              prop: 'updateTime',
              label: $t('home.graphics.GraphicsError.qzynwn36'),
            },
          ],
        },
      ],
      localStorageKey: 'graphicsErrorColumns',
      tableData: [],
      column: [
        {
          prop: 'select',
          label: '',
          width: 100,
          minWidth: '100',
          protect: true,
          columnType: 'cuntomSelect',
          onSelectRows: this.onSelectRows,
          option: this.setCheckAllOption,
        },
        {
          prop: 'protect',
          label: '',
          width: '20',
          columnType: 'slot',
          align: 'center',
        },
        {
          prop: 'index',
          label: $t('home.graphics.GraphicsError.qzynwn37'),
          minWidth: '80',
        },
        {
          prop: 'worker',
          label: $t('home.graphics.GraphicsError.qzynwn38'),
          minWidth: '130',
        },
        {
          prop: 'sortId',
          label: $t('home.graphics.GraphicsError.qzynwn39'),
          minWidth: this.language === 'en' ? '120' : '80',
        },
        {
          prop: 'coinType',
          label: $t('home.graphics.GraphicsError.qzynwn40'),
          width: '120',
          columnType: 'imgText',
          isUnShow: true,
        },
        {
          prop: 'poolType',
          label: $t('home.graphics.GraphicsError.qzynwn41'),
          width: '120',
          columnType: 'imgText',
          isUnShow: true,
        },
        {
          prop: 'status',
          label: $t('home.graphics.GraphicsError.qzynwn42'),
          minWidth: this.language === 'en' ? '150' : '105',
          columnType: 'statusColor',
          statusMap,
        },
        {
          prop: 'calcRT',
          label: $t('home.graphics.GraphicsError.qzynwn43'),
          minWidth: this.language === 'en' ? '185' : '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'MH/S',
          decimal: 2,
          multiple: 1000,
        },
        {
          prop: 'statusSince',
          label: $t('home.graphics.GraphicsError.qzynwn44'),
          minWidth: this.language === 'en' ? '135' : '125',
          isUnShow: true,
          sortable: 'custom',
        },
        {
          prop: 'temperature',
          label: $t('home.graphics.GraphicsError.qzynwn45'),
          minWidth: '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: '℃ ', // 这个空格需要保留
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'rejectRate',
          label: $t('home.graphics.GraphicsError.qzynwn46'),
          minWidth: this.language === 'en' ? '145' : '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: '% ', // 这个空格需要保留
          decimal: 2,
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'powerWaste',
          label: $t('home.graphics.GraphicsError.qzynwn47'),
          minWidth: this.language === 'en' ? '175' : '100',
          isUnShow: true,
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'W ',
          multiple: Number.MAX_SAFE_INTEGER,
        },
        // {
        //   prop: 'voltage',
        //   label: $t('home.graphics.GraphicsError.qzynwn48'),
        //   minWidth: '100',
        //   isUnShow: true,
        //   sortable: 'custom',
        //   columnType: 'calcSuffix',
        //   unit: 'V ', // 这个空格需要保留
        //   multiple: Number.MAX_SAFE_INTEGER,
        // },
        {
          prop: 'frequency',
          label: $t('home.graphics.GraphicsError.qzynwn49'),
          minWidth: '100',
          isUnShow: true,
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'MHz',
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'memoryFrequency',
          label: $t('home.graphics.GraphicsError.qzynwn50'),
          minWidth: this.language === 'en' ? '155' : '100',
          isUnShow: true,
          columnType: 'calcSuffix',
          unit: 'MHz',
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'gpuType',
          label: $t('home.graphics.GraphicsError.qzynwn51'),
          minWidth: '200',
          isUnShow: true,
          isWhiteSpace: true,
        },
        {
          prop: 'gpuModel',
          label: $t('home.graphics.GraphicsError.qzynwn52'),
          minWidth: '200',
          isUnShow: true,
          isWhiteSpace: true,
        },
        // {
        //   prop: 'memoryModel',
        //   label: $t('home.graphics.GraphicsError.qzynwn53'),
        //   minWidth: this.language === 'en' ? '115' : '100',
        //   isUnShow: true,
        // },
        // {
        //   prop: 'elapsed',
        //   label: $t('home.graphics.GraphicsError.qzynwn54'),
        //   minWidth: this.language === 'en' ? '135' : '100',
        //   sortable: 'custom',
        // },
        {
          prop: 'memorySize',
          label: $t('home.graphics.GraphicsError.qzynwn55'),
          minWidth: this.language === 'en' ? '115' : '100',
          isUnShow: true,
          columnType: 'calcSuffix',
          unit: 'M ', // 这个空格需要保留
          multiple: 1024,
        },
        {
          prop: 'updateTime',
          label: $t('home.graphics.GraphicsError.qzynwn56'),
          minWidth: this.language === 'en' ? '155' : '120',
          isUnShow: true,
        },
      ],

      loading: false,
      checkAllOption: false, // 全选状态，
      selectAllPage: false, // false未所有页全选，
      pageSize: 30,
      total: 0,
      pageIndex: 1,
      keyword: '',
      searchType: '',
      orderType: '',
      orderMethod: '',
      singleMac: '',
      showHint: false,
    };
  },
  props: {
    // 从上层获取
    language: {
      type: [String],
      default: '',
    },
  },
  components: { Header, CommonManageList, CommonTable },
  methods: {
    getDefaultModel() {
      this.hasDefaultModel = false;
      getDefaultModel({ factoryId: this.factoryId }).then(res => {
        this.hasDefaultModel = res?.data?.length > 0;
      });
    },
    getGraphicsErrorStatistics() {
      getGraphicsErrorStatistics({ factoryId: this.factoryId }).then(res => {
        const { statusStat, generalError, lowCalc, invalid } = res.data;
        this.headerData =
          { ...statusStat, generalError, lowCalc, invalid } || {};
      });
    },
    getGraphicsErrorSelectList() {
      getGraphicsErrorSelectList({ factoryId: this.factoryId }).then(res => {
        res.data = res.data || {};
        // 设置筛选数据
        for (let item in res.data) {
          if (res.data[item]) {
            res.data[item] = this.getValueAndLabelByList(res.data[item]);
          }
        }
        // 显存单位换算
        res.data?.memorySize.forEach(item => {
          let a = switchUnit(item.value, 'M ', 3, 1024 )
          item.label = a.value + a.unit
        })
        // 状态写死
        res.data.statusList = [
          {
            label: $t('home.graphics.GraphicsError.qzynwn57'),
            value: 'temperature_anomaly',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn58'),
            value: 'high_reject_rate',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn59'),
            value: 'low_calculation',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn60'),
            value: 'loss_card',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn61'),
            value: 'un_calculation',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn62'),
            value: 'mining_stoppage',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn63'),
            value: 'not_configure',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn64'),
            value: 'stop_card',
          },
          {
            label: $t('home.graphics.GraphicsError.qzynwn65'),
            value: 'off_line',
          },
        ];
        this.selectListData = res.data;
      });
    },

    forbidGraphics() {
      if (this.hasDefaultModel) {
        const h = this.$createElement;
        const msg = $t('home.graphics.GraphicsList.qzynwza101');
        this.msgbox && this.msgbox.close();
        this.msgbox = this.$message({
          showClose: true,
          duration: 0,
          type: 'warning',
          message: h(
            'div',
            {
              class: 'flexbox space-bt nowrap',
            },
            [
              h('span', null, msg),
              h(
                'span',
                {
                  class: 'clickable theme-color nowrap mr-m ml-xl',
                  on: {
                    click: () => {
                      this.toSetModal();
                    },
                  },
                },
                $t('home.graphics.GraphicsList.qzynwza102')
              ),
            ]
          ),
        });
        return;
      }
      if (this.checkedCount <= 0) {
        this.$message.warning($t('home.graphics.GraphicsError.qzynwn72'));
        return;
      }
      this.alterDis = true;
    },
    confirm_alter() {
      const { status = '' } = this.checkedRows?.[0] || {}
      // 不能禁卡
      if(this.checkedRows.length === 1 && (status === 'stop_card' || status === 'loss_card' || status === 'off_line' || status === 'not_configure' || status === 'mining_stoppage' )) {
        this.$message.warning($t('home.graphics.GraphicsError.qzynwn76'));
        return;
      }
      let params = {};
      if (this.checkAllOption === 2) {
        params = { factoryId: this.factoryId, all: true, query: { ...this.query } };
      } else {
        let cards = [];
        this.checkedRows.forEach(item => {
          item.minerId &&
            cards.push({ cardNo: item.sortNo, minerId: item.minerId });
        });
        params = { factoryId: this.factoryId, cards };
      }
      forbidGraphics(params).then(res => {
        const { code, failNum, successNum } = res;
        if (code === 200) {
          let message = '';
          successNum > 0 &&
            (message +=
              successNum + $t('home.graphics.GraphicsError.qzynwn74'));
          failNum > 0 &&
            (message +=
              (successNum > 0 ? ',' : '') +
              failNum +
              $t('home.graphics.GraphicsError.qzynwn75'));
          this.yfAlert(message, 'success');
          this.alterDis = false;
          this.getList();
        }
      });
    },

    // 遍历得到value、label
    getValueAndLabelByList(list = []) {
      let data = [];
      list.forEach(item => {
        if (Object.prototype.toString.call(item) === '[object Object]') {
          data.push({
            label: item.name,
            value: item.id + '',
          });
        } else {
          data.push({
            label: item,
            value: item,
          });
        }
      });
      return data;
    },

    onDeside(by) {
      this.showHint = false;
      this.searchType = by;
      this.getList(true);
    },
    onSearchBy() {
      // 判断查询的类型1、ip => ip， 2、矿机id => worker
      if (isIp(this.keyword)) {
        this.searchType = 'ip';
      } else if (isMac(this.keyword)) {
        this.searchType = 'mac';
      } else if (isIpRange(this.keyword)) {
        // 是单个ip范围
        this.searchType = 'ips';
      } else if (isIpRanges(this.keyword)) {
        // 多个网段范围
        this.searchType = 'ips';
      } else if (this.keyword) {
        this.showHint = true;
        return;
      }
      this.showHint = false;
      this.getList(true);
    },

    getList(resetPage) {
      if (resetPage) {
        this.pageIndex = 1;
      }
      let params = { factoryId: this.factoryId, ...this.query, filterNormal: true };
      this.loading = true;
      getGraphicsErrorList(params)
        .then(res => {
          res.data &&
            res.data.forEach((item, index) => {
              item.checked = item.status === 'stop_card' ? false : (item.protect ? false : this.checkAllOption === 2);
              item.dis = false;
              item.index = index + 1;
              // 转换整数
              item.temperature =
                item.temperature === 0
                  ? 0
                  : (item.temperature && item.temperature.toFixed(0)) || null;
              item.powerWaste =
                item.powerWaste === 0
                  ? 0
                  : (item.powerWaste && item.powerWaste.toFixed(0)) || null;
              item.frequency =
                item.frequency === 0
                  ? 0
                  : (item.frequency && item.frequency.toFixed(0)) || null;
              item.memoryFrequency =
                item.memoryFrequency === 0
                  ? 0
                  : (item.memoryFrequency && item.memoryFrequency.toFixed(0)) ||
                    null;
              // 时间处理
              item.elapsed =
                item.elapsed &&
                getTimespan(moment.duration(new Date() - item.elapsed) || '-');
              item.statusSince =
                item.statusSince &&
                getTimespan(
                  moment.duration(new Date() - item.statusSince) || '-'
                );
              item.updateTime =
                (item.updateTime &&
                  getTimespan(moment.duration(new Date() - item.updateTime)) +
                    $t('home.graphics.GraphicsError.qzynwn73')) ||
                '-';
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
      setIntervalToLocalStorage('graphicsError', this.interval);
      if (+cmd > 0) {
        this.$nextTick(() => {
          this.$refs.countdown.run();
        });
      }
    },
    // 倒计时时间到重置定时器
    onTimeUp() {
      // 列表有勾选不刷新列表
      if (this.checkedRows.length === 0) {
        this.getList();
        this.getGraphicsErrorStatistics();
      }
      this.$refs.countdown.run();
    },
    // 设置管理列表项
    setManageList(checkedList) {
      this.allManageList.forEach(item => {
        this.column[this.indexByColumn[item]].isUnShow =
          !checkedList.includes(item);
      });
    },
    onSelectRows(checked, value) {
      this.selectAllPage = value === 2;
      this.tableData.forEach(row => {
        row.checked = row.protect ? false : checked;
      });
    },
    openDetail(row) {
      console.log('row', row);
    },
    setCheckAllOption(value = false) {
      this.checkAllOption = value;
    },
    switchType(type) {
      const map = {
        statusSince: 'status_since',
        calcRT: 'calc_rt',
        temperature: 'temperature',
        reclaimingCount: 'reclaiming_count',
        rejectRate: 'reject_rate',
        powerWaste: 'power_waste',
        voltage: 'voltage',
        frequency: 'frequency',
        memoryFrequency: 'memory_frequency',
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
    toSetModal() {
      this.msgbox && this.msgbox.close();
      this.$router.push({
        name: 'GpuConfig',
        query: { type: 'templates', factoryId: this.factoryId },
      });
    },
  },
  watch: {
    // $route: {
    //   handler(v) {},
    //   immediate: true,
    // },
    factoryId: {
      handler(value) {
        if (value) {
          this.getList(true);
          this.getGraphicsErrorSelectList();
          this.getGraphicsErrorStatistics();
        }
      },
      immediate: true,
    },
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
    checkedRows() {
      return this.tableData.filter(item => item.checked);
    },
    checkedCount() {
      return this.checkAllOption === 2 ? this.total : this.checkedRows.length;
    },
    // 所有管理列表项
    allManageList() {
      let list = [];
      this.manageList.forEach(item => {
        item.children?.forEach(childrenItem => {
          childrenItem.prop && list.push(childrenItem.prop);
        });
      });
      return list;
    },
    // columns的索引值index
    indexByColumn() {
      let data = {};
      this.column.forEach((item, index) => {
        item.prop && (data[item.prop] = index);
      });
      return data;
    },
    protectReasonMap() {
      return protectReasonMap;
    },
    // 查询参数转换
    query() {
      let {
        gpuTypes,
        gpuModels,
        memoryModels,
        memorySizes,
        coinTypes,
        poolTypes,
        statuses,
        templateId,
      } = this.$route.query;
      return {
        page: {
          // page 分页
          index: this.pageIndex,
          size: this.pageSize,
        },
        statuses: statuses || undefined,
        coinTypes: coinTypes || undefined,
        poolTypes: poolTypes || undefined,
        gpuTypes: gpuTypes || undefined,
        gpuModels: gpuModels || undefined,
        memoryModels: memoryModels || undefined,
        memorySizes: memorySizes || undefined,
        orderType: this.orderType || undefined,
        orderMethod: this.orderMethod || undefined,
        ip: this.searchType === 'ip' ? this.keyword : undefined,
        worker: this.searchType === 'worker' ? this.keyword : undefined,
        ips:
          this.searchType === 'ips'
            ? (this.keyword && removeCommaAndSpace(this.keyword)) || undefined
            : undefined,
        mac: this.searchType === 'mac' ? this.keyword : undefined,
        templateId: templateId || undefined,
      };
    },
    macs() {
      let macs = [];
      this.tableData.forEach(item => {
        item.checked && macs.push(item.mac);
      });
      return macs;
    },
  },
  created() {
    this.onSearchBy = debounce(this.onSearchBy, 500);
    this.interval = getIntervalToLocalStorage('graphicsError');
  },
  mounted() {},
  filters: {
    capitalize: function (text) {
      return text.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.graphicsList.widget.router-page {
  min-height: auto;
}
.widget.router-page .widget-body {
  margin: 0;
  padding-bottom: 0;
  padding-top: 16px;
}
.text-tag {
  height: 29px;
  line-height: 29px;
  box-sizing: border-box;
  &.network {
    width: 20px;
    text-align: center;
    padding: 0;
    border-radius: 2px;
  }
}

.action-buttons {
  .el-button {
    & + .el-button {
      margin-left: 8px;
    }
  }
}

/deep/ .alterDialogBox .el-dialog__body {
  min-height: 180px;
  padding-top: 32px;
}
.commonTableBox {
  /deep/ .el-table__fixed {
    &::before {
      width: 0;
    }
  }
}

/deep/ .el-table th,
/deep/ .el-table td {
  &:last-child {
    text-align: right;
  }
}
</style>