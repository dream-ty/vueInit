<template>
  <div class="">
    <div class="chart" ref="chart"></div>
    <div ref="tooltip" v-show="false">
      <div class="chart-tooltip">
        <div class="mb-m">
          {{ tooltipData.time | time }}
        </div>
        <div>
          <span>{{ $t('UvD12hKXBbSbTRNNRCOsn') }}</span>
          <span
            >{{ getClacNums(tooltipData.value, tooltipData.calcUnit)
            }}{{ getClacUnit(tooltipData.value, tooltipData.calcUnit) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chart from '@/../common-module/mixin/chart.js';
import { hexToRGB, getAxisRange } from '@/../common-module/utils/';
import sassVars from '@/style/_var.scss';
import utils from '@/handle';
// import moment from 'moment';

export default {
  mixins: [chart],
  methods: {
    getClacNums(item, unit) {
      return utils.switchUnit(item, unit).num;
    },
    getClacUnit(item, unit) {
      return utils.switchUnit(item, unit).unit;
    },
    drawCharts(chartData) {
      this.drawChart(chartData);
    },
    getChartOption(chartData) {
      const values = chartData.map(item => item.value);
      if (values.length === 0) {
        values.push(0);
      }
      const { unit, carry } = utils.switchUnit(Math.max(...values), 'KH/S');
      const [r, g, b] = hexToRGB(sassVars.themeColor).values;
      const range = getAxisRange(values);
      const formatter = this.$options.filters.time;
      return this.getLineChartOption(chartData, {
        grid: {
          bottom: 40,
        },
        xAxis: {
          data: chartData.map(item => {
            return formatter(item.time, 'HH:mm');
          }),
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#EBEBEB',
              width: 1,
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          name: unit,
          min: Math.max(range.min, 0),
          max: range.max,
          axisLabel: {
            formatter(value) {
              const result = value / Math.pow(1000, carry);
              return (+result).toFixed(2);
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#EBEBEB',
              width: 1,
            },
          },
          axisTick: {
            show: false,
          },
        },
        tooltip: this.getTooltipOption(carry),
        lineStyle: {
          shadowColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
          shadowBlur: 10,
          shadowOffsetY: 5,
        },
      });
    },
    getTooltipOption(carry) {
      return {
        trigger: 'axis',
        backgroundColor: 'rgba(46,48,51,0.9)',
        padding: 0,
        position: function (point, params, dom) {
          dom.style.transform = 'translateZ(0)';
        },
        formatter: (params, format, callback) => {
          this.tooltipData = {
            ...params[0].data,
          };
          this.$nextTick(() => {
            callback(format, this.$refs.tooltip.innerHTML);
          });
          return 'Loading';
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: sassVars.themeColor,
            color: '#fff',
            formatter({ value, axisDimension }) {
              if (axisDimension === 'y') {
                const result = value / Math.pow(1000, carry);
                return (+result).toFixed(2);
              }
              return value;
            },
          },
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 600px;
}
</style>
