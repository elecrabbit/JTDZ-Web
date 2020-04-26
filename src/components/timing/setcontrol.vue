<template>
  <div class="config">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <div></div> -->
        <p class="roomlist">酒店房间列表</p>
        <div class="allbtn">
          <!-- <el-button size="mini">超小按钮</el-button> -->
          <el-button size="mini" @click="addconfiglist">单个增加房间</el-button>
          <el-button size="mini" @click="addroomlists">批量生成房间</el-button>
          <el-button size="mini" @click="addxwjlists">批量生成下位机</el-button>
          <el-button size="mini" @click="addsblists">批量生成设备</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" class="databox" @row-click="handle">
        <el-table-column label="酒店名称" width="250">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Hotel_Name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.Hotel_Builder }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="楼层">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.Hotel_Floor }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="ID号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.RoomID}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房间号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.RoomNUM}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房间类型">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.RoomType}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.stop="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 单个增加房间 -->
    <el-dialog title="单个增加加房间" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="form">
        <el-form-item label="酒店名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼号：" :label-width="formLabelWidth">
          <el-input v-model="form.building" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼层：" :label-width="formLabelWidth">
          <el-input v-model="form.floor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间号：" :label-width="formLabelWidth">
          <el-input v-model="form.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间类型：" :label-width="formLabelWidth">
          <el-input v-model="form.roomtype" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="singleaddroom">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量添加房间 -->
    <el-dialog title="批量生成房间" :visible.sync="dialogFormVisible2">
      <!-- 要添加的房间列表 -->
      <fieldset class="roombox">
        <legend class="roomNum">房间号</legend>
        <ul>
          <li
            v-for="(item,index) in roomlist"
            :key="index"
            @click="select($event,item)"
            class="liss"
          >{{item.RoomNUM}}房间</li>
        </ul>
      </fieldset>
      <!-- 添加房间 -->
      <div class="hotelmsg">
        <el-form :model="form">
          <el-form-item label="酒店名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="楼号：" :label-width="formLabelWidth">
            <el-input v-model="form.building" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="楼层：" :label-width="formLabelWidth">
            <el-input v-model="form.floor" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间类型：" :label-width="formLabelWidth">
            <el-input v-model="form.roomtype" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间号：" :label-width="formLabelWidth">
            <el-input v-model="form.roomNum" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="minbtn">
          <el-button size="mini" round @click="addroom">添加房间</el-button>
          <el-button size="mini" round @click="deleteroom">删除房间</el-button>
          <!-- <el-button size="mini" round @click="createroom">生成房间</el-button> -->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="createroom">生成房间</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 给选中的房间添加下位机 -->
    <el-dialog title="多房间添加下位机" :visible.sync="dialogFormVisible3" class="xwjtcbox">
      <!-- 多选所有房间 -->
      <fieldset class="allroom">
        <legend>房间号</legend>
        <div v-if="tableData3.length!=0">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedroom" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(item,index) in tableData3"
              :label="item"
              :key="index"
            >{{item.RoomNUM}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-else>所有的房间都有下位机，不能再添加了</div>
      </fieldset>
      <!-- 添加下位机 -->
      <div class="hotelmsg">
        <el-form :model="form">
          <el-form-item label="下位机IP：" :label-width="formLabelWidth">
            <el-input v-model="form.LowerMachine_IP" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="addxwj">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 批量添加设备 -->
    <el-dialog title="多房间添加设备" :visible.sync="dialogFormVisible4" class="sbbox">
      <!-- 多选所有房间 -->
      <fieldset class="allroom">
        <legend>房间号</legend>
        <div class="select">
          <!-- 选择房间类型 -->
          <div class="lefttype">
            <span>房间类型：</span>
            <select id="test" @click="selected">
              <option :value="index" v-for="(item,index) in roomTypes" :key="index">{{index}}</option>
            </select>
          </div>
          <!-- 同类型选择房间 -->
          <div class="rightroom">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="type_checkAll"
              @change="handleCheckAllChange2"
            >全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="type_checkedroom" @change="handleCheckedCitiesChange2">
              <el-checkbox
                v-for="(item,index) in tableData2"
                :label="item"
                :key="index"
              >{{item.RoomNUM}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </fieldset>
      <div class="selectedXwj">
        <el-checkbox-group v-model="checkedxwjlist" >
          <el-checkbox :label="item" v-for="(item,index) in type_checkedroom"
            :key="index">{{item.RoomNUM+" -- "+item.LowerMachine.LowerMachine_IP}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="xzsb">
        <el-form :model="form">
          <el-form-item label="设备类型：" :label-width="formLabelWidth">
            <el-radio-group v-model="radio" width="200">
              <el-radio label="灯光">灯光</el-radio>
              <el-radio label="风扇">风扇</el-radio>
              <el-radio label="插座">插座</el-radio>
              <el-radio label="温控器">温控器</el-radio>
              <el-radio label="电动卷帘">电动卷帘</el-radio>
              <el-radio label="门显">门显</el-radio>
              <el-radio label="磁性感应器">磁性感应器</el-radio>
              <el-radio label="取电开关">取电开关</el-radio>
              <el-radio label="紧急呼叫">紧急呼叫</el-radio>
              <el-radio label="预约服务">预约服务</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设备名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备位置：" :label-width="formLabelWidth">
            <el-input v-model="form.location" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址吗：" :label-width="formLabelWidth">
            <el-input v-model="form.OwinSHA" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="线序号："
            :label-width="formLabelWidth"
            v-if="radio=='灯光' || radio=='风扇' || radio=='插座'"
          >
            <el-input v-model="form.roomXxh" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="纱OR帘：" :label-width="formLabelWidth" v-if="radio=='电动卷帘'">
            <el-radio-group v-model="radio2">
              <el-radio label="窗帘">窗帘</el-radio>
              <el-radio label="窗纱">窗纱</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="bigbtn">
            <el-button @click="dialogFormVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="createsb">生成设备</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      tableData2: [],
      tableData3: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      form: {
        name: '',
        building: '',
        floor: '',
        RoomID: '',
        roomNum: '',
        roomtype: '',
        name2: '',
        location: '',
        OwinSHA: '',
        roomXxh: ''
      },
      num: '',
      roomID: '',
      formLabelWidth: '120px',
      portAddress: this.$store.state.portAddress,
      roomlist: [],
      deletelist: [],

      checkAll: false,
      checkedroom: [],
      isIndeterminate: true,
      checkedxwjlist: [],

      type_checkAll: false,
      roomTypes: {},
      type_checkedroom: [],
      radio: '灯光',
      radio2: '',
      addsbarr: [],
      addsblist: [],
      deletesblist: [],
      // checkList: []
    }
  },
  mounted() {
    console.log(this.tableData)
    this.roomlists();
  },
  computed: {
  },
  methods: {
    //点击行跳转页面
    handle(row) {
      console.log(row);
      this.changeroomID(row.RoomID);
      this.$router.push("/configDetail/" + row.RoomNUM);
    },
    //改变store中的ID
    changeroomID(val) {
      this.$store.commit("changeroomID", val);
    },
    //排序方法
    compare(property) {
      return function (a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        return value1 - value2;
      }
    },
    // 当localStorage中还未储存信息时应用此方法获取房间列表
    roomlists() {
      // console.log(this.room1);
      this.$axios
        .get(
          // './../../static/json/getRoomLisr.json'
          this.portAddress + "/api/home/GetAllRoomInfosNoDeviceInfo"
        )
        .then(res => {
          console.log(res.data)
          for (var i in res.data) {
            this.equipmentlist(res.data[i])
          }
          this.tableData = res.data;
          this.tableData.sort(this.compare('RoomNUM'))
          this.roomTypes = _.groupBy(res.data, "RoomType");
          console.log(this.roomTypes)
          this.tableData2 = this.roomTypes['标准间']
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 给房间添加下位机
    equipmentlist(data) {
      this.$axios
        .get(this.portAddress + "/api/home/GetDevice_InfoByRoomInfo?RoomNUM=" + data.RoomNUM)
        .then(res => {
          console.log(res.data);
          data.LowerMachine = res.data.LowerMachine;
          if (res.data.LowerMachine.LowerMachine_ID == null) {
            this.tableData3.push(data);
            this.tableData3.sort(this.compare('RoomNUM'))
          }
          this.$set(data, 'room', data.RoomNUM);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //增加单个房间
    addconfiglist() {
      this.dialogFormVisible = true;
      this.num = this.tableData.length + 1;
      console.log(this.num);
      console.log(this.from)
      this.form.name = '';
      this.form.building = '';
      this.form.floor = '';
      this.form.roomNum = '';
      this.form.roomtype = '';

    },
    //对房间进行编辑
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.num = index;
      this.roomID = row.RoomID
      this.form.name = '';
      this.form.building = '';
      this.form.floor = '';
      this.form.roomNum = '';
      this.form.roomtype = '';
    },
    //对房间进行删除
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.$axios
        .delete(this.portAddress + "/api/DataBase/DeleteRoomInfo?id=" + row.RoomID)
        .then(res => {
          console.log('成功')
          this.roomlists()
        })
        .catch(err => {
          console.log('失败');
        });
    },
    //增加和编辑中的确认生成新房间的方法
    singleaddroom() {
      this.dialogFormVisible = false;
      var nnn = this.tableData.length;
      var room;
      console.log(this.num);
      if (this.num <= nnn) {
        room = {
          Hotel_Builder: this.form.building,
          Hotel_Floor: this.form.floor,
          Hotel_Name: this.form.name,
          RoomNUM: this.form.roomNum,
          RoomID: this.roomID,
          RoomType: this.form.roomtype,
        }
        this.$axios
          .post(this.portAddress + "/api/DataBase/ModifyRoomInfo", room)
          .then(res => {
            console.log('成功')
            this.roomlists()
          })
          .catch(err => {
            console.log('失败');
          });
      } else {
        room = {
          Hotel_Builder: this.form.building,
          Hotel_Floor: this.form.floor,
          Hotel_Name: this.form.name,
          RoomNUM: this.form.roomNum,
          RoomType: this.form.roomtype,
        }
        this.tableData.push(room);
        this.$axios
          .put(this.portAddress + "/api/DataBase/PutRoomInfo", room)
          .then(res => {
            console.log('成功')
            this.roomlists()
          })
          .catch(err => {
            console.log('失败');
          });
      }
    },


    //批量增加多个房间
    addroomlists() {
      this.roomlists = []
      this.dialogFormVisible2 = true;
      this.form.name = '';
      this.form.building = '';
      this.form.floor = '';
      this.form.roomNum = '';
      this.form.roomtype = '';
    },
    //批量增加多个房间中的增加房间入列表
    addroom() {
      var room = {
        Hotel_Builder: this.form.building,
        Hotel_Floor: this.form.floor,
        Hotel_Name: this.form.name,
        RoomNUM: this.form.roomNum,
        RoomType: this.form.roomtype,
      }
      var bool = false
      if (this.roomlist.length > 0) {
        for (var i in this.roomlist) {
          if (this.roomlist[i].RoomNUM == room.RoomNUM) {
            bool = true
            alert('已经存在' + room.RoomNUM + '房间，不能再添加了')
            break
          }
        }
        if (!bool) {
          this.roomlist.push(room)
        }
      }
      else {
        this.roomlist.push(room)
      }

    },
    //批量增加多个房间中的删除房间列表
    deleteroom() {
      var newroomlist = []
      for (var i in this.roomlist) {
        for (var j in this.deletelist) {
          if (this.roomlist[i] == this.deletelist[j]) {
            this.roomlist.splice(i, 1);
          } else {
            var liss = $('.liss')
            for (var f in liss) {
              liss.eq(f).removeClass('lis')
            }
          }
        }
      }
    },
    //批量增加多个房间中的生成房间列表
    createroom() {
      this.dialogFormVisible2 = false;
      var bool = false
      if (this.tableData.length > 0) {
        for (var j in this.roomlist) {
          for (var i in this.tableData) {
            if (this.tableData[i].RoomNUM == this.roomlist[j].RoomNUM) {
              bool = true
              alert('已经存在' + this.roomlist[j].RoomNUM + '房间，不能再添加了')
              break
            }
          }
          if (!bool) {
            this.tableData.push(this.roomlist[j])
            this.$axios
              .put(this.portAddress + "/api/DataBase/PutRoomInfo", this.roomlist[j])
              .then(res => {
                console.log('成功')
                this.roomlists()
              })
              .catch(err => {
                console.log('失败');
              });
          }
        }
      }
      else {
        this.tableData = this.roomlist
        for (var g in this.roomlist) {
          this.$axios
            .put(this.portAddress + "/api/DataBase/PutRoomInfo", this.roomlist[g])
            .then(res => {
              console.log('成功')
              this.roomlists()
            })
            .catch(err => {
              console.log('失败');
            });
        }
      }
    },
    //批量增加多个房间中的选择要删除的房间
    select(e, item) {
      if ($(e.target).hasClass('lis')) {
        $(e.target).removeClass('lis');
        for (var i in this.deletelist) {
          if (this.deletelist[i] == item) {
            this.deletelist.splice(i, 1)
          }
        }
      }
      else {
        $(e.target).addClass('lis');
        this.deletelist.push(item);

      }
    },


    //批量给房间增加下位机方法
    addxwjlists() {
      this.dialogFormVisible3 = true;
    },
    //批量增加下位机中的确认生成下位机数据
    addxwj() {
      this.dialogFormVisible3 = false;
      console.log(this.checkedroom)

      for (var i in this.checkedroom) {
        var room = {
          RoomID: this.checkedroom[i].RoomID,
          LowerMachine_IP: this.form.LowerMachine_IP,
          LowerMachine_ID: this.LowerMachineID

        }
        this.checkedroom[i].LowerMachine = [];
        this.checkedroom[i].LowerMachine.push(room);
        this.$axios
          .put(this.portAddress + "/api/DataBase/PubLowerMachine", room)
          .then(res => {
            console.log('成功')
          })
          .catch(err => {
            console.log('失败');
          });
      }
      // this.tableData.push(room);

    },
    //批量增加下位机中的全选
    handleCheckAllChange(val) {
      console.log(val)
      this.checkedroom = val ? this.tableData : [];
      this.isIndeterminate = false;
    },
    //批量增加下位机中的单选
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
    },



    //批量增加设备
    addsblists() {
      this.dialogFormVisible4 = true;
    },
    //选择房间类型
    selected() {
      var myselect = document.getElementById("test");
      for (var k in this.roomTypes) {
        if (myselect.options[myselect.selectedIndex].value == k) {
          this.tableData2 = this.roomTypes[k];
        }
      }
    },
    //批量选择房间中的全选
    handleCheckAllChange2(val) {
      console.log(val)
      this.type_checkedroom = val ? this.tableData2 : [];
      this.isIndeterminate = false;
    },
    //批量选择房间中的单选
    handleCheckedCitiesChange2(value) {
      let checkedCount = value.length;
      this.type_checkAll = checkedCount === this.tableData2.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData2.length;
    },
    //批量增加设备确认方法
    createsb() {
       console.log(this.checkedxwjlist)
      this.dialogFormVisible4 = false;
      // console.log(this.type_checkedroom)
      // console.log(this.type_checkedroom)
      for (var i in this.checkedxwjlist) {
        if (this.radio == '灯光' || this.radio == '风扇' || this.radio == '插座') {
          var sb = {
            AreaOfRoom: this.form.location,
            DeviceClass: this.radio,
            DeviceName: this.form.name2,
            Device_ID: "",
            LowerMachine_ID: "",
            OwinSHA: this.form.OwinSHA,
            DeviceProperty: [{
              "AttributeName": "线序号",
              "AttributeValue": this.form.roomXxh
            }]
          }
        } else if (this.radio == '电动卷帘') {
          var sb = {
            AreaOfRoom: this.form.location,
            DeviceClass: this.radio,
            DeviceName: this.form.name2,
            Device_ID: "",
            LowerMachine_ID: "",
            OwinSHA: this.form.OwinSHA,
            DeviceProperty: [{
              "AttributeName": "纱OR帘",
              "AttributeValue": this.radio2
            },]
          }
        } else {
          var sb = {
            AreaOfRoom: this.form.location,
            DeviceClass: this.radio,
            DeviceName: this.form.name2,
            Device_ID: "",
            LowerMachine_ID: "",
            OwinSHA: this.form.OwinSHA,
            DeviceProperty: []
          }
        }
        var bool = false
        if (this.checkedxwjlist[i].LowerMachine.DeviceList != null) {
          for (var j in this.checkedxwjlist[i].LowerMachine.DeviceList) {
            if (this.checkedxwjlist[i].LowerMachine.DeviceList[j].AreaOfRoom == sb.AreaOfRoom && this.checkedxwjlist[i].LowerMachine.DeviceList[j].DeviceClass == sb.DeviceClass && this.checkedxwjlist[i].LowerMachine.DeviceList[j].DeviceName == sb.DeviceName && this.checkedxwjlist[i].LowerMachine.DeviceList[j].OwinSHA == sb.OwinSHA) {
              bool = true
              alert('已经存在该设备，不能再添加了')
              break
            }
          }
          if (!bool) {
            sb.LowerMachine_ID = this.checkedxwjlist[i].LowerMachine.LowerMachine_ID
            this.checkedxwjlist[i].LowerMachine.DeviceList.push(sb)
            this.$axios
              .put(this.portAddress + "/api/DataBase/InsertDeviceInfo", sb)
              .then(res => {
                console.log('成功')
              })
              .catch(err => {
                console.log('失败');
              });
          }
        }
        else {
          this.checkedxwjlist[i].LowerMachine.DeviceList = [];
          sb.LowerMachine_ID = this.checkedxwjlist[i].LowerMachine.LowerMachine_ID
          this.checkedxwjlist[i].LowerMachine.DeviceList.push(sb)
          this.$axios
            .put(this.portAddress + "/api/DataBase/InsertDeviceInfo", sb)
            .then(res => {
              console.log('成功')
            })
            .catch(err => {
              console.log('失败');
            });
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.config {
  .box-card {
    .clearfix {
      .roomlist {
        text-align: center;
        font-size: 25px;
        margin: 20px 20px;
      }
      .allbtn {
        text-align: center;
      }
    }
    .databox {
      margin: 0 auto;
    }
  }
  .form {
    width: 100%;
  }
  .dialog-footer {
    text-align: right;
  }

  /deep/ .el-dialog__body {
    display: flex;
    .roombox {
      border: 1px solid #ccc;
      width: 100px;
      .roomNum {
        margin: 0 10px;
      }
      ul {
        list-style: none;
        li {
          margin: 5px 10px;
        }
        .lis {
          color: red;
        }
      }
      // height: 200px;
    }
    .hotelmsg {
      flex: 1;
      border: 1px solid #ccc;
      margin-left: 10px;
      padding: 10px;
      .minbtn {
        margin: 10px 20px;
      }
      .bigbtn {
        margin: 0 10px;
      }
    }
  }

  /deep/.xwjtcbox {
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      .allroom {
        padding: 10px;
        border: 1px solid #ccc;
      }
      .hotelmsg {
        margin: 20px 0;
      }
    }
  }
  /deep/.sbbox {
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      .allroom {
        padding: 10px;
        border: 1px solid #ccc;
        .select {
          display: flex;
          .lefttype {
            display: flex;
            flex-direction: column;
            padding-right: 20px;
            border-right: 1px solid #ccc;
            line-height: 30px;
          }
          .rightroom {
            padding-left: 20px;
          }
        }
      }
      .hotelmsg {
        margin: 20px 0;
      }
    }
  }
  /deep/.selectedXwj {
    border: 1px solid #ccc;
    margin: 10px 0;
    padding: 5px 10px;
    min-height: 10px;
    max-height: 100px;
    overflow-y: scroll;
    .el-checkbox {
      width: 160px;
    }
    // ul {
    //   list-style: none;
    //   li {
    //     display: flex;
    //     line-height: 20px;
    //     padding-left: 10px;
    //     p {
    //       color: rgb(4, 0, 255);
    //     }
    //     div {
    //       margin: 0 10px;
    //       width: 100px;
    //     }
    //   }
    // }
  }
  /deep/ .xzsb {
    margin-top: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    .bigbtn {
      text-align: right;
      padding: 0 20px;
    }
    /deep/ .el-radio-group {
      line-height: 20px;
      .el-radio {
        width: 80px;
      }
    }
  }
}
</style>