<template>
  <div class="out">
    <header>
      <div class="head-left">
        <img src="./../assets/images/logo_login.png" alt />必达智慧酒店控制系统
      </div>
      <div>
        <el-dropdown @command="handleCommand">
          <el-avatar shape="square" :size="50">
            <img src="./../../static/images/icon.jpg" />
          </el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{userrank}}</el-dropdown-item>
            <!-- <el-dropdown-item command="set">系统设置</el-dropdown-item> -->
            <el-dropdown-item command="out" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <article class="article">
      <ul>
        <li v-for="(item,index) in fenlei" :key="index" @click="jumpTo(index)">
          <router-link :to="item.src">
            <div class="li" :class="{on : index == 0}">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.text}}</span>
            </div>
          </router-link>
        </li>
      </ul>
      <transition name="fade">
        <router-view class="main-content"></router-view>
      </transition>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fenlei: [
        {
          text: "房间列表",
          src: "/home",
          icon: "icon-home"
        },
        {
          text: "定时控制",
          src: "/timing/select",
          icon: "icon-dingshi"
        },
        {
          text: "系统配置",
          src: "/config",
          icon: "icon-configure"
        },
        {
          text: "空调配置",
          src: "/kongtiao",
          icon: "icon-kongtiao"
        },
        {
          text: "用户中心",
          src: "/userCentre",
          icon: "icon-users"
        },
        {
          text: "加密解密",
          src: "/encrytion",
          icon: "icon-jiami"
        },
        {
          text: "问题房间",
          src: "/problemroom",
          icon: "icon-Tools"
        },
        {
          text: "继电器配置",
          src: "/relay",
          icon: "icon-configuration"
        }
      ],
      num: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: "120px",
      telephone1: "",
      password1: "",
      password2: "",
      usertype: "",
      userrank: "",
      portAddress: this.$store.state.portAddress
    };
  },
  mounted() {
    this.$axios
      .get(this.portAddress + "/api/User/GetAllUser")
      .then(res => {
        var data = JSON.parse(res.data);
        for (var i in data) {
          if (data[i].UserName == localStorage.getItem("token")) {
            this.userrank = data[i].Department;
            this.$store.commit("changeuserrank", data[i].Department);
            if (data[i].Department == "超级管理员") {
            } else if (data[i].Department == "管理员") {
              this.fenlei.splice(5, 1);
            } else if (data[i].Department == "前台") {
              this.fenlei.splice(5, 1);
            } else if (data[i].Department == "工程部") {
              this.fenlei.splice(1, 5);
            } else if (data[i].Department == "经理") {
              this.fenlei.splice(4, 2);
            } else {
              this.fenlei = [];
            }
          }
        }
      })
      .catch(err => {
        console.log("失败");
      });
  },
  methods: {
    jumpTo(index) {
      let li = document.getElementsByClassName("li");
      li[this.num].classList.remove("on");
      li[index].classList.add("on");
      this.num = index;
    },
    handleCommand(cmd) {
      if (cmd === "set") {
        this.$router.push("/setting");
      } else if (cmd === "out") {
        this.tuic();
      }
    },
    tuic() {
      this.$router.push("/login");
      localStorage.removeItem("token");
    }
  }
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.out {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    background-color: #2d3647;
    color: white;
    font-size: 1.3em;
    font-weight: bold;
    height: 100px;
    padding: 0 42px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-left {
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
        width: 70px;
      }
    }
  }

  .article {
    // height: 100%;
    flex: 1;
    display: flex;
    ul {
      width: 130px;
      background-color: #3b4255;
      li {
        height: 45px;
        a {
          text-decoration: none;
          display: block;
          height: 100%;
          .li {
            line-height: 45px;
            color: white;
            text-align: center;
          }
          &:hover {
            background: #293038;
          }
          .on {
            border-left: 4px solid #ffc600;
            background-color: #293038;
          }
        }
      }
    }
    .main-content {
      // flex: 1;
      position: absolute;
      top: 100px;
      left: 130px;
      height: ~"calc(100% - 100px)";
      width: ~"calc(100% - 130px)";
      overflow-y: auto;
    }
  }
}
</style>