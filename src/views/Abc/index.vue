<template>
  <div class="table-section">
    <h3>element中table的封装，利用插槽，绑定row</h3>
    <common-table
        :column="column"
        :tableData="tableData"
        :pageVo="pageVo"
        @handleCurrentChange="handleCurrentChange"
    >
      <!-- ID -->
      <template #id="{row}">
        <div class="pub-status">
          VIP
          <span class="triangle-up"></span>
        </div>
        {{row.id}}
      </template>
      <!-- 性别 -->
      <template #sex="{row}">
        {{getLabel(row.sex, sexOption)}}
      </template>
      <!-- 年级 -->
      <template #grade="{row}">
        <!--计算label的值，计算函数获取和v-for v-if获取-->
        <!--<template v-for="(item) in gradeOption">-->
          <!--<template v-if="row.grade === item.id">-->
            <!--{{item.label}}-->
          <!--</template>-->
        <!--</template>-->
        {{getLabel(row.grade, gradeOption)}}
      </template>
      <!-- 描述 -->
      <template #desc="{row}">
        <el-popover
            popper-class="table-popper"
            placement="right-start"
            trigger="hover"
            width="100"
            v-if="row.desc && row.desc.length > 20"
            :content="row.desc">
          <span slot="reference">{{row.desc.length > 20 ? row.desc.substr(0,20) + '...' : row.description}}</span>
        </el-popover>
        <span v-else>{{row.desc}}</span>
      </template>
    </common-table>
  </div>
</template>

<script>
  import CommonTable from './Components/Table'
  export default {
    data(){
      return{
        column:[
          {
            prop:"id",
            align:"",
            label:"ID",
            fixed: true,
            scopeStatus:true,
            width:"",
            minWidth:""
          },
          {
            prop:"name",
            align:"",
            label:"姓名",
            scopeStatus:false,
            width:"",
            minWidth:""
          },
          {
            prop:"sex",
            align:"",
            label:"性别",
            scopeStatus:true,
            width:"",
            minWidth:""
          },
          {
            prop:"age",
            align:"",
            label:"年龄",
            scopeStatus:false,
            width:"",
            minWidth:""
          },
          {
            prop:"grade",
            align:"",
            label:"年级",
            scopeStatus:true,
            width:"",
            minWidth:""
          },
          {
            prop:"desc",
            align:"",
            label:"描述",
            scopeStatus:true,
            width:"",
            minWidth:""
          }
        ],
        tableData:[
          {
            id:"1",
            name:"张三",
            sex:0,
            age:12,
            grade:1,
            desc:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          },
          {
            id:"2",
            name:"李四",
            sex:0,
            age:13,
            grade:2,
            desc:"HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
          },
          {
            id:"3",
            name:"李丽",
            sex:1,
            age:13,
            grade:2,
            desc:"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          }
        ],
        pageVo:{
          total:3,
          pageSize: 1,
          currentPage: 1
        },
        sexOption:[
          {
            id:0,
            label:"男"
          },
          {
            id:1,
            label:'女'
          }
        ],
        gradeOption:[
          {
            id:1,
            label:"一年级"
          },
          {
            id:2,
            label:"二年级"
          },
          {
            id:3,
            label:"三年级"
          },
          {
            id:4,
            label:"四年级"
          },
          {
            id:5,
            label:"五年级"
          },
          {
            id:6,
            label:"六年级"
          }
        ]
      }
    },
    components:{
      CommonTable
    },
    methods:{
      /**
       * 页码改变
       */
      handleCurrentChange (val) {
        this.pageVo.currentPage = val
        alert("当前页面为："+val)
      },
      getLabel(val, list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === val){
            return list[i].label
          } ;
        };
        return '无'

      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-section{
    width:100%;
    .pub-status{
      display: inline-block;
      position: absolute;
      top:0px;
      left:0px;
      width: 26px;
      height: 36px;
      background-color: #66b1ff;
      color: #fff;
      font-size: 12px;
      transform: scale(0.8);//chrome默认最小字体是12px，将字体变成10px
      .triangle-up{
        width:0;
        height:0;
        border-right:12px solid transparent;
        border-left:12px solid transparent;
        border-bottom:12px solid #fff;
        position: absolute;
        top:25px;
        left:0px;
      }
    }
    .danger-text{
      color: red;
    }
    .gray-text{
      color:darkgray;
    }
  }
</style>
