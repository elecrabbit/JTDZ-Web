
<template>
  <div class="YYue" v-show="true">
    <p class="title tit">{{title}}</p>
    <!-- <button @click="fn" class='btn'>预约退房</button> -->
    <ul>
      <li v-for="(item,index) in list" :key="index" class="yyue">
        <p v-show="false">{{getMsg}}</p>
        <p v-show="false" class="yyLowerMachine_ID">{{item[0].LowerMachine_ID}}</p>
        <p v-show="false" class="yyDeviceClass">{{item[0].DeviceClass}}</p>
        <p v-show="false" class="yyOwinSHA">{{item[0].OwinSHA}}</p>
        <div v-if="item[0].DeviceProperty.length==0" class="yys">
           <img src="./../../assets/images/weilianjie.jpg" alt="">
        </div>
        <div v-else>
          <div v-if="item[0].DeviceProperty[0].AttributeName=='状态更改'">
            <div v-if="item[0].DeviceProperty[0].AttributeValue=='开'" class="yys">开</div>
            <div v-else class="yys">关</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title', 'list', 'roomNum'],
  updated() {
    // console.log(this.list)
  },
  computed: {
    getMsg() {
      var dd = this.$store.state.count;
      // console.log(dd);
      var yyue = $(".yyue");
      for (var i = 0; i < yyue.length; i++) {
        var yyLowerMachine_ID = yyue.eq(i).find(".yyLowerMachine_ID").text();
        var yyDeviceClass = yyue.eq(i).find(".yyDeviceClass").text();
        var yyOwinSHA = yyue.eq(i).find(".yyOwinSHA").text();
        console.log(dd.DeviceClass, yyDeviceClass, dd.OwinSHA, yyOwinSHA);
        if (dd.DeviceClass == yyDeviceClass && dd.OwinSHA == yyOwinSHA) {
          for (var j = 0; j < dd.DeviceProperty.length; j++) {
            if (dd.DeviceProperty[j].AttributeName == "状态更改") {
              if (dd.DeviceProperty[j].AttributeValue == "开") {
                $(".yys").eq(j).text("开")
                //创建一个audio对象
                var sound = new Audio();
                //选择文件
                sound.src = './../../../static/有客人预约1574408570382.mp3';
                //播放
                sound.play();
              } else {
                $(".yys").eq(j).text("关")
              }
            }
          }
        }
      }
      return dd;
    }
  },
  methods: {
    fn() {
      this.$notify.info({
        title: '预约退房',
        message: this.roomNum + '房间有预约退房服务，请注意',
        duration: 0
      });
      //创建一个audio对象
      var sound = new Audio();
      //选择文件
      // sound.src = './../../../static/CheckOut.wav';
      // sound.src = './../../../static/dxx.mp3';
      sound.src = './../../../static/有客人预约1574408570382.mp3';
      //播放
      sound.play();
    }
  }
}
</script>

<style lang="less" scoped>
.YYue {
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
      min-width: 40px;
      margin: 20px 0;
      overflow: hidden;
      background:rgb(108, 185, 221);
      div {
        font-size: 22px;
        text-align: center;
        line-height: 80px;
        color: rgb(243, 2, 2);
        img{
          width:80px;
          height:80px;
        }
      }
    }
  }
}
</style>