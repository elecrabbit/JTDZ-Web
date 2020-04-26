
<template>
  <div class="kt">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备信息3-空调</span>
      </div>
      <ul>
        <li v-for="(item,index) in list" :key="index" class="kt_p">
          <el-card class="box-card1">
            <div slot="header" class="clearfix">
              <p>{{item.AreaOfRoom}}</p>
            </div>
            <div>
              <!-- <p>{{item}}</p> -->
              <p v-show="false" class="getMsg">{{getMsg}}</p>
              <p v-show="false" class="getMsg">{{getkongtiao}}</p>
              <p v-show="visible" class="ktOwinSHA">{{item.OwinSHA}}</p>
              <p v-show="visible" class="ktDeviceClass">{{item.DeviceClass}}</p>
              <p v-show="visible" class="ktAreaOfRoom">{{item.AreaOfRoom}}</p>
              <p v-show="visible" class="ktLowerMachine_ID">{{item.LowerMachine_ID}}</p>
              <div class="kt_out">
                <div class="out_1">
                  <div class="out_2" v-show='false'>
                    <div class="kt_top">
                      <div>
                        <img class="model" src="./../../../static/images/blackhole.png" alt />
                        <span class="kt_ms">通风</span>
                      </div>
                      <div class="windbox">
                        <img class="winds" src="./../../../static/images/mode_wind_black.png" alt />
                        <span class="Dw">低</span>
                      </div>
                    </div>
                    <div class="kt_bottom">
                      <p>
                        <span>设置温度：</span>
                        <span class="set_temperature">{{sz_wd}}</span>
                      </p>
                      <p>
                        <span>室内温度：</span>
                        <span class="present_temperature">{{sn_wd}}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="kt_btn">
                  <button @click="switchs($event,item)">开关</button>
                  <button @click="code($event,item)">制冷</button>
                  <button @click="hott($event,item)">制热</button>
                  <button @click="windd($event,item)">通风</button>
                  <button @click="windBig($event,item)">风速 +</button>
                  <button @click="windSmall($event,item)">风速 -</button>
                  <button @click="big($event,item)">温度▲</button>
                  <button @click="small($event,item)">温度▼</button>
                </div>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data()  {
    return {
      img1: "./../../../static/images/air_quick_cool.png",
      img2: "./../../../static/images/air_quick_hot.png",
      img3: "./../../../static/images/blackhole.png",
      cooltel: '',
      hottel: '',
      windtel: '',
      sz_wd: 23,
      sn_wd: 25,
      visible: false
      // kongtiaolist:this.$store.state.kongtiao
    };
  },
  props: ["title", "list", "client", "roomNum", "jdName"],
  mounted()  {
    // console.log(this.kongtiaolist)
  },
  computed: {
    getMsg()    {
      var dd = this.$store.state.count;
      console.log(dd);
      var kt_p = $(".kt_p");
      // console.log(kt_p.eq(i).find(".ktName").text());
      for (var i = 0; i < kt_p.length; i++)      {
        if (kt_p.eq(i).find(".ktOwinSHA").text() == dd.OwinSHA && kt_p.eq(i).find(".ktDeviceClass").text() == dd.DeviceClass && kt_p.eq(i).find(".ktAreaOfRoom").text() == dd.AreaOfRoom)        {
          for (var j = 0; j < dd.DeviceProperty.length; j++)          {
            if (dd.DeviceProperty[j].AttributeName == "开关")            {
              if (dd.DeviceProperty[j].AttributeValue == "开")              {
                $(".out_2").eq(i).show();
                // $(".out_2").eq(i).attr("status", "开");
              } else              {
                $(".out_2").eq(i).hide();
                // $(".out_2").eq(i).attr("status", "关");
              }
            } else if (dd.DeviceProperty[j].AttributeName == "模式")            {
              if (dd.DeviceProperty[j].AttributeValue == "制冷")              {
                $(".model").eq(i).attr("src", "./../../../static/images/air_quick_cool.png");
                $(".kt_ms").eq(i).text("制冷");
              } else if (dd.DeviceProperty[j].AttributeValue == "制热")              {
                $(".model").eq(i).attr("src", "./../../../static/images/air_quick_hot.png");
                $(".kt_ms").eq(i).text("制热");
              } else if (dd.DeviceProperty[j].AttributeValue == "通风")              {
                $(".model").eq(i).attr("src", "./../../../static/images/blackhole.png");
                $(".kt_ms").eq(i).text("通风");
              }
            } else if (dd.DeviceProperty[j].AttributeName == "档位")            {
              if (dd.DeviceProperty[j].AttributeValue == "高")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>高</span>';
                $(".windbox").eq(i).append(ss);
              } else if (dd.DeviceProperty[j].AttributeValue == "中")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>中</span>';
                $(".windbox").eq(i).append(ss);
              } else if (dd.DeviceProperty[j].AttributeValue == "低")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>低</span>';
                $(".windbox").eq(i).append(ss);
              }
            } else if (dd.DeviceProperty[j].AttributeName == "手动自动")            {
            } else if (
              dd.DeviceProperty[j].AttributeName == "目标制冷设定温度"
            )            {
              if (
                $(".kt_ms").eq(i).text() == "制冷"
              )              {
                $(".set_temperature").eq(i).text(dd.DeviceProperty[j].AttributeValue);
              }
            } else if (
              dd.DeviceProperty[j].AttributeName == "目标制热设定温度"
            )            {
              if (
                $(".kt_ms").eq(i).text() == "制热"
              )              {
                $(".set_temperature").eq(i).text(dd.DeviceProperty[j].AttributeValue);
              }
            } else if (
              dd.DeviceProperty[j].AttributeName == "目标通风设定温度"
            )            {
              if (
                $(".kt_ms").eq(i).text() == "通风"
              )              {
                $(".set_temperature").eq(i).text(dd.DeviceProperty[j].AttributeValue);
              }
            } else if (dd.DeviceProperty[j].AttributeName == "当前温度")            {
              $(".present_temperature").eq(i).text(dd.DeviceProperty[j].AttributeValue);
            }
          }
        }
      }
      return dd;
    },
    getkongtiao()    {
      var list = this.$store.state.kongtiao;
      console.log(list);
      for (var i in list)      {
        if (list[i].DeviceProperty.length == 0)        {
          $(".out_2").eq(i).hide();
        } else        {
          for (var j in list[i].DeviceProperty)          {
            if (list[i].DeviceProperty[j].AttributeName == "开关")            {
              if (list[i].DeviceProperty[j].AttributeValue == "开")              {
                $(".out_2").eq(i).show();
              } else              {
                $(".out_2").eq(i).hide();
              }
            } else if (list[i].DeviceProperty[j].AttributeName == "模式")            {
              if (list[i].DeviceProperty[j].AttributeValue == "制冷")              {
                $(".model").eq(i).attr("src", this.img1);
                $(".kt_ms").eq(i).text('制冷')
              } else if (list[i].DeviceProperty[j].AttributeValue == "制热")              {
                $(".model").eq(i).attr("src", this.img2);
                $(".kt_ms").eq(i).text('制热')
              } else if (list[i].DeviceProperty[j].AttributeValue == "通风")              {
                $(".model").eq(i).attr("src", this.img3);
                $(".kt_ms").eq(i).text('通风')
              }
            } else if (list[i].DeviceProperty[j].AttributeName == "档位")            {
              if (list[i].DeviceProperty[j].AttributeValue == "高")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>高</span>';
                $(".windbox").eq(i).append(ss);
              } else if (list[i].DeviceProperty[j].AttributeValue == "中")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>中</span>';
                $(".windbox").eq(i).append(ss);
              } else if (list[i].DeviceProperty[j].AttributeValue == "低")              {
                $(".windbox").eq(i).empty();
                var ss = '<img class="winds" src="./../../../static/images/mode_wind_black.png" alt width="50"/><span>低</span>';
                $(".windbox").eq(i).append(ss);
              }
            } else if (list[i].DeviceProperty[j].AttributeName == "手动自动")            {
              if (list[i].DeviceProperty[j].AttributeValue == "手动")              {

              } else if (list[i].DeviceProperty[j].AttributeValue == "自动")              {

              }
            } else if (list[i].DeviceProperty[j].AttributeName == "目标制冷设定温度")            {
              if (
                $(".kt_ms").eq(i).text() == "制冷"
              )              {
                $(".set_temperature").eq(i).text(list[i].DeviceProperty[j].AttributeValue);
              }
            } else if (list[i].DeviceProperty[j].AttributeName == "目标制热设定温度")            {
               if (
                $(".kt_ms").eq(i).text() == "制热"
              )              {
                $(".set_temperature").eq(i).text(list[i].DeviceProperty[j].AttributeValue);
              }
            } else if (list[i].DeviceProperty[j].AttributeName == "目标通风设定温度")            {
              if (
                $(".kt_ms").eq(i).text() == "通风"
              )              {
                $(".set_temperature").eq(i).text(list[i].DeviceProperty[j].AttributeValue);
              }
            }else if (list[i].DeviceProperty[j].AttributeName == "当前温度")            {
              $(".present_temperature").eq(i).text(list[i].DeviceProperty[j].AttributeValue);
            }
          }
        }
      }
    }
  },
  methods: {
    switchs(e, it)    {
      var f = $(e.target).parents(".kt_out").find(".out_2");
      if (f.is(":hidden")) {
        f.show();
        var payload = {
          LowerMachine_ID: it.LowerMachine_ID,
          DeviceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: [{ AttributeName: "开关", AttributeValue: "开" }]
        };
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload)
        );
      } else {
        f.hide();
        var payload = {
          viceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: [{ AttributeName: "开关", AttributeValue: "关" }]
        };
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      }
    },
    code(e, it)    {
      var f = $(e.target).parents(".kt_out").find(".model");
      var ppp = $(e.target).parents(".kt_out").find(".kt_ms");
      f.attr("src", "./static/images/air_quick_cool.png");
      ppp.text("制冷");
      var payload = {
        LowerMachine_ID: it.LowerMachine_ID,
        DeviceName: it.DeviceName,
        DeviceClass: it.DeviceClass,
        AreaOfRoom: it.AreaOfRoom,
        OwinSHA: it.OwinSHA,
        DeviceProperty: [{ AttributeName: "模式", AttributeValue: "制冷" }]
      };
      this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));},
    hott(e, it)    {
      var f = $(e.target).parents(".kt_out").find(".model");
      var ppp = $(e.target).parents(".kt_out").find(".kt_ms");
      f.attr("src", "./static/images/air_quick_hot.png");
      ppp.text("制热");
      var payload = {
        LowerMachine_ID: it.LowerMachine_ID,
        DeviceName: it.DeviceName,
        DeviceClass: it.DeviceClass,
        AreaOfRoom: it.AreaOfRoom,
        OwinSHA: it.OwinSHA,
        DeviceProperty: [{ AttributeName: "模式", AttributeValue: "制热" }]
      };
      this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
    },
    windd(e, it)    {
      var f = $(e.target).parents(".kt_out").find(".model");
      var ppp = $(e.target).parents(".kt_out").find(".kt_ms");
      f.attr("src", "./static/images/blackhole.png");
      ppp.text("通风");
      var payload = {
        LowerMachine_ID: it.LowerMachine_ID,
        DeviceName: it.DeviceName,
        DeviceClass: it.DeviceClass,
        AreaOfRoom: it.AreaOfRoom,
        OwinSHA: it.OwinSHA,
        DeviceProperty: [{ AttributeName: "模式", AttributeValue: "通风" }]
      };
      this.client.publish(this.jdName + this.roomNum, JSON.stringify(payload));
    },
    windContral(e, it)    {
      var winds = $(e.target).parents(".kt_out").find(".winds");
      var Dw = $(e.target).parents(".kt_out").find(".Dw");
       var payload = {
          LowerMachine_ID: it.LowerMachine_ID,
          DeviceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: []
        };
      if (winds.length == 1) {
        Dw.text("低");
        payload. DeviceProperty= [{ AttributeName: "档位", AttributeValue: "低" }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else if (winds.length == 2) {
        Dw.text("中");
         payload. DeviceProperty= [{ AttributeName: "档位", AttributeValue: "中" }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else {
        Dw.text("高");
        payload. DeviceProperty= [{ AttributeName: "档位", AttributeValue: "高" }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      }
    },
    windBig(e, it)    {
      var windbox = $(e.target).parents(".kt_out").find(".windbox");
      var winds = $(e.target).parents(".kt_out").find(".winds").first().clone();
      if (windbox.children().length < 4) {
        windbox.prepend(winds);
      } else {
        alert("已是最大风速，不能再大了");
      }
      this.windContral(e, it);
    },
    windSmall(e, it)    {
      var windbox = $(e.target).parents(".kt_out").find(".windbox");
      var winds = windbox.children(":first");
      if (windbox.children().length > 2) {
        winds.remove();
      } else {
        alert("已是最小风速，不能再小了");
      }
      this.windContral(e, it);
    },
    big(e, it)    {
      let el = $(e.target).parents(".kt_out").find(".set_temperature");
      var f = el.text();
      f++;
      el.text(f);
       var payload = {
          LowerMachine_ID: it.LowerMachine_ID,
          DeviceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: []
        };
      var models = $(e.target).parents(".kt_out").find(".kt_ms").text();
      if (models == "制冷") {
        payload. DeviceProperty= [{ AttributeName: "目标制冷设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else if (models == "制热") {
         payload. DeviceProperty= [{ AttributeName: "目标制热设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else {
        payload. DeviceProperty= [{ AttributeName: "目标通风设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      }
    },
    small(e, it)    {
      var el = $(e.target).parents(".kt_out").find(".set_temperature");
      var f = el.text();
      var models = $(e.target).parents(".kt_out").find(".kt_ms").text();
      f--;
       var payload = {
          LowerMachine_ID: it.LowerMachine_ID,
          DeviceName: it.DeviceName,
          DeviceClass: it.DeviceClass,
          AreaOfRoom: it.AreaOfRoom,
          OwinSHA: it.OwinSHA,
          DeviceProperty: []
        };
      el.text(f);
      if (models == "制冷") {
       payload. DeviceProperty= [{ AttributeName: "目标制冷设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else if (models == "制热") {
      payload. DeviceProperty= [{ AttributeName: "目标制热设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      } else {
       payload. DeviceProperty= [{ AttributeName: "目标通风设定温度", AttributeValue: f }];
        this.client.publish(this.jdName + this.roomNum,JSON.stringify(payload));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.kt {
  padding: 0 3%;
  .box-card {
    // min-width: 1220px;
    margin: 10px 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      background-color: rgb(188, 184, 207);
      padding: 10px 0;
      li {
        width: 450px;
        display: flex;
        flex-direction: column;
        .box-card1 {
          margin: 10px 20px;
          .kt_out {
            border: 2px solid rgb(168, 167, 167);
            border-radius: 10px;
            overflow: hidden;
            .out_1 {
              height: 134px;
              background: rgb(245, 243, 243);
              .out_2 {
                background: rgb(213, 244, 252);
                .kt_top {
                  display: flex;
                  border-bottom: 1px solid #666;
                  img {
                    width: 50px;
                  }
                  div {
                    flex: 1;
                    img {
                      width: 50px;
                    }
                    .winds {
                      width: 50px;
                    }
                  }
                  div:first-of-type {
                    border-right: 1px solid #666;
                  }
                }
                .kt_bottom {
                  display: flex;
                  p {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    span:last-of-type {
                      font-size: 50px;
                      text-align: center;
                    }
                  }
                  p:first-of-type {
                    border-right: 1px solid #666;
                  }
                }
              }
            }
            .kt_btn {
              display: flex;
              flex-wrap: wrap;
              background-color: rgb(245, 226, 226);
              border-top: 2px solid rgb(158, 158, 158);
              padding-top:3px;
              button {
                width: 25%;
                border-radius: 25px;
                outline: none;
                border:2px solid rgb(219, 219, 219);
                padding: 9px 0;
                margin-bottom: 3px;
                font-size: 15px;
                font-weight: 600;
                color: #fff;
                box-sizing: border-box;
                background-color: rgb(5, 73, 78);
              }
              button:first-of-type {
                background-color: rgb(250, 5, 5);
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>