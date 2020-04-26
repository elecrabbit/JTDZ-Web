
<template>
  <div>
    <!-- <p v-show="false" class="getMsg">{{getMsg}}</p> -->
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span class="title">问题房间</span>
        <div>
          <el-button size="mini" @click="yicom" class="bt">已处理</el-button>
          <el-button size="mini" @click="weicom" class="bt">未处理</el-button>
          <el-button size="mini" @click="allcom" class="bt">全部</el-button>
        </div>
      </div>
      <div class="content">
        <div v-show="active1">
          <template>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="RoomNUM" label="房间号" width="100"></el-table-column>
              <el-table-column prop="Description" label="问题类型"></el-table-column>
              <el-table-column prop="SolutionProject" label="解决方式"></el-table-column>
              <el-table-column prop="SolutionEngineer" label="工程师姓名" width="150"></el-table-column>
              <el-table-column prop="ReportTime" label="上报时间" width="180"></el-table-column>
              <el-table-column prop="SolutionTime" label="解决时间" width="180"></el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">处理</el-button>

                  <el-popover placement="top-end" width="160" v-model="scope.row.bool">
                    <p>确定要删除该房间信息吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.bool = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
                    </div>
                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                  </el-popover>
                  <!-- <el-button size="mini" type="danger" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div v-show="active2">
          <template>
            <el-table :data="tableData2" style="width: 100%">
              <el-table-column prop="RoomNUM" label="房间号" width="200"></el-table-column>
              <el-table-column prop="Description" label="问题类型"></el-table-column>
              <el-table-column prop="ReportTime" label="上报时间" width="250"></el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">处理</el-button>
                  <el-button size="mini" type="danger" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div v-show="active3">
          <template>
            <el-table :data="tableData3" style="width: 100%">
              <el-table-column prop="RoomNUM" label="房间号" width="150"></el-table-column>
              <el-table-column prop="Description" label="问题类型"></el-table-column>
              <el-table-column prop="SolutionProject" label="解决方式"></el-table-column>
              <el-table-column prop="SolutionEngineer" label="工程师姓名" width="150"></el-table-column>
              <el-table-column prop="SolutionTime" label="解决时间" width="150"></el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">处理</el-button>
                  <el-button size="mini" type="danger" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <el-button size="small" @click="addproblemroom" class="addbtn">增加问题房间</el-button>
      </div>
    </el-card>
    <el-dialog title="增加问题房间" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="form">
        <el-form-item label="房间号：" :label-width="formLabelWidth">
          <el-input v-model="form.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述：" :label-width="formLabelWidth">
          <el-input v-model="form.problemtype" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addproblemroom2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑问题房间" :visible.sync="dialogFormVisible2">
      <el-form :model="form" class="form">
        <el-form-item label="房间号：" :label-width="formLabelWidth">
          <el-input v-model="form.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述：" :label-width="formLabelWidth">
          <el-input v-model="form.problemtype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="处理方式：" :label-width="formLabelWidth">
          <el-input v-model="form.SolutionProject" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工程师姓名：" :label-width="formLabelWidth">
          <el-input v-model="form.SolutionEngineer" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      tableData: [],
      tableData2: [],
      tableData3: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: '120px',
      client: this.$store.state.client,
      jdNameUP_TO_UP: "UP_TO_UP/河南阿宝蜀黍的酒店/AlarmReport",
      // jdNameUP_TO_LOW: "UP_TO_UP/河南阿宝蜀黍的酒店/AlarmReport",
      portAddress: this.$store.state.portAddress,
      form: {
        id: '',
        roomNum: '',
        problemtype: '',
        SolutionProject: '',
        SolutionEngineer: ''
      },
      nowdata: '',
      active1: true,
      active2: false,
      active3: false,
      userrank: this.$store.state.userrank,
    }
  },
  mounted()  {
    this.geterrorlist()

  },
  created()  {
    this.getMqtt()
  },
  methods: {
    getMqtt()    {
      // var pic = this.jdNameLOW_TO_UP 
      this.client.subscribe(this.jdNameUP_TO_UP, { qos: 1 }, (error) =>      {
        if (!error)        {
          console.log('订阅成功')
        } else        {
          console.log('订阅失败')
        }
      })
      // console.log(this.userrank)
      // if (this.userrank == '工程部')      {
      //   // 接收消息处理
      //   this.client.on('message', (topic, message) =>        {
      //     console.log('收到来自', topic, '的消息', message.toString())
      //     this.msg = JSON.parse(message.toString())
      //     console.log(this.msg)
      //     if (this.msg.type == 'problem')          {
      //       this.$notify({
      //         title: '维修',
      //         message: this.msg.RoomNUM + '房间有维修处理，请尽快解决',
      //         duration: 0,
      //         type: 'warning'
      //       });
      //     }
      //   })

      // }


    },



    geterrorlist()    {
      this.$axios
        .get(
          this.portAddress + "/api/FaultReport/GetAllFault")
        .then(res =>        {
          console.log(res.data)
          this.tableData = res.data
          for (var i in res.data)          {
            this.$set(res.data[i], "bool", false);
            if (res.data[i].SolutionEngineer == '')            {
              this.tableData2.push(res.data[i])
            } else            {
              this.tableData3.push(res.data[i])
            }
          }

        });
    },
    allcom()    {
      this.active1 = true;
      this.active2 = false;
      this.active3 = false;
    },
    yicom()    {
      this.active1 = false;
      this.active2 = false;
      this.active3 = true;
    },
    weicom()    {
      this.active1 = false;
      this.active2 = true;
      this.active3 = false;
    },
    addproblemroom()    {
      this.dialogFormVisible = true;
      this.form.roomNum = '';
      this.form.problemtype = '';
    },
    getdata()    {
      var data = Date.parse(new Date());
      var date = new Date(data);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      var hh = "0" + date.getHours();
      var mm = "0" + date.getMinutes();
      var ss = "0" + date.getSeconds();
      this.nowdata = y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + ' ' + hh.substring(hh.length - 2, hh.length) + ":" + mm.substring(mm.length - 2, mm.length) + ":" + ss.substring(ss.length - 2, ss.length);
    },
    addproblemroom2()    {
      this.dialogFormVisible = false;
      this.getdata()
      this.$axios
        .put(
          this.portAddress + "/api/FaultReport/FaultTriggerReport", {
          "RoomNUM": this.form.roomNum,
          "Description": this.form.problemtype,
          "ReportTime": this.nowdata,
        })
        .then(res =>        {
          console.log('成功')
          this.geterrorlist()
          var payload = {
            "type": "problem",
            "RoomNUM": this.form.roomNum,
            "Description": this.form.problemtype,
            "ReportTime": this.nowdata,
          }
          console.log(payload)
          this.client.publish(this.jdNameUP_TO_UP, JSON.stringify(payload));
          this.$store.commit("changemqttroom2", this.form.roomNum);
        });
    },
    handleEdit(index, row)    {
      this.dialogFormVisible2 = true;
      this.form.id = row.ID;
      this.form.roomNum = row.RoomNUM
      this.form.problemtype = row.Description
      this.form.SolutionProject = ''
      this.form.SolutionEngineer = ''
    },
    handleEdit2()    {
      this.dialogFormVisible2 = false;
      this.getdata()
      this.$axios
        .post(
          this.portAddress + "/api/FaultReport/FaultDealWith", {
          "ID": this.form.id,
          "SolutionEngineer": this.form.SolutionEngineer,
          "SolutionProject": this.form.SolutionProject,
          "SolutionTime": this.nowdata,
        })
        .then(res =>        {
          console.log('成功')
          this.geterrorlist()
        });
    },
    handleDelete(index, row)    {
      this.$axios
        .delete(
          this.portAddress + "/api/FaultReport/FaultDelete?id=" + row.ID)
        .then(res =>        {
          console.log('成功')
          this.geterrorlist()
        });
    },
  }

}
</script>

<style lang="less" scoped>
.el-card {
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  .clearfix {
    display: flex;
    justify-content: space-between;
    .title {
      color: rgb(245, 46, 20);
      font-size: 25px;
      // font-weight: 600;
    }
    .bt {
      background: rgb(21, 174, 245);
      color: #fff;
    }
  }
  .content {
    // margin:10px;
    position: relative;
    padding-bottom: 50px;
    .addbtn {
      background: rgb(5, 105, 151);
      position: absolute;
      bottom: 0px;
      right: 10px;
      color: #fff;
    }
  }
}
</style>