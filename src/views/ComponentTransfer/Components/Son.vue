<template>
  <div>子组件的msg--{{sonMsg}}
    <div>子组件中的父组件数据--{{fatherMsg}}</div>
    <div><button @click="sonclick">子组件调用父组件方法</button></div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            sonMsg: '子组件的msg'
        }
    },
    props: [ 'fatherMsg' ],
    methods: {
      sonclick() {
        this.$emit('changeDis', 'emit传参')
      }
    },
    created() {
      console.log('son的created执行了')
    },
}
</script>