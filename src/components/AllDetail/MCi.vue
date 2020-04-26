
<template>
  <div class="MCi">
    <p class="title tit">{{title}}</p>
    <ul>
      <li v-for="(item,index) in list" :key="index" class="mcbox">
        <p v-show="false">{{getMsg}}</p>
        <p v-show="false" class="mcDeviceName">{{item[0].DeviceName}}</p>
        <p v-show="false" class="mcAreaOfRoom">{{item[0].AreaOfRoom}}</p>
        <p v-show="false" class="mcOwinSHA">{{item[0].OwinSHA}}</p>
        <div v-if="item[0].DeviceProperty.length==0">
          <img src="./../../assets/images/weilianjie.jpg" alt="">
        </div>
        <div v-else>
          <div v-if="item[0].DeviceProperty[0].AttributeName=='开关'">
            <div v-if="item[0].DeviceProperty[0].AttributeValue=='开'" class="mcs">开</div>
            <div v-else class="mcs">关</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title', 'list'],
  computed: {
    getMsg() {
      var dd = this.$store.state.count;
      // console.log(dd);
      var mcbox = $(".mcbox");
      for (var i = 0; i < mcbox.length; i++) {
        var mcDeviceName = mcbox.eq(i).find(".mcDeviceName").text();
        var mcAreaOfRoom = mcbox.eq(i).find(".mcAreaOfRoom").text();
        var mcOwinSHA = mcbox.eq(i).find(".mcOwinSHA").text();
        // console.log(dd.DeviceName, mcDeviceName, dd.AreaOfRoom, mcAreaOfRoom, dd.OwinSHA, mcOwinSHA);
        if (dd.DeviceName == mcDeviceName && dd.AreaOfRoom == mcAreaOfRoom && dd.OwinSHA == mcOwinSHA) {
          for (var j = 0; j < dd.DeviceProperty.length; j++) {
            if (dd.DeviceProperty[j].AttributeName == "开关") {
              if (dd.DeviceProperty[j].AttributeValue == "开") {
                $(".mcs").eq(0).text("开")
              } else {
                $(".mcs").eq(0).text("关")
              }
            }
          }
        }
      }
      return dd;
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.MCi {
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
      background: rgb(108, 185, 221);
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