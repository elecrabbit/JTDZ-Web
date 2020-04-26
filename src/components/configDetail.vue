
<template>
  <div class="bigbox">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <el-button  @click="back"><i class="el-icon-arrow-left"></i>返回</el-button>
        <el-button  @click="addXwjlist" v-show="bool">增加下位机</el-button>
        <p class="roomNum">{{idn}} 房间下位机列表</p>
      </div>
      <el-table :data="tableData" class="dabox" height="650" @row-dblclick="handle">
        <el-table-column label="房间名称">
          <span>{{idn}}房间</span>
        </el-table-column>
        <el-table-column label="房间ID">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.RoomID}}</el-tag>
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
        <el-table-column label="下位机IP">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.LowerMachine_IP}}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="烧入日期">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.MarkDate}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="烧入版本">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.MarkVersion}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>

            <el-popover placement="top-end" width="160" v-model="scope.row.bool">
              <p>确定要删除该下位机信息吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.bool = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="handleDelete(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="下位机信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="下位机IP：" :label-width="formLabelWidth">
          <el-input v-model="form.LowerMachine_IP" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addXwj">确 定</el-button>
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
        LowerMachine_IP: '',
      },
      num: '',
      roomID: '',
      LowerMachineID: '',
      formLabelWidth: '100px',
      bool: false,
    }
  },
  mounted()  {
    this.xwjlist(this.idn);
    this.getroomID;
  },
  computed: {
    getroomID()    {
      this.roomID = this.$store.state.roomID
      console.log(this.roomID)
    }
  },
  methods: {
    back()    {
      this.$router.go(-1); //返回上一层
    },
    handle(row)    {
      console.log(row);
      this.changesblist(row.DeviceList);
      this.changesbroom(this.idn);
      this.$router.push("/eqlist/" + row.LowerMachine_ID);
    },
    changesblist(val)    {
      this.$store.commit("changesblist", val);
    },
    changesbroom(val)    {
      this.$store.commit("changesbroom", val);
    },
    handleEdit(index, row)    {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.num = index;
      this.LowerMachineID = row.LowerMachine_ID;
      this.form.LowerMachine_IP = row.LowerMachine_IP;
    },
    handleDelete(index, row)    {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.$axios
        .delete(this.portAddress + "/api/DataBase/DeleteLowerMachine?id=" + row.LowerMachine_ID)
        .then(res =>        {
          console.log('成功');
          this.xwjlist(this.idn);
        })
        .catch(err =>        {
          console.log('失败');
        });
    },
    xwjlist(id)    {
      this.$axios
        .get(this.portAddress + "/api/home/GetDevice_InfoByRoomInfo?RoomNUM=" + id)
        .then(res =>        {
          console.log(res.data.LowerMachine)
          if (res.data.LowerMachine.LowerMachine_ID == null)          {
            this.bool = true
          } else          {
            this.tableData.push(res.data.LowerMachine);
            this.bool = false
          }
        })
        .catch(err =>        {
          console.log(err);
        });
    },
    addXwjlist()    {
      this.dialogFormVisible = true;
      this.num = this.tableData.length + 1;
      this.form.LowerMachine_IP = '';
    },
    addXwj()    {
      this.dialogFormVisible = false;
      var nnn = this.tableData.length;
      var room
      if (this.num <= nnn)      {
        room = {
          RoomID: this.roomID,
          LowerMachine_IP: this.form.LowerMachine_IP,
          LowerMachine_ID: this.LowerMachineID
        }
        this.$axios
          .post(this.portAddress + "/api/DataBase/ModifyLowerMachine", room)
          .then(res =>          {
            console.log('成功')
            this.xwjlist(this.idn);
          })
          .catch(err =>          {
            console.log('失败');
          });
      } else      {
        room = {
          RoomID: this.roomID,
          LowerMachine_IP: this.form.LowerMachine_IP,
        }
        this.$axios
          .put(this.portAddress + "/api/DataBase/PubLowerMachine", room)
          .then(res =>          {
            console.log('成功')
            this.xwjlist(this.idn);
          })
          .catch(err =>          {
            console.log('失败');
          });
      }
    },
  }
}
</script>

<style lang="less" scoped>
.box-card1 {
  height: 100%;
  box-sizing: border-box;
}
.bigbox {
  position: relative;
  // text-align: center;
  .btn {
    margin: 10px;
    padding: 3px 10px;
  }
  .addbtn {
    background: rgb(7, 231, 247);
    position: absolute;
    left: 10px;
    top: 85px;
  }
  .roomNum {
    text-align: center;
    font-size: 25px;
    margin: 10px 0;
    color: blue;
  }
}
.dabox{
  width:85%;
  margin: 0 auto;
}
</style>