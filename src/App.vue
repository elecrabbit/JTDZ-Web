<template>
  <div id="app">
    <p v-show="false">{{getcount}}</p>
    <router-view />
    <el-dialog title="警告" :visible.sync="showAlert" width="30%" center>
      <span>有客房有紧急呼叫，请尽快处理！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showAlert = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  name: "App",
  data() {
    return {
      client: this.$store.state.client,
      showAlert: false
    };
  },
  methods: {
    playSound(sound) {
      var audio = document.createElement("audio");
      var source = document.createElement("source");
      source.type = "audio/mpeg";
      source.src = sound;
      source.autoplay = "autoplay";
      audio.appendChild(source);
      audio.play();
    }
  },
  computed: {
    getcount() {
      var dd = this.$store.state.count;
      var room = this.$store.state.mqttroom;
      var room2 = this.$store.state.mqttroom2;
      console.log(dd);
      if (dd.DeviceClass == "门显") {
        for (var i in dd.DeviceProperty) {
          if (
            dd.DeviceProperty[i].AttributeName == "清理" &&
            dd.DeviceProperty[i].AttributeValue == "开"
          ) {
            this.$notify({
              title: "清理",
              message: room + "房间需要清理，请尽快处理",
              duration: 0,
              type: "warning"
            });
            this.playSound("../static/audios/clean.mp3");
          }
        }
      } else if (dd.DeviceClass == "预约服务") {
        for (var i in dd.DeviceProperty) {
          if (
            dd.DeviceProperty[i].AttributeName == "状态更改" &&
            dd.DeviceProperty[i].AttributeValue == "开"
          ) {
            this.$notify({
              title: "预约退房",
              message: room + "房间有预约退房，请尽快处理",
              duration: 0,
              type: "warning"
            });
            this.playSound("../static/audios/yuyue.mp3");
          }
        }
      } else if (dd.DeviceClass == "紧急呼叫") {
        for (var i in dd.DeviceProperty) {
          if (
            dd.DeviceProperty[i].AttributeName == "状态更改" &&
            dd.DeviceProperty[i].AttributeValue == "开"
          ) {
            this.showAlert = true;
            this.$notify({
              title: "紧急呼叫",
              message: room + "房间有紧急呼叫，请尽快处理",
              duration: 0,
              type: "warning"
            });
            this.playSound("../static/audios/sos.mp3");
          }
        }
      } else if (dd.type == "problem") {
        this.$notify({
          title: "维修",
          message: room2 + "房间有维修处理，请尽快解决",
          duration: 0,
          type: "warning"
        });
        this.playSound("../static/audios/fix.mp3");
      }
    }
  },
  mounted() {
    this.client.on("connect", e => {
      console.log("连接成功:");
    });
    // 断开发起重连
    this.client.on("reconnect", error => {
      console.log("正在重连:", error);
    });
    // 链接异常处理
    this.client.on("error", error => {
      console.log("连接失败:", error);
    });
  },
  beforeCreate: function() {
    this.$router.push("/");
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
