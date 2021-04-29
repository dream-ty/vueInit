<template>
  <div>
    <div>我是table,我要做点什么123</div>
      <el-table
          :data="tableData"
          :stripe= "true"
          style="width: 100%">
        <template v-for="(item, index) in column">
          <el-table-column
              v-bind={...item}
              v-if="!item.v_if"
              :key="item.prop + index"
          >
          </el-table-column>
        </template>
      </el-table>
    <ul >
      <li v-for="(item, index) in column" :key="item.prop">{{item.label + index + JSON.stringify(item)}}
      <div>{{item.template}}</div>
        <!--<div><{{item.template}} /></div>-->
        <div><mycom1/></div></li>
    </ul>
  </div>

</template>

<script>
  import Vue from "vue";
  Vue.component('mycom1', Vue.extend({
    template: '<h3>这是使用 Vue.extend 创建的组件</h3>'
  }))
  // new Vue({ el: '#app' })

  export default {
    name: "Table",


    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          id: '1',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          id: '2',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          id: '3',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          id: '4',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        column: [
          {
            prop: 'date',
            label: '日期',
            width: '180',
          },
          {
            prop: 'name',
            label: '姓名',
            width: '180',
          },
          {
            prop: 'address',
            label: '地址',
          },
          {
            prop: 'id',
            label: 'id地址',
            width: '180',
            v_if: true,
            template: 'mycom1'
          },
        ],
        isIdDis: false,
      }
    }
  }
</script>

<style scoped>

</style>
