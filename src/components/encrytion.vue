<template>
  <div>
    <el-card style="height:99%;">
      <div slot="header">
        <div style="width:80%;margin:0 auto;">
          <el-button type="primary" @click="decode">解密</el-button>
        </div>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 80%;margin:0 auto;"
          height="650"
          :default-sort="{prop: 'RoomNUM'}"
          @selection-change="handleSelectionChange"
          @row-click="singleDecode"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="RoomNUM" label="房间号" sortable></el-table-column>
          <el-table-column prop="RoomType" label="房间类型" sortable></el-table-column>
          <el-table-column prop="LeaveTime" label="剩余时间" sortable></el-table-column>
          <el-table-column prop="SecurityKey" label="当前令牌" sortable></el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog title="输入解密值" :visible.sync="dialogFormVisible">
      <el-form class="form">
        <el-form-item label="房间号：" :label-width="formLabelWidth">{{selectRoom | getRoomNum}}</el-form-item>
        <el-form-item label="令牌：" :label-width="formLabelWidth">{{selectRoom | getSecretKey}}</el-form-item>
        <el-form-item label="新令牌：" :label-width="formLabelWidth">
          <el-input v-model="token" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="decode_ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      selectRoom: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      token: "",
      roomList: this.$store.state.allroom,
      portAddress: this.$store.state.portAddress
    };
  },
  mounted() {
    this.getAllRoom();
  },
  filters: {
    getRoomNum(rooms) {
      let arr = [];
      if (Array.isArray(rooms)) {
        rooms.forEach(item => {
          arr.push(item.RoomNUM);
        });
        return arr;
      } else {
        return rooms.RoomNUM;
      }
    },
    getSecretKey(rooms) {
      let keys = [];
      if (Array.isArray(rooms)) {
        rooms.forEach(item => {
          keys.push(item.SecurityKey);
        });
        return [...new Set(keys)]; //去除重复的key
      } else {
        return rooms.SecurityKey;
      }
    }
  },
  methods: {
    getAllRoom() {
      console.log("store:", this.roomList);
      let roomNums = [];
      if (this.roomList) {
        this.roomList.forEach(item => {
          roomNums.push(item.RoomNUM);
        });
        this.getLeaveTimeAndKey(JSON.stringify(roomNums));
      }
      // this.$axios
      //   .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
      //   .then(res => {
      //     console.log(res.data);
      //     for (var i in res.data) {
      //       this.getLeaveTime(res.data[i]);
      //       this.getencrytion(res.data[i]);
      //     }
      //     this.tableData = res.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    getLeaveTimeAndKey(arr) {
      this.$axios
        .post(this.portAddress + "/api/Home/QueryLeaveTimeAndSecurityKey", arr)
        .then(res => {
          if (res.data.length) {
            res.data.forEach(item => {
              for (const i in this.roomList) {
                if (this.roomList[i].RoomNUM === item.RoomNUM) {
                  const { RoomNUM, ...rest } = item;
                  this.roomList[i] = { ...this.roomList[i], ...rest };
                }
              }
            });
            this.tableData = this.roomList;
            console.log(this.tableData);
          }
        })
        .catch(err => {
          this.tableData = this.roomList;
          console.log(err);
        });
    },
    // getLeaveTime(data) {
    //   this.$axios
    //     .get(
    //       this.portAddress + "/api/Home/QueryLeaveTime?RoomNUM=" + data.RoomNUM
    //     )
    //     .then(res => {
    //       //   console.log(res)
    //       this.$set(data, "Time", res.data);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // getencrytion(data) {
    //   this.$axios
    //     .get(
    //       this.portAddress + "/api/Home/QuerySecretKey?RoomNUM=" + data.RoomNUM
    //     )
    //     .then(res => {
    //       //   console.log(res)
    //       this.$set(data, "secretKey", res.data);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    handleSelectionChange(val) {
      this.selectRoom = val;
      console.log(this.selectRoom);
    },
    singleDecode(row) {
      this.selectRoom = row;
      console.log(this.selectRoom);
      this.decode();
    },
    decode() {
      if (this.selectRoom.length == 0) {
        this.$message({
          message: "请先选择要解密的房间",
          type: "warning"
        });
      } else {
        this.dialogFormVisible = true;
        this.token = "";
      }
    },
    decode_ok() {
      this.dialogFormVisible = false;
      for (var i in this.selectRoom) {
        this.$axios
          .post(this.portAddress + "/api/Home/KaiShiJieMi", {
            Token: this.token,
            RoomNUM: this.selectRoom[i].RoomNUM
          })
          .then(res => {
            console.log("成功");
            this.getAllRoom();
          })
          .catch(err => {
            console.log("失败");
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>