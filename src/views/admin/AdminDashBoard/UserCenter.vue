<template>
  <div class="container">
    <div class="container-header">
      <h2>用户中心</h2>
    </div>

    <!-- 管理员信息 -->
    <el-row>
      <el-col :span="2"><div class="container-main"></div></el-col>
      <el-col :span="20">
        <div class="container-main bg-main">
          <div class="container-main-message">
            <p>账号信息</p>
            <p>用户名</p>
            <p>{{ admin_data.user_name }}</p>
            <p>邮箱</p>
            <p v-if="admin_data.e_mail">{{ admin_data.e_mail }}</p>
            <p v-else>1048790189@qq.com</p>
          </div>
          <div class="container-main-btn">
            <div @click="delUser" class="container-main-btn-del"><img src="../images/forbid.png"></div>
            <span>注销账户</span>
          </div>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-main"></div></el-col>
    </el-row>

    <!-- 管理员列表 -->
    <el-row>
      <el-col :span="2"><div class="container-table"></div></el-col>
      <el-col :span="10">
        <div class="container-table-list bg-table">
          <h3>管理员列表</h3>
          <table>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
            </tr>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.user_name }}</td>
              <td v-if="item.e_mail">{{ item.e_mail }}</td>
              <td v-else>1048790189@qq.com</td>
            </tr>
          </table>
        </div>
      </el-col>
      <el-col :span="1"><div class="container-table"></div></el-col>
      <el-col :span="9">
        <div class="container-table-add bg-table">
          <h3>添加管理员</h3>
          <div class="container-table-add-admin">
            <div @click="submitForm('numberValidateForm')" class="container-table-add-admin-btn"><img src="../images/add.png"></div>
          </div>
          <!-- 添加用户表单 -->
          <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="1rem" class="demo-ruleForm">
            <el-form-item prop="user_name">
              <el-input placeholder="用户名" v-model.number="numberValidateForm.user_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="user_pwd">
              <el-input placeholder="密码" type="password" v-model.number="numberValidateForm.user_pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="e_mail">
              <el-input placeholder="邮箱" type="text" v-model.number="numberValidateForm.e_mail" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-table"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import animate from 'animate.css';
import md5 from 'blueimp-md5';
import { addAdmin, delAdmin, getAdminList } from "@/service/api";

export default {
  name: "UserCenter",
  components: {
  },
  props: {
    addUser: Function,
    admin_data: Object
  },
  data() {
    return {
      tableData: [],
      temp: animate,
      numberValidateForm: {
        user_name: '',
        user_pwd: '',
        e_mail: ''
      }
    }
  },
  created() {
    this.loadAdminList();
  },
  methods: {
    // 获取管理员列表
    async loadAdminList() {
      let result = await getAdminList();
      this.tableData = result.data;
    },
    // 删除管理员
    delUser() {
      this.$confirm('此操作将永久删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delAdmin(this.admin_data._id, this.admin_data.user_name);
        if (result.status === 200) {
          this.$message({
            type: 'success',
            message: '账号已注销!'
          });
          setTimeout(() => {
            this.$router.push('/adminLogin');
          }, 1500);
        } else if (result.err_code === 0) {
          this.$alert(result.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加管理员
    async submitForm(formName) {
      if (this.tableData.length === 5) {
        this.$alert('管理员已达上限', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      } else if (this.numberValidateForm.user_name === '' || this.numberValidateForm.user_pwd === '') {
        this.$alert('用户名或密码不能为空！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      } else {
        let result = await addAdmin(
            this.numberValidateForm.user_name,
            md5(this.numberValidateForm.user_pwd),
            this.numberValidateForm.e_mail
        );
        if (result.err_code === 0) {  // 用户名重复
          this.$alert(result.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        } else if (result.success_code === 200) {  // 添加管理员成功
          this.$alert('添加管理员成功', '提示', {
            confirmButtonText: '确定',
          }).then(() => {
            this.$refs[formName].resetFields();
            this.loadAdminList();
          });
        } else if (result.status === 500) {
          this.$confirm(result.result, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            this.$refs[formName].resetFields();
          });
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.container {
  color: #0f4b69;
  &-header {
    width: 100%;
    height: 150px;
    background-color: #b8dcff;
    background-image: linear-gradient(62deg, #b8dcff 0%, #00ffff 100%);
    box-shadow: #7c7c7c 0 0 5px;
    h2 {
      color: #fff;
      line-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-main {
    margin-top: -30px;
    border-radius: 10px;
    height: 200px;
    min-height: 36px;
    &-message {
      margin-left: 30px;
      margin-top: 30px;
      float: left;
      p:nth-child(1) {
        font-size: 20px;
        margin-bottom: 0.3rem;
      }
    }
    &-btn {
      margin-right: 30px;
      margin-top: 30px;
      float: right;
      span {
        line-height: 60px;
        margin-right: 1rem;
      }
      &-del {
        float: right;
        width: 60px;
        height: 60px;
        background-color: red;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s linear;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, .15), 1px 2px 3px 1px rgba(0, 0, 0, .15);
        img {
          width: 30px;
          height: 30px;
          position: relative;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &-del:hover {
        border-radius: 10px;
        transition: border-radius 0.2s;
      }
    }
  }
  &-table {
    margin-top: 30px;
    border-radius: 10px;
    min-height: 36px;
    &-list {
      height: 400px;
      box-shadow: #cacaca 0 0 10px;
      border-radius: 10px;
      h3 {
        margin-left: 30px;
        margin-top: 30px;
        padding-top: 30px;
      }
      table {
        width: 100%;
        margin-top: 20px;
        text-align: center;
      }
      th {
        border: none;
        text-align: center;
        border-bottom: 1px solid #e8e8e8;
      }
      td {
        border: none;
        border-bottom: 1px solid #e8e8e8;
      }
    }
    &-add {
      height: 400px;
      box-shadow: #cacaca 0 0 10px;
      border-radius: 10px;
      h3 {
        margin-left: 30px;
        padding-top: 30px;
        margin-top: 30px;
      }
      &-admin {
        float: right;
        height: 60px;
        width: 2rem;
        margin-right: 30px;
        margin-top: -50px;
        &-btn {
          float: right;
          width: 60px;
          height: 60px;
          background-color: blue;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s linear;
          box-shadow: 1px 2px 3px rgba(0, 0, 0, .15), 1px 2px 3px 1px rgba(0, 0, 0, .15);
          img {
            width: 30px;
            height: 30px;
            position: relative;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &-btn:hover {
          border-radius: 10px;
          transition: border-radius 0.2s;
        }
      }
      .demo-ruleForm {
        position: relative; left: 40%; top: 35%;
        transform: translate(-50%, -50%);
        width: 90%;
      }
    }

  }
}

.bg-main {
  background-color: #fff;
  box-shadow: #cacaca 0 0 10px;
}
.bg-table {
  background-color: #fff;
  box-shadow: #cacaca 0 0 10px;
}
.el-header, .el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}
.el-header {
  padding-top: 20px;
}
@media (max-width: 768px) {
  span {
    visibility:hidden
  }
}
@media (max-width: 1366px) and (max-height: 768px) {
  .container {
  }
}
</style>