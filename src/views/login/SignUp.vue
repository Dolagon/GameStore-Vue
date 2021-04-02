<template>
  <div class="popup">

    <h3>注册</h3>
    <p>用户名</p>
    <input v-model="SignUpUsername" @click="active = 0" :class="{ active:active === 0 }" type="text">
    <p>手机号码</p>
    <input v-model="phoneNum" @click="active = 1" :class="{ active:active === 1 }" type="text">
    <p>密码</p>
    <section class="passwordInput">
      <input v-model="SignUpPassword" @click="active = 2" class="signIn-password" :class="{ active:active === 2 }" :type="inputType">
      <div @click="changeShowPwd" class="switch-img">
        <img v-if="showPwd" src="./images/open.png" width="20">
        <img v-else src="./images/close.png" width="20">
      </div>
    </section>
    <p>点击"注册"即表示阅读并同意<a>服务条款</a>和<a>隐私声明</a></p>
    <van-button :disabled="disabled" :class="{btnActive:btnActive === 1}" @click="signUp">注册</van-button>
  </div>
</template>

<script>
import {userSingUp} from "@/service/api";
import {Toast} from 'vant';
import {Notify} from 'vant';

export default {
  name: "SignIn",
  data() {
    return {
      active: 0,
      btnActive: 0,
      disabled: true,
      openBtn: {phone: 0, user: 0, pwd: 0},
      showPwd: true,
      inputType: 'password',

      phoneNum: '',
      SignUpUsername: '',
      SignUpPassword: '',
    }
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  },
  computed: {
    // 验证手机号码是否正确
    phoneRight() {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNum)
    },
    usernameRight() {
      return /^[a-zA-Z0-9_-]{4,16}$/.test(this.SignUpUsername)
    }
  },
  methods: {
    goBack(){
      this.$emit('signUp');
    },
    async signUp() {
      if (this.usernameRight) {
        if (this.phoneRight) {
          let result = await userSingUp(this.SignUpUsername, this.SignUpPassword, this.phoneNum);
          if (result.success_code === 200) {
            Toast.success('注册成功');
            this.$emit('signUp');
          } else {
            Notify({ type: 'danger', message: result.message });
          }
        } else {
          Notify({ type: 'danger', message: '请输入正确的手机号码' });
        }
      } else {
        Notify({ type: 'danger', message: '用户名格式不正确' });
      }
    },
    changeBtnStyle() {
      if (this.openBtn.user !== 0 && this.openBtn.pwd !== 0 && this.openBtn.phone !== 0) {
        this.disabled = false;
        this.btnActive = 1;
      } else {
        this.disabled = true;
        this.btnActive = 0;
      }
    },
    changeShowPwd() {
      this.showPwd = !this.showPwd;
      if (this.showPwd) {
        this.inputType = 'password';
      } else {
        this.inputType = 'text';
      }
    }
  },
  watch: {
    phoneNum(val) {
      if (val) {
        this.openBtn.phone = 1;
      } else {
        this.openBtn.phone = 0;
      }
      this.changeBtnStyle();
    },
    SignUpPassword(val) {
      if (val) {
        this.openBtn.pwd = 1;
      } else {
        this.openBtn.pwd = 0;
      }
      this.changeBtnStyle();
    },
    SignUpUsername(val) {
      if (val) {
        this.openBtn.user = 1;
      } else {
        this.openBtn.user = 0;
      }
      this.changeBtnStyle();
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 13.5rem;
  border-radius: 0.2rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: 1.5px solid #fff;
}
.active {
  background-color: #fff;
  border: 1.5px solid #a163f7;
}
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    margin-top: 2rem;
    width: 15.5rem;
    text-align: left;
    padding-bottom: 1rem;
  }
  p {
    width: 15.5rem;
    text-align: left;
    margin-top: 0.7rem;
    margin-bottom: 0.2rem;
  }
  p:nth-child(8) {
    font-size: 0.6rem;
    a {
      color: #a163f7;
    }
  }
  .van-button {
    background-color: #f1f1f1;
    border: none;
    width: 15.5rem;
    height: 2rem;
    border-radius: 0.2rem;
    color: #a4a4a4;
  }
  .passwordInput {
    position: relative;
  }
  .switch-img {
    position: absolute;
    right: 10px;
    top: 0.8rem;
    opacity: 0.5;
  }
  .btnActive {
    background-color: #a163f7;
    color: #fff;
  }
}
</style>