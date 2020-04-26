
<template>
  <div class="kongtiao">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span>添加配置</span>
      </div>
      <div class="botox">
        <div class="el_input">
          <p>输入房间号：</p>
          <el-input v-model="input" placeholder="请输入房间号"></el-input>
        </div>
        <div class="el_model">
          <p>选择模式：</p>
          <div>
            <el-radio v-model="radio" label="节能">节能</el-radio>
            <el-radio v-model="radio" label="恒温">恒温</el-radio>
          </div>
        </div>
        <div class="el_telephone">
          <p>温度设置：</p>
          <el-input-number v-model="num" :step="2" :min="10" :max="50"></el-input-number>
        </div>
        <div class="el_model">
          <p>执行模式：</p>
          <div>
            <el-radio v-model="radio2" label="1">插卡</el-radio>
            <el-radio v-model="radio2" label="0">不插卡</el-radio>
          </div>
        </div>
        <!-- <el-button type="primary" round>主要按钮</el-button> -->
          <el-button type="primary" round @click="add">添加配置</el-button>
        <!-- <div class="a-btn">
        </div> -->
      </div>

    </el-card>
      <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span>删除配置</span>
      </div>
      <div class="botox">
        <div class="el_input">
          <p>输入房间号：</p>
          <el-input v-model="input2" placeholder="请输入房间号"></el-input>
        </div>
        <div class="el_model">
          <p>选择模式：</p>
          <div>
            <el-radio v-model="radio3" label="节能">节能</el-radio>
            <el-radio v-model="radio3" label="恒温">恒温</el-radio>
          </div>
        </div>
          <el-button type="primary" round @click="delate">删除配置</el-button>
        <!-- <div class="a-btn">
        </div> -->
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      input2: '',
      radio: '节能',
      radio2: '1',
      radio3: '节能',
      num: 20,
      portAddress: this.$store.state.portAddress,
    }
  },
  methods: {
    add() {
      console.log(this.radio)
      console.log(this.radio2)
      console.log(this.num)
      console.log(this.input)
      this.$axios
        .put(
          this.portAddress + "/api/KongTiaoSpeciallyMode/QiYong", {
          "RoomNUM": this.input,
          "MoShiName": this.radio,
          "SetTemerature": this.num,
          "CardSwitchIsCondition": this.radio2
        })
        .then(res => {
          console.log('成功')
        //   this.geterrorlist()
        });
    },
    delate(){
         console.log(this.input2)
         console.log(this.radio3)
          this.$axios
        .post(
          this.portAddress + "/api/KongTiaoSpeciallyMode/TingYong", {
          "RoomNUM": this.input2,
          "MoShiName": this.radio3,
        })
        .then(res => {
          console.log('成功')
        //   this.geterrorlist()
        });
    }
  }
}
</script>

<style lang="less" scoped>
.kongtiao {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  .box-card1 {
    width: 70%;
    margin: 50px auto;
    // height: 60%;
    box-sizing: border-box;
    // padding-bottom:50px;
    .botox {
      width: 70%;
      height: 100%;
      margin: 0 auto;
      // display: flex;
      // flex-direction: column;
      .el_input {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        margin-left: 70px;
        p {
          width: 110px;
          text-align: right;
        }
        /deep/.el-input {
          width: 200px;
        }
      }
      .el_model {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        margin-left: 70px;
        p {
          width: 110px;
          text-align: right;
        }
        div {
          padding: 0 15px;
        }
      }
      .el_telephone {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        margin-left: 70px;
        p {
          width: 110px;
          text-align: right;
        }
      }
        .el-button {
          float:right;
          margin:0 20px 10px 0;
        //  width:100px;
        //  position: absolute;
        //  right:0;
        }
    }
  }
}
</style>