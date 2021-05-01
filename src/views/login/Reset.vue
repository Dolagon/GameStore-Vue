<template>
  <div class="popup">
    <van-nav-bar
        :fixed=true
        left-arrow
        @click-left="$router.go(-1)"
        :border=false
    ></van-nav-bar>
    <h3>恢复您的Game Store账号</h3>
    <p>用户名</p>
    <input v-model="username" @click="active = 0" :class="{ active:active === 0 }" type="text">
    <p>输入与账号绑定的手机号码</p>
    <div class="popup-code">
      <input v-model="phone" @click="active = 1" :class="{ active:active === 1 }" type="text">
      <button
          v-if="!countDown"
          class="get-verification"
          :class="{ phone_right: phoneRight }"
          @click.prevent="getVerifyCode()"
      >获取验证码</button>
      <button v-else disabled="disabled" class="get-verification">
        已发送({{ countDown }}s)
      </button>
    </div>
    <p>输入验证码</p>
    <input v-model="code" @click="active = 2" :class="{ active:active === 2 }" type="text">

    <van-popup v-model="showCode" position="top" :style="{ height: '10%' }">
      <span>验证码: {{ display_code }}</span>
      <button
          class="copy-btn"
          v-clipboard:copy="display_code"
          v-clipboard:success="onCopy"
          @click="showCode = false"
      >复制</button>
    </van-popup>


    <van-button :disabled="disabled" :class="{ btnActive:btnActive === 1 }" @click="nextPage(username)">继续</van-button>
  </div>
</template>

<script>
import {getPhoneCode, verifyPhone, verifyCode} from "@/service/api";
import {Notify, Toast} from "vant";

export default {
  name: "Reset",
  data() {
    return {
      active: 0,
      btnActive: 0,
      openBtn: {user: 0, phone: 0, code: 0},
      disabled: true,
      countDown: 0, // 倒计时
      showCode: false,

      username: '',
      phone: '',
      display_code: 0,
      code: ''
    }
  },
  computed: {
    // 验证手机号码是否正确
    phoneRight() {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  },
  methods: {
    changeBtnStyle() {
      if (this.openBtn.user !== 0 && this.openBtn.phone !== 0 && this.openBtn.code !== 0) {
        this.disabled = false;
        this.btnActive = 1;
      } else {
        this.disabled = true;
        this.btnActive = 0;
      }
    },
    async getVerifyCode() {
      if (this.phoneRight) {
        let result = await verifyPhone(this.username, this.phone);
        console.log(result);
        if (result.success_code === 200) {
          this.countDown = 60;
          let timer = setInterval(() => {
            this.countDown--;
            if (this.countDown === 0) {
              clearInterval(timer);
            }
          }, 1000);
          // 获取短信验证码
          let resultCode = await getPhoneCode(this.phone);
          console.log(resultCode);
          if (resultCode.success_code === 200) {
            this.display_code  = resultCode.code;
            this.showCode = true;
          }
        } else {
          Notify({ type: 'danger', message: result.message });
          this.phone = '';
        }
      }
    },
    // 复制成功时的回调函数
    onCopy() {
      Toast('内容已复制到剪切板');
    },
    async nextPage(username) {
      let result = await verifyCode(this.phone, this.code);
      console.log(result);
      if (result.success_code === 200) {
        this.$router.push({
          path: '/resetPwd',
          query: {
            username: username
          }
        });
      } else {
        Notify({ type: 'danger', message: result.message });
      }
    }
  },
  watch: {
    username(val) {
      if (val) {
        this.openBtn.user = 1;
      } else {
        this.openBtn.user = 0;
      }
      this.changeBtnStyle();
    },
    phone(val) {
      if (val) {
        this.openBtn.phone = 1;
      } else {
        this.openBtn.phone = 0;
      }
      this.changeBtnStyle();
    },
    code(val) {
      if (val) {
        this.openBtn.code = 1;
      } else {
        this.openBtn.code = 0;
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

// 设置弹出层样式
.van-popup {
  display: flex;
  justify-content: center;
  align-items: center;
}
.copy-btn {
  margin-left: 1rem;
  width: 3rem;
  text-align: center;
  border: 1px solid black;
  border-radius: 0.4rem;
  background-color: black;
  color: #fff;
  display: inline-block;
}
.copy-btn:hover {
  background-color: #fff;
  color: black;
}

.active {
  background-color: #fff;
  border: 1.5px solid #a163f7;
}
.get-verification {
  color: #a4a4a4;
}
.phone_right {
  color: #a163f7;
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