<!--  -->
<template>
  <div>
    <span v-if="textCalc.text || textCalc.text === 0"
      >{{ textCalc.text || 0 }} <span class="suffix" >{{ textCalc.suffix }}</span>
    </span>
    <span v-else>-</span>
  </div>
</template>

<script>
import { switchUnit } from '@/handle/index'
export default {
  props: {
    text: {
      require: true,
      default: '',
      type: [String, Number],
    },
    unit: {
      require: true,
      default: 'GiB',
      type: [String],
    },
    decimal: {
      require: true,
      default: 3,
      type: [Number],
    },
    multiple: {
      require: true,
      default: 1000,
      type: [Number],
    },
  },
  data() {
    return {};
  },
  computed: {
    textCalc() {
      let a = switchUnit(this.text, this.unit, this.decimal, this.multiple )
      return {
        text: a.value,
        suffix: a.unit,
      }
    },
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.suffix {
  color: #999999;
}
</style>