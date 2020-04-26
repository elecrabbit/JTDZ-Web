
<template>
  <div class="bigbox">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <el-button @click="back"><i class="el-icon-arrow-left"></i>返回</el-button>
        <el-button @click="addEquipmentlist">增加设备</el-button>
        <p class="roomNum">{{room}}房间设备列表</p>
      </div>
      <div class="eqlist">
        <el-table :data="tableData" class="dabox" height="650">
          <el-table-column label="设备类型" style="padding-left: 30px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.DeviceClass}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.DeviceName}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设备位置">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.AreaOfRoom}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="下位机ID">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.LowerMachine_ID}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设备ID">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.Device_ID}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址吗">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.OwinSHA}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="线序号">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper" v-for="(item,index) in scope.row.DeviceProperty" :key="index">
                <el-tag size="medium" v-if="item.AttributeName=='线序号'">{{ item.AttributeValue}}</el-tag>
                <!-- <el-tag size="medium" v-else-if="item.AttributeName=='纱OR帘'">{{ item.AttributeValue}}</el-tag> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-popover placement="top-end" width="160" v-model="scope.row.bool">
                <p>确定要删除该设备信息吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.bool = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popover>
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="设备信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="设备类型：" :label-width="formLabelWidth">
          <el-radio-group v-model="radio" width="200" @change='selectequipment(radio)'>
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
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备位置：" :label-width="formLabelWidth">
          <el-input v-model="form.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址码：" :label-width="formLabelWidth">
          <el-input placeholder="7A.74.01.01." v-model="form.OwinSHA" :disabled="true">
          </el-input>
          <el-radio-group v-model="num2" class='radio_group'>
            <el-radio :label="item" v-for='(item,index) in dzma' :key='index' class='radio_'>{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="线序号：" :label-width="formLabelWidth" v-if="radio=='灯光' || radio=='风扇' || radio=='插座'">
          <el-input-number v-model="num4" controls-position="right" :min="0" :max="20"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      idn: this.$route.params.id,
      portAddress: this.$store.state.portAddress,
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: '',
        location: '',
        OwinSHA: '7A.74.01.01.',
        roomStatus: '',
        roomXxh: ''
      },
      num: '',
      equipmentID: '',
      formLabelWidth: '120px',
      room: this.$store.state.sbroom,
      radio: '',
      radio2: 0,
      num2: '',
      num4: '',
      dzma: []
    }
  },
  mounted()  {
    this.getsblist();
    console.log(this.room)
  },
  computed: {

  },
  methods: {
    back()    {
      this.$router.go(-1); //返回上一层
    },
    getsblist()    {
      this.room = this.$store.state.sbroom;
      this.$axios
        .get(this.portAddress + "/api/home/GetDevice_InfoByRoomInfo_Storage?RoomNUM=" + this.room)
        .then(res =>        {
          console.log(res)
          this.tableData = res.data.LowerMachine.DeviceList;
          for (var i in this.tableData)          {
            this.getstatus(this.tableData[i].DeviceName, this.tableData[i].AreaOfRoom, this.tableData[i])
          }
          // for (var i in res.data.LowerMachine) {
          //   if (res.data.LowerMachine[i].LowerMachine_ID == this.idn) {
          //     if (this.tableData != null) {
          //     } else {
          //       this.tableData = []
          //     }
          //   }
          // }
        })
        .catch(err =>        {
          console.log(err);
        });
    },
    handleEdit(index, row)    {
      console.log(index, row);
      console.log(row.DeviceClass);
      if (row.DeviceClass == '灯光' || row.DeviceClass == '风扇' || row.DeviceClass == '插座')      {
        this.dzma = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C', '1D', '1E', '1F']
      } else if (row.DeviceClass == '温控器')      {
        this.dzma = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', '3E', '3F']
      } else if (row.DeviceClass == '电动卷帘')      {
        this.dzma = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '2C', '2D', '2E', '2F']
      } else if (row.DeviceClass == '门显')      {
        this.dzma = ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7A', '7B', '7C', '7D', '7E', '7F']
      } else if (row.DeviceClass == '磁性感应器')      {
        this.dzma = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF']
      } else if (row.DeviceClass == '取电开关')      {
        this.dzma = ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8A', '8B', '8C', '8D', '8E', '8F']
      } else if (row.DeviceClass == '紧急呼叫')      {
        this.dzma = ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9A', '9B', '9C', '9D', '9E', '9F']
      } else if (row.DeviceClass == '预约服务')      {
        this.dzma = ['D0']
      }
      this.dialogFormVisible = true;
      this.equipmentID = row.Device_ID;
      this.num = index;
      this.form.name = row.DeviceName;
      this.form.location = row.AreaOfRoom;
      this.form.OwinSHA = row.OwinSHA.slice(0, 12);
      // this.form.roomXxh = '';
      this.radio = row.DeviceClass;
      this.num2 = row.OwinSHA.slice(12, 14)
      console.log(this.num2);
      for (var i in row.DeviceProperty)      {
        if (row.DeviceProperty[i].AttributeName == "线序号")        {
          this.num4 = row.DeviceProperty[i].AttributeValue
        }
      }
      // this.num4=
    },
    handleDelete(index, row)    {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.$axios
        .delete(this.portAddress + "/api/DataBase/DeleteDeviceInfo?id=" + row.Device_ID)
        .then(res =>        {
          console.log('成功')
          this.getsblist();
        })
        .catch(err =>        {
          console.log('失败');
        });
    },
    addEquipmentlist()    {
      this.dialogFormVisible = true;
      this.num = this.tableData.length + 1;
      this.form.name = '';
      this.form.location = '';
      // this.form.OwinSHA = '';
      this.form.roomXxh = '';
      this.radio2 = '';
    },
    selectequipment(val)    {
      console.log(val)
      if (val == '灯光' || val == '风扇' || val == '插座')      {
        this.dzma = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C', '1D', '1E', '1F']
      } else if (val == '温控器')      {
        this.dzma = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', '3E', '3F']
      } else if (val == '电动卷帘')      {
        this.dzma = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '2C', '2D', '2E', '2F']
      } else if (val == '门显')      {
        this.dzma = ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7A', '7B', '7C', '7D', '7E', '7F']
      } else if (val == '磁性感应器')      {
        this.dzma = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF']
      } else if (val == '取电开关')      {
        this.dzma = ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8A', '8B', '8C', '8D', '8E', '8F']
      } else if (val == '紧急呼叫')      {
        this.dzma = ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9A', '9B', '9C', '9D', '9E', '9F']
      } else if (val == '预约服务')      {
        this.dzma = ['D0']
      }
    },
    addEquipment()    {
      let room
      console.log(this.form.OwinSHA)
      var num3, num5
      if (this.num2 < 10)      {
        num3 = "0" + this.num2
      } else      {
        num3 = this.num2
      }
      if (this.num4 < 10)      {
        num5 = "0" + this.num4
      } else      {
        num5 = this.num4
      }
      console.log(this.equipmentID)
      this.dialogFormVisible = false;
      var tablength = this.tableData.length;
      if (this.radio == '灯光' || this.radio == '风扇' || this.radio == '插座')      {
        room = {
          AreaOfRoom: this.form.location,
          DeviceClass: this.radio,
          DeviceName: this.form.name,
          Device_ID: this.equipmentID,
          LowerMachine_ID: this.idn,
          OwinSHA: this.form.OwinSHA + num3,
          DeviceProperty: [{
            "AttributeName": "线序号",
            "AttributeValue": num5
          }]
        }
      } else
      {
        room = {
          AreaOfRoom: this.form.location,
          DeviceClass: this.radio,
          DeviceName: this.form.name,
          Device_ID: this.equipmentID,
          LowerMachine_ID: this.idn,
          OwinSHA: this.form.OwinSHA + num3,
          DeviceProperty: []
        }
      }
      console.log(room)
      if (this.num <= tablength)
      {
        this.$axios
          .post(this.portAddress + "/api/DataBase/ModifyDeviceInfo", room)
          .then(res =>          {
            console.log('成功')
            this.getsblist();
          })
          .catch(err =>          {
            console.log('失败');
          });
      } else      {
        this.tableData.push(room);
        this.$axios
          .put(this.portAddress + "/api/DataBase/InsertDeviceInfo", room)
          .then(res =>          {
            console.log('成功')
            this.getsblist();
          })
          .catch(err =>          {
            console.log('失败');
          });
      }
    },
    getstatus(name, location, arr)    {
      this.$axios
        .get(
          // './../../static/json/1001lwj.json')
          this.portAddress + "/api/home/GetAllDeviceStatusByRoom?RoomNUM=" + this.room)
        .then(res =>        {
          // console.log(res)
          for (var i in res.data.DeviceList)          {
            if (
              res.data.DeviceList[i].DeviceName == name &&
              res.data.DeviceList[i].AreaOfRoom == location
            )            {
              this.$set(arr, "DeviceProperty", res.data.DeviceList[i].DeviceProperty);
              // console.log(arr)
            }
          }
        });
    }
  }
}
</script>

<style lang="less" scoped>
.dabox{
  width: 85%;
  margin: 0 auto;
}
.bigbox {
  position: relative;
  .box-card1 {
    background: #fff;
    .clearfix {
      img {
        width: 40px;
      }
      .btn {
        background: #fff;
        padding: 3px 10px;
      }

      .roomNum {
        text-align: center;
        font-size: 25px;
        margin: 10px 0;
        color: rgb(50, 50, 233);
      }
    }
  }
  .eqlist {
    margin: 10px;
  }
  .radio_group {
    // border: 1px solid rgb(230, 227, 227);
    padding: 8px 10px 0;
    border-radius: 5px;
    margin: 10px 0 0;
    .radio_ {
      width: 20px !important;
      color: rgb(145, 142, 142);
    }
  }
}

/deep/ .el-radio {
  line-height: 2;
}
</style>