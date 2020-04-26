
<template>
  <div class="timing">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="width:70%;margin:0 auto;" class="line">
          <el-steps :active="getactive" finish-status="success">
            <el-step title="选择房间"></el-step>
            <el-step title="选择设备"></el-step>
            <el-step title="选择时间"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          
          <el-button type="primary" class='control' @click="goto_controlList">控制列表</el-button>
          <!-- <button >定时控制列表</button> -->
        </div>
      </div>
      <router-view></router-view>
    </el-card>

  </div>
</template>

<script>
import TimingControl from "./timingControl"
import Selectroom from "./selectroom"
export default {
  data() {
    return {
      // active: this.$store.state.active,
    }
  },
  beforeCreate: function () {
    this.$router.push('/timing/select')
  },
 computed:{
    getactive(){
      return   this.$store.state.active
    }
 },
 methods:{
   goto_controlList(){
    this.$router.push('/timingList')
   }
 },
  components: {
    TimingControl,
    Selectroom,
    //   Selece
  }
}
</script>

<style lang="less" scoped>
.timing {
  padding: 0px 0px;
  .box-card {
    box-sizing: border-box;
    min-height: 100%;
    /deep/.el-card__header {
      position: relative;
      padding: 25px 20px;
      .control{
        position: absolute;
        right:20px;
        top:10px;
      }
    }
  }
}
</style>