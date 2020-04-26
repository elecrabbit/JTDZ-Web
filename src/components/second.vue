<template>
  <div>
    <el-card>
      <div slot="header">
        <div style="width:70%;margin:0 auto;">
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
            <template slot="prepend">查找房间</template>
            <el-button slot="append" icon="el-icon-search" @click="searchRoom(inputRoom)"></el-button>
          </el-input>
          <p class="showError" v-show="show">{{error}}</p>
        </div>
        <div class="jdqbox" v-show="bool">
          <div style="color:blue;margin:20px 0;">继电器板 1：</div>
          <div class="relay-list-title">
            <p v-for="i in 21" :key="i">k{{ i }}</p>
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
          <el-row :gutter="10" class="rightset">
            <el-tooltip content="恢复默认状态" placement="top">
              <el-button type="danger" @click="resetList">重置</el-button>
            </el-tooltip>

            <el-tooltip content="提交现在的配置" placement="top">
              <el-button type="success" @click="subList(inputRoom)">提交</el-button>
            </el-tooltip>
          </el-row>
        </div>
        <div v-if="secondBoard">
          <div style="color:blue;margin:10px 0;">继电器板 2：</div>
          <div v-for="i in 21" :key="i" class="relay-list-title">k{{ i }}</div>
          <div class="clearfix"></div>
          <transition-group name="flip-list" tag="div">
            <div
              v-for="(item, index) in list"
              @dragstart="dragstart(index, $event)"
              @drop="drop(item, index, $event)"
              @dragend="dragend(item, index, $event)"
              @dragover.prevent
              draggable="true"
              :key="item"
              class="relay-list"
            >{{ item }}</div>
          </transition-group>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {
      secondBoard: false,
      bool: false,
      active: 0,
      error: '',
      show: false,
      inputRoom: '',
      moveIndex: null,
      moveItem: '',
      targetIndex: null,
      portAddress: this.$store.state.portAddress,
      list: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      backList: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
    }
  },
  computed: {
    getClass: function () {
      return 'relay-list'
    }
  },
  mounted() {
    //   if(this.inputRoom==''){
    //    this.error=''
    // }
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    },
    searchRoom(num) {
      if (num === '') {
        this.$message({
          message: '请输入房间号',
          type: 'warning'
        })
        // return
      } else {
        this.$axios
          .get(
            //  this.portAddress + "/api/Lowmachine/ChanXunJiDianQiPeiZhi?RoomNUM="+num
            this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo"
          )
          .then(res => {
            console.log(res.data)
            for (var i in res.data) {
              console.log(res.data[i].RoomNUM, num)
              if (res.data[i].RoomNUM == num) {
                this.active = 1
                this.error = '';
                this.bool = true;
                break
              } else {
                this.show = true
                this.error = '输入房间号不正确，请重新输入'
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }

    },
    dragstart(item, index, e) {
      console.log(item, index)
      $(e.target).addClass('move')
      this.moveItem = item
      this.moveIndex = index
    },
    drop(item, index, e) {
      console.log(index)
      $(e.target).addClass('changed');
      $('.relay-list').eq(this.moveIndex).removeClass('move').addClass('changed')
      this.targetIndex = index
      this.$set(this.list, this.moveIndex, item)
      this.$set(this.list, index, this.moveItem)
    },
    dragend(item, index, e) {
      if (Number(item) == Number(index)) {
        setTimeout(() => {
          $(e.target).removeClass('changed');
          $('.relay-list').eq(this.moveIndex).removeClass('changed')
        }, 1000)
      }
    },
    resetList() {
      const back = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
      this.list = back;
      var lis = $('.relay-list');
      setTimeout(() => {
        for (var i in lis) {
          if (lis.eq(i).hasClass('move') || lis.eq(i).hasClass('changed')) {
            lis.eq(i).removeClass('move')
            lis.eq(i).removeClass('changed')
          }
        }
      }, 1000)
    },
    subList(inputRoom) {
      this.$axios
        .put(
          this.portAddress + "/api/Lowmachine/SetJiDianQi", {
          "RoomNUM": inputRoom, "RelayData": this.list
        }
        )
        .then(res => {
          this.$message({
            message: 'success' + JSON.stringify(this.list),
            type: 'success'
          })
          var lis = $('.relay-list');
          setTimeout(() => {
            for (var i in lis) {
              if (lis.eq(i).hasClass('move') || lis.eq(i).hasClass('changed')) {
                lis.eq(i).removeClass('move')
                lis.eq(i).removeClass('changed')
              }
            }
            this.active = 3
          }, 1000)
          console.log('成功')
        })
        .catch(err => {
          this.active = 2
          console.log("失败");
        });
    }
  }
}
</script>
<style lang="less" scoped>
.w-70 {
  width: 60%;
  margin: 12px auto;
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
  /deep/.rightset {
    // text-align: right;
    margin-left: 938px !important;
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
