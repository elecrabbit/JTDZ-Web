<template>
  <div class="relay">
    <el-card class="card">
      <div slot="header">
        <div style="width:50%;margin:0 auto;">
          <el-steps :active="active" finish-status="success">
            <el-step title="查找房间"></el-step>
            <el-step title="配置回路"></el-step>
            <el-step title="同步配置"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="card-body">
        <div class="w-70">
          <el-input placeholder="请输入房间号" v-model="inputRoom">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="继电器-A" value="A"></el-option>
              <el-option label="继电器-B" value="B"></el-option>
              <el-option label="继电器-C" value="C"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchRoom(inputRoom,select)"></el-button>
          </el-input>
          <p class="showError" v-show="show">{{error}}</p>
        </div>
        <div class="w-70" v-show="bool">
          <div>
            <h4>拖动下方方框调整继电器位置：</h4>
            <br />
          </div>
          <div class="jdqbox">
            <div class="relay-list-title">
              <p v-for="i in 20" :key="i">K{{ i }}</p>
            </div>
            <div class="clearfix"></div>
            <transition-group name="flip-list" tag="div" class="list-cicle">
              <div
                v-for="(item, index) in list"
                @dragstart="dragstart(item,index, $event)"
                @drop="drop(item, index, $event)"
                @dragend="dragend(item, index, $event)"
                @dragover.prevent
                draggable="true"
                :key="item"
                :class="getClass"
              >{{ item }}</div>
            </transition-group>
            <div class="clearfix"></div>
          </div>
          <el-row :gutter="10">
            <el-button size="mini" type="danger" @click="resetList">重置</el-button>

            <el-button size="mini" type="success" @click="subList(inputRoom,select)">提交</el-button>

          </el-row>
        </div>

        <div class="w-70" v-show="bool">
          <h4>如需特殊配置，请在下方输入配置码：</h4>
          <br />
          <el-input type="textarea" :rows="10" placeholder="请输入十六进制代码,以空格隔开" v-model="hexCode"></el-input>
          <div style="margin-top:10px;float:right;">
            <el-button size="mini" type="primary" @click="subHex(inputRoom)">提交配置码</el-button>
          </div>
        </div>
        <!-- <div v-if="secondBoard">
          <div style="color:blue;margin:10px 0;">继电器板 2：</div>
          <div v-for="i in 21" :key="i" class="relay-list-title">k{{ i }}</div>
          <div class="clearfix"></div>
          <transition-group name="flip-list" tag="div">
            <div v-for="(item, index) in list" @dragstart="dragstart(index, $event)" @drop="drop(item, index, $event)" @dragend="dragend(item, index, $event)" @dragover.prevent draggable="true" :key="item" class="relay-list">{{ item }}</div>
          </transition-group>
        </div>-->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {

      hexCode: "",
      select: "A",
      secondBoard: false,
      bool: false,
      active: 0,
      error: "",
      show: false,
      inputRoom: "",
      moveIndex: null,
      moveItem: "",
      targetIndex: null,
      portAddress: this.$store.state.portAddress,
      list: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
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
        "20"
      ]
    };
  },
  computed: {
    getClass: function() {
      return "relay-list";
    }
  },
  mounted() {},
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    searchRoom(inputRoom, select) {
      console.log(inputRoom, select);
      if (inputRoom === "") {
        this.$message({
          message: "请输入房间号",
          type: "warning"
        });
        // return
      } else if (select == "") {
        this.$message({
          message: "请选择继电器",
          type: "warning"
        });
      } else {
        this.$axios
          .get(
            this.portAddress +
              "/api/Lowmachine/ChanXunJiDianQiPeiZhi?RoomNUM=" +
              inputRoom +
              "&BoardName=" +
              select
          )
          .then(res => {
            if (res.data.length) {
              console.log(res.data);
              this.list = res.data;
              for (var i in this.list) {
                var num = parseInt(i) + 1;
                // console.log(parseInt(this.list[i]), num);
                if (parseInt(this.list[i]) != num) {
                  $(".relay-list")
                    .eq(num)
                    .addClass("changed");
                }
              }
              this.active = 1;
              this.bool = true;
            } else {
              this.$message({
                message: "请输入正确的房间号",
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    dragstart(item, index, e) {
      console.log(item, index);
      $(e.target).addClass("move");
      this.moveItem = item;
      this.moveIndex = index;
    },
    drop(item, index, e) {
      console.log(index);
      $(e.target).addClass("changed");
      $(".relay-list")
        .eq(this.moveIndex)
        .removeClass("move")
        .addClass("changed");
      this.targetIndex = index;
      this.$set(this.list, this.moveIndex, item);
      this.$set(this.list, index, this.moveItem);
    },
    dragend(item, index, e) {
      if (Number(item) == Number(index)) {
        setTimeout(() => {
          $(e.target).removeClass("changed");
          $(".relay-list")
            .eq(this.moveIndex)
            .removeClass("changed");
        }, 1000);
      }
    },
    resetList() {
      const back = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
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
        "20"
      ];
      this.list = back;
      var lis = $(".relay-list");
      setTimeout(() => {
        for (var i in lis) {
          if (lis.eq(i).hasClass("move") || lis.eq(i).hasClass("changed")) {
            lis.eq(i).removeClass("move");
            lis.eq(i).removeClass("changed");
          }
        }
      }, 1000);
    },
    subList(inputRoom, select) {
      console.log(inputRoom, select, this.list);
      this.$axios
        .put(this.portAddress + "/api/Lowmachine/SetJiDianQi", {
          RoomNUM: inputRoom,
          BorderName: select,
          Relays: this.list
        })
        .then(res => {
          this.$message({
            message: "success",
            type: "success"
          });
          var lis = $(".relay-list");
          setTimeout(() => {
            for (var i in lis) {
              if (lis.eq(i).hasClass("move") || lis.eq(i).hasClass("changed")) {
                lis.eq(i).removeClass("move");
                lis.eq(i).removeClass("changed");
              }
            }
            this.active = 3;
          }, 500);
          console.log("成功");
        })
        .catch(err => {
          this.active = 2;
          this.$message({
            message: "failed",
            type: "warning"
          });
          console.log("失败");
        });
    },

    subHex(num) {
      let arr = this.hexCode.trim().split(/\s+/);
      let subData = {
        RoomNUM: num,
        ByteArray: []
      };
      let checked = false;
      const pattern = /\b(0[xX])?[A-Fa-f0-9]{2}\b/;
      console.log(arr);

      for (let i in arr) {
        if (pattern.test(arr[i])) {
          console.log(arr[i]);
          checked = true;
        } else {
          checked = false;
        }
      }
      if (checked) {
        subData.ByteArray =this.hexCode;
        console.log(subData);

        this.$axios
          .post(
            this.portAddress + "/api/home/DominateEquipmentNoProcotol",
            subData
          )
          .then(res => {
            console.log('subData:',subData);

            this.$message({
              message: "提交成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message({
              message: "提交失败",
              type: "warning"
            });
          });
      } else {
        this.$message({
          message: "配置码格式有问题",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.relay {
  .card {
    box-sizing: border-box;
    height: 100%;
  }
}
.w-70 {
  width: 60%;

  margin: 50px auto;
  /deep/.el-select .el-input {
    width: 130px;
  }
  .showError {
    color: red;
    font-size: 12px;
    padding: 0 10px;
  }
}
.card-body {
  min-height: 400px;
}
.jdqbox {
  // margin-top: 50px;
  // margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
  .relay-list-title {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    p {
      width: 50px;
      height: 25px;
      border: 1px solid #ebeef5;
      text-align: center;
      line-height: 25px;
    }
  }
  .list-cicle {
    display: flex;
    justify-content: center;
    .relay-list {
      width: 50px;
      height: 100px;
      border: 1px solid #ebeef5;
      text-align: center;
      line-height: 100px;
    }
  }
}

.changed {
  background: #f56c6c;
}
.move {
  background: #67c23a;
}

.flip-list-move {
  transition: transform 1s;
}
.el-row {
  margin-top: 20px;
  float: right;
}
</style>
