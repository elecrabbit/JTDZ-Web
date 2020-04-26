
<template>
  <div class="jBao" v-show="true">
    <p class="title tit">{{title}}</p>
    <ul>
      <li v-for="(item,index) in list" :key="index" class="jbox">
        <p v-show="false">{{getMsg}}</p>
        <p v-show="false">{{getlist}}</p>
        <div class="jbs">
          <img :src='img1' alt="" class='img'>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      img1: ''
    }
  },
  props: ["title", "list", "roomNum"],
  computed: {
    getMsg()    {
      var dd = this.$store.state.count;
      // console.log(dd);
      if (dd.DeviceName == this.list[0].DeviceName && dd.AreaOfRoom == this.list[0].AreaOfRoom && dd.OwinSHA == this.list[0].OwinSHA)      {
        for (var j = 0; j < dd.DeviceProperty.length; j++)        {
          if (dd.DeviceProperty[j].AttributeName == "状态更改")          {
            if (dd.DeviceProperty[j].AttributeValue == "开")            {
              this.img1 = './../../../static/images/ic_launcher.png'
              // this.$notify({
              //   title: '紧急呼叫',
              //   message: this.roomNum + '房间有紧急呼叫，请尽快处理',
              //   duration: 0,
              //   type: 'warning'
              // });
              // //创建一个audio对象
              // var sound = new Audio();
              // //选择文件
              // sound.src = './../../../static/有客房有紧1574408721191.mp3';
              // //播放
              // sound.play();

            } else            {
              this.img1 = './../../../static/images/stop.jpg'
            }
          }
        }
      }
      return dd;
    },
    getlist()    {
      console.log(this.list)
      for (var i in this.list[0].DeviceProperty)      {
        var device = this.list[0].DeviceProperty[i]
        if (device.AttributeName == '状态更改')        {
          if (device.AttributeValue == '开')          {
            this.img1 = './../../../static/images/ic_launcher.png'
          } else          {
            this.img1 = './../../../static/images/stop.jpg'
          }
        } else if (this.list.length == 0)        {
          this.img1 = './../../../static/images/weilianjie.jpg'
        }
      }
    },
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.jBao {
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: space-between;
  margin: 0 20px;
  .title {
    font-size: 15px;
  }
  ul {
    list-style: none;
    li {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius: 50%;
      margin: 20px 0;
      overflow: hidden;
       background: rgb(108, 185, 221);
      .jbs {
        height: 80px;
        width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          margin-top:2px;
        }
      }
    }
  }
}
</style>