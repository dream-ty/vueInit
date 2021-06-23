<template>
  <div class="home">
    1111
    <ul  >
      <template v-for="item in listData">
      <li :key="item.key"> {{item.value.a}}</li>

      </template>
    </ul>
  <button @click="onclick">点击</button>

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
        { key: 'a',value: {}},
        { key: 'b',value: {a: '我是b'}},
        { key: 'c',value: {a: '我是c'}},
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
  methods:{
    onclick() {
      // this.listData[0].value.a = 11111
      this.$set(this.listData[0].value,'a', 1111)
      console.log(111111,this.listData);
    }
  },
  components: {
    HelloWorld,
  },
};
</script>
