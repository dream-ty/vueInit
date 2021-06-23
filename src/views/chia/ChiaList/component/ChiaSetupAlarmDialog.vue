<template>
  <div class="">
    <el-dialog
      title="设置告警"
      width="595px"
      class="dialog"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="color-9">
          当矿机的CPU使用率 /
          缓存盘占用率不在指定范围时，系统会改变标签颜色提醒您。
        </div>
        <div class="flexbox align-center mt-xl">
          <el-input
            v-model="form.minCpuUse"
            v-numformat="{ min: 0, max: 100, precision: 0, isAuto: false }"
          >
            <template slot="append">%</template>
          </el-input>
          <div class="setting-item flexbox align-center space-bt">
            <span class="">≤</span>
            <span class="">CPU使用率</span>
            <span class="">≤</span>
          </div>
          <el-input
            class=""
            v-model="form.maxCpuUse"
            v-numformat="{ min: 0, max: 100, precision: 0, isAuto: false }"
          >
            <template slot="append">%</template>
          </el-input>
        </div>
        <div class="flexbox align-center mt-xl">
          <el-input
            v-model="form.minRamdisk"
            v-numformat="{ min: 0, max: 100, precision: 0, isAuto: false }"
          >
            <template slot="append">%</template>
          </el-input>
          <div class="setting-item flexbox align-center space-bt">
            <span class="">≤</span>
            <span class="">缓存盘使用率</span>
            <span class="">≤</span>
          </div>
          <el-input
            class=""
            v-model="form.maxRamdisk"
            v-numformat="{ min: 0, max: 100, precision: 0, isAuto: false }"
          >
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="mr-m" type="text" size="medium" @click="onReset"
          >重 置</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :disabled="isEmpty"
          :loading="loading"
          @click="onConfirm"
          >{{ $t('common.ok') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getChiaAlarm, modifyChiaAlarm } from '@/../common-module/api/chia';
export default {
  name: '',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      ruleId: undefined,
      form: {
        minCpuUse: 20,
        maxCpuUse: 80,
        minRamdisk: 20,
        maxRamdisk: 80,
      },
    };
  },
  computed: {
    isEmpty() {
      return Object.values(this.form).some(item => item === '');
    },
  },
  watch: {},
  created() {},
  methods: {
    showDialog() {
      getChiaAlarm().then(res => {
        this.ruleId = res.ruleId;
        this.form = {
          minCpuUse: res.cpuMinRate,
          maxCpuUse: res.cpuMaxRate,
          minRamdisk: res.diskMinRate,
          maxRamdisk: res.diskMaxRate,
        };
        this.visible = true;
      });
    },
    reset() {
      this.loading = false;
      this.ruleId = undefined;
      this.form = {
        minCpuUse: 20,
        maxCpuUse: 80,
        minRamdisk: 20,
        maxRamdisk: 80,
      };
    },
    onReset() {
      this.form = {
        minCpuUse: 20,
        maxCpuUse: 80,
        minRamdisk: 20,
        maxRamdisk: 80,
      };
    },
    onConfirm() {
      if (
        +this.form.minCpuUse > +this.form.maxCpuUse ||
        +this.form.minRamdisk > +this.form.maxRamdisk
      ) {
        this.yfAlert('设定范围上限值小于下限值，请修改范围数值', 'warning');
        return;
      }
      this.loading = true;
      modifyChiaAlarm({
        ruleId: this.ruleId,
        cpuMinRate: this.form.minCpuUse,
        cpuMaxRate: this.form.maxCpuUse,
        diskMinRate: this.form.minRamdisk,
        diskMaxRate: this.form.maxRamdisk,
      })
        .then(() => {
          this.visible = false;
          this.$emit('success');
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.setting-item {
  width: 119px;
  padding: 0 16px;
  box-sizing: content-box;
}
.dialog {
  /deep/.el-dialog__body {
    min-height: 200px;
    max-height: 200px !important;
    padding-top: 16px;
  }
}

.el-input {
  width: 150px;
  border: 1px solid #eceef2;
  /deep/.el-input__inner {
    padding: 0 16px;
    border: none;
  }
  /deep/.el-input-group__append {
    background-color: #fff;
    border: none;
  }
}
</style>
