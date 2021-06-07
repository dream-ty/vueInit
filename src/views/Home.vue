<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <img src="./static/冲突处理.png" alt=""> -->
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div>{{filterTest | getNameByList(listData, 'value')}}</div>
    <div>{{'' | getNameByList(listData)}}</div>
    <div>{{'c' | getNameByList(listData)}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  data(){
    return {
      filterTest: 'a',
      listData: [
        { key: 'a',value: '我是a'},
        { key: 'b',value: '我是b'},
        { key: 'c',value: '我是c'},
      ]
    }
  },
  created() {
    setTimeout(() => {
      this.filterTest = 'b'
    }, 2000);
  },
  filters: {
    getNameByList(value, list = [], valueKey ='value') {
      console.log('aaaaaaa');
      // console.log(value, list, (list.find(item => item.key === value))[valueKey]);
      let str = (list.find(item => item.key === value))?.[valueKey] || '-'
      return str

    }
  },
  components: {
    HelloWorld,
  },
};
</script>
