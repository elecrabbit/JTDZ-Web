<template>
  <div class="out">
    <header>
      <div class="head-left">
        <img src="./../assets/images/logo_login.png" alt />必达智慧酒店控制系统
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <el-avatar :size="60">
          <img src="./../../static/images/icon.jpg"  />
          </el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>{{userrank}}</el-dropdown-item>
            <el-dropdown-item command="set">系统设置</el-dropdown-item>
            <el-dropdown-item command="out" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <article class="article">
      <ul>
        <li v-for="(value,index) in fenlei" :key="index" @click="junp(index)" class="fl">
          <transition name="slide-fade">
            <router-link :to="value.src">
              <div class="li" :class="{on : index == 0}">
                <img :src="value.img_src" alt />
                <span>{{value.text}}</span>
              </div>
            </router-link>
          </transition>
        </li>
      </ul>
      <router-view class="ck"></router-view>
    </article>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      fenlei: [
        {
          text: "房间列表",
          src: "/home"
        },
        {
          text: "定时控制",
          src: "/timing/select"
        },
        {
          text: "系统配置",
          src: "/config"
        },
        {
          text: "空调配置",
          src: "/kongtiao"
        },
        {
          text: "用户中心",
          src: "/userCentre"
        },
        {
          text: "加密解密",
          src: "/encrytion"
        },
        {
          text: "问题房间",
          src: "/problemroom"
        },
        {
          text: "继电器配置",
          src: "/relay"
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
      portAddress: this.$store.state.portAddress,
    };
  },
  mounted()  {
    this.$axios
      .get(this.portAddress + "/api/User/GetAllUser")
      .then(res =>      {
        var data = JSON.parse(res.data);
        for (var i in data)        {
          if (data[i].UserName == localStorage.getItem("token"))          {
            this.userrank = data[i].Department;
            this.$store.commit("changeuserrank", data[i].Department);
            if (data[i].Department == "超级管理员")            {
            } else if (data[i].Department == "管理员")            {
              this.fenlei.splice(5, 1);
            } else if (data[i].Department == "前台")            {
              this.fenlei.splice(5, 1);
            } else if (data[i].Department == "工程部")            {
              this.fenlei.splice(1, 5);
            } else if (data[i].Department == "经理")            {
              this.fenlei.splice(4, 2);
            } else            {
              this.fenlei = [];
            }
          }
        }
      })
      .catch(err =>      {
        console.log("失败");
      });
  },
  methods: {

    junp(index)    {
      let li = document.getElementsByClassName("li");
      li[this.num].classList.remove("on");
      li[index].classList.add("on");
      this.num = index;
    },
    handleCommand(cmd){
      if(cmd === 'set'){
        this.$router.push('/setting')

      }else if(cmd === 'out'){
        this.tuic()
      }
    },
    tuic()    {
      this.$router.push("/login");
      localStorage.removeItem("token");
    }
  }
};
</script>

<style lang="less" scoped>
.out {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    background-color: #2d3647;
    color: white;
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
    .header-right {
      margin-right: 20px;
      span {
        color: aqua;
      }
    }
  }
  .tuichu {
    position: fixed;
    left: 50px;
    bottom: 30px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      margin-right: 5px;
    }
    span {
      color: #ccc;
    }
  }
  .outset {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1001;
    position: absolute;
    #set {
      z-index: 1001;
      padding: 10px;
      width: 80px;
      border: 1px solid #999;
      position: absolute;
      right: 0;
      top: 100px;
      background: #2d3647;
      p {
        text-align: center;
        font-size: 15px;
        color: #ccc;
        padding: 5px 0;
      }
    }
  }
  .article {
    // height:100%;
    flex: 1;
    display: flex;
    ul {
      width: 170px;
      background-color: #3b4255;

      li {
        box-sizing: border-box;
        height: 45px;
        a {
          text-decoration: none;
          display: block;
          height: 100%;
          .li {
            box-sizing: border-box;
            line-height: 45px;
            // padding:10px 0;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .on {
            box-sizing: border-box;
            border-left: 4px solid #ffc600;
            background-color: #293038;
          }
        }
        .slide-fade-enter-active {
          transition: all 1s ease;
        }
      }
    }
    .ck {
      // flex: 1;
      position: absolute;
      top: 100px;
      left: 170px;
      height: ~"calc(100vh - 100px)";
      width: ~"calc(100% - 170px)";
      overflow-y: auto;
    }
  }
}
</style>