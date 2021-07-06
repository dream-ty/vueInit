<template>
  <div class="">
    <div class="chart" ref="chart"></div>
    <div ref="tooltip" v-show="false">
      <div class="chart-tooltip">
        <div class="mb-m">
          {{ tooltipData.time | time }}
        </div>
        <div v-if="tooltipData.data && tooltipData.data.length > 0">
          <div
            v-for="(item, index) in tooltipData.data"
            :key="index"
            class="flexbox"
          >
            <span
              class="dot mr-xs"
              :style="'background-color:' + item.color"
            ></span>
            <span class="mr-m">{{ item.names }}</span
            ><span class="mr-s flex-fill">{{
              getClacNums(item.calcs, 'KH/S')
            }}</span
            ><span>{{ getClacUnit(item.calcs, 'KH/S') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chart from '@/../common-module/mixin/chart.js';
import { getAxisRange } from '@/../common-module/utils/';
import sassVars from '@/style/_var.scss';
import utils from '@/handle';

export default {
  mixins: [chart],
  data() {
    return {
      colors: [
        '#01EBD6',
        '#0068FA',
        '#00D4FA',
        '#00EBA2',
        '#0089DB',
        '#0300FA',
        '#6C01EB',
        '#A000F0',
        '#CE00F0',
        '#F000E6',
        '#F00082',
        '#F03A00',
        '#F07300',
        '#F09E00',
        '#F0D800',
      ],
      select: [],
    };
  },
  mounted() {
    this.setLegendSelectChanger(e => {
      if (e.selected) {
        const selectList = Object.keys(e.selected);
        this.select = selectList.filter(value => {
          return e.selected[value] == true;
        });
      }
    });
  },
  methods: {
    getClacNums(item, unit) {
      return utils.switchUnit(item, unit).num;
    },
    getClacUnit(item, unit) {
      return utils.switchUnit(item, unit).unit;
    },
    drawCharts(chartData) {
      if (chartData)
        chartData.forEach(item => {
          this.select.push(String(item.sortId));
        });
      this.drawChart(chartData);
    },
    getChartOption(chartData) {
      const maxValues = chartData.map(item => item.maxvalue);
      if (maxValues.length === 0) {
        maxValues.push(0);
      }
      const products = chartData.map(item => item.product)[0]
        ? chartData.map(item => item.product)[0]
        : [];
      const { unit, carry } = utils.switchUnit(Math.max(...maxValues), 'KH/S');
      const range = getAxisRange(maxValues);
      const mySeries = [];
      const series_item = {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
        symbol: 'none',
      };
      chartData.forEach(() => {
        mySeries.push(series_item);
      });
      const mySources = chartData.reduce((prevValue, currentValue) => {
        currentValue.values.unshift(String(currentValue.sortId));
        prevValue.push(currentValue.values);
        return prevValue;
      }, []);

      products.unshift('product');
      mySources.unshift(products);
      return this.getShareChartOption(chartData, {
        grid: { top: '10%', left: 60, right: '5%', bottom: '5%' },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 12,
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
        },
        tooltip: this.getTooltipOption(chartData, carry),
        dataset: {
          source: mySources,
        },
        series: mySeries,
      });
    },
    getTooltipOption(chartData, carry) {
      return {
        trigger: 'axis',
        backgroundColor: 'rgba(46,48,51,0.9)',
        padding: 0,
        position: function (point, params, dom) {
          dom.style.transform = 'translateZ(0)';
        },
        formatter: (params, format, callback) => {
          const cal_arr =
            params[0].data.length != 0 ? params[0].data.slice(1) : [];
          const name_arr =
            params[0].dimensionNames.length != 0
              ? params[0].dimensionNames.slice(1)
              : [];
          const data = [];
          cal_arr.forEach((value, index) => {
            const item = {};
            item.calcs = value;
            item.color = this.colors[index];
            item.names = name_arr[index];
            if (this.select.includes(name_arr[index])) data.push(item);
          });
          this.tooltipData = {
            time: chartData[0].calcData[params[0].dataIndex].time * 1000,
            data,
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
.dot {
  display: inline-block;
  margin-top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>
