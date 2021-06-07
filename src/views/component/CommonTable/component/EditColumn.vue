<!--  -->
<template>
  <div class="nameRow textover">
    <span :class="judgeLen(text) < 16 ? 'rel' : ''"
      >{{ text }}
      <span
        class="commedit"
        v-if="row.dis && judgeLen(text) < 16"
        @click="onClick(row)"
        ><i class="iconfont icon-modify" v-if="type === 'edit'"></i>
        <span v-else>修改</span></span
      >
    </span>
    <span
      v-show="row.dis && judgeLen(text) >= 16"
      class="edit"
      @click.prevent="onClick(row)"
      ><i class="iconfont icon-modify" v-if="type === 'edit'"></i>
      <span v-else>修改</span></span
    >
  </div>
</template>

<script>
export default {
  props: {
    row: {
      require: true,
      default: {},
      type: Object,
    },
    text: {
      require: true,
      default: '',
      type: String,
    },
    type: {
      require: true,
      default: 'edit',
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    judgeLen(str) {
      let strlen = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          strlen += 2; //如果是汉字，则字符串长度加2
        } else {
          strlen++;
        }
      }
      return strlen;
    },
    onClick(row = {}) {
      this.$emit('onClick', row);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.nameRow {
  position: relative;
  padding-right: 25px;
  .edit {
    position: absolute;
    right: 0;
    top: 1px;
    cursor: pointer;
    font-size: 12px;
    color: #308af4;
    // vertical-align: bottom;
  }
  .commedit {
    position: absolute;
    top: 1px;
    right: -32px;
    font-size: 12px;
    line-height: 14px;
    color: #308af4;
    padding-left: 4px;
    cursor: pointer;
  }
}
.textover {
  width: 156px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>