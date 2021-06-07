<!--  -->
<template>
  <div>
    <span :class="isRed ? 'redBox' : 'blueBox'">{{ text || 0 + '%' }}</span>
  </div>
</template>

<script>
export default {
  props: {
    isRed: {
      require: true,
      default: false,
      type: [String, Boolean],
    },
    text: {
      require: true,
      default: '0',
      type: [String, Number],
    },
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.redBox {
  color: #f05656;
  background: rgba(240, 86, 86, 0.1);
  border-radius: 2px;
  display: inline-block;
  padding: 2px 8px 0px 8px;
}
.blueBox {
  color: #308af4;
  background: rgba(48, 138, 244, 0.1);
  border-radius: 2px;
  display: inline-block;
  padding: 2px 8px 0px 8px;
}
</style>