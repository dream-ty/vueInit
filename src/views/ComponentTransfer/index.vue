<template>
  <div>
    我是TableContain页
    <div>
      <span>{{msg}}</span>
      <hr/>
      <el-button type="primary" @click="getMessage">点击弹出messagebox</el-button>
      <button @click="isDisplaySon = !isDisplaySon">显示隐藏son</button>
      <hr>
      <div>ref获取子组件中的msg ——
        <span v-show="isDisplaySon">{{ $refs.sonRef && $refs.sonRef.sonMsg }}</span>
      </div>
      <hr>
      <div>
        <Son :fatherMsg="msg" v-show="isDisplaySon" @changeDis="changeDis" ref="sonRef"/> 
      </div>
    </div>

  </div>
  
</template>

<script>
let login = {
  template:  '#eeff'
}
import Son from './Components/Son'
export default {
  data() {
    return {
      msg: '我是TableContain页的消息',
      isDisplaySon: true, 
    }

  },
  components: {
    Son
  },
  methods: {
    changeDis(isdis) {
      console.log(isdis);
      this.isDisplaySon = !isdis
    },
    getMessage(){
      const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(Son),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });
    }
  },
  mounted() {
    console.log(this.$refs.sonRef.sonMsg)
  }

};
</script>
<style lang="scss" scoped>

</style>
