<template>
  <div class="detail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p @click='back'>
          <i class="el-icon-arrow-left"></i>返回
        </p>
        <h1>{{list.Hotel_Name}}</h1>
      </div>
      <div class="top_box">
        <el-card class="box-card1">
          <div slot="header" class="clearfix">
            <span>房间信息</span>
          </div>
          <p>楼号：{{list.Hotel_Builder}}</p>
          <p>楼层：{{list.Hotel_Floor}}层</p>
          <p>房号：{{list.RoomNUM}}房</p>
          <p>类型：{{list.RoomType}}</p>
        </el-card>
        <el-card class="box-card2">
          <div slot="header" class="clearfix">
            <span>房间设备1</span>
          </div>
          <div class="card2">
            <MXian title="门显" :list="mx" :roomNum="idn"></MXian>
            <QDian title="取电开关" :list="qd"></QDian>
            <JBao title="紧急呼叫" :list="jb" :roomNum="idn"></JBao>
            <MCi title="门磁" :list="mc"></MCi>
            <YYue title="预约呼叫" :list="yyhj" :roomNum="idn"></YYue>
          </div>
        </el-card>
      </div>
      <light title="灯光" :client="client" :roomNum="idn" :list="dg" :jdName="jdNameUP_TO_LOW"></light>
      <KTiao title="空调" :client="client" :roomNum="idn" :list="kt" :jdName="jdNameUP_TO_LOW"></KTiao>
      <CLian title="窗帘" :client="client" :roomNum="idn" :list="cl" :jdName="jdNameUP_TO_LOW"></CLian>
    </el-card>
  </div>
</template>

<script>
import mqtt from "mqtt";
import $ from "jquery";
import light from "./AllDetail/light";
import KTiao from "./AllDetail/KTiao";
import CLian from "./AllDetail/CLian";
import MCi from "./AllDetail/MCi";
import JBao from "./AllDetail/JBao";
import MXian from "./AllDetail/MXian";
import QDian from "./AllDetail/QDian";
import YYue from "./AllDetail/YYue";
export default {
  data()  {
    return {
      idn: this.$route.params.id,
      list: '',
      getList: '',
      msg: '',
      dg: [],
      kt: [],
      cl: [],
      mx: [],
      qd: [],
      jb: [],
      fs: [],
      mc: [],
      yyhj: [],
      client: this.$store.state.client,
      jdNameLOW_TO_UP: "LOW_TO_UP/"+globalSetting.mqttTopic+"/",
      jdNameUP_TO_LOW: "UP_TO_LOW/"+globalSetting.mqttTopic+"/",
      portAddress: this.$store.state.portAddress,
    }
  },

  mounted()  {
    if (JSON.parse(localStorage.getItem(this.idn)) != null)    {
      this.list = JSON.parse(localStorage.getItem(this.idn));
    } else    {
      this.roomlist(this.idn);
    }
    this.getList = JSON.parse(localStorage.getItem(this.idn + "tt"))
    if (this.getList != null)    {
      this.getMas(this.getList);
    } else    {
      this.getRoomMassage();
    }
  },
  methods: {
    back()    {
      this.$router.go(-1); //返回上一层
    },
    roomlist(id)    {
      this.$axios
        .get(this.portAddress + "/api/home/GetDevice_InfoByRoomInfo?RoomNUM=" + id)
        .then(res =>        {
          console.log(res)
          localStorage.setItem(id, JSON.stringify(res.data));
          this.list = res.data;
        })
        .catch(err =>        {
          console.log(err);
        });
    },
    //通过房间号获取该房间的详细信息
    getRoomMassage()    {
      this.$axios
        .get(this.portAddress + "/api/home/GetDevice_InfoByRoomInfo?RoomNUM=" + this.idn)
        .then(res =>        {
          console.log(res.data)
          var xwjlist = res.data.LowerMachine.DeviceList;
          // console.log(xwjlist);
          localStorage.setItem(this.idn + "tt", JSON.stringify(xwjlist));
          this.getMas(xwjlist)
        });
    },
    //给添加设备状态的设备信息进行分类
    getMas(msg)    {
      this.$axios
        .get(
          this.portAddress + "/api/home/GetAllDeviceStatusByRoom?RoomNUM=" + this.idn)
        .then(res =>        {
          // console.log(res.data)
          for (var i in res.data.DeviceList)          {
            for (var j in msg)            {
              if (
                res.data.DeviceList[i].DeviceName == msg[j].DeviceName &&
                res.data.DeviceList[i].AreaOfRoom == msg[j].AreaOfRoom
              )              {
                this.$set(msg[j], "DeviceProperty", res.data.DeviceList[i].DeviceProperty);
              }
            }
          }
          var groupList = _.groupBy(msg, "DeviceClass");
          for (var key in groupList)          {
            if (key == "灯光")            {
              this.dg = _.groupBy(groupList[key], "AreaOfRoom");
            } else if (key == "温控器")            {
              this.kt = groupList[key]
              // console.log(this.kt)
              this.$store.commit("changekongtiao", this.kt);
            } else if (key == "电动卷帘")            {
              this.cl = _.groupBy(groupList[key], "AreaOfRoom");
            } else if (key == "门显")            {
              this.mx = groupList[key]
            } else if (key == "取电开关")            {
              this.qd = _.groupBy(groupList[key], "AreaOfRoom");
            } else if (key == "紧急呼叫")            {
              this.jb = groupList[key];
            } else if (key == "磁性感应器")            {
              this.mc = _.groupBy(groupList[key], "AreaOfRoom");
            } else if (key == "风扇")            {
              this.fs = _.groupBy(groupList[key], "AreaOfRoom");
            } else if (key == "预约服务")            {
              this.yyhj = _.groupBy(groupList[key], "AreaOfRoom");
            }
          }
        });
    }
  },
  components: {
    light,
    KTiao,
    CLian,
    MCi,
    JBao,
    MXian,
    QDian,
    YYue
  }
}
</script>

<style lang="less" scoped>
.detail {
  // height: 90%;
  // overflow-y: scroll;
  .box-card {
    // padding-bottom: 50px;
    background: rgb(212, 212, 219);
    img {
      position: relative;
      width: 40px;
    }
    button {
      margin: 10px;
      padding: 2px 10px;
      font-size: 12px;
    }
    h1 {
      text-align: center;
      padding: 20px 0;
    }
    .top_box {
      // min-width: 1220px;
      display: flex;
      margin: 0 3%;
      .box-card1 {
        width: 30%;
        min-width: 200px;
        margin: 10px 30px;
        p {
          padding: 10px 20px;
        }
      }
      .box-card2 {
        flex: 1;
        min-width: 200px;
        margin: 10px 30px;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // background: rgb(220, 221, 221);
        // line-height: 30px;
        .card2 {
          display: flex;
        }
      }
    }
  }
}
</style>