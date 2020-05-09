<template>
  <div>
    <div class="btn">
      <!-- <el-button type="primary" @click="roomSort">房间号排序</el-button> -->
      <!-- <el-button type="primary" @click="timeSort">剩余时间排序</el-button> -->
      <!-- <el-button type="primary" @click="keySort">令牌排序</el-button> -->
      <el-button type="primary" @click="decode">解密</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 70%;margin:5px auto;"
      height="70%"
      :default-sort = "{prop: 'RoomNUM'}"
      @selection-change="handleSelectionChange"
      @row-click="singleDecode"
    >
      <el-table-column type="selection" width="150"></el-table-column>
      <el-table-column prop="RoomNUM" label="房间号" sortable></el-table-column>
      <el-table-column prop="RoomType" label="房间类型" sortable></el-table-column>
      <el-table-column prop="Time.LeaveTime" label="剩余时间" sortable></el-table-column>
      <el-table-column prop="secretKey" label="当前令牌" sortable></el-table-column>
    </el-table>

    <el-dialog title="输入Token值" :visible.sync="dialogFormVisible">
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
      portAddress: this.$store.state.portAddress
    };
  },
  mounted() {
    this.getAllRoom();
  },
  filters:{
    getRoomNum(rooms){
      let arr = [];
      if(Array.isArray(rooms)){
        rooms.forEach(item => {
          arr.push(item.RoomNUM)
        });
        return arr;
      }else{
        return rooms.RoomNUM
      }
    },
    getSecretKey(rooms){
      let keys = [];
      if(Array.isArray(rooms)){
        rooms.forEach(item => {
          keys.push(item.secretKey)
        });
        return [...new Set(keys)] //去除重复的key
      }else{
        return rooms.secretKey;
      }
    }
  },
  methods: {
    getAllRoom() {
      this.$axios
        .get(this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo")
        .then(res => {
          console.log(res.data);
          for (var i in res.data) {
            this.getLeaveTime(res.data[i]);
            this.getencrytion(res.data[i]);
          }
          this.tableData = res.data;
          // this.tableData.sort(this.compare("RoomNUM"));
        })
        .catch(err => {
          console.log(err);
        });
    },
    getLeaveTime(data) {
      this.$axios
        .get(
          this.portAddress + "/api/Home/QueryLeaveTime?RoomNUM=" + data.RoomNUM
        )
        .then(res => {
          //   console.log(res)
          this.$set(data, "Time", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getencrytion(data) {
      this.$axios
        .get(
          this.portAddress + "/api/Home/QuerySecretKey?RoomNUM=" + data.RoomNUM
        )
        .then(res => {
          //   console.log(res)
          this.$set(data, "secretKey", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // compare(property) {
    //   console.log(property);
    //   return function(a, b) {
    //     var value1 = parseInt(a[property]);
    //     var value2 = parseInt(b[property]);
    //     // console.log(value1, value2)
    //     return value1 - value2;
    //   };
    // },
    // compare1(property, property1) {
    //   console.log(property);
    //   return function(a, b) {
    //     var value1 = a[property][property1];
    //     var value2 = b[property][property1];
    //     // console.log(a, b)
    //     // console.log(value1, value2)
    //     return value1 - value2;
    //   };
    // },
    // compare2(property) {
    //   console.log(property);
    //   return function(a, b) {
    //     var value1 = parseInt(a[property], 16);
    //     var value2 = parseInt(b[property], 16);
    //     // console.log(value1, value2)
    //     return value1 - value2;
    //   };
    // },
    // roomSort() {
    //   this.tableData.sort(this.compare("RoomNUM"));
    // },
    // timeSort() {
    //   this.tableData.sort(this.compare1("Time", "TimeStamp"));
    // },
    // keySort() {
    //   this.tableData.sort(this.compare2("secretKey"));
    // },
    handleSelectionChange(val) {
      this.selectRoom = val;
      console.log(this.selectRoom);

    },
    singleDecode(row){
      this.selectRoom = row;
      console.log(this.selectRoom)
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
.btn {
  margin: 20px 0 5px 10px;
}
</style>