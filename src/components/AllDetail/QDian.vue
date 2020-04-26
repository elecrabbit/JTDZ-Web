
<template>
  <div class="QDian">
    <p class="title tit">{{title}}</p>
    <ul>
      <li v-for="(item,index) in list" :key="index" class="qdbox">
        <!-- {{item}} -->
        <p v-show="false">{{getMsg}}</p>
        <p v-show="false" class="qdDeviceName">{{item[0].DeviceName}}</p>
        <p v-show="false" class="qdAreaOfRoom">{{item[0].AreaOfRoom}}</p>
        <p v-show="false" class="qdOwinSHA">{{item[0].OwinSHA}}</p>
        <div v-if="item[0].DeviceProperty.length==0">
          <img src="./../../assets/images/weilianjie.jpg" alt="">
        </div>
        <div v-else>
          <div v-if="item[0].DeviceProperty[0].AttributeName=='插卡还是拔卡'">
            <div v-if="item[0].DeviceProperty[0].AttributeValue=='插卡'" class="qds">
              插卡
              <!-- <img src="./../../assets/images/chaka01.png" alt=""> -->
            </div>
            <div v-else class="qds">
              拔卡
              <!-- <img src="./../../assets/images/baka01.png" alt=""> -->
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title', 'list'],
  updated() {
    console.log(this.list)
  },
  computed: {
    getMsg() {
      var dd = this.$store.state.count;
      console.log(dd);
      var qdbox = $(".qdbox");
      for (var i = 0; i < qdbox.length; i++) {
        var qdDeviceName = qdbox.eq(i).find(".qdDeviceName").text();
        var qdAreaOfRoom = qdbox.eq(i).find(".qdAreaOfRoom").text();
        var qdOwinSHA = qdbox.eq(i).find(".qdOwinSHA").text();
        console.log(dd.DeviceName, qdDeviceName, dd.AreaOfRoom, qdAreaOfRoom, dd.OwinSHA, qdOwinSHA);
        if (dd.DeviceName == qdDeviceName && dd.AreaOfRoom == qdAreaOfRoom && dd.OwinSHA == qdOwinSHA) {
          for (var j = 0; j < dd.DeviceProperty.length; j++) {
            if (dd.DeviceProperty[j].AttributeName == "插卡还是拔卡") {
              if (dd.DeviceProperty[j].AttributeValue == "插卡") {
                // console.log('kkkkkkkkkk');
                $(".qds").eq(0).text("插卡")
              } else {
                $(".qds").eq(0).text("拔卡")
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
.QDian {
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