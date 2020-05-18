<template>
  <div class="maincontent">
    <div class="m-title">
      <span>{{Hotel}}</span>
    </div>
    <div class="select-area">
      <div class="select_floor">
        <span>选层：</span>
        <el-select v-model="value" placeholder="请选择" @change="selected">
          <el-option v-for="(item,index) in floorList" :key="index" :label="index" :value="index"></el-option>
        </el-select>
      </div>
      <div class="room_stats">
        <div class="state" @click="filterNeed($event)">
          <i
            class="el-icon-message-solid"
            style="font-size:26px;color:#F56C6C;vertical-align: bottom;"
          ></i>
          SOS X {{sos.length}}
        </div>
        <div class="state" @click="filterNeed($event)">
          <i
            class="el-icon-delete-solid"
            style="font-size:26px;color:#67C23A;vertical-align: bottom;"
          ></i>
          清理 X {{qingli.length}}
        </div>
        <div class="state" @click="filterNeed($event)">
          <i class="el-icon-s-finance" style="font-size:26px;color:#E6A23C;vertical-align: bottom;"></i>
          退房 X {{tuifang.length}}
        </div>
        <div class="state" @click="filterStatus($event)" id="kf">
          <div class="status-block">
            <div class="kongfang m-block"></div>
          </div>
          空房 X {{kongfang.length}}
        </div>
        <div class="state" @click="filterStatus($event)" id="zdf">
          <div class="status-block">
            <div class="zhongdianfang m-block"></div>
          </div>
          钟点房 X {{zhongdianfang.length}}
        </div>
        <div class="state" @click="filterStatus($event)" id="rzf">
          <div class="status-block">
            <div class="rizufang m-block"></div>
          </div>
          日租房 X {{rizufang.length}}
        </div>
        <div class="state" @click="filterStatus($event)" id="czf">
          <div class="status-block">
            <div class="changzufang m-block"></div>
          </div>
          长租房 X {{changzufang.length}}
        </div>
        <div class="state" @click="filterStatus($event)" id="gzf">
          <div class="status-block">
            <div class="guzhangfang m-block"></div>
          </div>
          故障房 X {{guzhangfang.length}}
        </div>
      </div>
    </div>
    <ul class="roomlist">
      <li
        v-for="(item,index) in tableData"
        :key="index"
        @dblclick="jumpTo(item.RoomNUM,item.LowerMachine.RunStatus)"
        class="myroom"
      >
        <el-card class="box-card11">
          <div slot="header" class="clearfix">
            <span class="room-num">{{item.RoomNUM}}</span>
            <div>
              <i
                v-show="item.needSOS"
                class="el-icon-message-solid room-state-icon"
                style="color:#F56C6C;"
                @click="handleRoomState(item,$event)"
              ></i>
              <i
                v-show="item.needClean"
                class="el-icon-delete-solid room-state-icon"
                style="color:#67C23A;"
                @click="handleRoomState(item,$event)"
              ></i>
              <i
                v-show="item.needTuifang"
                class="el-icon-s-finance room-state-icon"
                style="color:#E6A23C;"
                @click="handleRoomState(item,$event)"
              ></i>
            </div>
          </div>
          <div>
            <p>
              <span>房间类型：</span>
              <span>{{item.RoomType}}</span>
            </p>
            <p>
              <span>连接状态：</span>
              <span v-if="item.LowerMachine!=null">{{item.LowerMachine.RunStatus}}</span>
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
              <span>房间温度：</span>
              <span>{{item.nowtelephone}}</span>
            </p>
            <p>
              <span>空调控制：</span>
              <el-switch
                v-model="item.kongtiao"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="kongtiaoChange(item)"
              ></el-switch>
            </p>
            <p style="line-height:40px;">
              <span>房间状态：</span>
              <el-popover placement="bottom" trigger="click">
                <!-- <el-tag v-for="i in roomStatusOptions" :key="i">{{i}}</el-tag> -->
                <el-radio-group v-model="item.RoomStatus" @change="changeRoomStatus(item)">
                  <el-radio-button label="空房"></el-radio-button>
                  <el-radio-button label="钟点房"></el-radio-button>
                  <el-radio-button label="日租房"></el-radio-button>
                  <el-radio-button label="长租房"></el-radio-button>
                  <el-radio-button label="故障房"></el-radio-button>
                </el-radio-group>
                <el-button
                  type="text"
                  slot="reference"
                  style="color:#000;"
                >{{item.RoomStatus || "空房"}}</el-button>
              </el-popover>
            </p>
            <div
              :class="{'m-color-status':true,'rizufang':item.RoomStatus === '日租房','zhongdianfang':item.RoomStatus === '钟点房','changzufang':item.RoomStatus === '长租房','guzhangfang':item.RoomStatus === '故障房'}"
            ></div>
          </div>
        </el-card>
      </li>
    </ul>
  </div>
