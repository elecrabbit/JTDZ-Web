<template>
  <div class="selectRoom">
    <!-- <el-card class="box-card"> -->
    <div slot="header" class="clearfix">
      <span></span>
      <div>
        <span>房间类型：</span>
        <!-- <select id="test" @click="selected">
          <option :value="index" v-for="(item,index) in roomTypes" :key="index">{{index}}</option>
        </select> -->
         <el-select v-model="typevalue" placeholder="请选择"  @change='selected(typevalue)' >
            <el-option
              v-for="(item,index) in roomTypes"
              :key="index"
              :value="index">

            </el-option>
        </el-select>
      </div>
    </div>
    <el-table
      height="600"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="150"></el-table-column>
      <el-table-column prop="RoomNUM" label="房间号"></el-table-column>
      <el-table-column prop="RoomType" label="房间类型"></el-table-column>
    </el-table>
    <el-button type="success" class="sublet" @click="sublit">下一步</el-button>
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tableData: JSON.parse(localStorage.getItem("roomlist")),
      tableData: [],
      multipleSelection: [],
      roomTypes: {},
      portAddress: this.$store.state.portAddress,
      active: this.$store.state.active,
      typevalue:''
    }
  },
  beforeCreate: function () {
    this.$router.push('/timing/select')
  },
  mounted() {
    // this.$store.commit("changenum", 1);
    this.$axios
      .get(
        this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo"
        // './../../../static/json/getRoomLisr.json'/api/home/GetAllRoomInfosNoDeviceInfo
      )
      .then(res => {
        console.log(res.data)
        this.roomTypes = _.groupBy(res.data, "RoomType");
        console.log(this.roomTypes)
        this.tableData = this.roomTypes['标准间']
        this.tableData.sort(this.compare("RoomNUM"));
        this.changeactive(0)
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
      compare(property) {
      console.log(property);
      return function(a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        // console.log(value1, value2)
        return value1 - value2;
      };
    },
    selected(value) {
      console.log(value)
      var myselect = document.getElementById("test");
      // var ff = _.groupBy(this.newlist, "Hotel_Floor");
      for (var k in this.roomTypes) {
        if (value == k) {
          this.tableData = this.roomTypes[k];
          this.tableData.sort(this.compare("RoomNUM"));
          // for (let j = 0; j < this.tableData.length; j++) {
          //   this.ckstatus(this.tableData[j].RoomNUM, this.tableData[j]);
          // }
        }
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      // val[0].RoomType
      // for(var i in  this.tableData){
      //   if(this.tableData[i].RoomType!=val[0].RoomType){
      //     this.tableData[i].disabled=true
      //   }
      // }
      this.multipleSelection = val;
      this.$store.commit("changemultipleSelection", val);
    },
    sublit() {
      console.log(this.active)
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请先选择房间',
          type: 'warning'
        });
      } else {
        this.changeactive(1)
        this.$router.push('/timing/selectroom')
      }
    },
    changeactive(val) {
      this.$store.commit("changeactive", val);
    },
  }
}
</script>
<style lang='less' scoped>
.selectRoom {
  padding-bottom: 40px;
  position: relative;
  width: 80%;
  margin: 20px auto;
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
  .sublet {
    //  color:red;
    position: absolute;
    bottom: -10px;
    right: 20px;
    margin: 0 auto;
  }
  .select_type {
    font-size: 18px;
    color: red;
    position: absolute;
    top: 0px;
    left: 350px;
  }
}
</style>