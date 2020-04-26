
<template>
  <div class="dg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备信息2-灯光</span>
      </div>
      <ul>
        <li v-for="(item,index) in list" :key="index" class="dgbigbox">
          <p class="Dname">{{index}}</p>
          <el-row class="lisbox">
            <el-col v-for="(it, ind) in item" :key="ind" class="dgbox">
              <el-card class="dgss" v-if="it.DeviceProperty.length==0">
                <img :src="img1" status="关" class="lamp" />
                <p>{{it.DeviceName}}</p>
                <el-button type="text" class="button">未连接</el-button>
              </el-card>
              <div v-else>
                <div v-for="(itt,indd) in it.DeviceProperty" :key="indd">
                  <div v-if="itt.AttributeName=='开关'">
                    <el-card v-if="itt.AttributeValue=='开'" ref="it" class="dgss">
                      <img :src="img2" status="开" alt class="lamp" />
                      <p class="dgDeviceName">{{it.DeviceName}}</p>
                      <p v-show="active" class="dgLowerMachine_ID">{{it.LowerMachine_ID}}</p>
                      <p v-show="active" class="dgDeviceClass">{{it.DeviceClass}}</p>
                      <p v-show="active" class="dgOwinSHA">{{it.OwinSHA}}</p>
                      <p v-show="active" class="getMsg">{{getMsg}}</p>
                      <el-button type="text" @click="dguang2($event,it)">开关</el-button>
                      <!-- <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" @click="dguang2($event,it)"></el-switch> -->
                    </el-card>
                    <el-card v-else ref="it" class="dgss">
                      <img :src="img1" status="关" alt class="lamp" />
                      <p class="dgDeviceName">{{it.DeviceName}}</p>
                      <p v-show="active" class="dgLowerMachine_ID">{{it.LowerMachine_ID}}</p>
                      <p v-show="active" class="dgDeviceClass">{{it.DeviceClass}}</p>
                      <p v-show="active" class="dgOwinSHA">{{it.OwinSHA}}</p>
                      <p v-show="active" class="getMsg">{{getMsg}}</p>
                      <el-button type="text" @click="dguang2($event,it)">开关</el-button>
                       <!-- <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" @click="dguang2($event,it)"></el-switch> -->
                    </el-card>
                  </div>
                  <div
                    v-show="active"
                    v-if="itt.AttributeName=='线序号'"
                    class="dgxxh"
                  >{{itt.AttributeValue}}</div>
                </div>
              </div>
            </el-col>
          </el-row>
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
      img1: "./static/images/close.png",
      img2: "./static/images/open.png",
      msg: "",
      xxh: '',
      active: false,
      value:''
    };
  },
  props: ["title", "list", "client", "roomNum", "jdName"],
  mounted() {
    this.getMsg
  },
  computed: {
    getMsg() {
      var dd = this.$store.state.count;
      // console.log(dd);
      var dgbox = $(".dgbox");
      for (var i in dgbox) {
        var dgit = dgbox.eq(i).find(".dgit").text();
        var AreaOfRoom = dgbox.eq(i).parents(".dgbigbox").find(".Dname").text();  //获取位置
        var dgLowerMachine_ID = dgbox.eq(i).find(".dgLowerMachine_ID").text();  //获取LowerMachine_ID
        var dgDeviceName = dgbox.eq(i).find(".dgDeviceName").text();  //获取name
        var dgDeviceClass = dgbox.eq(i).find(".dgDeviceClass").text();  //获取DeviceClass
        var dgxxh = dgbox.eq(i).find(".dgxxh").text();  //获取线序号
        var dgOwinSHA = dgbox.eq(i).find(".dgOwinSHA").text();  //获取地址码
        if (dd.LowerMachine_ID == dgLowerMachine_ID && dd.DeviceName == dgDeviceName && dd.AreaOfRoom == AreaOfRoom && dd.DeviceClass == dgDeviceClass && dd.OwinSHA == dgOwinSHA && dd.DeviceProperty[0].AttributeValue == dgxxh) {
          for (var j = 0; j < dd.DeviceProperty.length; j++) {
            if (dd.DeviceProperty[j].AttributeName == "开关") {
              if (dd.DeviceProperty[j].AttributeValue == "开") {
                dgbox.eq(i).find(".lamp").attr("src", this.img2);
                dgbox.eq(i).find(".lamp").attr("status", "开");
              } else {
                dgbox.eq(i).find(".lamp").attr("src", this.img1);
                dgbox.eq(i).find(".lamp").attr("status", "关");
              }
            }
          }
        }
      }
      return dd;
    }
  },
  methods: {
    dguang2(e, it) {
      var dgimg = $(e.target).parents(".dgbox").find(".lamp");               //灯光图片
      for (var i in it.DeviceProperty) {
        if (it.DeviceProperty[i].AttributeName == '线序号') {
          this.xxh = it.DeviceProperty[i].AttributeValue
        }
      }
       var payload = {
          LowerMachine_ID: it.LowerMachine_ID,
          DeviceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: []
        };
      var text = dgimg.attr("status");
      if (text == "开") {
        dgimg.attr("src", this.img1);
        dgimg.attr("status", "关");
        payload.DeviceProperty= [
            { AttributeName: "线序号", AttributeValue: this.xxh },
            { AttributeName: "开关", AttributeValue: "关" }
          ]
        this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
        console.log('发布：',this.jdName+this.roomNum)
      } else {
        dgimg.attr("src", this.img2);
        dgimg.attr("status", "开");
         payload.DeviceProperty= [
            { AttributeName: "线序号", AttributeValue: this.xxh },
            { AttributeName: "开关", AttributeValue: "开" }
          ]
        this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
        console.log('发布：',this.jdName+this.roomNum)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dg {
  padding: 0 3%;
  .box-card {
    // min-width: 1220px;
    margin: 10px 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      background-color: rgb(207, 184, 184);
      padding: 10px 0;
      li {
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        .Dname {
          text-align: center;
          font-size: 15px;
          color: blue;
          padding: 10px 0;
        }
        .lisbox {
          display: flex;
          // width: 120px;
          .dgss {
            margin: 0 6px;
            display: flex;
            flex-direction: column;
            background: rgb(27, 26, 26);
            //   align-items: center;
            text-align: center;
            border-radius: 10px;
            .lamp {
              width: 60px;
              border-radius: 50%;
            }
            p{
              font-size:15px;
              color:rgb(192, 224, 6);
              padding-top:5px;
            }
            button{
              padding:10px 0 0 0;
            }
          }
        }
      }
    }
  }
}
</style>