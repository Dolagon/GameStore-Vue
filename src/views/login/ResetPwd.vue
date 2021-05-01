<template>
  <div class="popup">
    <van-nav-bar
        :fixed=true
        left-arrow
        @click-left="$router.go(-1)"
        :border=false
    ></van-nav-bar>
    <h3>重置密码</h3>
    <p>新密码</p>
    <input v-model="password" @click="active = 0" :class="{ active:active === 0 }" type="password">
    <p>确认密码</p>
    <input v-model="confirmPwd" @click="active = 1" :class="{ active:active === 1 }" type="password">

    <van-button :disabled="disabled" :class="{ btnActive:btnActive === 1 }" @click="complete">完成</van-button>
  </div>
</template>

<script>
import {Notify, Toast} from "vant";
import {changePwd} from "@/service/api";

export default {
  name: "ResetPwd",
  data() {
    return {
      active: 0,
      btnActive: 0,
      openBtn: {password: 0, confirmPwd: 0},
      disabled: true,

      password: '',
      confirmPwd: ''
    }
  },
  computed: {
    // 验证输入的密码是否相同
    verify() {
      return this.password === this.confirmPwd;
    }
  },
  methods: {
    changeBtnStyle() {
      if (this.openBtn.password !== 0 && this.openBtn.confirmPwd !== 0) {
        this.disabled = false;
        this.btnActive = 1;
      } else {
        this.disabled = true;
        this.btnActive = 0;
      }
    },
    async complete() {
      if (this.verify) {
        let result = await changePwd(this.$route.query.username, this.password);
        console.log(this.$route.query.username, this.password);
        console.log(result);
        if (result.success_code === 200) {
          Toast.success('修改成功');
          this.$router.push('/login');
        }
      } else {
        Notify({ type: 'danger', message: '两次输入密码不一致' });
      }
    }
  },
  watch: {
    password(val) {
      if (val) {
        this.openBtn.password = 1;
      } else {
        this.openBtn.password = 0;
      }
      this.changeBtnStyle();
    },
    confirmPwd(val) {
      if (val) {
        this.openBtn.confirmPwd = 1;
      } else {
        this.openBtn.confirmPwd = 0;
      }
      this.changeBtnStyle();
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
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
.get-verification {
  color: #a4a4a4;
}
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-code {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      border: none;
      background-color: transparent;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      font-size: 0.7rem;
    }
  }
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
  .van-button {
    background-color: #f1f1f1;
    border: none;
    width: 15.5rem;
    height: 2rem;
    border-radius: 0.2rem;
    color: #a4a4a4;
    margin-top: 1.5rem;
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