
<template>
  <div class="home">
    <div class="article_left">
      <h1>{{Hotel}}</h1>
      <!-- <div class="al">
        <p>PC：<span>温度</span></p>
        <p>HR：<span>湿度</span></p>
        <p>PM：<span>PM2.5</span></p>
        <p>清理：<img src="./../assets/images/qingli.png" alt /></p>
        <p>SOS：<img src="./../assets/images/ic_launcher.png" alt /></p>
        <p>预约退房：<img src="./../assets/images/tuif.png" alt /></p>
      </div>-->
      <div class="header">
        <div class="select_floor">
          <span>选层：</span>
          <el-select v-model="value" placeholder="请选择" @change="selected">
            <el-option v-for="(item,index) in floorList" :key="index" :label="index" :value="index"></el-option>
          </el-select>
        </div>
      </div>
      <ul class="roomlist">
        <li
          v-for="(item,index) in tableData"
          :key="index"
          @dblclick="hand(item.RoomNUM,item.LowerMachine.RunStatus)"
          class="myroom"
        >
          <el-card class="box-card11">
            <div slot="header" class="clearfix">
              <span class="roomNUM">{{item.RoomNUM}}房间</span>
              <div>
                <img v-show="img1" class="img1" src="./../assets/images/qingli.png" alt />
                <img v-show="img2" class="img2" src="./../assets/images/ic_launcher.png" alt />
                <img v-show="img3" class="img3" src="./../assets/images/tuif.png" alt />
              </div>
              <i class="el-icon-error" v-show="ic" @click.stop="delate(item)"></i>
            </div>
            <p>
              <span>房间类型：</span>
              <span>{{item.RoomType}}</span>
            </p>
            <p v-if="item.LowerMachine!=null">
              <span>连接状态：</span>
              <span>{{item.LowerMachine.RunStatus}}</span>
            </p>
            <p>
              <span>插卡状态：</span>
              <span class="chaka">{{item.qdstatus}}</span>
            </p>
            <p>
              <span>门磁状态：</span>
              <span class="menci">{{item.mencistatus}}</span>
            </p>
            <p>
              <span>空调控制：</span>
              <el-switch
                v-model="item.kongtiao"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="kongt(item)"
              ></el-switch>
            </p>
            <p>
              <span>房间温度：</span>
              <span>{{item.nowtelephone}}</span>
            </p>

            <!-- <div class="now">
              <div class="tel">
                <p>{{item.nowtelephone}}</p>
                <p>PC</p>
              </div>
              <div class="tel">
                <p>100</p>
                <p>PM</p>
              </div>
              <div class="tel">
                <p>30%</p>
                <p>HR</p>
              </div>
            </div>-->
          </el-card>
        </li>
      </ul>
    </div>
    <div class="article_right" v-show="bool"></div>
    <img src="./../../static/images/you.png" class="shenzuo" @click="show_right($event)" alt />
    <div class="right_fixed" v-show="bool">
      <h4>客房快速统计</h4>
      <div>
        <p @click="allSos">
          <img src="./../assets/images/ic_launcher.png" alt />
          <span>SOS X {{sos.length}}</span>
        </p>
        <p @click="allqingli">
          <img src="./../assets/images/qingli.png" alt />
          <span>清理 X {{qingli.length}}</span>
        </p>
        <p @click="alltuifang">
          <img src="./../assets/images/tuif.png" alt />
          <span>退房 X {{tuifang.length}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  data() {
    return {
      value: "所有房间",
      Hotel: "", //存储酒店名称
      tableData: [],
      show: false,
      error: "",
      val: "", //搜索框v-model绑定的值
      floorList: "", //楼层列表
      msg: "",
      addtopic: [],
      portAddress: this.$store.state.portAddress,
      client: this.$store.state.client,
      jdNameLOW_TO_UP: "LOW_TO_UP/" + globalSetting.mqttTopic + "/",
      jdNameUP_TO_LOW: "UP_TO_LOW/" + globalSetting.mqttTopic + "/",
      img1: false,
      img2: false,
      img3: false,
      ic: false,
      ind: "",
      bool: true,
      qingli: [],
      sos: [],
      tuifang: [],
      userrank: this.$store.state.userrank
    };
  },
  mounted() {
    this.changeFloor(this.floorList);
    this.roomlists();
    // 接收消息处理
    this.client.on("message", (topic, message) => {
      console.log("收到来自", topic, "的消息", message.toString());
      this.msg = JSON.parse(message.toString());
      this.$store.commit("changeCount", this.msg);
      var ss = topic.match(/\d+/)[0];
      this.$store.commit("changemqttroom", ss);
      var lis = $(".box-card11");
      for (var i in lis) {
        var li = lis
          .eq(i)
          .find(".roomNUM")
          .text();
        if (parseInt(li) == parseInt(ss)) {
          // console.log(parseInt(li) + "******" + parseInt(ss));
          if (this.msg.DeviceClass == "紧急呼叫") {
            for (var j in this.msg.DeviceProperty) {
              if (
                this.msg.DeviceProperty[j].AttributeName == "状态更改" &&
                this.msg.DeviceProperty[j].AttributeValue == "开"
              ) {
                // this.$notify({
                //   title: "紧急呼叫",
                //   message: ss + "房间有紧急呼叫，请尽快处理",
                //   duration: 0,
                //   type: "warning"
                // });
                $(".img2")
                  .eq(i)
                  .show();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "rgb(245, 142, 142)" });
              } else {
                $(".img2")
                  .eq(i)
                  .hide();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "#fff" });
              }
            }
          } else if (this.msg.DeviceClass == "预约服务") {
            for (var j in this.msg.DeviceProperty) {
              if (
                this.msg.DeviceProperty[j].AttributeName == "状态更改" &&
                this.msg.DeviceProperty[j].AttributeValue == "开"
              ) {
                // this.$notify({
                //   title: "预约退房",
                //   message: ss + "房间有预约退房，请尽快处理",
                //   duration: 0,
                //   type: "warning"
                // });
                $(".img3")
                  .eq(i)
                  .show();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "hsl(239, 84%, 76%)", color: "#000" });
              } else {
                $(".img3")
                  .eq(i)
                  .hide();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "#fff" });
              }
            }
          } else if (this.msg.DeviceClass == "门显") {
            for (var j in this.msg.DeviceProperty) {
              if (
                this.msg.DeviceProperty[j].AttributeName == "清理" &&
                this.msg.DeviceProperty[j].AttributeValue == "开"
              ) {
                // this.$notify({
                //   title: "清理",
                //   message: ss + "房间需要清理，请尽快处理",
                //   duration: 0,
                //   type: "warning"
                // });
                $(".img1")
                  .eq(i)
                  .show();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "rgb(52, 226, 52)" });
              } else {
                $(".img1")
                  .eq(i)
                  .hide();
                $(".box-card11")
                  .eq(i)
                  .css({ background: "#fff" });
              }
            }
          } else if (this.msg.DeviceClass == "取电开关") {
            for (var j in this.msg.DeviceProperty) {
              if (
                this.msg.DeviceProperty[j].AttributeName == "插卡还是拔卡" &&
                this.msg.DeviceProperty[j].AttributeValue == "插卡"
              ) {
                $(".chaka")
                  .eq(i)
                  .text("插卡");
              } else {
                $(".chaka")
                  .eq(i)
                  .text("拔卡");
              }
            }
          } else if (this.msg.DeviceClass == "磁性感应器") {
            for (var j in this.msg.DeviceProperty) {
              if (
                this.msg.DeviceProperty[j].AttributeName == "开关" &&
                this.msg.DeviceProperty[j].AttributeValue == "开"
              ) {
                $(".menci")
                  .eq(i)
                  .text("开");
              } else {
                $(".menci")
                  .eq(i)
                  .text("关");
              }
            }
          }
        }
      }
    });
  },
  created() {
    this.getMqtt();
  },
  methods: {
    getMqtt() {
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          for (let i in res.data) {
            let pic = this.jdNameLOW_TO_UP + res.data[i].RoomNUM;
            this.client.subscribe(pic, { qos: 1 }, error => {
              if (!error) {
                console.log("订阅成功,主题：", pic);
              } else {
                console.log("订阅失败", pic);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    kongt(item) {
      console.log(item);
      item.LowerMachine.DeviceList.forEach(device => {
        if (device.DeviceClass == "温控器") {
          var payload = {
            LowerMachine_ID: device.LowerMachine_ID,
            DeviceName: device.DeviceName,
            DeviceClass: device.DeviceClass,
            AreaOfRoom: device.AreaOfRoom,
            OwinSHA: device.OwinSHA,
            DeviceProperty: []
          };

          if (item.kongtiao == true) {
            // alert(this.jdNameUP_TO_LOW + item.RoomNUM)
            payload.DeviceProperty = [
              { AttributeName: "开关", AttributeValue: "开" }
            ];
            this.client.publish(
              this.jdNameUP_TO_LOW + item.RoomNUM,
              JSON.stringify(payload)
            );
            console.log(payload);
          } else {
            payload.DeviceProperty = [
              { AttributeName: "开关", AttributeValue: "关" }
            ];
            this.client.publish(
              this.jdNameUP_TO_LOW + item.RoomNUM,
              JSON.stringify(payload)
            );
            console.log(payload);
          }
        }
      });
    },
    allSos() {
      console.log(this.sos);
      this.tableData = this.sos;
      this.ic = true;
      $(".img1").hide();
      $(".img2").show();
      $(".img3").hide();
      $(".box-card11").css({ background: "rgb(245, 142, 142)" });
      for (var i in this.tableData) {
        this.$set(this.tableData[i], "seletetype", "sos");
      }
    },
    alltuifang() {
      console.log(this.tuifang);
      this.tableData = this.tuifang;
      this.ic = true;
      $(".img1").hide();
      $(".img2").hide();
      $(".img3").show();
      $(".box-card11").css({ background: "hsl(239, 84%, 76%)" });
      for (var i in this.tableData) {
        this.$set(this.tableData[i], "seletetype", "退房");
      }
    },
    allqingli() {
      console.log(this.qingli);
      this.tableData = this.qingli;
      this.ic = true;
      $(".img1").show();
      $(".img2").hide();
      $(".img3").hide();
      $(".box-card11").css({ background: "rgb(52, 226, 52)" });
      for (var i in this.tableData) {
        this.$set(this.tableData[i], "seletetype", "清理");
      }
    },
    delate(item) {
      // console.log(item);
      var payload = {
              LowerMachine_ID: item.LowerMachine.DeviceList[i].LowerMachine_ID,
              DeviceName: item.LowerMachine.DeviceList[i].DeviceName,
              DeviceClass: item.LowerMachine.DeviceList[i].DeviceClass,
              AreaOfRoom: item.LowerMachine.DeviceList[i].AreaOfRoom,
              OwinSHA: item.LowerMachine.DeviceList[i].OwinSHA,
              DeviceProperty: []
            };
      if (item.seletetype == "sos") {
        for (var i in item.LowerMachine.DeviceList) {
          if (item.LowerMachine.DeviceList[i].DeviceClass == "紧急呼叫") {
            // var payload = {
            //   LowerMachine_ID: item.LowerMachine.DeviceList[i].LowerMachine_ID,
            //   DeviceName: item.LowerMachine.DeviceList[i].DeviceName,
            //   DeviceClass: item.LowerMachine.DeviceList[i].DeviceClass,
            //   AreaOfRoom: item.LowerMachine.DeviceList[i].AreaOfRoom,
            //   OwinSHA: item.LowerMachine.DeviceList[i].OwinSHA,
            //   DeviceProperty: []
            // };
            payload.DeviceProperty = [
              { AttributeName: "状态更改", AttributeValue: "关" }
            ];
          }
        }
      } else if (item.seletetype == "清理") {
        for (var i in item.LowerMachine.DeviceList) {
          if (item.LowerMachine.DeviceList[i].DeviceClass == "门显") {
            // var payload = {
            //   LowerMachine_ID: item.LowerMachine.DeviceList[i].LowerMachine_ID,
            //   DeviceName: item.LowerMachine.DeviceList[i].DeviceName,
            //   DeviceClass: item.LowerMachine.DeviceList[i].DeviceClass,
            //   AreaOfRoom: item.LowerMachine.DeviceList[i].AreaOfRoom,
            //   OwinSHA: item.LowerMachine.DeviceList[i].OwinSHA,
            //   DeviceProperty: []
            // };
            payload.DeviceProperty = [
              { AttributeName: "清理", AttributeValue: "关" }
            ];
          }
        }
      } else if (item.seletetype == "退房") {
        for (var i in item.LowerMachine.DeviceList) {
          if (item.LowerMachine.DeviceList[i].DeviceClass == "预约服务") {
            // var payload = {
            //   LowerMachine_ID: item.LowerMachine.DeviceList[i].LowerMachine_ID,
            //   DeviceName: item.LowerMachine.DeviceList[i].DeviceName,
            //   DeviceClass: item.LowerMachine.DeviceList[i].DeviceClass,
            //   AreaOfRoom: item.LowerMachine.DeviceList[i].AreaOfRoom,
            //   OwinSHA: item.LowerMachine.DeviceList[i].OwinSHA,
            //   DeviceProperty: []
            // };
            payload.DeviceProperty = [
              { AttributeName: "状态更改", AttributeValue: "关" }
            ];
          }
        }
      }
      console.log(JSON.stringify(payload));
      this.client.publish(
        this.jdNameUP_TO_LOW + item.RoomNUM,
        JSON.stringify(payload)
      );
    },
    show_right(e) {
      if (
        e.target.src ==
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABVUlEQVRYR+2Xu0rEQBSG/zl5irkUWllYCYKVsPbWglaChaCNoP3uPoBauYIIWln4FJY+RiBzAX2HPZJAlpCsWmySCeg0IUXO/51rzghEPiKyPoYBEEJYAzBm5vzZ+RFCpACmUsq0iIBzbiKEGHeuXBFg5pnW+rwA8N7fArjoE2A+n18ZY64XNeCcOwSw0QcEEX1IKWe51jCKsA+vv9MYfgS890dKqZfcgyzLRkQ0WjVizJwaY55/rQHv/Q2ALaXUXpZlO0mSvK8qXn7PzFOt9WRpCkIIm8x8D2AXwFsOEEI4Y+a7tgAAPCilThsA1tpjInqqCBUA+bu19pKI9luA+FRKHTRS4L1/BHBSE1gAtCDcMFFOwm0ArwDWl4j8AYDS62gpqIY9ahGWIFHbsBqNaIOoBhFvFHfR93Wbw/8bdh2FYaxk0ZfS6Gt59ItJ14X2k/3/NvwC02S0Ibsuo7YAAAAASUVORK5CYII="
      ) {
        e.target.src =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABfUlEQVRYR+2WsUrDUBSGz+lSXG2X/oeOvoHoajZXN5ciDiIICrroIm0nwUUXHXwBFcEHcLEv4KCLda65XTrURQlYjlTa0KZJFZqbLMkWyD3/x3/Oyf2ZUn44ZX3KAHwHjDGrRLRFRPOW29JV1WcRqfV1fIB2u72jqheWxf3yAH61Rx1YI6L7hACuAGyPAfRfWq3WHBEt24Yol8uNoUa2Bb4DnU5HisWia9v+YH0fwHXdGjO/AIgcRGPMCREdxQB5DmB/bAgHAFVVPRWRwzARY8wjEa3EANAA4IQCDIo38vl8pVAovI+KDSFnBVDV+sSPKKT4FzNvlEqlu1kFp50PzkA15OMzAAe2IP4EmDYTcUBFAqiqIaJNEXmIQyiqRigAM980m82K4zjfoweTWMNdVT0Wkcu01vAWwGuUXVbX0Gaf/7WGGcAgjCzYzoS5XO6Dmd8AfAbvgnVmvk6oFZOXUcKh9AnA4pgD/UDied4eMy/ZdqHX69WHuTDLhJkDP7YepCHJq8/eAAAAAElFTkSuQmCC";
        this.bool = true;
      } else {
        e.target.src =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABVUlEQVRYR+2Xu0rEQBSG/zl5irkUWllYCYKVsPbWglaChaCNoP3uPoBauYIIWln4FJY+RiBzAX2HPZJAlpCsWmySCeg0IUXO/51rzghEPiKyPoYBEEJYAzBm5vzZ+RFCpACmUsq0iIBzbiKEGHeuXBFg5pnW+rwA8N7fArjoE2A+n18ZY64XNeCcOwSw0QcEEX1IKWe51jCKsA+vv9MYfgS890dKqZfcgyzLRkQ0WjVizJwaY55/rQHv/Q2ALaXUXpZlO0mSvK8qXn7PzFOt9WRpCkIIm8x8D2AXwFsOEEI4Y+a7tgAAPCilThsA1tpjInqqCBUA+bu19pKI9luA+FRKHTRS4L1/BHBSE1gAtCDcMFFOwm0ArwDWl4j8AYDS62gpqIY9ahGWIFHbsBqNaIOoBhFvFHfR93Wbw/8bdh2FYaxk0ZfS6Gt59ItJ14X2k/3/NvwC02S0Ibsuo7YAAAAASUVORK5CYII=";
        this.bool = false;
      }
    },
    changeFloor(val) {
      this.$store.commit("changeFloor", val);
    },
    //卡片式跳转到相应房间的方法
    hand(roomNum, roomstatus) {
      console.log(roomNum, roomstatus);
      if (roomstatus == "连接") {
        this.$router.push("/equipmentList/" + roomNum);
      }
    },
    p() {
      this.val = "";
      this.error = "";
    },
    //当localStorage中还未储存信息时应用此方法获取房间列表
    roomlists() {
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          console.log(res.data);
          this.$store.commit("changeallroom", res.data);
          this.Hotel = res.data[0].Hotel_Name;
          var newList = [];
          for (var i in res.data) {
            if (res.data[i].Hotel_Name == this.Hotel) {
              newList.push(res.data[i]);
              this.floorList = _.groupBy(newList, "Hotel_Floor");
              this.$set(this.floorList, "所有房间", newList);
              this.tableData = newList;
              this.tableData.sort(this.compare("RoomNUM"));
            }
          }
          for (let j = 0; j < this.tableData.length; j++) {
            this.ckstatus(this.tableData[j], j);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //排序方法
    compare(property) {
      return function(a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        return value1 - value2;
      };
    },
    // 获取下位机，取电开关，门显状态
    ckstatus(room, index) {
      this.$axios
        .get(
          this.portAddress +
            "/api/home/GetAllDeviceStatusByRoom?RoomNUM=" +
            room.RoomNUM
        )
        .then(res => {
          // console.log(res.data)
          room.LowerMachine = res.data;
          this.$set(room, "kongtiao", "false");
          // this.$set(room, room.RoomNUM, false);
          for (var i in res.data.DeviceList) {
            if (res.data.DeviceList[i].DeviceClass == "取电开关") {
              for (var j in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[j].AttributeName ==
                  "插卡还是拔卡"
                ) {
                  this.$set(
                    room,
                    "qdstatus",
                    res.data.DeviceList[i].DeviceProperty[j].AttributeValue
                  );
                }
              }
            }
            if (res.data.DeviceList[i].DeviceClass == "磁性感应器") {
              for (var j in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[j].AttributeName ==
                  "开关"
                ) {
                  this.$set(
                    room,
                    "mencistatus",
                    res.data.DeviceList[i].DeviceProperty[j].AttributeValue
                  );
                }
              }
            }
            if (res.data.DeviceList[i].DeviceClass == "门显") {
              for (let g in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[g].AttributeValue ==
                  "开"
                ) {
                  this.$set(
                    room,
                    "mxstatus",
                    res.data.DeviceList[i].DeviceProperty[g].AttributeName
                  );
                  if (room.mxstatus == "清理") {
                    $(".img1")
                      .eq(index)
                      .show();
                    this.qingli = [];
                    if (this.qingli.indexOf(room) == -1) {
                      this.qingli.push(room);
                    }
                  } else {
                    $(".img1")
                      .eq(index)
                      .hide();
                  }
                }
              }
            }
            if (res.data.DeviceList[i].DeviceClass == "温控器") {
              for (let g in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[g].AttributeName ==
                  "当前温度"
                ) {
                  this.$set(
                    room,
                    "nowtelephone",
                    res.data.DeviceList[i].DeviceProperty[g].AttributeValue
                  );
                }
              }
            }
            if (res.data.DeviceList[i].DeviceClass == "预约服务") {
              for (let g in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[g].AttributeValue ==
                  "开"
                ) {
                  $(".img3")
                    .eq(index)
                    .show();
                  this.tuifang = [];
                  if (this.tuifang.indexOf(room) == -1) {
                    this.tuifang.push(room);
                  }
                } else {
                  $(".img3")
                    .eq(index)
                    .hide();
                }
              }
            }
            if (res.data.DeviceList[i].DeviceClass == "紧急呼叫") {
              for (let g in res.data.DeviceList[i].DeviceProperty) {
                if (
                  res.data.DeviceList[i].DeviceProperty[g].AttributeValue ==
                  "开"
                ) {
                  $(".img2")
                    .eq(index)
                    .show();
                  this.sos = [];
                  if (this.sos.indexOf(room) == -1) {
                    this.sos.push(room);
                  }
                } else {
                  $(".img2")
                    .eq(index)
                    .hide();
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择楼层的方法
    selected() {
      this.tableData = [];
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          // console.log(res.data)
          for (var i in res.data) {
            if (parseInt(res.data[i].Hotel_Floor) == this.value) {
              this.tableData.push(res.data[i]);
            } else if (this.value == "所有房间") {
              this.tableData = res.data;
            }
          }
          for (let j = 0; j < this.tableData.length; j++) {
            this.ckstatus(this.tableData[j], j); //给房间列表添加属性
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang='less' scoped>
.home {
  background: rgb(236, 236, 236);
  display: flex;
  .article_right {
    width: 170px;
  }
  .shenzuo {
    width: 25px;
    position: fixed;
    top: 50px;
    right: 25px;
  }
  .right_fixed {
    position: fixed;
    width: 120px;
    height: 85vh;
    top: 110px;
    right: 25px;
    border-radius: 5px;
    background: rgb(133, 132, 109);
    h4 {
      text-align: center;
      color: rgb(60, 255, 0);
      margin: 20px 0;
    }
    div {
      margin: 40px 0;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        img {
          width: 25px;
          margin-right: 10px;
        }
        span {
          color: aqua;
        }
      }
    }
  }
  h1 {
    text-align: center;
    padding: 20px 0;
  }
  .al {
    z-index: 3000;
    width: ~"calc(100% - 170px)";
    background: rgb(121, 119, 119);
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0px;
    right: 0px;
    font-size: 15px;
    color: rgb(4, 245, 4);
    p {
      margin: 8px 10px;
      display: flex;
      align-items: center;
    }
    span {
      color: red;
    }
    img {
      width: 20px;
    }
  }
  .chat {
    img {
      width: 40px;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .num {
      width: 15px;
      height: 15px;
      text-align: center;
      border-radius: 50%;
      background-color: red;
      color: #fff;
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  .header {
    width: 100%;
    .select_floor {
      span {
        margin-left: 100px;
      }
      select {
        color: rgb(248, 14, 6);
        border: 2px solid rgb(4, 115, 243);
        outline: none;
      }
    }

    .search {
      width: 300px;
      position: absolute;
      right: 30px;
      .s-input {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #fff;
        input {
          flex: 1;
          border: 0;
          outline: none;
          padding: 0 10px;
        }
        p {
          margin-right: 10px;
          color: rgb(59, 59, 59);
          padding: 0 4px;
          border-radius: 6px;
          background-color: rgb(231, 228, 228);
        }
        img {
          width: 25px;
          height: 25px;
          margin-right: 5px;
        }
      }
      p {
        padding: 0 10px;
        font-size: 12px;
        color: rgb(247, 8, 8);
      }
    }
  }
  .roomlist {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    // align-items: center;
    margin: 30px 0 50px;
    padding: 0px 20px;
    li {
      width: 200px;
      border-radius: 10px;
      padding: 10px;
      .box-card11 {
        position: relative;
        background: rgb(252, 249, 249);
        /deep/.el-card__header {
          padding: 10px 20px;
          .clearfix {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
              width: 25px;
            }
          }
        }
        .el-icon-error {
          position: absolute;
          right: 2px;
          top: 2px;
        }
        p {
          display: flex;
          font-size: 15px;
          span {
            color: rgb(255, 0, 200);
          }
          span:first-of-type {
            width: 90px;
            color: rgb(4, 41, 250);
          }
        }
        .now {
          display: flex;
          .tel {
            transform: scale(0.8);
            width: 35px;
            height: 70px;
            margin: 0px 5px 0 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 25px;
            background: rgb(35, 241, 197);
            border: 1px solid #ccc;
            border-radius: 20px;
            border: 1px solid #ccc;
            p {
              // width: 100%;
              margin-top: -1px;
              height: 35px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: rgb(50, 5, 253);
            }
            p:first-of-type {
              border: 1px solid #ccc;
              border-radius: 50%;
              color: red;
              // font-size:13px;
            }
          }
          .tel:nth-of-type(2) {
            background: rgb(93, 245, 113);
          }
          .tel:nth-of-type(3) {
            background: rgb(237, 240, 93);
          }
        }
      }
    }
  }
}
</style>