<template>
  <div class="mainBox">
    <div class="table">
      <h2>请输入当前酒店的对应系统设置</h2>
      <br />
      <el-form label-width="120px" :model="jdInfo" ref="myform">
        <el-form-item label="服务器地址" >
          <el-input v-model="jdInfo.serverAdd" placeholder="默认 192.168.10.10:9000" clearable></el-input>
        </el-form-item>
        <el-form-item label="mqtt 地址" >
          <el-input v-model="jdInfo.mqttAdd" placeholder="默认 192.168.10.172:61623" clearable></el-input>
        </el-form-item>
        <el-form-item label="mqtt 账户">
          <el-input v-model="jdInfo.mqttId" placeholder="默认 admin" clearable></el-input>
        </el-form-item>
        <el-form-item label="mqtt 密码" >
          <el-input v-model="jdInfo.mqttPwd" placeholder="默认 password" clearable></el-input>
        </el-form-item>
        <el-form-item label="mqtt 主题" >
          <el-input v-model="jdInfo.mqttTopic" placeholder="默认 bidajiudian" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="float:right" clearable>保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      jdInfo: {
        serverAdd: null,
        mqttAdd: null,
        mqttId: null,
        mqttPwd: null,
        mqttTopic: null
      }
    };
  },
  methods: {
    submitForm() {
      let jdInfoObj = {}
      jdInfoObj.serverAdd = this.jdInfo.serverAdd || "192.168.10.10:9000"
      jdInfoObj.mqttAdd = this.jdInfo.mqttAdd || "192.168.10.172:61623"
      jdInfoObj.mqttId = this.jdInfo.mqttId || "admin"
      jdInfoObj.mqttPwd = this.jdInfo.mqttPwd || "password"
      jdInfoObj.mqttTopic = this.jdInfo.mqttTopic || "bidajiudian"
      let jdInfoStr = JSON.stringify(jdInfoObj)
      localStorage.setItem('jdInfo',jdInfoStr)  //系统配置保存到本地



    }

  }
};
</script>

<style>
.mainBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e3e3e3;
}
.table {
  width: 800px;
  text-align: center;
  padding: 50px;
  background-color: #eee;
  border-radius: 10px;
}
</style>