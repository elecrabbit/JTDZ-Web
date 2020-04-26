<template>
  <div class="timingControl">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <div class="rwName">
          <p>任务名称：</p>
          <el-input v-model="input" placeholder="请输入内容" class="input"></el-input>
        </div>
      </div>
      <div class="timexz">
        <div class="timechange">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="执行一次" name="first">
              <p>执行一次</p>
              <div class="block">
                <div class="dataMM">
                  <span>选择日期：</span>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </div>
                <div class="dataMM">
                  <span>选择时间：</span>
                  <el-time-picker
                    v-model="value2"
                    placeholder="任意时间点"
                    format=" HH:mm:ss "
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="每天" name="second">
              <p>每天</p>
              <div class="block">
                <div class="dataMM">
                  <span>选择时间：</span>
                  <el-time-picker
                    v-model="value3"
                    placeholder="任意时间点"
                    format=" HH:mm:ss "
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </div>
                <div class="dataMM">
                  <span>间隔天数：</span>
                  <el-input-number v-model="num" :step="1" :min="0" :max="10"></el-input-number>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="每周" name="third">
              <p>每周？</p>
              <div class="block">
                <div class="dataMM">
                  <span>选择星期：</span>
                  <el-checkbox-group v-model="value4" class="zhou">
                    <el-checkbox label="Sunday"></el-checkbox>
                    <el-checkbox label="Monday"></el-checkbox>
                    <el-checkbox label="Tuesday"></el-checkbox>
                    <el-checkbox label="Wednesday"></el-checkbox>
                    <el-checkbox label="Thursday"></el-checkbox>
                    <el-checkbox label="Friday"></el-checkbox>
                    <el-checkbox label="Saturday"></el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="dataMM">
                  <span>选择时间：</span>
                  <el-time-picker
                    v-model="value5"
                    placeholder="任意时间点"
                    format=" HH:mm:ss "
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="每月" name="fourth">
              <div class="block">
                <div class="dataMM">
                  <el-tabs v-model="activeName2" @tab-click="handleClick2" class="MMbottom">
                    <el-tab-pane label="每月，天？" name="first" class="yuely">
                      <el-checkbox-group v-model="value63" class="yueData">
                        <el-checkbox v-for="data in yuelist" :label="data" :key="data">{{data}}</el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group v-model="value6" class="yueData">
                        <el-checkbox v-for="data in dataslist" :label="data" :key="data">{{data}}</el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane label="每月-周-周几？" name="second" class="weekly">
                      <el-checkbox-group v-model="value61" class="weekData">
                        <el-checkbox v-for="data in monthlist" :label="data" :key="data">{{data}}</el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group v-model="value62" class="weekData">
                        <el-checkbox v-for="data in weeklist" :label="data" :key="data">{{data}}</el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="dataMM">
                  <span>选择时间：</span>
                  <el-time-picker
                    v-model="value7"
                    placeholder="任意时间点"
                    format=" HH:mm:ss "
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="间隔多久" name="frith">
              <p>间隔多久</p>
              <div class="block">
                <div class="dataMM">
                  <span>开始时间：</span>
                  <el-time-picker
                    v-model="value9"
                    :picker-options="{
      selectableRange: '00:00:00 - 05:30:00'
    }"
                    placeholder="任意时间点"
                    format=" HH:mm:ss "
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </div>
                <div class="dataMM">
                  <span>间隔多久：</span>
                  <el-time-picker
                    v-model="value10"
                    :picker-options="{
      selectableRange: '00:00:00 - 05:00:00'
    }"
                    placeholder="任意时间点"
                    format=" HH:mm "
                    value-format="HH:mm"
                  ></el-time-picker>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="length">
          <span>运行时长：</span>
          <el-time-picker
            v-model="value8"
            :picker-options="{
      selectableRange: '00:00:00 - 05:30:00'
    }"
            placeholder="任意时间点"
            format=" HH:mm:ss "
            value-format="HH:mm:ss"
          ></el-time-picker>
        </div>
        <div class="btn">
          <el-button type="primary" @click="create()">创建</el-button>
          <el-button type="primary" @click="quit()">退出</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  data() {
    return {
      value1: "",
      value2: "",
      value3: "",
      value4: [],
      value5: "",
      value6: [],
      value61: [],
      value62: [],
      value63: [],
      value7: [],
      value8: "",
      value9: "",
      value10: "",
      input: "",
      num: 0,
      dataslist: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31"
      ],
      monthlist: ["First", "Second", "Third", "Fourth"],
      yuelist: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      weeklist: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      activeName: "first",
      activeName2: "first",
      portAddress: this.$store.state.portAddress,
      selectedTypes: [],
      selectroom: [],
      roomlist: [], //获取的房间列表
      mode: "执行一次", //执行的方式
      mode2: "每月，天？", //执行的方式
      client: this.$store.state.client,
      jdNameLOW_TO_UP: "LOW_TO_UP/河南阿宝蜀黍的酒店/",
      jdNameUP_TO_LOW: "UP_TO_LOW/河南阿宝蜀黍的酒店/"
    };
  },
  mounted() {
    this.getselectedTypes;
    this.getselectroom;
  },
  computed: {
    getselectroom() {
      this.selectroom = this.$store.state.multipleSelection;
      console.log(this.selectroom); //选取的房间
      for (var i in this.selectroom) {
        this.roomlist.push(this.selectroom[i].RoomNUM);
      }
      console.log(this.roomlist);
    },
    getselectedTypes() {
      this.selectedTypes = this.$store.state.selectedTypes;
      console.log(this.selectedTypes); //选取的大床房类型房间的设备
      for (var i in this.selectedTypes) {
        this.selectedTypes[i];
        console.log(this.selectedTypes[i]);
      }
    }
  },
  // filters: {
  //   dataFormat(this.value10) {
  //     return this.value10+ 'xxxxx';
  //   }
  // },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      console.log(tab.label);
      this.mode = tab.label;
    },
    handleClick2(tab, event) {
      // console.log(tab, event);
      console.log(tab.label);
      this.mode2 = tab.label;
    },
    create() {
      console.log(this.value10);
      var payload;
      if (this.mode == "执行一次") {
        payload = {
          RoomList: this.roomlist,
          TaskScheduleFamily: "Once",
          TimepieceExecuteTime: this.value1 + " " + this.value2,
          ContinuedTime: this.value8,
          DeviceList: this.selectedTypes
        };
        console.log(payload);
        this.sendmsg(payload);
        // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
      } else if (this.mode == "每天") {
        payload = {
          RoomList: this.roomlist,
          TaskScheduleFamily: "Circle",
          TimepieceExecuteTime: this.value3,
          ContinuedTime: this.value8,
          LoopClass: "Daily",
          Alternation: {
            IntervalDay: this.num
          },
          DeviceList: this.selectedTypes
        };
        console.log(payload);
        this.sendmsg(payload);
        // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
      } else if (this.mode == "每周") {
        payload = {
          RoomList: this.roomlist,
          TaskScheduleFamily: "Circle",
          TimepieceExecuteTime: this.value5,
          ContinuedTime: this.value8,
          LoopClass: "Weekly",
          Alternation: {
            WeekDay: this.value4
          },
          DeviceList: this.selectedTypes
        };
        console.log(payload);
        this.sendmsg(payload);
        // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
      } else if (this.mode == "每月") {
        if (this.mode2 == "每月，天？") {
          payload = {
            RoomList: this.roomlist,
            TaskScheduleFamily: "Circle",
            TimepieceExecuteTime: this.value7,
            ContinuedTime: this.value8,
            LoopClass: "Monthly",
            LoopClassChildAtMoment: "Day",
            Alternation: {
              WhitchOneMonth: this.value63,
              WhitchOneDay: this.value6
            },
            DeviceList: this.selectedTypes
          };
          console.log(payload);
          this.sendmsg(payload);
          // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
        } else if (this.mode2 == "每月-周-周几？") {
          payload = {
            RoomList: this.roomlist,
            TaskScheduleFamily: "Circle",
            TimepieceExecuteTime: this.value7,
            ContinuedTime: this.value8,
            LoopClass: "Monthly",
            LoopClassChildAtMoment: "Week",
            Alternation: {
              WhitchOneWeek: this.value61,
              WeekDay: this.value62
            },
            DeviceList: this.selectedTypes
          };
          console.log(payload);
          this.sendmsg(payload);
          // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
        }
      } else if (this.mode == "间隔多久") {
        payload = {
          RoomList: this.roomlist,
          TaskScheduleFamily: "Circle",
          TimepieceExecuteTime: this.value9,
          ContinuedTime: this.value8,
          LoopClass: "Clockly",
          Alternation: {
            WhitchOneHour: this.value8.slice(0, 2),
            AtMomentMinute: this.value8.slice(3, 5)
          },
          DeviceList: this.selectedTypes
        };
        console.log(payload);
        this.sendmsg(payload);
        // this.client.publish(this.jdNameUP_TO_LOW + '1001', JSON.stringify(payload));
      }
    },
    quit() {
      this.$router.go("./");
    },
    sendmsg(msg) {
      this.$axios
        .put(this.portAddress + "/api/TaskSchedule/SetCmd", {
          TaskName: this.input,
          TaskControlData: msg
        })
        .then(res => {
          console.log("请求成功");
          this.$message({
            message: "创建成功",
            type: "success"
          });
          this.$store.commit("changeactive", 4);
        })
        .catch(err => {
          console.log("请求失败");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.timingControl {
  padding: 20px 100px;
  .clearfix {
    padding-left: 10%;
    .rwName {
      width: 400px;
      display: flex;
      align-items: center;
      margin: 20px 0px;
      p {
        width: 100px;
      }
    }
  }
  .timexz {
    width: 80%;
    margin: 20px auto;
    .timechange {
      // width: 600px;
      height: 350px;
      border: 2px solid rgb(243, 238, 238);
      border-radius: 5px;
      text-align: center;

      .block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .dataMM {
          margin: 10px 0;
          display: flex;
          span {
            display: block;
            width: 100px;
            text-align: right;
            line-height: 40px;
            // margin-left: 20%;
          }
          .el-input-number {
            width: 220px;
          }
          .zhou {
            width: 200px;
            border: 1px solid rgb(233, 225, 225);
            border-radius: 5px;
            padding: 10px 0;
            display: flex;
            flex-direction: column;
            text-align: left;
            padding-left: 30px;
          }
          .MMbottom {
            width: 80%;
            margin: 0 auto;
            .yuely {
              display: flex;
              .yueData {
                width: 200px;
                height: 150px;
                margin: 0 10px;
                padding: 5px 10px;
                overflow-y: scroll;
                border: 1px solid rgb(228, 222, 222);
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                text-align: left;
                padding-left: 10px;
              }
            }
            .weekly {
              display: flex;
              // width: 60%;
              // margin: 0 auto;
              .weekData {
                width: 200px;
                height: 150px;
                margin: 0 10px;
                padding: 5px 10px;
                overflow-y: scroll;
                border: 1px solid rgb(228, 222, 222);
                border-radius: 5px;
                //  display: flex;
                // flex-direction: column;
                text-align: left;
                padding-left: 10px;
              }
            }
          }
        }
      }
    }
  }

  .length {
    margin: 20px 0;
  }
  .btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>