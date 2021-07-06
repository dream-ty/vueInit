<!-- 操作按钮 -->
<template>
  <span class="operateBox">
    <el-dropdown trigger="click" class="border-dropdown ml-s align-center">
      <span class="el-dropdown-link btn-name">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc1') }}
        <i class="iconfont icon-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          :disabled="isProtect"
          @click.native="openAlter('stopMinier')"
        >
          {{ $t('home.graphics.GraphicsList.Operate.qzynwzc2') }}
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="isProtect"
          @click.native="openAlter('removeMiner')"
        >
          {{ $t('home.graphics.GraphicsList.Operate.qzynwzc3') }}
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="isProtect"
          @click.native="openAlter('closeMiner')"
        >
          {{ $t('home.graphics.GraphicsList.Operate.qzynwzc4') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      :disabled="isProtect"
      size="medium"
      type="primary"
      class="ml-s"
      @click="openAlter('restartActive')"
    >
      {{ $t('home.graphics.GraphicsList.Operate.qzynwzc5') }}
    </el-button>
    <el-button
      :disabled="isProtect"
      size="medium"
      type="primary"
      class=""
      @click="openAlter('restartMiner')"
    >
      {{ $t('home.graphics.GraphicsList.Operate.qzynwzc6') }}
    </el-button>
    <el-button
      :disabled="isProtect"
      size="medium"
      type="primary"
      @click="restartMinerDeploy('restartMinerDeploy')"
    >
      {{ $t('home.graphics.GraphicsList.Operate.qzynwzc7') }}
    </el-button>
    <el-dialog
      :title="$t('home.graphics.GraphicsList.Operate.qzynwzc8')"
      :visible.sync="alterDis"
      width="500px"
      class="alterDialogBox"
    >
      <div v-if="operateType === 'restartMiner'">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc9')
        }}{{
          nums === 1
            ? $t('home.graphics.GraphicsList.Operate.qzynwzc38')
            : $t('home.graphics.GraphicsList.Operate.qzynwzc39') +
              nums +
              $t('home.graphics.GraphicsList.Operate.qzynwzc40')
        }}{{ $t('home.graphics.GraphicsList.Operate.qzynwzc10') }}
      </div>
      <div v-else-if="operateType === 'closeMiner'">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc11')
        }}{{
          nums === 1
            ? $t('home.graphics.GraphicsList.Operate.qzynwzc38')
            : $t('home.graphics.GraphicsList.Operate.qzynwzc39') +
              nums +
              $t('home.graphics.GraphicsList.Operate.qzynwzc40')
        }}{{ $t('home.graphics.GraphicsList.Operate.qzynwzc12') }}
      </div>
      <div v-else-if="operateType === 'stopMinier'">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc13')
        }}{{
          nums === 1
            ? $t('home.graphics.GraphicsList.Operate.qzynwzc38')
            : $t('home.graphics.GraphicsList.Operate.qzynwzc39') +
              nums +
              $t('home.graphics.GraphicsList.Operate.qzynwzc40')
        }}{{ $t('home.graphics.GraphicsList.Operate.qzynwzc14') }}
      </div>
      <div v-else-if="operateType === 'restartActive'">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc15')
        }}{{
          nums === 1
            ? $t('home.graphics.GraphicsList.Operate.qzynwzc38')
            : $t('home.graphics.GraphicsList.Operate.qzynwzc39') +
              nums +
              $t('home.graphics.GraphicsList.Operate.qzynwzc40')
        }}{{ $t('home.graphics.GraphicsList.Operate.qzynwzc16') }}
      </div>
      <div v-else-if="operateType === 'removeMiner'">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc1511')
        }}{{
          nums === 1
            ? $t('home.graphics.GraphicsList.Operate.qzynwzc38')
            : $t('home.graphics.GraphicsList.Operate.qzynwzc39') +
              nums +
              $t('home.graphics.GraphicsList.Operate.qzynwzc40')
        }}{{ $t('home.graphics.GraphicsList.Operate.qzynwzc12') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAlter" plain>{{
          $t('home.graphics.GraphicsList.Operate.qzynwzc17')
        }}</el-button>
        <el-button type="primary" @click="confirm_alter">{{
          $t('home.graphics.GraphicsList.Operate.qzynwzc18')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('home.graphics.GraphicsList.Operate.qzynwzc19')"
      :visible.sync="tableDis"
      width="750px"
      class="modelBox"
    >
      <CommonTable
        :table-data="tableData"
        :column="column"
        :row-key="getRowKey"
        v-loading="loading"
        highlight-current-row
        @row-click="rowClick"
        :no-empty="true"
        :default-expand-all="true"
        :tree-props="{ children: 'pools', hasChildren: 'hasChildren' }"
        ref="commonTable"
      >
        <template #name="{ row }">
          <div class="flexbox nameContain">
            <div class="nameText">{{ row.name }}</div>
            <div v-if="row.isDefault" class="default">
              {{ $t('home.graphics.GraphicsList.Operate.qzynwzc20') }}
            </div>
          </div>
        </template>
      </CommonTable>
      <div class="emptyBox" v-if="!hasData">
        {{ $t('home.graphics.GraphicsList.Operate.qzynwzc34') }}“
        <span v-if="userRole === 'admin'"
          >{{ $t('home.graphics.GraphicsList.Operate.qzynwzc36')
          }}<span class="linkModel" @click="toSetModal">{{
            $t('home.graphics.GraphicsList.Operate.qzynwzc35')
          }}</span></span
        >
        <span v-if="userRole !== 'admin'">{{
          $t('home.graphics.GraphicsList.Operate.qzynwzc37')
        }}</span
        >”
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTable" plain>{{
          $t('home.graphics.GraphicsList.Operate.qzynwzc21')
        }}</el-button>
        <el-button
          type="primary"
          @click="confirm_deploy"
          :disabled="!templateId"
          >{{ $t('home.graphics.GraphicsList.Operate.qzynwzc2111') }}</el-button
        >
      </span>
    </el-dialog>
  </span>
