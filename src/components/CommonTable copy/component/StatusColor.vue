<!--  -->
<template>
  <div><span class="commonBox" :class="text ? '': 'blankcolor'" :style="'background-color:' + color ">{{text || '-'}}</span></div>
</template>

<script>
export default {
  props: {
    text: {
      require: true,
      default: '',
      type: [String],
    },
    color: {
      require: true,
      default: '#000000',
      type: [String],
    },
  },
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {},
}
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.commonBox{
  color: #fff;
  border-radius: 2px;
  display: inline-block;
  padding: 2px 8px 0px 8px;
}
.blankcolor{
  color: #000;
}

</style>