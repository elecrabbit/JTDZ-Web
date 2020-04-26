<template>
  <div class="selectroom">
    <div class="bigbox">
      <el-card class="box-card1">
        <div slot="header" class="clearfix">
          <span class="trol">灯光</span>
          <div>
            <el-radio v-model="radio1" label="开" >开</el-radio>
            <el-radio v-model="radio1" label="关" >关</el-radio>
          </div>
        </div>
        <div class="dg">
          <el-checkbox-group v-model="checkList" v-for="(it,inde) in getroom1" :key="inde">
            <el-checkbox :label="it">{{it.DeviceName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
      <el-card class="box-card2">
        <div slot="header" class="clearfix">
          <span class="trol">空调</span>
        </div>
        <div class="dg">
          <el-checkbox-group v-model="checkList" v-for="(it,inde) in getroom2" :key="inde">
            <el-checkbox :label="it">{{it.AreaOfRoom}}{{it.DeviceName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="control">
          <el-tab-pane label="人为干预" name="first">
            <fieldset class="cont">
              <legend>开-关</legend>
              <el-radio v-model="radio6" label="开">开</el-radio>
              <el-radio v-model="radio6" label="关">关</el-radio>
            </fieldset>
            <fieldset class="cont">
              <legend>模式-人为干预</legend>
              <el-radio v-model="radio2" label="制冷">制冷</el-radio>
              <el-radio v-model="radio2" label="制热">制热</el-radio>
              <el-radio v-model="radio2" label="通风">通风</el-radio>
            </fieldset>
            <fieldset class="cont">
              <legend>档位-人为干预</legend>
              <el-radio v-model="radio3" label="高">高</el-radio>
              <el-radio v-model="radio3" label="中">中</el-radio>
              <el-radio v-model="radio3" label="低">低</el-radio>
            </fieldset>
            <fieldset class="cont2">
              <legend>温度-人为干预</legend>
              <el-input-number v-model="num" :step="2" :min="10" :max="50"></el-input-number>
            </fieldset>
          </el-tab-pane>
          <el-tab-pane label="自动调节" name="second">
            <fieldset class="cont">
              <legend>制式-智能调节</legend>
              <el-radio v-model="radio4" label="自动调节">自动调节</el-radio>
            </fieldset>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="box-card1">
        <div slot="header" class="clearfix">
          <span class="trol">窗帘</span>
          <div>
            <el-radio v-model="radio5" label="开">开</el-radio>
            <el-radio v-model="radio5" label="关">关</el-radio>
            <el-radio v-model="radio5" label="停">停</el-radio>
          </div>
        </div>
        <div class="dg">
          <el-checkbox-group v-model="checkList" v-for="(it,inde) in getroom3" :key="inde">
            <el-checkbox :label="it">{{it.DeviceName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
      <el-button type="success" class="sublet" @click="sublit">下一步</el-button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      checkedCities1: [],
      getroom1: [],
      getroom2: [],
      getroom3: [],
      portAddress: this.$store.state.portAddress,
      selectedTypes: [],
      selectedSB: [],
      group: [],
      radio1: '开',
      radio2: '制冷',
      radio3: '高',
      radio4: '自动调节',
      radio5: '开',
      radio6: '开',
      num: '10',
      activeName: 'first',
      mode: '人为干预',
      num: 10,
      checkList: []
    }
  },
  mounted() {
    this.arr;
    this.select();
  },
  computed: {
    arr() {
      var ff = this.$store.state.multipleSelection
      if (ff != '') {
        this.myAxios(ff[0].RoomNUM, ff[0].LowerMachine)
        // ff.forEach(val => {
        //   console.log(val)
        //   this.myAxios(val.RoomNUM, val.LowerMachine)
        // });
      } else {
        this.$message({
          message: '亲，请先选择房间',
          type: 'warning'
        });
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.label);
      this.mode = tab.label;
    },
    getValue() {
      console.log(this.radio1); // 打印的值，就是被选中的radio的值，1,2  
    },
    // handleCheckedCitiesChange(val) {
    //   console.log(val)
    // },
    select() {
      console.log(this.checkList)
      for (var i in this.checkList) {
        if (this.checkList[i].DeviceClass == '灯光') {
          for (var j in this.checkList[i].DeviceProperty) {
            if (this.checkList[i].DeviceProperty[j].AttributeName == '开关') {
              this.checkList[i].DeviceProperty[j].AttributeValue = this.radio1
            }
          }
        } else if (this.checkList[i].DeviceClass == '温控器') {
          if (this.mode == '人为干预') {
            this.checkList[i].DeviceProperty =
              [
                { "AttributeName": "手动自动", "AttributeValue": "手动" },
                { "AttributeName": "开关", "AttributeValue": this.radio6 },
                { "AttributeName": "模式", "AttributeValue": this.radio2 },
                { "AttributeName": "档位", "AttributeValue": this.radio3 },
                { "AttributeName": "目标" + this.radio2 + "设定温度", "AttributeValue": this.num }
              ]
          } else if (this.mode == '自动调节') {
            this.checkList[i].DeviceProperty =
              [
                { "AttributeName": "制式", "AttributeValue": this.radio4 },
              ]
          }
        } else if (this.checkList[i].DeviceClass == '电动卷帘') {
          for (var j in this.checkList[i].DeviceProperty) {
            if (this.checkList[i].DeviceProperty[j].AttributeName == '开关状态') {
              this.checkList[i].DeviceProperty[j].AttributeValue = this.radio5
            }
          }
        }
      }
       this.$store.commit("changeselectedTypes", this.checkList);
    },
    myAxios(room, arr) {
      console.log(room)
      this.$axios
        .get(
          this.portAddress + "/api/home/GetDevice_InfoByRoomInfo?RoomNUM=" +
          room
        )
        .then(res => {
          var mylist = res.data.LowerMachine.DeviceList;
          console.log(mylist)
          for (var i in mylist) {
            this.lwjAxios(room, mylist[i], mylist[i].DeviceName, mylist[i].AreaOfRoom)
            if (mylist[i].DeviceClass == '灯光' || mylist[i].DeviceClass == '风扇') {
              this.getroom1.push(mylist[i])
            } else if (mylist[i].DeviceClass == '温控器') {
              this.getroom2.push(mylist[i])
            } else if (mylist[i].DeviceClass == '电动卷帘') {
              this.getroom3.push(mylist[i])
            }
          }
          arr = res.data.LowerMachine
        });
    },
    lwjAxios(room, arr, name, location) {
      // console.log(room)
      this.$axios
        .get(
          // './../../../static/json/1001lwj.json'
          this.portAddress + "/api/home/GetAllDeviceStatusByRoom?RoomNUM=" + room
        )
        .then(res => {
          // console.log(res)
          for (var i in res.data.DeviceList) {
            if (
              res.data.DeviceList[i].DeviceName == name &&
              res.data.DeviceList[i].AreaOfRoom == location
            ) {
              arr.DeviceProperty = res.data.DeviceList[i].DeviceProperty
            }
          }
        });
    },
    sublit() {
      this.select();
      if (this.checkList.length == 0) {
        this.$message({
          message: '还未选择设备',
          type: 'warning'
        });
      } else {
         this.$store.commit("changeactive", 2);
        this.$router.push('/timing/timingControl')
      }
    },
  }
}
</script>
<style scoped lang=less>
.selectroom {
  width: 80%;
  margin: 20px auto;
  .bigbox {
    position: relative;
    margin-bottom: 70px;
    .box-card1 {
      .clearfix {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
      }
    }
    .box-card2 {
      margin: 10px 0;
      .clearfix {
        padding: 0 20px;
      }
    }
    .sublet {
      position: absolute;
      bottom: -50px;
      right: 20px;
      margin: 0 auto;
    }
    .dg {
      display: flex;
      flex-wrap: wrap;
    }
      /deep/.el-card__body {
        padding: 10px 60px !important;
        .el-checkbox-group {
          /* width:80px; */
          margin: 0 10px;
          line-height: 25px;
        }
      }
  }
  .trol {
    color: red;
  }
  .center {
    text-align: center;
    font-size: 20px;
    color: rgb(231, 6, 252);
  }
  .control {
    /* border: 1px solid rgb(129, 128, 128); */
    padding: 20px;
    margin: 10px 10px 20px 10px;
    /deep/ .el-tabs__header {
      padding: 0 10px;
    }
    .cont {
      border: 1px solid rgb(129, 128, 128);
      margin: 10px;
      padding: 20px;
      width: 28%;
      float: left;
      min-width: 250px;
      /* text-align: center; */
    }
    .cont2 {
      border: 1px solid rgb(129, 128, 128);
      margin: 10px;
      padding: 9px 20px;
      width: 28%;
      float: left;
      min-width: 250px;
      /* text-align: center; */
    }
    .block {
      /* width:300px; */
      margin-top: 200px;
    }
    .num {
      margin-top: 100px;
      float: left;
    }
  }
}
</style>