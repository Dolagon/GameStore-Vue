<template>
  <div class="container">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <transition enter-active-class="animated animate__bounceInDown" leave-active-class="animated animate__bounceOutUp">
      <div v-if="show_img" class="container-logo">
        <p>欢迎使用 Game Store</p>
      </div>
    </transition>
    <van-button class="container-signIn" @click="show = true">登陆</van-button>
    <van-button class="container-signUp" @click="show2 = true">注册</van-button>
    <van-popup
        v-model="show"
        close-icon="close"
        closeable
        position="bottom"
        :style="{ height: '100%' }"
        class="popup"
    >
      <SignIn @signIn="signIn"></SignIn>
    </van-popup>
    <van-popup
        v-model="show2"
        close-icon="close"
        closeable
        position="bottom"
        :style="{ height: '100%' }"
        class="popup"
    >
      <SignUp @signUp="signUp"></SignUp>
    </van-popup>
    <vue-particles
        class="particles"
        color="#45e3ff"
        :particleOpacity="0.8"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#45e3ff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
    >
    </vue-particles>
  </div>
</template>

<script>
import animatex from 'animate.css';  // eslint-disable-line no-unused-vars
import SignIn from "@/views/login/SignIn";
import SignUp from "@/views/login/SignUp";

export default {
  name: "Login",
  // mixins: [preventBack],  // 主面板禁止返回
  components: {
    SignIn,
    SignUp
  },
  data() {
    return {
      show: false,
      show2: false,
      show_img: true,

      value: '',
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.log(from.name);
    if (from.name === 'reset') window.loginPage = true;
    else window.loginPage = false;
    next();
  },
  mounted() {
    this.goLogin();
    if (window.loginPage) this.show = true;
  },
  methods: {
    signUp() {
      this.show2 = false;
    },
    signIn() {
      this.show = false;
    },
    goLogin() {
      if (this.$route.path !== '/login') {
        this.$router.push('/login');
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.show_img = false;
      } else {
        this.show_img = true;
      }
    },
    show2(val) {
      if (val) {
        this.show_img = false;
      } else {
        this.show_img = true;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.particles {
  height: 100%;
}
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  //background-image: url(images/02.jpg) ;
  background-color: #fff;
  background-attachment:fixed;
  background-repeat:no-repeat;
  background-size:cover;
  -moz-background-size:cover;
  -webkit-background-size:cover;
  &-logo {
    position: absolute;
    width: 100%;
    height: 6rem;
    top: 40%;
    text-align: center;
    p {
      font-family:"Microsoft YaHei";
      color: black;
      font-size: 1.4rem;
    }
  }
  &-title {
    position: absolute;
    width: 7rem;
    height: 6rem;
    left: 34%; top: 5%;
    text-align: center;
    color: white;
  }
  &-signIn {
    position: absolute; left: 50%; top: 53%;
    transform: translate(-50%, -50%);
    background-color: #a163f7;
    border: none;
    height: 2rem;
    width: 15rem;
    border-radius: 0.4rem;
    color: #fff;
  }
  &-signUp {
    position: absolute; left: 50%; top: 61%;
    transform: translate(-50%, -50%);
    background-color: #e5e5e5;
    border: none;
    height: 2rem;
    width: 15rem;
    border-radius: 0.4rem;
    color: #000158;
  }
}
.van-field {
  width: 15rem;
}
</style>
