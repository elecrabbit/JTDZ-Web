
<template>
  <div>
    <!-- <p v-show="false" class="getMsg">{{getMsg}}</p> -->
    <el-card class="card-box">
      <div slot="header" class="card-head">
        <h2>问题房间</h2>
      </div>
      <div class="tables">
        <div>
          <el-button size="small" @click="searchSOS" type="warning" plain>查询SOS记录</el-button>
          <el-button size="small" @click="addproblemroom" type="primary" plain>增加问题房间</el-button>
          <el-button size="small" @click="allcom" type="primary" plain>全部问题房间</el-button>
          <el-button size="small" @click="yicom" type="info" plain>已处理问题房间</el-button>
          <el-button size="small" @click="weicom" type="danger" plain>未处理问题房间</el-button>
        </div>
        <div v-show="active1">
          <el-table :data="tableData" height="650">
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
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleDelete(scope.$index, scope.row)"
                    >确定</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="danger">删除</el-button>
                </el-popover>
                <!-- <el-button size="mini" type="danger" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="active2">
          <el-table :data="tableData2" height="650">
            <el-table-column prop="RoomNUM" label="房间号" width="200"></el-table-column>
            <el-table-column prop="Description" label="问题类型"></el-table-column>
            <el-table-column prop="ReportTime" label="上报时间" width="250"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">处理</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="active3">
          <el-table :data="tableData3" height="650">
            <el-table-column prop="RoomNUM" label="房间号" width="150"></el-table-column>
            <el-table-column prop="Description" label="问题类型"></el-table-column>
            <el-table-column prop="SolutionProject" label="解决方式"></el-table-column>
            <el-table-column prop="SolutionEngineer" label="工程师姓名" width="150"></el-table-column>
            <el-table-column prop="SolutionTime" label="解决时间" width="150"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">处理</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="showSOS">
          <el-table :data="sosList" height="650" stripe>
            <el-table-column prop="roomNum"  label="房间" ></el-table-column>
            <el-table-column prop="RecordTime" label="时间" ></el-table-column>
            <el-table-column prop="SOSStatus" label="状态" sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog title="查询SOS记录" :visible.sync="searchForm">
      <el-form :model="sosForm">
        <el-form-item label="房间号：" :label-width="formLabelWidth">
          <el-input v-model="sosForm.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间段：" :label-width="formLabelWidth">
          <el-date-picker
            v-model="sosForm.pickTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:MM:SS"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="searchForm = false">取 消</el-button>
        <el-button type="primary" @click="subSOS">确 定</el-button>
      </div>
    </el-dialog>
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
  data() {
    return {
      tableData: [],
      tableData2: [],
      tableData3: [],
      sosList:[],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      searchForm: false,
      formLabelWidth: "120px",
      client: this.$store.state.client,
      jdNameUP_TO_UP:
        "UP_TO_UP/" + globalSetting.mqttTopic + "/" + "AlarmReport",
      portAddress: this.$store.state.portAddress,
      form: {
        id: "",
        roomNum: "",
        problemtype: "",
        SolutionProject: "",
        SolutionEngineer: ""
      },
      sosForm: {
        roomNum: "",
        pickTime: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      currentTime: "",
      active1: true,
      active2: false,
      active3: false,
      showSOS:false,
      userrank: this.$store.state.userrank
    };
  },
  mounted() {
    this.getMqtt();
    this.geterrorlist();
  },
  methods: {
    getMqtt() {
      this.client.subscribe(this.jdNameUP_TO_UP, { qos: 1 }, error => {
        if (!error) {
          console.log("订阅成功");
        } else {
          console.log("订阅失败");
        }
      });
    },
    geterrorlist() {
      this.$axios
        .get(this.portAddress + "/api/FaultReport/GetAllFault")
        .then(res => {
          console.log(res.data);
          this.tableData = res.data;
          for (var i in res.data) {
            this.$set(res.data[i], "bool", false);
            if (res.data[i].SolutionEngineer == "") {
              this.tableData2.push(res.data[i]);
            } else {
              this.tableData3.push(res.data[i]);
            }
          }
        });
    },
    allcom() {
      this.active1 = true;
      this.active2 = false;
      this.active3 = false;
      this.showSOS = false;
    },
    yicom() {
      this.active1 = false;
      this.active2 = false;
      this.active3 = true;
      this.showSOS = false;
    },
    weicom() {
      this.active1 = false;
      this.active2 = true;
      this.active3 = false;
      this.showSOS = false;
    },
    addproblemroom() {
      this.dialogFormVisible = true;
      this.form.roomNum = "";
      this.form.problemtype = "";
    },
    searchSOS() {
      this.searchForm = true;
    },
    subSOS() {
      console.log(this.sosForm);
      if(this.sosForm.roomNum && this.sosForm.pickTime.length>0){
        this.$axios
        .get(this.portAddress
          + "/api/home/GetSOSRecordDetailByRoom?RoomNUM="
          +this.sosForm.roomNum
          +"&StartTime="
          +this.sosForm.pickTime[0]
          +"&EndTime="
          +this.sosForm.pickTime[1])
        .then(res=>{
          if(res.data.length){
            this.active1 = false;
            this.active2 = false;
            this.active3 = false;
            this.searchForm = false;
            this.showSOS = true;
            this.sosList = res.data;
            this.sosList.forEach(item =>{
              item.roomNum = this.sosForm.roomNum;
            })
            console.log(this.sosList);
          }else{
            this.$message({
              message:'未查询到记录',
              type:'warning'
            })
          }
        }).catch(e=>{
          this.searchForm = false;
          this.$message({
              message:'网络错误:'+e,
              type:'warning'
            })
        });
      }else{
        this.$message({
          message:'请输入完整信息',
          type:'warning'
        })
      }

    },
    formatTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const formatNumber = n => {
        n = n.toString();
        return n[1] ? n : "0" + n;
      };
      this.currentTime =
        [year, month, day].map(formatNumber).join("-") +
        " " +
        [hour, minute, second].map(formatNumber).join(":");
    },
    addproblemroom2() {
      this.dialogFormVisible = false;
      this.formatTime();
      this.$axios
        .put(this.portAddress + "/api/FaultReport/FaultTriggerReport", {
          RoomNUM: this.form.roomNum,
          Description: this.form.problemtype,
          ReportTime: this.currentTime
        })
        .then(res => {
          console.log("成功");
          this.geterrorlist();
          var payload = {
            type: "problem",
            RoomNUM: this.form.roomNum,
            Description: this.form.problemtype,
            ReportTime: this.currentTime
          };
          console.log(payload);
          this.client.publish(this.jdNameUP_TO_UP, JSON.stringify(payload));
          this.$store.commit("changemqttroom2", this.form.roomNum);
        });
    },
    handleEdit(index, row) {
      this.dialogFormVisible2 = true;
      this.form.id = row.ID;
      this.form.roomNum = row.RoomNUM;
      this.form.problemtype = row.Description;
      this.form.SolutionProject = "";
      this.form.SolutionEngineer = "";
    },
    handleEdit2() {
      this.dialogFormVisible2 = false;
      this.formatTime();
      this.$axios
        .post(this.portAddress + "/api/FaultReport/FaultDealWith", {
          ID: this.form.id,
          SolutionEngineer: this.form.SolutionEngineer,
          SolutionProject: this.form.SolutionProject,
          SolutionTime: this.currentTime
        })
        .then(res => {
          console.log("成功");
          this.geterrorlist();
        });
    },
    handleDelete(index, row) {
      this.$axios
        .delete(this.portAddress + "/api/FaultReport/FaultDelete?id=" + row.ID)
        .then(res => {
          console.log("成功");
          this.geterrorlist();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.card-box {
  height: 100%;
  .card-head {
    width: 80%;
    margin: 0 auto;
  }
  .tables {
    width: 80%;
    margin: 0 auto;
  }
}
</style>