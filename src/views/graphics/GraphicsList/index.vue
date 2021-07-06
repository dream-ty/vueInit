<!-- graphics矿机列表 -->
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
                  {{ $t('home.graphics.GraphicsList.qzynwza1') }}
                </span>
                <span v-else>{{
                  $t('home.graphics.GraphicsList.qzynwza2')
                }}</span>
              </count-down>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">{{
                $t('home.graphics.GraphicsList.qzynwza2')
              }}</el-dropdown-item>
              <el-dropdown-item command="60"
                >60
                {{
                  $t('home.graphics.GraphicsList.qzynwza3')
                }}</el-dropdown-item
              >
              <el-dropdown-item command="120"
                >120
                {{
                  $t('home.graphics.GraphicsList.qzynwza3')
                }}</el-dropdown-item
              >
              <el-dropdown-item command="180"
                >180
                {{
                  $t('home.graphics.GraphicsList.qzynwza3')
                }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-checkbox
            class="el-dropdown-link ml-m"
            v-model="abnormalOnly"
            :disabled="!!$route.query.statuses"
            @change="onAbnormalOnlyChange"
          >
            {{ $t('home.graphics.GraphicsList.qzynwza4') }}
          </el-checkbox>
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
                {{ $t('home.graphics.GraphicsList.qzynwza5') }}
              </li>
            </ul>
            <el-input
              slot="reference"
              class="keyword-input ml-s long-input"
              size="small"
              v-model="keyword"
              :placeholder="$t('home.graphics.GraphicsList.qzynwza6')"
              :clearable="true"
              prefix-icon="iconfont icon-search"
              @input="onSearchBy"
              @clear="onSearchBy"
            >
            </el-input>
          </el-popover>
          <Operate
            :params="operateParams"
            :nums="checkedCount || 0"
            :no-default-model="!hasDefaultModel"
            @getList="getList"
          />
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
        <template #ip="{ row }">
          <a
            @click.stop="onIpClick"
            :href="'http://' + row.ip"
            target="_blank"
            class="underline nowrap"
            >{{ row.ip }}</a
          >
          <span
            class="text-tag network ml-s"
            v-if="row.netWorkType && row.netWorkType !== 'unknown'"
            :class="row.netWorkType"
            >{{
              row.netWorkType === 'dhcp'
                ? $t('home.graphics.GraphicsList.qzynwza7')
                : $t('home.graphics.GraphicsList.qzynwza8')
            }}</span
          >
        </template>
        <template #software="{ row }">
          <span>{{ row.software ? row.software.name : '-' }}</span>
        </template>
        <template #template="{ row }">
          <span>{{ row.template ? row.template.name : '-' }}</span>
        </template>
        <template #gpuList="{ row }">
          <span class="">
            <template v-for="(item, index) in row.gpuList">
              <el-tooltip
                :key="item.status + index"
                :disabled="item.status === 'off_line'"
                class="item"
                effect="dark"
                popper-class="pad-small"
                placement="top-start"
              >
                <div class slot="content">
                  <div v-if="item.status === 'loss_card'">
                    {{ $t('home.graphics.GraphicsList.qzynwza9') }}
                  </div>
                  <div v-else-if="item.status === 'stop_card'">
                    {{ $t('home.graphics.GraphicsList.qzynwza10') }}
                  </div>
                  <div v-else-if="item.status === 'off_line'">
                    {{ $t('home.graphics.GraphicsList.qzynwza11') }}
                  </div>
                  <div v-else>
                    <div class>
                      {{ $t('home.graphics.GraphicsList.qzynwza12')
                      }}{{ item.calcRT | hashrate('MH/S') | empty }}
                    </div>
                    <div class>
                      {{ $t('home.graphics.GraphicsList.qzynwza13')
                      }}{{ item.temperature }} ℃
                    </div>
                  </div>
                </div>
                <span
                  class="cardStatusItem"
                  :style="
                    'background-color:' +
                    (graphicsStatusMap[item.status] &&
                      graphicsStatusMap[item.status].color)
                  "
                  ><span class="Xbox">{{
                    item.status === 'stop_card' ? 'X' : ''
                  }}</span></span
                ></el-tooltip
              >
            </template>
            <span v-if="!row.gpuList">-</span>
          </span>
        </template>
      </CommonTable>
      <div class="page-footer align-center flexbox">
        <div class="f-12 totalBox" v-if="checkedCount > 0">
          <span class>{{ $t('home.graphics.GraphicsList.qzynwza14') }}</span>
          <span class="theme-color"> {{ checkedCount }} </span>
          <span class>{{ $t('home.graphics.GraphicsList.qzynwza15') }}</span>
        </div>
        <div class="f-12 totalBox" v-else>
          <span class>{{ $t('home.graphics.GraphicsList.qzynwza16') }} </span>
          <span class="theme-color">{{ total }}</span>
          <span class>{{ $t('home.graphics.GraphicsList.qzynwza17') }}</span>
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
    <!-- 编辑矿工id弹窗 -->
    <el-dialog
      :title="$t('home.graphics.GraphicsList.qzynwza18')"
      :visible.sync="editWorkerDis"
      width="500px"
      class="editBox"
      :destroy-on-close="true"
    >
      <el-form
        size="small"
        :model="editForm"
        ref="editRuleForm"
        label-position="left"
        label-width="0px"
      >
        <el-form-item :label="''" prop="worker" :rules="workerRules">
          <el-input
            v-model="editForm.worker"
            @input.native="workerChange"
            @compositionend.native="workerChange"
            @clear="clearEdit"
            :placeholder="$t('home.graphics.GraphicsList.qzynwza19')"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditWorkerId" plain>{{
          $t('home.graphics.GraphicsList.qzynwza20')
        }}</el-button>
        <el-button
          type="primary"
          :disabled="!editForm.worker"
          @click="confirm_edit"
          >{{ $t('home.graphics.GraphicsList.qzynwza2011') }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('home.graphics.GraphicsList.qzynwza21')"
      :visible.sync="alterDis"
      width="500px"
      class="alterBox"
    >
      <div>{{ $t('home.graphics.GraphicsList.qzynwza22') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterDis = false" plain>{{
          $t('home.graphics.GraphicsList.qzynwza23')
        }}</el-button>
        <el-button type="primary" @click="confirm_alter">{{
          $t('home.graphics.GraphicsList.qzynwza24')
        }}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Header from '@/views/home/graphics/GraphicsList/component/Header.vue';
import Operate from '@/views/home/graphics/GraphicsList/component/Operate.vue';
import { getTimespan } from '@/filters';
import moment from 'moment';
import debounce from 'lodash-es/debounce';
import CommonManageList from '@/views/components/CommonManageList';
import CommonTable from '@/views/components/CommonTable';
import {
  setIntervalToLocalStorage,
  getIntervalToLocalStorage,
} from '@/handle/index';
import { mapGetters } from 'vuex';
import {
  getGraphicsStatistics,
  getGraphicsSelectList,
  getGraphicsList,
  editGraphicsId,
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
    text: $t('home.graphics.GraphicsList.qzynwza25'),
    color: '#3566F0',
  },
  temperature_anomaly: {
    text: $t('home.graphics.GraphicsList.qzynwza26'),
    color: '#FF824E',
  },
  high_reject_rate: {
    text: $t('home.graphics.GraphicsList.qzynwza27'),
    color: '#865BE3',
  },
  main_board_stoppage: {
    text: $t('home.graphics.GraphicsList.qzynwza28'),
    color: '#F05697',
  },
  low_calculation: {
    text: $t('home.graphics.GraphicsList.qzynwza29'),
    color: '#EB5E75',
  },
  loss_card: {
    text: $t('home.graphics.GraphicsList.qzynwza30'),
    color: '#B9B9B9',
  },
  un_calculation: {
    text: $t('home.graphics.GraphicsList.qzynwza31'),
    color: ' #F05656',
  },
  mining_stoppage: {
    text: $t('home.graphics.GraphicsList.qzynwza32'),
    color: '#CA5CE6',
  },
  not_configure: {
    text: $t('home.graphics.GraphicsList.qzynwza33'),
    color: '#EF9F03',
  },
  off_line: {
    text: $t('home.graphics.GraphicsList.qzynwza34'),
    color: '#7E89A8',
  },
};
const graphicsStatusMap = {
  normal: {
    text: $t('home.graphics.GraphicsList.qzynwza35'),
    color: '#67C23A',
  },
  temperature_anomaly: {
    text: $t('home.graphics.GraphicsList.qzynwza36'),
    color: '#FF4D4F',
  },
  high_reject_rate: {
    text: $t('home.graphics.GraphicsList.qzynwza37'),
    color: '#FF4D4F',
  },
  low_calculation: {
    text: $t('home.graphics.GraphicsList.qzynwza38'),
    color: '#FF4D4F',
  },
  un_calculation: {
    text: $t('home.graphics.GraphicsList.qzynwza39'),
    color: '#FF4D4F',
  },
  mining_stoppage: {
    text: $t('home.graphics.GraphicsList.qzynwza40'),
    color: '#FF4D4F',
  },
  not_configure: {
    text: $t('home.graphics.GraphicsList.qzynwza41'),
    color: '#FF4D4F',
  },
  stop_card: {
    text: $t('home.graphics.GraphicsList.qzynwza42'),
    color: '#E4E4E4',
  },
  loss_card: {
    text: $t('home.graphics.GraphicsList.qzynwza43'),
    color: '#E4E4E4',
  },
  off_line: {
    text: $t('home.graphics.GraphicsList.qzynwza44'),
    color: '#F0F2F5',
  },
};
const protectReasonMap = {
  change_template: $t('home.graphics.GraphicsList.qzynwza45'),
  update_worker: $t('home.graphics.GraphicsList.qzynwza46'),
  restart_excavate: $t('home.graphics.GraphicsList.qzynwza47'),
  stop_excavate: $t('home.graphics.GraphicsList.qzynwza48'),
  restart_miner: $t('home.graphics.GraphicsList.qzynwza49'),
  disable_card: $t('home.graphics.GraphicsList.qzynwza50'),
  shutdown_miner: $t('home.graphics.GraphicsList.qzynwza51'),
};
export default {
  data() {
    return {
      headerData: {},
      selectListData: {},
      interval: 60,
      hasDefaultModel: false, // 是否有默认模板
      msgbox: null,
      abnormalOnly: false,
      editWorkerDis: false,
      alterDis: false,
      editForm: {
        worker: '',
      },
      editMac: '',
      editOldWorker: '',
      editTemplate: '',
      workerRules: [
        {
          required: true,
          message: $t('home.graphics.GraphicsList.qzynwza52'),
          trigger: 'blur',
        },
      ],
      manageList: [
        {
          title: $t('home.graphics.GraphicsList.qzynwza53'),
          children: [
            {
              prop: 'statusSince',
              label: $t('home.graphics.GraphicsList.qzynwza54'),
            },
            {
              prop: 'gpuCount',
              label: $t('home.graphics.GraphicsList.qzynwza55'),
            },
            {
              prop: 'powerWaste',
              label: $t('home.graphics.GraphicsList.qzynwza56'),
            },
            // {
            //   prop: 'delay',
            //   label: $t('home.graphics.GraphicsList.qzynwza57'),
            // },
            {
              prop: 'elapsed',
              label: $t('home.graphics.GraphicsList.qzynwza58'),
            },
            {
              prop: 'cpuType',
              label: $t('home.graphics.GraphicsList.qzynwza59'),
            },
          ],
        },
        {
          title: $t('home.graphics.GraphicsList.qzynwza60'),
          children: [
            {
              prop: 'template',
              label: $t('home.graphics.GraphicsList.qzynwza61'),
            },
            {
              prop: 'coinType',
              label: $t('home.graphics.GraphicsList.qzynwza62'),
            },
            {
              prop: 'poolType',
              label: $t('home.graphics.GraphicsList.qzynwza63'),
            },
            {
              prop: 'software',
              label: $t('home.graphics.GraphicsList.qzynwza64'),
            },
          ],
        },
        {
          title: $t('home.graphics.GraphicsList.qzynwza65'),
          children: [
            {
              prop: 'updateTime',
              label: $t('home.graphics.GraphicsList.qzynwza66'),
            },
          ],
        },
      ],
      localStorageKey: 'graphicsListColumns',
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
          label: $t('home.graphics.GraphicsList.qzynwza67'),
          minWidth: '80',
        },
        {
          prop: 'worker',
          label: $t('home.graphics.GraphicsList.qzynwza68'),
          width: '179',
          columnType: 'edit',
          onClick: this.onClick,
        },
        {
          prop: 'ip',
          label: $t('home.graphics.GraphicsList.qzynwza69'),
          minWidth: this.language === 'en' ? '155' : '145',
          columnType: 'slot',
        },
        {
          prop: 'status',
          label: $t('home.graphics.GraphicsList.qzynwza70'),
          minWidth: this.language === 'en' ? '150' : '105',
          columnType: 'statusColor',
          statusMap,
        },
        {
          prop: 'statusSince',
          label: $t('home.graphics.GraphicsList.qzynwza71'),
          minWidth: this.language === 'en' ? '135' : '125',
          isUnShow: true,
          sortable: 'custom',
        },
        {
          prop: 'calcRT',
          label: $t('home.graphics.GraphicsList.qzynwza72'),
          minWidth: this.language === 'en' ? '185' : '120',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'MH/S',
          decimal: 2,
          multiple: 1000,
        },
        {
          prop: 'gpuCount',
          label: $t('home.graphics.GraphicsList.qzynwza73'),
          minWidth: this.language === 'en' ? '145' : '100',
          isUnShow: true,
          sortable: 'custom',
        },
        {
          prop: 'gpuList',
          label: $t('home.graphics.GraphicsList.qzynwza74'),
          minWidth: '105',
          columnType: 'slot',
          'class-name': 'cardStatusBox',
        },
        {
          prop: 'temperature',
          label: $t('home.graphics.GraphicsList.qzynwza75'),
          minWidth: '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: '℃ ', // 这个空格需要保留
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'rejectRate',
          label: $t('home.graphics.GraphicsList.qzynwza76'),
          minWidth: this.language === 'en' ? '145' : '100',
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: '% ', // 这个空格需要保留
          decimal: 2,
          multiple: Number.MAX_SAFE_INTEGER,
        },
        {
          prop: 'powerWaste',
          label: $t('home.graphics.GraphicsList.qzynwza77'),
          minWidth: this.language === 'en' ? '175' : '100',
          isUnShow: true,
          sortable: 'custom',
          columnType: 'calcSuffix',
          unit: 'W ',
          multiple: Number.MAX_SAFE_INTEGER,
        },
        // {
        //   prop: 'delay',
        //   label: $t('home.graphics.GraphicsList.qzynwza78'),
        //   minWidth: '100',
        //   isUnShow: true,
        //   sortable: 'custom',
        //   columnType: 'calcSuffix',
        //   unit: 'Ms',
        //   multiple: Number.MAX_SAFE_INTEGER,
        // },
        {
          prop: 'elapsed',
          label: $t('home.graphics.GraphicsList.qzynwza79'),
          minWidth: this.language === 'en' ? '145' : '100',
          isUnShow: true,
          sortable: 'custom',
        },
        {
          prop: 'cpuType',
          label: $t('home.graphics.GraphicsList.qzynwza80'),
          minWidth: '200',
          isUnShow: true,
          isWhiteSpace: true,
        },
        {
          prop: 'template',
          label: $t('home.graphics.GraphicsList.qzynwza81'),
          minWidth: '140',
          isUnShow: true,
          columnType: 'slot',
          isWhiteSpace: true,
        },
        {
          prop: 'coinType',
          label: $t('home.graphics.GraphicsList.qzynwza82'),
          width: '120',
          columnType: 'imgText',
          isUnShow: true,
        },
        {
          prop: 'poolType',
          label: $t('home.graphics.GraphicsList.qzynwza83'),
          width: '120',
          columnType: 'imgText',
          isUnShow: true,
        },
        {
          prop: 'software',
          label: $t('home.graphics.GraphicsList.qzynwza84'),
          minWidth: '140',
          columnType: 'slot',
          isUnShow: true,
        },
        {
          prop: 'mac',
          label: $t('home.graphics.GraphicsList.qzynwza85'),
          minWidth: '150',
        },
        {
          prop: 'ssh',
          label: $t('home.graphics.GraphicsList.qzynwza86'),
          minWidth: '100',
        },
        {
          prop: 'updateTime',
          label: $t('home.graphics.GraphicsList.qzynwza87'),
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
  components: { Header, CommonManageList, CommonTable, Operate },
  methods: {
    getDefaultModel() {
      this.hasDefaultModel = false;
      getDefaultModel({ factoryId: this.factoryId }).then(res => {
        this.hasDefaultModel = res?.data?.length > 0;
      });
    },
    getGraphicsStatistics() {
      getGraphicsStatistics({ factoryId: this.factoryId }).then(res => {
        const { statusStat, generalError, lowCalc, invalid } = res.data;
        this.headerData =
          { ...statusStat, generalError, lowCalc, invalid } || {};
      });
    },
    getGraphicsSelectList() {
      getGraphicsSelectList({ factoryId: this.factoryId }).then(res => {
        // 设置筛选数据
        res.data = res.data || {};
        for (let item in res.data) {
          if (res.data[item]) {
            res.data[item] = this.getValueAndLabelByList(res.data[item]);
          }
        }
        res.data.statusList = [
          {
            label: $t('home.graphics.GraphicsList.qzynwza88'),
            value: 'normal',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza89'),
            value: 'temperature_anomaly',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza90'),
            value: 'high_reject_rate',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza91'),
            value: 'main_board_stoppage',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza92'),
            value: 'low_calculation',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza93'),
            value: 'loss_card',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza94'),
            value: 'un_calculation',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza95'),
            value: 'mining_stoppage',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza96'),
            value: 'not_configure',
          },
          {
            label: $t('home.graphics.GraphicsList.qzynwza97'),
            value: 'off_line',
          },
        ];
        this.selectListData = res.data;
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
      this.getDefaultModel();
      if (resetPage) {
        this.pageIndex = 1;
      }
      let params = { ...this.query, factoryId: this.factoryId };
      this.loading = true;
      getGraphicsList(params)
        .then(res => {
          // 数据处理
          res.data &&
            res.data.forEach((item, index) => {
              item.checked = item.protect ? false : this.checkAllOption === 2;
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
                    $t('home.graphics.GraphicsList.qzynwza98')) ||
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
      setIntervalToLocalStorage('graphicslist', this.interval);
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
        this.getGraphicsStatistics();
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
      this.$router.push({
        name: 'graphicsdetail',
        query: {
          minerId: row.minerId || '',
          mac: row.mac || '',
          isProtect: (row.protect && '1') || undefined,
        },
      });
    },
    setCheckAllOption(value = false) {
      this.checkAllOption = value;
    },
    switchType(type) {
      const map = {
        statusSince: 'status_since',
        calcRT: 'calc_rt',
        gpuCount: 'gpu_count',
        temperature: 'temperature',
        rejectRate: 'reject_rate',
        powerWaste: 'power_waste',
        delay: 'delay',
        elapsed: 'elapsed',
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
    // 点击矿机id中修改图标
    onClick(row = {}) {
      if (!this.hasDefaultModel) {
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
      if(row.status === 'off_line'){
        this.$message.warning($t('home.graphics.GraphicsList.qzynwza103'))
        return
      }
      if(row.protect){
        this.$message.warning($t('home.graphics.GraphicsList.qzynwza104'))
        return
      }
      // off_line
      this.editWorkerDis = true;
      this.editForm.worker = row.worker || '';
      this.editMac = row.mac || '';
      this.editOldWorker = row.worker || '';
      this.editTemplate = row.template || '';
    },
    onIpClick() {
      this.$track([
        '_trackEvent',
        // this.userKey,
        // this.currentFactory.name,
        `显卡矿机列表-查看IP`,
        0,
      ]);
    },
    onAbnormalOnlyChange(value) {
      this.$router.replace({
        query: { ...this.$route.query, abnormalOnly: value || undefined },
      });
      this.getList(true);
    },
    closeEditWorkerId() {
      this.editWorkerDis = false;
    },
    confirm_edit() {
      this.$refs['editRuleForm'].validate(valid => {
        if (valid) {
          this.alterDis = true;
          // if (!this.editTemplate) {
          //   this.alterDis = true;
          // } else {
          //   this.confirm_alter();
          // }
        }
      });
    },
    // 只能输入数字
    workerChange(value) {
      if(value.data === null){
        this.editOldWorker = this.editOldWorker.substr(0,this.editOldWorker.length-1)
        this.editForm.worker = this.editOldWorker;
      }
      if (!(/\d/.test(value.data) && /\d/.test(this.editForm.worker))) {
        this.editForm.worker = this.editOldWorker;
      } else {
        this.editOldWorker = this.editForm.worker;
      }
    },
    clearEdit() {
      this.editForm.worker = this.editOldWorker = ''
    },
    confirm_alter() {
      editGraphicsId({
        factoryId: this.factoryId,
        macs: [this.editMac],
        minerWorkerId: this.editForm.worker,
      }).then(res => {
        const { code, failNum, successNum } = res;
        if (code === 200) {
          let message = '';
          successNum > 0 &&
            (message +=
              successNum + $t('home.graphics.GraphicsList.qzynwza99'));
          failNum > 0 &&
            (message +=
              (successNum > 0 ? ',' : '') +
              failNum +
              $t('home.graphics.GraphicsList.qzynwza100'));
          this.yfAlert(message, 'success');
          this.alterDis = false;
          this.editWorkerDis = false;
          this.getList();
        }
      });
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
    $route: {
      handler(v) {
        const { abnormalOnly } = v.query;
        this.abnormalOnly = !!abnormalOnly;
      },
      immediate: true,
    },
    factoryId: {
      handler(value) {
        if (value) {
          this.getList(true);
          this.getGraphicsSelectList();
          this.getGraphicsStatistics();
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
    graphicsStatusMap() {
      return graphicsStatusMap;
    },
    protectReasonMap() {
      return protectReasonMap;
    },
    // 查询参数转换
    query() {
      let {
        cpuTypes,
        coinTypes,
        poolTypes,
        softwares,
        statuses,
        templateId,
        abnormalOnly,
      } = this.$route.query;
      // 只看故障机，非正常的全带上
      if (abnormalOnly) {
        let statusList = this.selectListData['statusList'] || [];
        let statusTemp = [];
        statusList.forEach(item => {
          item.value && item.value !== 'normal' && statusTemp.push(item.value);
        });
        statuses = statusTemp.join(',');
      }
      return {
        page: {
          // page 分页
          index: this.pageIndex,
          size: this.pageSize,
        },
        statuses: statuses || undefined,
        cpuTypes: cpuTypes || undefined,
        coinTypes: coinTypes || undefined,
        poolTypes: poolTypes || undefined,
        softwares: softwares || undefined,
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
    operateParams() {
      if (!this.factoryId) {
        return {};
      }
      if (this.checkAllOption === 2) {
        return {
          factoryId: this.factoryId,
          all: true,
          query: { ...this.query },
        };
      } else {
        return { factoryId: this.factoryId, macs: this.macs };
      }
    },
  },
  created() {
    this.onSearchBy = debounce(this.onSearchBy, 500);
    this.interval = getIntervalToLocalStorage('graphicslist');
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
<style lang="scss" scoped>
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

/deep/ .cardStatusBox .cell {
  word-wrap: break-word !important;
  white-space: normal !important;
  .cardStatusItem {
    display: inline-block;
    height: 14px;
    width: 14px;
    font-size: 8px;
    // line-height: 21px;
    margin-right: 2px;
    // text-align: center;
    background-color: #e4e4e4;
    position: relative;
  }
  .Xbox {
    position: absolute;
    top: -3px;
    left: 3px;
  }
}

.action-buttons {
  .el-button {
    & + .el-button {
      margin-left: 8px;
    }
  }
}
/deep/ .editBox .el-dialog__body {
  min-height: 180px;
  padding-top: 32px;
}
/deep/ .alterBox .el-dialog__body {
  min-height: 180px;
  padding-top: 32px;
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
/deep/ .el-table th,
/deep/ .el-table td {
  &:last-child {
    text-align: right;
  }
}
</style>
