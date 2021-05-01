<template>
  <div id="main">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <van-nav-bar
        left-text="首页"
        class="nav-title"
        :fixed=true
        @click-left="temp"
    >
      <van-icon @click="goSearch(true)" name="search" slot="right"></van-icon>
    </van-nav-bar>

    <div v-if="showLoading" class="container" :class="{ active:active === 1 }">
      <van-pull-refresh :disabled="disabled"  v-model="loadingRefresh" @refresh="onRefresh">
        <!-- 轮播图 -->
        <Swiper :sowing_list="sowing_list"></Swiper>
        <!-- 折扣 -->
        <Discount @goDetail="goDetail" :discount_list="discount_list"></Discount>
        <!-- 热门 -->
        <HotProduct @goSpecial="goSpecial"></HotProduct>
        <!-- 剧情 -->
        <DomProduct @goScene="goScene"></DomProduct>
        <!-- 新作 -->
        <NewProduct @goDetail="goDetail" :new_list="new_list"></NewProduct>
        <!-- Cyberpunk -->
        <img id="cyberpunk" src="./components/images/Cyberpunk.png" alt="">
        <!-- 国产 -->
        <StateProduct @goDetail="goDetail" :state_list="state_list"></StateProduct>
        <!-- 返回顶部 -->
        <transition leave-active-class="animated animate__bounceOut">
          <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
        </transition>
      </van-pull-refresh>
    </div>

    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>

    <transition name="router-slider" mode="out-in">
      <Search v-if="showSearch" @goSearch="goSearch"></Search>
      <Special v-if="showSpecial" @goSpecial="goSpecial"></Special>
      <Scene v-if="showScene" @goScene="goScene"></Scene>
    </transition>
  </div>
</template>

<script>
// 引入组件
import Swiper from '@/views/home/components/Swiper';
import Discount from "@/views/home/components/Discount";
import NewProduct from "@/views/home/components/NewProduct";
import HotProduct from "@/views/home/components/HotProduct";
import DomProduct from "@/views/home/components/DomProduct";
import StateProduct from "@/views/home/components/StateProduct";
import MarkPage from "@/views/home/components/MarkPage";
import Special from "@/views/special/Special";
import Scene from "@/views/special/Scene";

import Search from "@/views/search/Search";

import animatex from 'animate.css';  // eslint-disable-line no-unused-vars
import {getProductByType, getSowingList} from "@/service/api";
import {showBack, animate} from "@/config/global";  // eslint-disable-line no-unused-vars
import preventBack from 'vue-prevent-browser-back';
import {Toast} from "vant";

export default {
  name: "Home",
  mixins: [preventBack],  // 主面板取消返回
  components: {
    Swiper,
    Discount,
    NewProduct,
    HotProduct,
    DomProduct,
    StateProduct,
    Search,
    Special,
    Scene,
    MarkPage
  },
  data() {
    return {
      // 是否显示Loading加载图标
      active: null,
      showLoading: false,
      showSearch: false,
      showSpecial: false,
      showScene: false,
      load_status: {sowing: 0, discount: 0, newProduct: 0, stateProduct: 0},

      sowing_list: [],
      discount_list: [],
      new_list: [],
      state_list: [],

      showBackStatus: false,  // 显示返回顶部按钮
      disabled: false,  // 禁用下拉刷新
      loadingRefresh: false  // 下拉刷新
    }
  },
  mounted() {
    this.loadSowing();
    this.loadDiscount();
    this.loadNewProduct();
    this.loadStateProduct();
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'detail') window.fromDetail = true;
    else window.fromDetail = false;
    next();
  },
  methods: {
    temp() {
      console.log(this.disabled)
    },
    async loadSowing() {
      let result = await getSowingList();
      if (result.success_code === 200) {
        this.sowing_list = result.data;
        this.load_status.sowing = 1;
        this.changeLoad();
      } else {
        console.log(result);
      }
    },
    async loadDiscount() {
      let result = await getProductByType(1);
      if (result.success_code === 200) {
        this.discount_list = result.data;
        this.load_status.discount = 1;
        this.changeLoad();
      } else {
        console.log(result);
      }
    },
    async loadNewProduct() {
      let result = await getProductByType(4)
      if (result.success_code === 200) {
        this.new_list = result.data;
        this.load_status.newProduct = 1;
        this.changeLoad();
      } else {
        console.log(result);
      }
    },
    async loadStateProduct() {
      let result = await getProductByType(3)
      if (result.success_code === 200) {
        this.state_list = result.data;
        this.load_status.stateProduct = 1;
        this.changeLoad();
      } else {
        console.log(result);
      }
    },
    // 重新加载数据
    onRefresh() {
      setTimeout(() => {
        this.loadingRefresh = false;
        Toast('刷新成功');
      }, 1000);
    },
    goSpecial(args) {
      window.fromDetail = false;
      // 将所选商品id传递给详情页
      if (args) {
        this.stop();
        this.showSpecial = true;
      } else {
        this.move();
        this.showSpecial = false;
      }
    },
    goScene(args) {
      window.fromDetail = false;
      if (args) {
        this.stop();
        this.showScene = true;
      } else {
        this.move();
        this.showScene = false;
      }
    },
    goDetail(id) {
      // 将所选商品id传递给详情页
      this.$router.push({
        // path: '/dashboard/home/detailHome',
        path: '/dashboard/detail',
        query: {
          id: id
        }
      });
    },
    scrollToTop(ms = 400) {
      let docB;
      if (document.documentElement.scrollTop) {
        docB = document.documentElement;
        // 400ms内滚到顶部 scrollTop 顶部距离0
        animate(docB, {scrollTop: 0}, ms, 'ease-out');
      } else if (document.body.scrollTop) {
        docB = document.body;
        animate(docB, {scrollTop: 0}, ms, 'ease-out');
      }
    },
    changeLoad() {
      for (let key in this.load_status) {
        if (this.load_status[key] !== 1) {
          return false;
        }
      }
      this.showLoading = true;
      // 显示顶部按钮并禁止下拉刷新
      showBack(status => {
        if (status) {
          this.showBackStatus = true;
          this.disabled = true;
        } else {
          this.showBackStatus = false;
          this.disabled = false;
        }
      });
    },
    //禁止滚动
    stop(){
      let mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.addEventListener("touchmove",mo,false); //禁止页面滑动
    },
    // 取消滑动限制
    move() {
      let mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = '';  //出现滚动条
      document.removeEventListener("touchmove",mo,false);
    },
    goSearch(args) {
      window.fromDetail = false;
      if (args) {
        this.stop();
        this.showSearch = true;
      } else {
        this.move();
        this.showSearch = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  display: none;
}
::v-deep .van-nav-bar__text {
  color: black;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.router-slider-enter-active, .router-slider-leave-active {
  will-change: transform;
  transition: all 0.5s;
  position: absolute;
}
.router-slider-enter, .router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
#cyberpunk {
  width: 94%;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
  border-radius: 0.4rem;
  margin: 0.5rem 0;
}
.nav-title {
  box-shadow: #cacaca 0 0 2px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100!important;
}
</style>