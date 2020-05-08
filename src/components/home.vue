
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
            紧急呼叫 X {{sos.length}}
          </div>
          <div class="state" @click="filterNeed($event)">
            <i
              class="el-icon-delete-solid"
              style="font-size:26px;color:#67C23A;vertical-align: bottom;"
            ></i>
            清理 X {{qingli.length}}
          </div>
          <div class="state" @click="filterNeed($event)">
            <i
              class="el-icon-s-finance"
              style="font-size:26px;color:#E6A23C;vertical-align: bottom;"
            ></i>
            退房 X {{tuifang.length}}
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
              <span class="roomNUM">{{item.RoomNUM}}房间</span>
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

          </el-card>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import mqtt from "mqtt";
export default {
  data() {
    return {
      // rightData: true,
      value: "所有房间",
      Hotel: "", //存储酒店名称
      tableData: [],
      tempData:[],
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
      qingli: [],//请求清理房间统计
      sos: [],//紧急呼叫房间统计
      tuifang: [],//预约退房统计
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
      this.handleMessage(roomNum,this.msg);
    });
  },
  methods: {
    //请求房间列表信息
    getRoomlists() {
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          console.log(res.data);
          this.$store.commit("changeallroom", res.data);
          this.Hotel = res.data[0].Hotel_Name;
          this.tempData = res.data;

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
          this.tableData = this.tempData;//初始界面显示全部房间
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
          this.filterRoomState(room,res.data.DeviceList);

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
    filterNeed(e){
      if(e.target.innerText.indexOf("紧急呼叫") !== -1){
        this.tableData = this.tempData.filter(roomObj=>{
          if(roomObj.needSOS){
            return roomObj;
          }
        })

      }else if(e.target.innerText.indexOf("清理") !== -1){
        this.tableData = this.tempData.filter(roomObj=>{
          if(roomObj.needSOS){
            return roomObj;
          }
        })

      }else if(e.target.innerText.indexOf("退房") !== -1){
        this.tableData = this.tempData.filter(roomObj=>{
          if(roomObj.needTuifang){
            return roomObj;
          }
        })
      }

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
        messageObj.DeviceProperty=[{ AttributeName: "状态更改", AttributeValue: "关" }];

      } else if (e.target.classList[0] === "el-icon-s-finance") {
        for (const elObj of item.LowerMachine.DeviceList) {
          if (elObj.DeviceClass === "预约服务") {
            messageObj = { ...elObj };
          }
        }
        item.needTuifang = false;
        this.tuifang.splice(this.tuifang.indexOf(item), 1);
        messageObj.DeviceProperty = [{ AttributeName: "状态更改", AttributeValue: "关" }];
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
    filterRoomState(room,list){
      this.$set(room, "kongtiao", "false");
      for (const deviceObj of list) {
            if(deviceObj.DeviceClass === '取电开关'){
              for (const deviceProperty of deviceObj.DeviceProperty) {
                if(deviceProperty.AttributeName === '插卡还是拔卡'){
                  this.$set(room,"qdstatus",deviceProperty.AttributeValue);
                }
              }
            }else if(deviceObj.DeviceClass === '磁性感应器'){
              this.$set(room,"mencistatus",deviceObj.DeviceProperty[0].AttributeValue);

            }else if(deviceObj.DeviceClass === '门显'){
              for (const deviceProperty of deviceObj.DeviceProperty) {
                if(deviceProperty.AttributeName === '清理' && deviceProperty.AttributeValue === '开'){
                  this.$set(room, "mxstatus", "清理");
                  this.$set(room, "needClean", true);
                  if (this.qingli.indexOf(room) === -1) {
                    this.qingli.push(room);
                  }
                }else if(deviceProperty.AttributeName === '清理' && deviceProperty.AttributeValue === '关'){
                  this.$set(room, "mxstatus", "");
                  this.$set(room, "needClean", false);
                  if (this.qingli.indexOf(room)!== -1) {
                    this.qingli.splice(this.qingli.indexOf(room), 1);
                  }
                }
              }

            }else if(deviceObj.DeviceClass === '温控器'){
              for (const deviceProperty of deviceObj.DeviceProperty) {
                if(deviceProperty.AttributeName === '当前温度'){
                  this.$set(room,"curTemper",deviceProperty.AttributeValue);
                }
              }

            }else if(deviceObj.DeviceClass === '预约服务'){
              if(deviceObj.DeviceProperty[0].AttributeValue === '开'){
                this.$set(room,"needTuifang",true);
                if (this.tuifang.indexOf(room) == -1) {
                    this.tuifang.push(room);
                  }
              }else{
                this.$set(room,"needTuifang",false);
                if(this.tuifang.indexOf(room)!==-1){
                  this.tuifang.splice(this.tuifang.indexOf(room),1);
                }
              }

            }else if(deviceObj.DeviceClass === '紧急呼叫'){
              if(deviceObj.DeviceProperty[0].AttributeValue === '开'){
                this.$set(room,"needSOS",true);
                if (this.sos.indexOf(room) == -1) {
                    this.sos.push(room);
                  }
              }else{
                this.$set(room,"needSOS",false);
                if(this.sos.indexOf(room) !== -1){
                  this.sos.splice(this.tuifang.indexOf(room),1);
                }
              }
            }
          }
    },
    //按楼层显示的方法
    selected() {
      if(this.value === '所有房间'){
        this.tableData = this.tempData;
      }else{
        this.tableData = this.tempData.filter((roomObj)=>{
          if(roomObj.Hotel_Floor === this.value){
            return roomObj;
          }
        })
      }
    },
    //处理收到的mqtt消息
    handleMessage(num,msg){
      for (const room of this.tempData) {
        if(room.RoomNUM === num){
          if(msg.DeviceClass === '紧急呼叫'){
            room.needSOS = msg.DeviceProperty[0].AttributeValue === '开' ? true:false;
            if(room.needSOS && this.sos.indexOf(room)===-1){
              this.sos.push(room);
            }else{
              this.sos.splice(this.sos.indexOf(room),1);
            }
          }else if(msg.DeviceClass === '预约服务'){
            room.needTuifang = msg.DeviceProperty[0].AttributeValue === '开' ? true:false;
            if(room.needTuifang && this.tuifang.indexOf(room) === -1){
              this.tuifang.push(room);
            }else{
              this.tuifang.splice(this.tuifang.indexOf(room),1);
            }
          }else if(msg.DeviceClass === '磁性感应器'){
            room.mencistatus = msg.DeviceProperty[0].AttributeValue === '开' ? true:false;
          }else if(msg.DeviceClass === '取电开关'){
            for (const arrObj of msg.DeviceProperty) {
              if(arrObj.AttributeName === '插卡还是拔卡'){
                room.qdstatus = arrObj.AttributeValue;
              }
            }
          }else if(msg.DeviceClass === '门显'){
            for (const arrObj of msg.DeviceProperty) {
              if(arrObj.AttributeName === '清理'){
                room.needClean = arrObj.AttributeValue === '开'? true:false;
                if(room.needClean && this.qingli.indexOf(room) === -1){
                  this.qingli.push(room);
                }else{
                  this.qingli.splice(this.qingli.indexOf(room),1);
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
.home {
  background: rgb(236, 236, 236);
  display: flex;
  .article_left {
    width: 100%;
  }
  .article_right {
    width: 170px;
  }
  .right-btn {
    position: fixed;
    top: 50px;
    right: 5px;
  }
  .right_fixed {
    position: fixed;
    width: 120px;
    height: 95vh;
    top: 105px;
    right: 5px;
    border-radius: 5px;
    background: #3b4255;
    h4 {
      text-align: center;
      color: #fff;
      margin: 20px 0;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 10px;
      span {
        color: skyblue;
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
  .select-area {
    width: 100%;
    display: flex;
    .select_floor {
      margin-left: 100px;
    }
    .room_stats {
      width: 450px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-left: 80px;
      .state {
        border-radius: 5px;
        border: 1px solid #eee;
        padding: 4px;
        transition: background-color 0.5s, color 0.5s;
        -moz-transition: background-color 0.5s, color 0.5s;
        -webkit-transition: background-color 0.5s, color 0.5s;
        -o-transition: background-color 0.5s, color 0.5s;
        &:hover {
          background-color: #fff;
          border: 1px solid rgb(220, 220, 230);
          cursor: pointer;
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
.room-state-icon {
  font-size: 22px;
  &:hover {
    cursor: pointer;
  }
}
</style>