<template>
  <div class="page-container flexbox vertical">
    <div class="card mb-xl flexbox vertical">
      <div class="header flexbox align-center">
        <i class="iconfont icon-back" @click="$router.go(-1)"></i>
        <span class="f-22 color-0 ml-s">{{
          $t('GraphicsDetail.vuegW7PIdiqOk16ThMaGpmWl')
        }}</span>
        <Operate
          :params="operateParams"
          :nums="1"
          @getList="getList"
          :is-protect="isProtect"
          :no-default-model="!hasDefaultModel"
          class="operateClassBox"
        />
      </div>
      <section class="padding flexbox vertical" v-loading="loading1">
        <span class="f-18 color-3">{{
          $t('machineManagement.InspectMinerDialog.5a4jcxk85l40')
        }}</span>
        <div class="flexbox mt-xl">
          <div class="flex-1 flexbox vertical">
            <span class="f-14 color-6"
              >ID:<span class="color-3 ml-s">{{
                minerTopDada.worker | empty
              }}</span></span
            >
            <span class="f-14 color-6 mt-xl"
              >{{ $t('GraphicsDetail.vuemDe4zEgKmifxjm1_h7fJ1') }}:<span
                class="color-3 ml-s"
                >{{ minerTopDada.ip | empty }}</span
              ></span
            >
            <span class="f-14 color-6 mt-xl"
              >{{ $t('GraphicsDetail.vueiydhaAbONkQq7K-2a3GEe') }}:<span
                class="color-3 ml-s"
                >{{ minerTopDada.minerId | empty }}</span
              ></span
            >
          </div>
          <div class="flex-1 flexbox vertical">
            <span class="f-14 color-6"
              >{{ $t('GraphicsDetail.vue1jkHGloqYqtkpzImO4tPP') }}:<span
                class="color-3 ml-s"
                >{{ minerTopDada.cpuType | empty }}</span
              ></span
            >
            <span class="f-14 color-6 mt-xl"
              >{{ $t('GraphicsDetail.vuev8_XjO0wt9Q_S9-DCTCJl') }}:<span
                class="color-3 ml-s"
                >{{ minerTopDada.internetIp | empty }}</span
              ></span
            >
            <span class="f-14 color-6 mt-xl"
              >{{ $t('machineManagement.MinerDetail.5a3ztihw6pc0') }}:<span
                class="color-3 ml-s"
                >{{ getUpdateDate(minerTopDada.updateTime) }}</span
              ></span
            >
          </div>
          <div class="flex-1 flexbox vertical">
            <span class="f-14 color-6"
              >{{ $t('GraphicsDetail.vueD6KBi650OIZ_TFFRyS84u') }}:<span
                class="color-3 ml-s"
                >{{ getStatus(minerTopDada.status) }}</span
              ></span
            >
            <span class="f-14 color-6 mt-xl"
              >MAC:<span class="color-3 ml-s">{{
                minerTopDada.mac | empty
              }}</span></span
            >
          </div>
        </div>
      </section>
    </div>
    <section class="card mb-xl padding flexbox vertical" v-loading="loading1">
      <span class="f-18 color-3">{{
        $t('GraphicsDetail.vueecfypEnT3dPQEzh7ipmp5')
      }}</span>
      <div class="flexbox mt-xl">
        <div class="flex-1 flexbox vertical">
          <span class="f-14 color-6"
            >{{ $t('GraphicsDetail.vueb0KxK8fTsIEP22qI0_MkF') }}:<span
              class="color-3 ml-s"
              >{{
                minerTopDada.template && minerTopDada.template.name
                  ? minerTopDada.template.name
                  : '-'
              }}</span
            ></span
          >
          <span class="f-14 color-6 mt-xl"
            >{{ $t('GpuTemplates.vueaTOdR0zyYtvQ6rKT5uylA') }}:<span
              class="color-3 ml-s"
              >{{
                minerTopDada.software && minerTopDada.software.name
                  ? minerTopDada.software.name
                  : '-'
              }}</span
            ></span
          >
        </div>
        <div class="flex-1 flexbox vertical">
          <span class="f-14 color-6"
            >{{ $t('GpuTemplates.vueOKBFIjJNOPamUrW7bej_t') }}:<span
              class="color-3 ml-s images_f"
            >
              <img
                v-if="minerTopDada.coinType && minerTopDada.coinType.name"
                class="icons"
                :src="iconList[minerTopDada.coinType.name.toLowerCase()]"
              />
              <span class="icon_text">{{
                minerTopDada.coinType && minerTopDada.coinType.name
                  ? minerTopDada.coinType.name
                  : '-'
              }}</span>
            </span></span
          >
          <span class="f-14 color-6 mt-xl"
            >{{ $t('GpuTemplates.vueuxveVESaGEawtwL3H8fim') }}:<span
              class="color-3 ml-s"
              >{{ minerTopDada.wallet | empty }}</span
            ></span
          >
        </div>
        <div class="flex-1 flexbox vertical">
          <span class="f-14 color-6"
            >{{ $t('E9K5ej8hxl9Swi_KHLN6f') }}:<span
              class="color-3 ml-s images_f"
            >
              <img
                v-if="minerTopDada.poolType && minerTopDada.poolType.name"
                class="icons"
                :src="iconList[minerTopDada.poolType.name.toLowerCase()]"
              />
              <span class="icon_text">{{
                minerTopDada.poolType && minerTopDada.poolType.name
                  ? minerTopDada.poolType.name
                  : '-'
              }}</span>
            </span></span
          >
        </div>
      </div>
    </section>
    <section class="card mb-xl padding flexbox vertical" v-loading="loading2">
      <span class="f-18 color-3 mb-m">{{
        $t('GraphicsDetail.vueNGRQJpRDAbQR6FpkieW8n')
      }}</span>
      <el-table
        fixed
        class="flex-fill responsive-table"
        :data="graphicsData"
        ref="multipleTable"
        @sort-change="filterHandler"
      >
        <el-table-column
          :label="$t('machineManagement.RoomFormDialog.5a8zatl8jk00')"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">{{ scope.row.sortId | empty }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          :label="$t('home.graphics.GraphicsError.qzynwn52')"
        >
          <template slot-scope="scope">
            <div class="f-14 color-3">
              {{ scope.row.gpuType | empty }}
            </div>
            <div class="f-12 color-3">
              {{ scope.row.gpuModel | empty }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('SxdkqiSqch8hBZk3oqsWt')">
          <template slot-scope="scope">
            <div
              v-if="scope.row.status"
              class="status_bg"
              :style="'background-color:' + getStatusColors(scope.row.status)"
            >
              {{ getStatus(scope.row.status) }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('machineManagement.MinerDetail.5a3ztihw5gk0')"
          prop="calcRT"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">
              {{ switchUnit(scope.row.calcRT, 'MH/S').num | empty }}</span
            ><span class="f-14 color-9 ml-xs">{{
              switchUnit(scope.row.calcRT, 'MH/S').unit | empty
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('machineManagement.MinerDetail.5a3ztihw6cg0')"
          prop="temperature"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">
              {{ scope.row.temperature | empty }}</span
            ><span class="f-14 color-9 ml-xs">℃</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('GraphicsDetail.vuewUJR_kqemyOw4DwNBHUNi')"
          prop="powerWaste"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">
              {{ Math.round(scope.row.powerWaste) | empty }}</span
            ><span class="f-14 color-9 ml-xs">W</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('GraphicsDetail.vueoNlxaOE68Zp_ZEn6q0s4n')"
          prop="frequency"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3"> {{ scope.row.frequency | empty }}</span
            ><span class="f-14 color-9 ml-xs">HZ</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('home.graphics.GraphicsError.qzynwn48')"
          v-if="false"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3"> {{ scope.row.voltage | empty }}</span
            ><span class="f-14 color-9 ml-xs">V</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('home.graphics.GraphicsError.qzynwn50')"
          prop="memoryFrequency"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">
              {{ scope.row.memoryFrequency | empty }}</span
            ><span class="f-14 color-9 ml-xs">HZ</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('D2cSw8fSYhkUIsuL3Cpco')"
          prop="rejectRate"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3">
              {{
                scope.row.rejectRate
                  ? scope.row.rejectRate.toFixed(2)
                  : scope.row.rejectRate == '0'
                  ? '0'
                  : '-'
              }}</span
            ><span class="f-14 color-9 ml-xs">%</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('pHHMfjJCD-V5SlCrZgqQp')"
          prop="fanSpeed"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span class="f-14 color-3"> {{ scope.row.fanSpeed | empty }}</span
            ><span class="f-14 color-9 ml-xs">r/min</span>
          </template>
        </el-table-column>
        <el-table-column
          width="50"
          :label="$t('machineManagement.AddToRepairsDialog.5a4iwqc72c00')"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="isDis(scope.row)"
              @click="forBiddenDialog(scope.row)"
              >{{ $t('GraphicsDetail.vuejAwEKPfU_8aNLFEHLBNe8') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="card mb-xl padding flexbox vertical" v-loading="loading3">
      <div class="flexbox space-bt">
        <span class="f-18 color-3">{{
          $t('GraphicsDetail.vuejd-lXsZeAQOJqG3JJ033o')
        }}</span>
        <span>
          <span class="line"></span>
          <span class="f-12 color-9 mr-l">{{
            $t('machineManagement.MinerDetail.5a3ztihw5gk0')
          }}</span>
        </span>
      </div>
      <miner-hash ref="miner"></miner-hash>
    </section>
    <section class="card padding flexbox vertical" v-loading="loading4">
      <span class="f-18 color-3">{{
        $t('GraphicsDetail.vue808HYppF9WILsz2gWRyLd')
      }}</span>
      <graphics-hash ref="graphics"></graphics-hash>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MinerHash from './component/GPUMinerHash.vue';
import GraphicsHash from './component/GraphicsHash.vue';
import Operate from './component/Operate.vue';
import {
  getMinerDetail,
  getGraphicsDetail,
  getMinerHashRate,
  getGraphicsHashRate,
  forbidGraphics,
  getDefaultModel,
} from '@/../common-module/api/graphics.js';
import moment from 'moment';
import { $t } from '@/plugins/i18n';
import icons from '@/mixin/iconList.js';
import utils from '@/handle';

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
  main_board_stoppage: {
    text: $t('home.graphics.GraphicsList.qzynwza28'),
    color: '#F05697',
  },
};
export default {
  mixins: [icons],
  components: {
    MinerHash,
    GraphicsHash,
    Operate,
  },
  data() {
    return {
      minerId: '',
      mac: '',
      isProtect: undefined,
      minerTopDada: '',
      graphicsData: [],
      coinTypeList: [],
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      checkedRows: [],
      hasDefaultModel: false, // 是否有默认模板
    };
  },
  computed: {
    ...mapGetters(['factoryId', 'userRole']),
    operateParams() {
      return { factoryId: this.factoryId, macs: [this.mac] };
    },
  },
  watch: {
    factoryId() {
      this.getList();
    },
  },
  created() {
    this.minerId = this.$route.query.minerId || '';
    this.mac = this.$route.query.mac || '';
    this.isProtect = this.$route.query.isProtect || undefined;
    this.getList();
  },
  methods: {
    isDis(row) {
      return (
        row.protect ||
        row.status == 'off_line' ||
        row.status == 'stop_card' ||
        row.status == 'loss_card' ||
        row.status == 'not_configure' ||
        row.status == 'mining_stoppage'
      );
    },
    getDefaultModel() {
      this.hasDefaultModel = false;
      getDefaultModel({ factoryId: this.factoryId }).then(res => {
        this.hasDefaultModel = res?.data?.length > 0;
      });
    },
    forBiddenDialog(rows) {
      this.$confirm(
        `${this.$t('GraphicsDetail.vueRYwVIRlTRCWpTnA_c1DD7')}`,
        this.$t('machineManagement.RepairDetails.5a4ih0g7mf40'),
        {
          confirmButtonText: this.$t(
            'machineManagement.RepairDetails.5a4ih0g7mho0'
          ),
          cancelButtonText: this.$t(
            'machineManagement.RepairDetails.5a4ih0g7mkw0'
          ),
          type: 'warning',
        }
      ).then(() => {
        this.forbidGraphics(rows);
      });
    },
    forbidGraphics(rows) {
      if (!this.factoryId) return;
      const params = {
        factoryId: this.factoryId,
        cards: [
          {
            cardNo: rows.sortId,
            minerId: rows.minerId,
          },
        ],
      };
      forbidGraphics(params).then(res => {
        const { code, failNum, successNum } = res;
        if (code === 200) {
          let message = '';
          message =
            successNum > 0
              ? $t('GraphicsDetail.vueOS_QzVMXMsCooLdOCLS47')
              : failNum > 0
              ? $t('GraphicsDetail.vue0uc2QZmpMf6y7wRkfJrj6')
              : '';
          if (message) this.yfAlert(message, 'success');
          this.getTableDetails();
        }
      });
    },
    filterHandler(column) {
      let orderType = column.prop;
      switch (orderType) {
        case 'calcRT':
          orderType = 'calc_rt';
          break;
        case 'temperature':
          orderType = 'temperature';
          break;
        case 'powerWaste':
          orderType = 'power_waste';
          break;
        case 'frequency':
          orderType = 'frequency';
          break;
        case 'memoryFrequency':
          orderType = 'memory_frequency';
          break;
        case 'rejectRate':
          orderType = 'reject_rate';
          break;
        case 'fanSpeed':
          orderType = 'fan_speed';
          break;
        default:
          orderType = undefined;
          break;
      }
      const orderMethod = column.order
        ? column.order == 'ascending'
          ? 'asc'
          : 'desc'
        : '';
      const params = {
        orderMethod,
        orderType,
      };
      this.getTableDetails(params);
    },
    switchUnit(value, unit) {
      return utils.switchUnit(value, unit);
    },
    getStatus(status) {
      return status ? statusMap[status]?.text : '-';
    },
    getStatusColors(status) {
      return status ? statusMap[status]?.color : '#666';
    },
    getUpdateDate(data) {
      return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
    getList() {
      this.getTopDetails();
      this.getTableDetails();
      this.getMinerHash();
      this.getGraphicsHash();
    },
    getTopDetails() {
      if (!this.factoryId) return;
      this.loading1 = true;
      const parms = {
        factoryId: this.factoryId || undefined,
        minerId: this.minerId,
      };
      this.getDefaultModel();
      getMinerDetail(parms)
        .then(res => {
          this.minerTopDada = res.data;
        })
        .finally(() => {
          this.loading1 = false;
        });
    },
    getTableDetails(obj) {
      const parms = {
        factoryId: this.factoryId || undefined,
        minerId: this.minerId,
      };
      if (obj) {
        Object.assign(parms, obj);
      }
      this.loading2 = true;
      getGraphicsDetail(parms)
        .then(res => {
          this.graphicsData = res.data?.data ? res.data.data : [];
        })
        .finally(() => {
          this.loading2 = false;
        });
    },
    getMinerHash() {
      if (!this.factoryId) return;
      const parms = {
        factoryId: this.factoryId || undefined,
        mac: this.mac,
      };
      this.loading3 = true;
      getMinerHashRate(parms)
        .then(res => {
          let chartData = res.data?.data ? res.data.data : [];
          chartData = chartData.map(item => {
            return {
              ...item,
              time: item.time * 1000,
              calcUnit: 'KH/S',
              value: item.calc / 1000,
            };
          });
          this.$refs.miner?.drawCharts(chartData);
        })
        .catch(() => {
          this.$refs.miner?.drawCharts([]);
        })
        .finally(() => {
          this.loading3 = false;
        });
    },
    getGraphicsHash() {
      if (!this.factoryId) return;
      const parms = {
        factoryId: this.factoryId || undefined,
        mac: this.mac,
      };
      this.loading4 = true;
      getGraphicsHashRate(parms)
        .then(res => {
          let chartData = res.data?.data ? res.data.data : [];
          chartData = chartData.map(item => {
            const pro = item.calcData?.map(it =>
              moment(it.time * 1000).format('HH:mm')
            );
            const value = item.calcData?.map(it => it.calc / 1000);
            const maxvalue = Math.max(...value);
            return {
              ...item,
              values: value ? value : [],
              maxvalue: maxvalue,
              calcUnit: 'KH/S',
              product: pro ? pro : [],
            };
          });
          this.$refs.graphics?.drawCharts(chartData);
        })
        .catch(() => {
          this.$refs.graphics?.drawCharts([]);
        })
        .finally(() => {
          this.loading4 = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-container {
  height: 100%;
  margin: 24px;
}
.header {
  height: 60px;
  padding-left: 17px;
  border-bottom: 1px solid #ecf0f7;
  position: relative;
  & > i {
    cursor: pointer;
  }
  .operateClassBox {
    position: absolute;
    right: 24px;
  }
}
.padding {
  padding: 24px;
}
.card {
  border-radius: 4px;
  background: #fff;
}
.flex-1 {
  flex: 1;
}
.images_f {
  position: relative;
}
.icon_text {
  margin-left: 25px;
}
.icons {
  position: absolute;
  top: -2px;
  width: 20px;
  height: 20px;
}
.status_bg {
  font-size: 14px;
  color: #fff;
  padding: 1px 8px;
  border-radius: 2px;
}

.line {
  margin-bottom: 3px;
  margin-right: 8px;
  display: inline-block;
  height: 2px;
  width: 32px;
  background: #177bf6;
}
</style>
