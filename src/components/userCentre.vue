
<template>
  <div class="userCentre">
    <el-button type="primary" class="head" @click="toAddUser">添加用户</el-button>
    <template>
      <el-table :data="tableData"  style="width: 70%;margin:5px auto;" height="650">
        <el-table-column prop="UserName" label="用户名"></el-table-column>
        <el-table-column prop="UserID" label="用户ID"></el-table-column>
        <!-- <el-table-column prop="UserPassWord" label="用户密码" ></el-table-column> -->
        <el-table-column prop="Department" label="所属部门"></el-table-column>
        <el-table-column prop="Department" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible2">
      <el-form class="form">
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="telephone1" autocomplete="off" :disabled="bool"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" :label-width="formLabelWidth">
          <el-input v-model="password1" autocomplete="off" show-password :disabled="bool"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth">
          <el-input v-model="password2" autocomplete="off" show-password :disabled="bool"></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" :label-width="formLabelWidth">
          <el-input v-model="usertype" autocomplete="off" :disabled="bool"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form class="form">
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="telephone1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" :label-width="formLabelWidth">
          <el-input v-model="password1" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth">
          <el-input v-model="password2" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" :label-width="formLabelWidth">
          <!-- <el-input v-model="usertype" autocomplete="off"></el-input> -->
          <el-radio-group v-model="usertype">
            <el-radio label="超级管理员">超级管理员</el-radio>
            <el-radio label="管理员">管理员</el-radio>
            <el-radio label="前台">前台</el-radio>
            <el-radio label="工程部">工程部</el-radio>
            <el-radio label="客房部">客房部</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      tableData: [],
      portAddress: this.$store.state.portAddress,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: "120px",
      telephone1: "",
      password1: "",
      password2: "",
      usertype: "",
      userID: "",
      bool: false,
      userrank: this.$store.state.userrank
    };
  },
  mounted()  {
    this.getUserCentre();
  },
  watch: {
    tableData: {
      handler(val, oldVal)      {
        // console.log(val, oldVal);//但是这两个值打印出来却都是一样的
        this.tableData = val;
      },
      deep: true
    }
  },
  methods: {
    getUserCentre()    {
      this.$axios
        .get(this.portAddress + "/api/User/GetAllUser")
        .then(res =>        {
          console.log(res.data);
          this.tableData = JSON.parse(res.data);
        })
        .catch(err =>        {
          console.log("失败");
        });
    },
    toAddUser()    {
      this.dialogFormVisible = true;
      this.telephone1 = "";
      this.password1 = "";
      this.password2 = "";
      this.usertype = "";
    },
    addUser()    {
      var user = {
        UserName: this.telephone1,
        UserPassWord: this.password1,
        Department: this.usertype
      };
      console.log(this.userrank)
      this.dialogFormVisible = false;
      if (this.telephone1 == '' || this.password1 == '' || this.usertype == '')
      {
        this.$message({
          message: "用户名、密码、用户类型不能为空，请重新输入",
          type: "warning"
        })
      }
      else
      {
        // var isSuperAdmin = false;
        // var isNomalAdmin = false;
        var isExist = false;

        for (var i in this.tableData)
        {
          if (this.tableData[i].UserName == this.telephone1)
          {

            isExist = true;

            this.$message({
              message: "用户名已存在，请重新输入用户名",
              type: "warning"
            });
            break
          }
          else          {
            continue;
          }
        }

        if (!isExist)
        {
          if (this.userrank == "超级管理员")
          {
            this.$axios

              .put(this.portAddress + "/api/User/PutUserInfo", user)
              .then(res =>              {
                console.log("成功");
                this.getUserCentre();
              })
              .catch(err =>              {
                console.log("失败");
              });
          }
          else if (this.userrank == "管理员")
          {
            if (this.usertype == '超级管理员')
            {
              this.$message({
                message: "由于权限限制，你不能添加超级管理员",
                type: "warning"
              });
            }
            else
            {
              this.$axios
                .put(this.portAddress + "/api/User/PutUserInfo", user)
                .then(res =>                {
                  console.log("成功");
                  this.getUserCentre();
                })
                .catch(err =>                {
                  console.log("失败");
                });
            }
          }
          else
          {
            this.$message({
              message: "由于权限限制，你不能添加用户，如果需要，请找管理员",
              type: "warning"
            });
          }

        }
      }
    },

    handleEdit(index, row)    {
      console.log(this.userrank);
      if (row.Department == "超级管理员")      {
        if (this.userrank == "超级管理员")        {
          this.bool = false;
        } else        {
          this.bool = true;
        }
      }
      console.log(row);
      this.dialogFormVisible2 = true;
      this.telephone1 = row.UserName;
      this.password1 = "";
      this.password2 = "";
      this.usertype = row.Department;
      this.userID = row.UserID;
    },
    quxiao()    {
      this.dialogFormVisible2 = false;
      this.bool = false;
    },
    editUser()    {
      this.bool = false;
      this.dialogFormVisible2 = false;
      var user = {
        UserName: this.telephone1,
        UserID: this.userID,
        UserPassWord: this.password1,
        Department: this.usertype
      };
      this.$axios
        .post(this.portAddress + "/api/User/ModifyUserInfo", user)
        .then(res =>        {
          console.log("成功");
          this.getUserCentre();
        })
        .catch(err =>        {
          console.log("失败");
        });
    },
    handleDelete(index, row)    {
         this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (row.Department == "超级管理员")      {
            if (this.userrank == "超级管理员")        {
              console.log(this.userrank, row);
              this.tableData.splice(index, 1);
              this.$axios
                .delete(this.portAddress + "/api/User/DeleteUser?id=" + row.UserID)
                .then(res =>            {
                  console.log("成功");
                  this.getUserCentre();
                })
                .catch(err =>            {
                  console.log("失败");
                });
            } else        {
              this.$message({
                message: "由于权限限制，你不能删除超级管理员",
                type: "warning"
              });
            }
          } else      {
            this.tableData.splice(index, 1);
            this.$axios
              .delete(this.portAddress + "/api/User/DeleteUser?id=" + row.UserID)
              .then(res =>          {
                console.log("成功");
                this.getUserCentre();
              })
              .catch(err =>          {
                console.log("失败");
              });
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

    }
  }
};
</script>

<style lang="less" scoped>
.userCentre {
  .head {
    margin: 30px 0 5px 10px;
  }
}
</style>