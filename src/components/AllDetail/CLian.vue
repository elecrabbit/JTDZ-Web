
<template>
  <div class="cl">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备信息4-窗帘</span>
      </div>
      <ul>
        <li v-for="(item,index) in list" :key="index">
          <p class="Dname">{{index}}</p>
          <ul>
            <li v-for="(it,ind) in item" :key="ind" class="clian">
              <div v-if="it.DeviceProperty.length==0" class="clbox">
                <img :src="climg_close" status="关" alt class="cl_kg" />
                <p class="clDeviceName">{{it.DeviceName}}</p>
                <p v-show="false" class="getMsg">{{getMsg}}</p>
                <button @click="clguan2($event,it)">未连接</button>
              </div>
              <div v-else>
                <div v-for="(itt,indd) in it.DeviceProperty" :key="indd">
                  <div v-if="itt.AttributeName=='开关状态'">
                    <div v-if="itt.AttributeValue=='开'" class="clbox">
                      <img :src="climg_open" status="开" alt class="cl_kg" />
                      <p class="clDeviceName">{{it.DeviceName}}</p>
                      <p v-show="visible" class="clDeviceClass">{{it.DeviceClass}}</p>
                      <p v-show="visible" class="clLowerMachine_ID">{{it.LowerMachine_ID}}</p>
                      <p v-show="visible" class="clAreaOfRoom">{{it.AreaOfRoom}}</p>
                      <p v-show="visible" class="clOwinSHA">{{it.OwinSHA}}</p>
                      <p v-show="false" class="getMsg">{{getMsg}}</p>
                      <button @click="clguan2($event,it)">开关</button>
                    </div>
                    <div v-else class="clbox">
                      <img :src="climg_close" status="关" alt class="cl_kg" />
                      <p class="clDeviceName">{{it.DeviceName}}</p>
                      <p v-show="visible" class="clDeviceClass">{{it.DeviceClass}}</p>
                      <p v-show="visible" class="clLowerMachine_ID">{{it.LowerMachine_ID}}</p>
                      <p v-show="visible" class="clAreaOfRoom">{{it.AreaOfRoom}}</p>
                      <p v-show="visible" class="clOwinSHA">{{it.OwinSHA}}</p>
                      <p v-show="false" class="getMsg">{{getMsg}}</p>
                      <button @click="clguan2($event,it)">开关</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      climg_open: "./static/images/appcurtain0.png",
      climg_close: "./static/images/appcurtain6.png",
      visible: false
    }
  },
  props: ['title', "list", 'client', "roomNum", "jdName"],
  updated() {
    // console.log(this.list)
  },
  computed: {
    getMsg() {    //通过mqtt 获取的数据改变页面元素的状态
      var dd = this.$store.state.count;
      // console.log(dd);
      var clkg = document.getElementsByClassName('cl_kg');
      for (var i = 0; i < clkg.length; i++) {
        var clDeviceName = clkg[i].parentNode.children[1].innerText;    //获取名字
        var clDeviceClass = clkg[i].parentNode.children[2].innerText;   //获取类型
        var clLowerMachine_ID = clkg[i].parentNode.children[3].innerText;  //获取id
        var clAreaOfRoom = clkg[i].parentNode.children[4].innerText;  //获取位置
        var clOwinSHA = clkg[i].parentNode.children[5].innerText;  //获取地址码
        console.log(dd.DeviceName, clDeviceName)
        console.log(dd.AreaOfRoom, clAreaOfRoom)
        console.log(dd.DeviceClass, clDeviceClass)
        console.log(dd.LowerMachine_ID, clLowerMachine_ID)
        console.log(dd.OwinSHA, clOwinSHA)
        if (dd.DeviceName == clDeviceName && dd.AreaOfRoom == clAreaOfRoom && dd.DeviceClass == clDeviceClass && dd.LowerMachine_ID == clLowerMachine_ID && dd.OwinSHA == clOwinSHA) {
          for (var j = 0; j < dd.DeviceProperty.length; j++) {
            if (dd.DeviceProperty[j].AttributeName == '开关状态') {
              if (dd.DeviceProperty[j].AttributeValue == '开') {
                clkg[i].src = this.climg_open;
                clkg[i].setAttribute("status", "开")
              } else {
                clkg[i].src = this.climg_close
                clkg[i].setAttribute("status", "关")
              }
            }
          }
        }
      }
      return dd;
    }
  },
  methods: {
    clguan2(e, it) {
      console.log(it)
      let cl = e.target.parentNode.children[0],       //获取被点击元素
        clTypeNum = $(e.target).parents(".clian").find(".clTypeNum").text(), //获取卷帘类型编号
        clType = $(e.target).parents(".clian").find(".clType").text();  //获取纱OR帘
      console.log(clTypeNum)
      var text = cl.getAttribute("status");
      var payload = {
          "LowerMachine_ID": it.LowerMachine_ID,
          "DeviceName": it.DeviceName,
          "DeviceClass": it.DeviceClass,
          "AreaOfRoom": it.AreaOfRoom,
          "OwinSHA": it.OwinSHA,
          "DeviceProperty": []        }
      if (text == "开") {
        cl.src = this.climg_close;
        cl.setAttribute("status", "关");
        payload.DeviceProperty=[{ "AttributeName": "开关状态", "AttributeValue": "关" }] 
        this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
      } else {
        cl.src = this.climg_open;
        cl.setAttribute("status", "开")
        payload.DeviceProperty=[{ "AttributeName": "开关状态", "AttributeValue": "开" }] 
        this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
      }
    },
  }
};
</script>

<style lang="less" scoped>
.cl {
  padding: 0 3%;
  padding-bottom: 30px;
  .box-card {
    //  min-width: 1220px;
    margin: 10px 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      background-color: rgb(203, 207, 184);
      padding: 10px 0;
      li {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        margin: 0 20px;
        .Dname {
          text-align: center;
          font-size: 20px;
          color: blue;
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            margin: 0 10px;
            .clbox {
              display: flex;
              flex-direction: column;
              border: 1px solid #666;
              padding: 10px;
              background: rgb(43, 80, 80);
              color: rgb(236, 235, 235);
              border-radius: 10px;
              img {
                width: 100px;
                // border-radius: 50%;
              }
              p {
                padding: 5px 0;
                text-align: center;
              }
              button {
                outline: none;
                padding:3px 0;
                border-radius: 20px;
                color:rgb(230, 227, 228);
                background: rgb(22, 141, 238);
              }
            }
          }
        }
      }
    }
  }
}
</style>