<template>
  <div class="login">
    <div class="lo_center">
      <h2>{{head}}</h2>
      <p class="line"></p>
      <div class="input" v-show="login">
        <el-input v-model="telephone" placeholder="请输入账号"></el-input>
        <p class="p1">{{p4text}}</p>
        <el-input v-model="passWord" placeholder="请输入密码" show-password></el-input>
        <p class="p1">{{p5text}}</p>
        <div class="login-btn" @click="joinOne">login in</div>
        <!-- <p class="ip" @click="changeIP">修改IP</p> -->
      </div>

    </div>
  </div>
</template>

<script>
// import $ from "jquery";
export default {
  data() {
    return {
      login: true,
      register: false,
      head: "登 录",
      telephone: "",
      passWord: "",
      p4text: "",
      p5text: "",
      portAddress: this.$store.state.portAddress
    };
  },
  methods: {
    joinOne() {
      let _this = this;
      if (this.telephone === "" || this.passWord === "") {
        alert("账号或密码不能为空");
      } else {
        this.axios
          .get(
            this.portAddress +
              "/api/User/GetSingle?UserName=" +
              this.telephone +
              "&UserPassWord=" +
              this.passWord
          )
          .then(res => {
            console.log(res.data);
            if (JSON.parse(res.data).length == 0) {
              this.$message({
                message: "账号或密码错误,请重新输入",
                type: "warning"
              });
            } else {
              this.$message({
                message: "登陆成功",
                type: "success"
              });
              localStorage.setItem("token", this.telephone);
              this.$router.push("/home");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "连接服务器失败"
            });
          });
      }
    },
    // changeIP() {
    //   this.$prompt("请输入新IP", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     inputValue: "192.168.10.10:9000"
    //   })
    //     .then(({ value }) => {
    //       if (value != "") {
    //         console.log(value);
    //         this.$store.commit("changeportAddress", value);
    //         localStorage.setItem("IP", "http://" + value);
    //       }
    //       this.$message({
    //         type: "success",
    //         message: "你的新IP: " + value
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消输入"
    //       });
    //     });
    // }

  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  background: url("./../../static/login_0.png");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .lo_center {
    width: 500px;
    height: 600px;
    background-color: rgb(233, 233, 233);
    .ip {
      text-align: right;
      color: rgb(10, 139, 245);
    }
    h2 {
      margin-top: 100px;
      text-align: center;
      font-size: 35px;
      color: rgb(235, 86, 41);
    }
    .line {
      width: 80%;
      margin: 20px auto;
      border: 1px solid #ccc;
    }
    .input {
      width: 60%;
      margin: 50px auto;
      .login-btn {
        width: 300px;
        height: 40px;
        margin: 20px 0;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        font-size: 22px;
        background-color: rgb(39, 122, 67);
        color: #fff;
      }
      .res {
        display: flex;
        color: #999;
        justify-content: space-between;
      }
      .ret {
        display: flex;
        justify-content: space-between;
        padding: 20px 5px;
        .res-btn {
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 5px;
          color: #fff;
          background-color: rgb(39, 122, 67);
          outline: none;
        }
        .btn {
          background-color: rgb(243, 32, 32);
        }
      }
      .p1 {
        height: 20px;
        line-height: 20px;
        color: red;
        padding: 0 10px;
        font-size: 12px;
      }
      .tologin {
        text-align: right;
        color: #999;
      }
    }
  }
}
</style>