</template>

<script>
import {
  stopMinier,
  removeMiner,
  closeMiner,
  restartActive,
  restartMiner,
  getTemplateList,
  restartMinerDeploy,
} from '@/../common-module/api/graphics';
import CommonTable from '@/views/components/CommonTable';
import { mapGetters } from 'vuex';
import { $t } from '@/plugins/i18n';
const messageMap = {
  stopMinier: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc22'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
  removeMiner: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc24'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
  closeMiner: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc25'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
  restartActive: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc26'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
  restartMiner: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc27'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
  restartMinerDeploy: [
    $t('home.graphics.GraphicsList.Operate.qzynwzc33'),
    $t('home.graphics.GraphicsList.Operate.qzynwzc23'),
  ],
};
export default {
  props: {
    // 请求接口需要的参数
    params: {
      type: Object,
      default: () => {},
    },
    // 选则的矿机数
    nums: {
      type: [String, Number],
      default: 0,
    },
    isProtect: {
      type: [String, Boolean],
      default: false,
    },
    noDefaultModel: {
      type: [String, Boolean],
      default: false,
    },
  },
  data() {
    return {
      alterDis: false,
      tableDis: false,
      loading: false,
      hasData: false,
      selectedRow: undefined,
      msgbox: null,
      operateType: '',
      templateId: '',
      tableData: [],
      column: [
        {
          prop: 'name',
          label: $t('home.graphics.GraphicsList.Operate.qzynwzc28'),
          width: '240',
          columnType: 'slot',
          'class-name': 'nameBox',
        },
        {
          prop: 'coinType',
          label: $t('home.graphics.GraphicsList.Operate.qzynwzc29'),
          width: '120',
          columnType: 'imgText',
        },
        {
          prop: 'poolType',
          label: $t('home.graphics.GraphicsList.Operate.qzynwzc30'),
          width: '120',
          columnType: 'imgText',
        },
        {
          prop: 'softwareName',
          label: $t('home.graphics.GraphicsList.Operate.qzynwzc31'),
          minWidth: '110',
          align: 'right',
          isWhiteSpace: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userRole',
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
  },
  components: { CommonTable },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    openAlter(operateType) {
      console.log(this.noDefaultModel, operateType);
      if (this.noDefaultModel && operateType === 'restartActive') {
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
      if (this.nums <= 0) {
        this.$message.warning(
          $t('home.graphics.GraphicsList.Operate.qzynwzc32')
        );
        return;
      }
      this.operateType = operateType;
      this.alterDis = true;
    },
    restartMinerDeploy(operateType) {
      if (this.nums <= 0) {
        this.$message.warning(
          $t('home.graphics.GraphicsList.Operate.qzynwzc32')
        );
        return;
      }
      this.operateType = operateType;
      this.tableDis = true;
      this.$nextTick(() => {
        this.$refs.commonTable?.$children?.[0]?.setCurrentRow(this.selectedRow);
      });
    },
    closeAlter() {
      this.operateType = '';
      this.alterDis = false;
    },
    closeTable() {
      this.operateType = '';
      this.tableDis = false;
    },
    // 提交二次确认请求
    confirm_alter() {
      const portMap = {
        stopMinier: stopMinier,
        removeMiner: removeMiner,
        closeMiner: closeMiner,
        restartActive: restartActive,
        restartMiner: restartMiner,
      };
      if (portMap[this.operateType]) {
        portMap[this.operateType](this.params)
          .then(res => {
            this.alterDis = false;
            const { code, failNum, successNum } = res;
            if (code === 200) {
              let message = '';
              successNum > 0 &&
                (message += successNum + messageMap[this.operateType]?.[0]);
              failNum > 0 &&
                (message +=
                  (successNum > 0 ? ',' : '') +
                  failNum +
                  messageMap[this.operateType]?.[1]);
              this.yfAlert(message, 'success');
              this.operateType = '';
              this.$emit('getList');
            }
          })
          .finally(() => {});
      }
    },
    confirm_deploy() {
      restartMinerDeploy({ ...this.params, templateId: this.templateId })
        .then(res => {
          const { code, failNum, successNum } = res;
          if (code === 200) {
            let message = '';
            successNum > 0 &&
              (message += successNum + messageMap[this.operateType]?.[0]);
            failNum > 0 &&
              (message +=
                (successNum > 0 ? ',' : '') +
                failNum +
                messageMap[this.operateType]?.[1]);
            this.yfAlert(message, 'success');
            this.operateType = '';
            this.tableDis = false;
            this.$emit('getList');
          }
        })
        .finally(() => {});
    },
    rowClick(row) {
      // 分组不选中
      if (!row.id || !row.poolType) {
        this.$refs.commonTable?.$children?.[0]?.toggleRowExpansion(row);
        // this.$refs.commonTable?.$children?.[0]?.setCurrentRow(this.selectedRow);
        // this.templateId = this.selectedRow.id;
        this.$refs.commonTable?.$children?.[0]?.setCurrentRow();
        this.templateId = '';
        return;
      }
      // 二次点击取消
      if (row.id === this.templateId) {
        this.$refs.commonTable?.$children?.[0]?.setCurrentRow();
        this.templateId = '';
        return;
      }
      this.selectedRow = row;
      this.$refs.commonTable?.$children?.[0]?.setCurrentRow(row);
      this.templateId = row.id;
    },
    getTemplateList() {
      getTemplateList({ factoryId: this.factoryId }).then(res => {
        this.tableData = res.data || [];
        this.hasData = false;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i]?.pools?.length > 0) {
            this.hasData = true;
            for (let j = 0; j < this.tableData[i].pools.length; j++) {
              if (this.tableData[i].pools[j].isDefault) {
                this.selectedRow = this.tableData[i].pools[j];
                this.templateId = this.tableData[i].pools[j].id;
                return;
              }
            }
          }
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
  created() {
    // this.getTemplateList()
  },
  mounted() {},
  watch: {
    factoryId: {
      handler(value) {
        if (value) {
          this.getTemplateList();
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.border-dropdown:hover {
  color: #308af4;
  border-color: #308af4 !important;
}
.border-dropdown {
  line-height: 28px;
}
.btn-name {
  font-size: 14px;
  font-weight: normal;
}
.operateBox {
  // width: 468px;
  display: flex;
  // flex-wrap: nowrap;
  // flex-direction: row;
}
/deep/ .alterDialogBox .el-dialog__body {
  min-height: 240px;
  padding-top: 32px;
}
/deep/ .el-table__body .cell .el-table__placeholder {
  width: 7px;
}
/deep/ .el-table__body .nameBox .cell {
  display: flex;
  .nameText {
    width: 159px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .default {
    color: #308af4;
    background: rgba(48, 138, 244, 0.1);
    border: 1px solid #308af4;
    font-size: 10px;
    height: 18px;
    line-height: 18px;
    margin-top: 3px;
    border-radius: 3px;
    padding: 0px 2px;
  }
}
.emptyBox {
  text-align: center;
  margin-top: 53px;
  .linkModel {
    color: #308af4;
    text-decoration: underline;
    cursor: pointer;
  }
}
.modelBox {
  /deep/ .el-table__row {
    cursor: pointer;
  }
  /deep/ .el-table__row--level-0 {
    &:hover td {
      background-color: #fff !important;
    }
    cursor: not-allowed;
  }
}
</style>