<template>
  <div class='out_box'>
    <div v-for="(item,index) in tastList" :key="index">
      <el-card class="box">
        <div slot="header" class="clearfix">
          <div><span>任务名称：</span> <span>{{item.TaskName}}</span></div>
          <el-button type="danger" @click='deletetast(item.TaskName)'>删除计划</el-button>
        </div>
        <div class='list' ><span class='sp'>所选房间：</span><p class='li'><span v-for="(i,dex) in item.getProperty.RoomList" :key="dex" class='targ'>{{i}}</span></p></div>
        <div class='list'><span class='sp'>设备名称：</span>
          <p class='li'><el-tag v-for="(it,inde) in item.getProperty.DeviceList" :key="inde" class='targ'>{{it.DeviceName}}</el-tag></p>
        </div>
        <div class='list'><span class='sp'>持续时间：</span><span>{{item.getProperty.ContinuedTime}}</span></div>
        <div class='list'><span class='sp'>运行方式：</span><span>{{item.getProperty.TaskScheduleFamily}}</span></div>
        <div class='list'><span class='sp'>循环类型：</span><span>{{item.getProperty.LoopClass}}</span></div>
        <div class='list'><span class='sp'>开始时间：</span><span>{{item.getProperty.TimepieceExecuteTime}}</span></div>
      </el-card>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      tastList: '',

      portAddress: this.$store.state.portAddress,
    }
  },
  mounted()  {
   this.gettastlist()
  },
  methods: {
    gettastlist(){
       this.$axios
      .get(
        this.portAddress + "/api/TaskSchedule/GetAllTaskSchedule"
        // './../../../static/json/getRoomLisr.json'/api/home/GetAllRoomInfosNoDeviceInfo
      )
      .then(res =>      {
        console.log(res.data)
        for (var i in res.data)        {
          this.$set(res.data[i], "getProperty", JSON.parse(res.data[i].TaskControlData));
        }
        this.tastList = res.data
      })
      .catch(err =>      {
        console.log(err);
      });
    },
    deletetast(msg)    {
      var a = [];
      a.push(msg);
      console.log(a)
      console.log(this.portAddress + "/api/TaskSchedule/RemoveTaskSchedule ", JSON.stringify(a))
      this.$axios
        .post(
          this.portAddress + "/api/TaskSchedule/RemoveTaskSchedule ", a
        )
        .then(res =>        {
          console.log("成功")
          this.gettastlist()
        })
        .catch(err =>        {
          console.log("失败");
        });
    }
  }
}
</script>

<style lang="less" scoped>
.out_box{
  // overflow-y: scroll;
// display: flex;
// flex-wrap: wrap;
}
.box {
  // float: left;
  // width:40%;
  margin: 30px 100px;
  .list {
    display: flex;
    // span{

    // }
    .sp {
      display: block;
      width: 90px;
     
    }
    .li {
      flex: 1;
      // height:25px;
      margin: 5px 2px;
      .targ {
        margin: 2px 3px;
        // padding: 2px 3px;
      }
    }
    //    .li span{
    //        float: left;
    //    }
  }
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>