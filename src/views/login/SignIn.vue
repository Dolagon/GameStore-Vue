<template>
  <div class="popup">
    <h3>登陆</h3>
    <p>用户名</p>
    <input v-model="loginUsername" @click="active = 0" :class="{ active:active === 0 }" type="text">
    <p>密码</p>
    <section class="passwordInput">
      <input v-model="loginPassword" @click="active = 1" class="signIn-password" :class="{ active:active === 1 }" :type="inputType">
      <div @click="changeShowPwd" class="switch-img">
        <img v-if="showPwd" src="./images/open.png" width="20">
        <img v-else src="./images/close.png" width="20">
      </div>
    </section>
    <p @click="warning">登陆时遇到问题？</p>
    <van-button :disabled="disabled" :class="{btnActive:btnActive === 1}" @click="signIn">登陆</van-button>
  </div>
</template>

<script>
import {pwdLogin} from "@/service/api";
import {mapActions} from 'vuex';
import {Notify} from 'vant';

export default {
  name: "SignIn",
  data() {
    return {
      active: 0,
      btnActive: 0,
      disabled: true,
      openBtn: {user: 0, pwd: 0},
      showPwd: true,
      inputType: 'password',

      loginUsername: '',
      loginPassword: '',
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
  methods: {
    ...mapActions(['syncUserInfo']),
    goBack(){
      this.$emit('signIn');
    },
    async signIn() {
      let result = await pwdLogin(this.loginUsername, this.loginPassword);
      console.log(result);
      if (result.success_code === 200) {
        // 保存用户信息到本地 异步用 actions
        this.syncUserInfo(result.data);
        this.$router.push('/');
        sessionStorage.setItem('tabBarActiveIndex', 0);
        Notify({ type: 'success', message: '登陆成功' });
      } else {
        console.log(result);
        Notify({ type: 'danger', message: result.message });
      }

    },
    changeBtnStyle() {
      if (this.openBtn.user !== 0 && this.openBtn.pwd !== 0) {
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
    },
    warning() {
      Notify({ type: 'warning', message: '未开通此项功能' });
    }
  },
  watch: {
    loginPassword(val) {
      if (val) {
        this.openBtn.pwd = 1;
      } else {
        this.openBtn.pwd = 0;
      }
      this.changeBtnStyle();
    },
    loginUsername(val) {
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
  p:nth-child(6) {
    color: #a163f7;
    font-size: 0.7rem;
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