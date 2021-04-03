<template>
  <div class="container">
    <el-row>
      <el-col :span="12" class="left">
        <div class="left-text">
          <p>Game Store</p>
          <p>Bring you Explore The World</p>
          <p><a href="#" style="color: white">Term & Conditions</a></p>
        </div>
      </el-col>

      <el-col :span="12" class="right">
        <div class="right-main">

          <el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
            <div class="right-main-form">
              <p>Login</p>
              <p>Please enter your username(admin) and password(123)</p>
              <el-form-item prop="user_name" style="margin-top: 30px;">
                <el-input placeholder="username" type="text" v-model="ruleForm.user_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item prop="user_pwd">
                <el-input @keyup.enter.native="submitForm('ruleForm')" placeholder="password" type="password" v-model="ruleForm.user_pwd" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
              </el-form-item>
              <a href="#" id="form-a1">Forget user_pwd</a>
              <a href="#" id="form-a2">Register Account</a>
            </div>
          </el-form>

        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { adminLogin } from "@/service/api";

export default {
  name: "AdminLogin",
  data() {
    return {
      ruleForm: {
        user_name: '',
        user_pwd: ''
      }
    };
  },
  methods: {
    goAdminDashBoard(data) {
      this.$router.push({
        path: '/admin',
        query: {
          data: data
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (this.ruleForm.user_name === '' || this.ruleForm.user_pwd === '') {
          this.$alert('用户名或密码不能为空！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        } else if (valid) {
          let result = await adminLogin(this.ruleForm.user_name, this.ruleForm.user_pwd);
          if (result.success_code === 200) {
            window.adminLogin = true;
            alert('Welcom Back !');
            this.goAdminDashBoard(result.data);
          } else if (result.err_code === 0) {
            this.$alert(result.message, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #7043ff;
  background-image: linear-gradient(90deg, #7043ff 0%, #00c0e9 100%);
}
.left {
  margin-top: 20%;
  display: flex;
  justify-content: center;
  color: white;
  p:nth-child(1) {
    font-size: 40px;
    font-weight: bold;
  }
  p:nth-child(2) {
    font-size: 40px;
  }
  p:nth-child(3) {
    margin-top: 20px;
  }
}

.right {
  margin-top: 8%;
  display: flex;
  justify-content: center;
  &-main {
    background-color: #fff;
    width: 443px;
    height: 607.4px;
    align-items: center;
    display: flex;
    justify-content: center;
    position: absolute;
    box-shadow: #035c98 0 0 20px;
    &-form {
      width: 350px;
      height: 500px;
      align-items: center;
      p:nth-child(1) {
        font-size: 30px;
        font-weight: bold;
      }
      p:nth-child(2) {
        color: #aaaaaa;
      }
      .el-button {
        margin-top: 140px;
        width: 100%;
        border: none;
        background-color: #80b9d0;
        background-image: linear-gradient(90deg, #80b9d0 0%, #00e974 100%);
      }
      .el-button:hover {
        opacity: 0.7;
      }
      #form-a1 {
        color: #aaaaaa;
      }
      #form-a2 {
        color: deepskyblue;
        float: right;
      }
      #form-a2:hover {
        color: #0093E9;
      }
    }
  }
}
@media (max-width: 1366px) and (max-height: 768px) {
  .right {
    margin-top: 0;
  }
}
</style>