</template>
<script>
import mqtt from "mqtt";
export default {
  data() {
    return {
      // rightData: true,
      // roomStatusOptions: ["空房", "钟点房", "日租房", "长租房"],
      value: "所有房间",
      Hotel: "", //存储酒店名称
      tableData: [],
      tempData: [],
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
      needClean: true,
      needSOS: true,
      needTuifang: true,
      ic: false,
      ind: "",
      qingli: [], //请求清理房间统计
      sos: [], //紧急呼叫房间统计
      tuifang: [], //预约退房统计
      kongfang: [],
      zhongdianfang: [],
      rizufang: [],
      changzufang: [],
      guzhangfang: [],
      userrank: this.$store.state.userrank
    };
  },
  mounted() {
    // this.changeFloor(this.floorList);
    this.getRoomlists();
    // 接收消息处理
    this.client.on("message", (topic, message) => {
      console.log("收到来自", topic, "的消息", message.toString());
      this.msg = JSON.parse(message.toString());
      this.$store.commit("changeCount", this.msg);
      var roomNum = topic.match(/\d+/)[0];
      this.$store.commit("changemqttroom", roomNum);
      this.handleMessage(roomNum, this.msg);
    });
  },

  methods: {
    //统计房间状态数量
    computRoomStatus(list) {
      this.guzhangfang = [];
      this.rizufang = [];
      this.zhongdianfang = [];
      this.changzufang = [];
      this.kongfang = [];
      for (const item of list) {
        if (item.RoomStatus === "" || item.RoomStatus === "空房") {
          this.kongfang.push(item);
        } else if (
          item.RoomStatus === "钟点房" &&
          this.zhongdianfang.indexOf(item) === -1
        ) {
          this.zhongdianfang.push(item);
        } else if (
          item.RoomStatus === "日租房" &&
          this.rizufang.indexOf(item) === -1
        ) {
          this.rizufang.push(item);
        } else if (
          item.RoomStatus === "长租房" &&
          this.changzufang.indexOf(item) === -1
        ) {
          this.changzufang.push(item);
        } else if (
          item.RoomStatus === "故障房" &&
          this.guzhangfang.indexOf(item) === -1
        ) {
          this.guzhangfang.push(item);
        }
      }
    },
    //更改房间出租状态
    changeRoomStatus(item) {
      let msg = { RoomNUM: item.RoomNUM, RoomStatus: item.RoomStatus };
      this.$axios
        .post(this.portAddress + "/api/DataBase/SetRoomCurrentStatus", msg)
        .then(res => {
          if (res.status >= 200) {
            console.log("success");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //请求房间列表信息
    getRoomlists() {
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          console.log(res.data);
          this.$store.commit("changeallroom", res.data);
          this.Hotel = res.data[0].Hotel_Name;
          this.tempData = res.data;
          this.computRoomStatus(this.tempData);
          this.floorList = _.groupBy(res.data, "Hotel_Floor");
          this.$set(this.floorList, "所有房间", res.data);
          for (let j = 0; j < this.tempData.length; j++) {
            this.ckstatus(this.tempData[j]);
            let mtopic = this.jdNameLOW_TO_UP + this.tempData[j].RoomNUM;
            this.client.subscribe(mtopic, { qos: 1 }, error => {
              if (!error) {
                console.log("订阅成功,主题：", mtopic);
              } else {
                console.log("订阅失败:", mtopic);
              }
            });
          }
          this.tableData = this.tempData; //初始界面显示全部房间
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取下位机，取电开关，门显状态
    ckstatus(room) {
      this.$axios
        .get(
          this.portAddress +
            "/api/home/GetAllDeviceStatusByRoom?RoomNUM=" +
            room.RoomNUM
        )
        .then(res => {
          // console.log(res.data)
          room.LowerMachine = res.data;
          this.filterRoomState(room, res.data.DeviceList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //房间卡片上的一键开关空调按钮
    kongtiaoChange(item) {
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
    //筛选显示有服务请求的房间
    filterNeed(e) {
      if (e.target.innerText.indexOf("紧急呼叫") !== -1) {
        this.tableData = this.tempData.filter(roomObj => {
          if (roomObj.needSOS) {
            return roomObj;
          }
        });
      } else if (e.target.innerText.indexOf("清理") !== -1) {
        this.tableData = this.tempData.filter(roomObj => {
          if (roomObj.needSOS) {
            return roomObj;
          }
        });
      } else if (e.target.innerText.indexOf("退房") !== -1) {
        this.tableData = this.tempData.filter(roomObj => {
          if (roomObj.needTuifang) {
            return roomObj;
          }
        });
      }
    },
    //筛选出租状态的房间
    filterStatus(e) {
      switch (e.target.id) {
        case "kf":
          this.tableData = this.tempData.filter(roomObj => {
            if (roomObj.RoomStatus === "" || roomObj.RoomStatus === "空房") {
              return roomObj;
            }
          });
          break;
        case "zdf":
          this.tableData = this.tempData.filter(roomObj => {
            if (roomObj.RoomStatus === "钟点房") {
              return roomObj;
            }
          });
          break;
        case "rzf":
          this.tableData = this.tempData.filter(roomObj => {
            if (roomObj.RoomStatus === "日租房") {
              return roomObj;
            }
          });
          break;
        case "czf":
          this.tableData = this.tempData.filter(roomObj => {
            if (roomObj.RoomStatus === "长租房") {
              return roomObj;
            }
          });
          break;
        case "gzf":
          this.tableData = this.tempData.filter(roomObj => {
            if (roomObj.RoomStatus === "故障房") {
              return roomObj;
            }
          });
          break;
        default:
          break;
      }
      // console.log(e.target.id);
    },
    //点击关闭服务请求
    handleRoomState(item, e) {
      let messageObj = {};
      if (e.target.classList[0] === "el-icon-delete-solid") {
        for (const elObj of item.LowerMachine.DeviceList) {
          if (elObj.DeviceClass === "门显") {
            messageObj = { ...elObj };
          }
        }
        item.needClean = false;
        // item.mxstatus = "";
        this.qingli.splice(this.qingli.indexOf(item), 1);
        messageObj.DeviceProperty = [
          { AttributeName: "清理", AttributeValue: "关" }
        ];
      } else if (e.target.classList[0] === "el-icon-message-solid") {
        for (const elObj of item.LowerMachine.DeviceList) {
          if (elObj.DeviceClass === "紧急呼叫") {
            messageObj = { ...elObj };
          }
        }
        item.needSOS = false;
        this.sos.splice(this.sos.indexOf(item), 1);
        messageObj.DeviceProperty = [
          { AttributeName: "状态更改", AttributeValue: "关" }
        ];
      } else if (e.target.classList[0] === "el-icon-s-finance") {
        for (const elObj of item.LowerMachine.DeviceList) {
          if (elObj.DeviceClass === "预约服务") {
            messageObj = { ...elObj };
          }
        }
        item.needTuifang = false;
        this.tuifang.splice(this.tuifang.indexOf(item), 1);
        messageObj.DeviceProperty = [
          { AttributeName: "状态更改", AttributeValue: "关" }
        ];
      }
      console.log(item);
      console.log(JSON.stringify(messageObj));

      this.client.publish(
        this.jdNameUP_TO_LOW + item.RoomNUM,
        JSON.stringify(messageObj)
      );
    },
    //卡片式跳转到相应房间的方法
    jumpTo(roomNum, roomstatus) {
      // console.log(roomNum, roomstatus);
      if (roomstatus === "连接") {
        this.$router.push("/equipmentList/" + roomNum);
      }
    },
    //添加每个房间的门显空调属性
    filterRoomState(room, list) {
      this.$set(room, "kongtiao", "false");
      for (const deviceObj of list) {
        if (deviceObj.DeviceClass === "取电开关") {
          for (const deviceProperty of deviceObj.DeviceProperty) {
            if (deviceProperty.AttributeName === "插卡还是拔卡") {
              this.$set(room, "qdstatus", deviceProperty.AttributeValue);
            }
          }
        } else if (deviceObj.DeviceClass === "磁性感应器") {
          this.$set(
            room,
            "mencistatus",
            deviceObj.DeviceProperty[0].AttributeValue
          );
        } else if (deviceObj.DeviceClass === "门显") {
          for (const deviceProperty of deviceObj.DeviceProperty) {
            if (
              deviceProperty.AttributeName === "清理" &&
              deviceProperty.AttributeValue === "开"
            ) {
              this.$set(room, "mxstatus", "清理");
              this.$set(room, "needClean", true);
              if (this.qingli.indexOf(room) === -1) {
                this.qingli.push(room);
              }
            } else if (
              deviceProperty.AttributeName === "清理" &&
              deviceProperty.AttributeValue === "关"
            ) {
              this.$set(room, "mxstatus", "");
              this.$set(room, "needClean", false);
              if (this.qingli.indexOf(room) !== -1) {
                this.qingli.splice(this.qingli.indexOf(room), 1);
              }
            }
          }
        } else if (deviceObj.DeviceClass === "温控器") {
          for (const deviceProperty of deviceObj.DeviceProperty) {
            if (deviceProperty.AttributeName === "当前温度") {
              this.$set(room, "curTemper", deviceProperty.AttributeValue);
            }
          }
        } else if (deviceObj.DeviceClass === "预约服务") {
          if (deviceObj.DeviceProperty[0].AttributeValue === "开") {
            this.$set(room, "needTuifang", true);
            if (this.tuifang.indexOf(room) == -1) {
              this.tuifang.push(room);
            }
          } else {
            this.$set(room, "needTuifang", false);
            if (this.tuifang.indexOf(room) !== -1) {
              this.tuifang.splice(this.tuifang.indexOf(room), 1);
            }
          }
        } else if (deviceObj.DeviceClass === "紧急呼叫") {
          if (deviceObj.DeviceProperty[0].AttributeValue === "开") {
            this.$set(room, "needSOS", true);
            if (this.sos.indexOf(room) == -1) {
              this.sos.push(room);
            }
          } else {
            this.$set(room, "needSOS", false);
            if (this.sos.indexOf(room) !== -1) {
              this.sos.splice(this.tuifang.indexOf(room), 1);
            }
          }
        }
      }
    },
    //按楼层显示的方法
    selected() {
      if (this.value === "所有房间") {
        this.tableData = this.tempData;
      } else {
        this.tableData = this.tempData.filter(roomObj => {
          if (roomObj.Hotel_Floor === this.value) {
            return roomObj;
          }
        });
      }
    },
    //处理收到的mqtt消息
    handleMessage(num, msg) {
      for (const room of this.tempData) {
        if (room.RoomNUM === num) {
          if (msg.DeviceClass === "紧急呼叫") {
            room.needSOS =
              msg.DeviceProperty[0].AttributeValue === "开" ? true : false;
            if (room.needSOS && this.sos.indexOf(room) === -1) {
              this.sos.push(room);
            } else {
              this.sos.splice(this.sos.indexOf(room), 1);
            }
          } else if (msg.DeviceClass === "预约服务") {
            room.needTuifang =
              msg.DeviceProperty[0].AttributeValue === "开" ? true : false;
            if (room.needTuifang && this.tuifang.indexOf(room) === -1) {
              this.tuifang.push(room);
            } else {
              this.tuifang.splice(this.tuifang.indexOf(room), 1);
            }
          } else if (msg.DeviceClass === "磁性感应器") {
            room.mencistatus =
              msg.DeviceProperty[0].AttributeValue === "开" ? true : false;
          } else if (msg.DeviceClass === "取电开关") {
            for (const arrObj of msg.DeviceProperty) {
              if (arrObj.AttributeName === "插卡还是拔卡") {
                room.qdstatus = arrObj.AttributeValue;
              }
            }
          } else if (msg.DeviceClass === "门显") {
            for (const arrObj of msg.DeviceProperty) {
              if (arrObj.AttributeName === "清理") {
                room.needClean = arrObj.AttributeValue === "开" ? true : false;
                if (room.needClean && this.qingli.indexOf(room) === -1) {
                  this.qingli.push(room);
                } else {
                  this.qingli.splice(this.qingli.indexOf(room), 1);
                }
              }
            }
          }
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.kongfang {
  background: #fcf9f9;
}
.zhongdianfang {
  background: #e6a23c;
}
.rizufang {
  background: #67c23a;
}
.changzufang {
  background: #f56c6c;
}
.guzhangfang {
  background: #909399;
}
.m-color-status {
  position: absolute;
  width: 50px;
  height: 50px;
  transform: rotate(45deg);
  bottom: -25px;
  right: -25px;
}
.maincontent {
  width: 100%;
  height: 100%;
  background: #ececec;

  .m-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 2em;
    font-weight: bold;
  }
  .select-area {
    width: 100%;
    display: flex;
    .select_floor {
      margin-left: 100px;
    }
    .room_stats {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-left: 50px;
      font-weight: 600;
      .state {
        position: relative;
        border-radius: 5px;
        padding: 5px;
        margin-left: 10px;
        vertical-align: bottom;
        transition: background-color 0.5s, color 0.5s;
        -moz-transition: background-color 0.5s, color 0.5s;
        -webkit-transition: background-color 0.5s, color 0.5s;
        -o-transition: background-color 0.5s, color 0.5s;
        &:hover {
          background-color: #fff;
          cursor: pointer;
        }
      }
      .status-block {
        display: inline-block;
        position: relative;
        height: 22px;
        width: 22px;
        overflow: hidden;
        .m-block {
          position: absolute;
          height: 30px;
          width: 30px;
          transform: rotate(45deg);
          top: 8px;
          left: 8px;
        }
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
}
.roomlist {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  li {
    width: 180px;
    padding: 2px;
    .box-card11 {
      position: relative;
      .room-num {
        font-size: 1.5em;
        font-weight: bold;
        color: #409eff;
      }
      /deep/.el-card__header {
        padding: 5px 10px;
        .clearfix {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      /deep/.el-card__body {
        padding: 10px;
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
.room-state-icon {
  font-size: 22px;
  &:hover {
    cursor: pointer;
  }
}
</style>