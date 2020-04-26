<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-head">
        <h1>酒店房间列表</h1>
        <br />
        <div>
          <el-button @click="showRoomForm = true">添加房间</el-button>
          <el-button @click="showMultiRoomForm = true">批量添加房间</el-button>
          <!-- <el-button @click="addMultiMachines">批量添加下位机</el-button> -->
          <el-button @click="showMultiDevices=true">批量添加设备</el-button>
        </div>
      </div>
      <el-table
        :data="roomList"
        height="650"
        class="databox"
        stripe
        :default-sort="{prop: 'RoomNUM'}"
        @row-dblclick="handleRowClick"
      >
        <el-table-column label="酒店名称" prop="Hotel_Name" width="250"></el-table-column>
        <el-table-column sortable label="Id号" prop="RoomID"></el-table-column>
        <el-table-column label="楼号" prop="Hotel_Builder"></el-table-column>
        <el-table-column label="楼层" prop="Hotel_Floor"></el-table-column>
        <el-table-column sortable label="房间号" prop="RoomNUM"></el-table-column>
        <el-table-column sortable label="房间类型" prop="RoomType"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click.stop="handleEdit(scope.row)">编辑</el-button>
            <!-- 删除确认框 -->
            <el-popover placement="top-end" width="160" v-model="scope.row.showTip">
              <p>确定要删除该房间信息吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click.stop="scope.row.showTip = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="handleDelete(scope.row)">确定</el-button>
              </div>
              <el-button slot="reference" size="mini" type="danger" @click.stop>删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑 单个房间信息 -->
    <el-dialog :title="editFlag?'修改房间':'添加房间'" :visible.sync="showRoomForm" center>
      <el-form :model="singleRoomForm" label-position="right" label-width="100px">
        <el-form-item label="酒店名称：">
          <el-input v-model="singleRoomForm.Hotel_Name"></el-input>
        </el-form-item>
        <el-form-item label="楼号：">
          <el-input v-model="singleRoomForm.Hotel_Builder"></el-input>
        </el-form-item>
        <el-form-item label="楼层：">
          <el-input v-model="singleRoomForm.Hotel_Floor"></el-input>
        </el-form-item>
        <el-form-item label="房间号：">
          <el-input v-model="singleRoomForm.RoomNUM"></el-input>
        </el-form-item>
        <el-form-item label="房间类型：">
          <el-input v-model="singleRoomForm.RoomType"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRoomForm = false,editFlag=false;singleRoomForm={}">取 消</el-button>
        <el-button type="primary" @click="addSingleRoom">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加多个房间信息 -->
    <el-dialog title="批量添加房间" :visible.sync="showMultiRoomForm" center>
      <div class="multi-rooms">
        <el-form
          :model="singleRoomForm"
          label-position="right"
          label-width="100px"
          class="room-form"
        >
          <el-form-item label="酒店名称：">
            <el-input v-model="singleRoomForm.Hotel_Name"></el-input>
          </el-form-item>
          <el-form-item label="楼号：">
            <el-input v-model="singleRoomForm.Hotel_Builder"></el-input>
          </el-form-item>
          <el-form-item label="楼层：">
            <el-input v-model="singleRoomForm.Hotel_Floor"></el-input>
          </el-form-item>
          <el-form-item label="房间号：">
            <el-input v-model="singleRoomForm.RoomNUM"></el-input>
          </el-form-item>
          <el-form-item label="房间类型：">
            <el-input v-model="singleRoomForm.RoomType"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top:10%;">
          <el-button @click="addToMultiRooms">添加</el-button>
        </div>
        <div class="room-list-box">
          <h3>房间号</h3>
          <el-tag
            v-for="item in multiRooms"
            :key="item.index"
            closable
            @close="handleClose(item)"
          >{{ item.RoomNUM }}</el-tag>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="showMultiRoomForm=false;singleRoomForm={}">取消</el-button>
        <el-button type="primary" @click="addMultiRooms">提交</el-button>
      </div>
    </el-dialog>

    <!-- 批量添加设备 -->
    <el-dialog title="批量添加设备" :visible.sync="showMultiDevices" center>
      <div>
        <el-select v-model="selectedValue" placeholder="选择房型" @change="selectable">
          <el-option v-for="(value,key,index) in selectOptions" :key="index" :value="key"></el-option>
        </el-select>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          border
        >全选</el-checkbox>
      </div>
      <div class="selsect-room-table">
        <el-checkbox-group v-model="checkedRooms" @change="handleCheckedRoomsChange">
          <el-checkbox
            v-for="(item,index) in selectedRooms"
            :label="item"
            :key="index"
          >{{item.RoomNUM}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="multi-rooms">
        <el-form :model="deviceObj" label-position="right" label-width="100px" class="room-form">
          <el-form-item label="设备类型：">
            <el-select
              v-model="deviceObj.DeviceClass"
              placeholder="选择设备类型"
              @change="deviceClassChange"
            >
              <el-option v-for="(item,index) in devicesTemplate" :key="index" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="deviceObj.DeviceName"></el-input>
          </el-form-item>
          <el-form-item label="设备位置：">
            <el-input v-model="deviceObj.AreaOfRoom"></el-input>
          </el-form-item>
          <el-form-item label="地址码：">
            <el-input placeholder="7A.74.01.01." v-model="deviceObj.OwinSHA"></el-input>
            <div class="mac-box">
              <el-radio-group v-model="deviceMac">
                <el-radio
                  :label="item"
                  v-for="item in macNums"
                  :key="item"
                  @change="macChange"
                  style="margin-top:5px;"
                >{{ item}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="线序号：" v-show="showLineNum">
            <el-input-number
              v-model="deviceObj.lineNumber"
              controls-position="right"
              :min="0"
              :max="22"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div style="margin-top:10%;">
          <el-button @click="addToMultiDevices">
            添加
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="room-list-box">
          <h3>设备：</h3>
          <el-tag
            v-for="item in multiDevices"
            :key="item.index"
            closable
            @close="handleDeviceDelete(item)"
            style="margin:5px;"
          >{{ item.DeviceName }}</el-tag>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showMultiDevices = false">取 消</el-button>
        <el-button type="primary" @click="addMultiDevices">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverAdd: this.$store.state.portAddress,
      roomList: [],
      multiRooms: [],
      multiDevices: [],
      editFlag: false, //标示编辑房间还是新建房间信息
      showRoomForm: false, //单个房间信息
      showMultiRoomForm: false, //批量添加房间信息
      showMultiDevices: false, //批量添加设备信息
      singleRoomForm: {
        Hotel_Name: "",
        Hotel_Builder: "",
        Hotel_Floor: "",
        RoomNUM: "",
        RoomType: ""
      },
      selectOptions: {},
      selectedValue: null,
      checkAll: false,
      isIndeterminate: true,
      selectedRooms: [],
      checkedRooms: [],
      selectedDeviceClass: {},
      deviceObj: {
        AreaOfRoom: "",
        DeviceClass: "",
        DeviceName: "",
        Device_ID: "",
        LowerMachine_ID: "",
        OwinSHA: "7A.74.01.01.",
        lineNumber: "",
        DeviceProperty: []
      },
      deviceMac: "",
      showLineNum: false,
      devicesTemplate: [
        "灯光",
        "风扇",
        "插座",
        "温控器",
        "电动卷帘",
        "门显",
        "磁性感应器",
        "取电开关",
        "紧急呼叫",
        "预约服务"
      ],
      macNums: [],
      devicesList: [],
      multiDevices: []
    };
  },
  mounted() {
    this.getRoomList();
  },
  methods: {
    //请求房间列表
    getRoomList() {
      this.$axios
        .get(this.serverAdd + "/api/home/GetAllRoomAndLowerMachineInfo")
        .then(res => {
          let rooms = res.data;
          if (rooms.length > 0) {
            for (const i in rooms) {
              //绑定删除按键的提示框，并且更新视图数据
              this.$set(rooms[i], "showTip", false);
            }
            this.roomList = rooms;
            console.log(this.roomList);
            this.selectOptions = _.groupBy(this.roomList, "RoomType");
          }
        })
        .catch(err => {
          this.$message({ message: "请求失败", type: "warning" });
        });
    },
    //添加单个房间信息
    addSingleRoom() {
      //如果是修改房间就提交到修改接口
      if (this.editFlag) {
        this.$axios
          .post(
            this.serverAdd + "/api/DataBase/ModifyRoomInfo",
            this.singleRoomForm
          )
          .then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.showRoomForm = false;
            this.editFlag = false;
            this.getRoomList();
          })
          .catch(err => {
            this.$message({ message: "修改失败", type: "warning" });
            this.showRoomForm = false;
            this.editFlag = false;
          });
      } else {
        // 判断房间信息表单不为空就提交
        if (this.singleRoomForm.RoomNUM !== "") {
          this.$axios
            .put(
              this.serverAdd + "/api/DataBase/PutRoomInfo",
              this.singleRoomForm
            )
            .then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.showRoomForm = false;
              this.editFlag = false;
              this.getRoomList(); //刷新列表
            })
            .catch(err => {
              this.$message({ message: "提交失败", type: "warning" });
              this.showRoomForm = false;
              this.editFlag = false;
            });
        } else {
          this.$message({ message: "数据不能为空", type: "warning" });
        }
      }
    },
    //点击行时处理事件
    handleRowClick(row) {
      this.$store.commit("changeroomID", row.RoomID);
      this.$router.push("/configDetail/" + row.RoomNUM);
    },
    //编辑房间信息
    handleEdit(row) {
      this.singleRoomForm = { ...row };
      this.editFlag = true;
      this.showRoomForm = true;
    },
    //删除批量添加中的指定房间
    handleClose(item) {
      this.multiRooms.splice(this.multiRooms.indexOf(item), 1);
    },
    //提交前的批量添加房间列表
    addToMultiRooms() {
      let areadyHad = false;
      if (
        this.singleRoomForm.RoomNUM !== "" &&
        Object.keys(this.singleRoomForm).length > 0
      ) {
        for (let i in this.roomList) {
          if (this.roomList[i].RoomNUM === this.singleRoomForm.RoomNUM) {
            this.$message("已经存在该房间");
            areadyHad = true;
            break;
          }
        }
        if (!areadyHad) {
          let room = { ...this.singleRoomForm };
          this.multiRooms.push(room);
          console.log(JSON.stringify(this.multiRooms));
        }
      } else {
        this.$message("清输入完整的房间信息");
      }
    },
    //批量添加房间信息
    addMultiRooms() {
      if (this.multiRooms.length > 0) {
        this.$axios
          .put(
            this.serverAdd + "/api/DataBase/BatchPutRoomInfo",
            this.multiRooms
          )
          .then(res => {
            this.$message({ message: "提交成功", type: "success" });
            this.showMultiRoomForm = false;
            this.multiRooms = [];
            this.getRoomList();
          })
          .catch(err => {
            this.$message("网络出错了,提交失败");
          });
      } else {
        this.$message("不能提交空数据");
      }
    },
    //批量添加下位机
    addMultiMachines() {},
    //批量添加设备
    addMultiDevices() {
      //把设备依次添加到不同的下位机ID上
      if (this.checkedRooms.length > 0 && this.multiDevices.length > 0) {
        let lowerIds = [];
        let devicesInfo = [];
        let localDevices = this.multiDevices;
        this.checkedRooms.forEach(item => {
          lowerIds.push(item.LowerMachine.LowerMachine_ID);
        });
        for (let i = 0; i < lowerIds.length; i++) {
          for (let j = 0; j < localDevices.length; j++) {
            let {
              AreaOfRoom,
              DeviceClass,
              DeviceName,
              Device_ID,
              OwinSHA,
              DeviceProperty
            } = localDevices[j];
            let tmp = {
              AreaOfRoom,
              DeviceClass,
              DeviceName,
              Device_ID,
              OwinSHA,
              DeviceProperty
            };
            tmp.LowerMachine_ID = lowerIds[i];
            devicesInfo.push(tmp);
          }
        }
        console.log(devicesInfo);
        this.$axios
          .put(
            this.serverAdd + "/api/DataBase/BatchInsertDeviceInfo",
            devicesInfo
          )
          .then(res => {
            console.log("成功");
            this.showMultiDevices = false;
          })
          .catch(err => {
            console.log("失败");
          });
      } else {
        this.$message("设备或房间不能为空");
      }
    },

    //删除房间信息方法
    handleDelete(row) {
      row.showTip = false; //关闭提示框
      this.$axios
        .delete(
          this.serverAdd + "/api/DataBase/DeleteRoomInfo?id=" + row.RoomID
        )
        .then(res => {
          this.$message({ message: "删除成功", type: "success" });
          this.getRoomList(); //请求新的房间列表
        })
        .catch(err => {
          this.$message({ message: "删除失败", type: "warning" });
        });
    },
    //筛选房间列表
    selectable(e) {
      this.selectedRooms = this.selectOptions[e];
      // console.log(this.selectedRooms);
    },
    //是否全选
    handleCheckAllChange(val) {
      this.checkedRooms = val ? this.selectedRooms : [];
      this.isIndeterminate = false;
      // console.log(this.checkedRooms);
    },
    //选中房间
    handleCheckedRoomsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.selectedRooms.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.selectedRooms.length;
      // console.log(this.checkedRooms);
    },
    //设备类型选择
    deviceClassChange(val) {
      this.showLineNum = false;
      let arr = [];
      if (val === "灯光" || val === "风扇" || val === "插座") {
        for (let i = 16; i < 32; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
        this.showLineNum = true;
      } else if (val === "电动卷帘") {
        for (let i = 32; i < 48; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "温控器") {
        for (let i = 48; i < 64; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "门显") {
        for (let i = 112; i < 128; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "取电开关") {
        for (let i = 128; i < 144; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "紧急呼叫") {
        for (let i = 144; i < 160; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "磁性感应器") {
        for (let i = 176; i < 192; i++) {
          arr.push(i.toString(16).toUpperCase());
        }
      } else if (val === "预约服务") {
        arr.push("D0");
      }
      this.macNums = arr;
    },
    //地址码选择
    macChange(val) {
      let s = "7A.74.01.01.01";
      if (this.deviceObj.OwinSHA.length !== s.length) {
        this.deviceObj.OwinSHA += val;
      } else {
        this.deviceObj.OwinSHA = this.deviceObj.OwinSHA.slice(0, 12) + val;
      }
    },
    //删除增加的设备
    handleDeviceDelete(item) {
      this.multiDevices.splice(this.multiDevices.indexOf(item), 1);
    },
    //添加到设备列表
    addToMultiDevices() {
      console.log(this.deviceObj);
      if (
        this.deviceObj.DeviceClass === "灯光" ||
        this.deviceObj.DeviceClass === "风扇" ||
        this.deviceObj.DeviceClass === "插座"
      ) {
        this.deviceObj.DeviceProperty = [
          {
            AttributeName: "线序号",
            AttributeValue:
              this.deviceObj.lineNumber > 9
                ? this.deviceObj.lineNumber
                : "0" + this.deviceObj.lineNumber
          }
        ];
      } else {
        this.deviceObj.DeviceProperty = [];
      }
      let {
        AreaOfRoom,
        DeviceClass,
        DeviceName,
        Device_ID,
        LowerMachine_ID,
        OwinSHA,
        DeviceProperty
      } = this.deviceObj;
      let tmpObj = {
        AreaOfRoom,
        DeviceClass,
        DeviceName,
        Device_ID,
        LowerMachine_ID,
        OwinSHA,
        DeviceProperty
      };
      this.multiDevices.push(tmpObj);
      console.log(this.multiDevices);
    }
  }
  // computed: {
  //   roomTypeOptions() {
  //     let typeGroupRooms = _.groupBy(this.roomList,"RoomType");
  //     console.log("===", typeGroupRooms);
  //     return typeGroupRooms;
  //   }
  // }
};
</script>

<style lang="less" scoped>
.box-card {
  height: 99%;
}
.table-head {
  text-align: center;
}
.databox {
  width: 85%;
  margin: 0 auto;
}
.multi-rooms {
  display: flex;
  justify-content: space-between;
  .room-form {
    width: 50%;
  }
  .room-list-box {
    width: 30%;
    border: 2px solid #eee;
  }
}
.selsect-room-table {
  height: 150px;
  border: 1px solid #eee;
  padding: 10px;
  overflow: auto;
  margin-bottom: 5px;
}
.mac-box {
  height: 90px;
  border: 1px solid #eee;
  padding: 5px;
}
</style>