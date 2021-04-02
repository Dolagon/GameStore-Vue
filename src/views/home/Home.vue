<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <van-nav-bar
        left-text="首页"
        style="box-shadow: #cacaca 0 0 2px;"
        class="nav-title"
        :fixed=true
    >
      <van-icon @click="$router.push('/search')" name="search" slot="right"></van-icon>
    </van-nav-bar>

    <div v-if="showLoading" class="container">
      <!-- 轮播图 -->
      <Swiper :sowing_list="sowing_list">></Swiper>
      <!-- 折扣 -->
      <Discount @goDetail="goDetail" :discount_list="discount_list"></Discount>
      <!-- 热门 -->
      <HotProduct @goSpecial="goSpecial"></HotProduct>
      <!-- 剧情 -->
      <DomProduct @goSpecial="goSpecial"></DomProduct>
      <!-- 新作 -->
      <NewProduct @goDetail="goDetail" :new_list="new_list"></NewProduct>
      <!-- 国产 -->
      <StateProduct @goDetail="goDetail" :state_list="state_list"></StateProduct>
      <!-- 返回顶部 -->
      <transition enter-active-class="animated animate__bounceIn" leave-active-class="animated animate__bounceOut">
        <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
      </transition>
    </div>

    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>
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

import animatex from 'animate.css';  // eslint-disable-line no-unused-vars
import {getProductByType, getSowingList} from "@/service/api";
import {showBack, animate} from "@/config/global";  // eslint-disable-line no-unused-vars
import preventBack from 'vue-prevent-browser-back';

export default {
  name: "Home",
  mixins: [preventBack],  // 主面板进制返回
  components: {
    Swiper,
    Discount,
    NewProduct,
    HotProduct,
    DomProduct,
    StateProduct,
    MarkPage
  },
  data() {
    return {
      // 是否显示Loading加载图标
      showLoading: false,
      sowing_list: [],
      discount_list: [],
      new_list: [],
      state_list: [],

      showBackStatus: false,  // 显示返回顶部按钮
    }
  },
  mounted() {
    this.loadSowing();
    this.loadDiscount();
    this.loadNewProduct();
    this.loadStateProduct();
  },
  methods: {
    async loadSowing() {
      let result = await getSowingList();
      if (result.success_code === 200) {
        this.sowing_list = result.data;
      } else {
        console.log(result);
      }
    },
    async loadDiscount() {
      let result = await getProductByType(1);
      if (result.success_code === 200) {
        this.discount_list = result.data;
      } else {
        console.log(result);
      }
    },
    async loadNewProduct() {
      let result = await getProductByType(4)
      if (result.success_code === 200) {
        this.new_list = result.data;
      } else {
        console.log(result);
      }
    },
    async loadStateProduct() {
      let result = await getProductByType(3)
      if (result.success_code === 200) {
        this.state_list = result.data;
        this.showLoading = true;

        showBack(status => {
          if (status) this.showBackStatus = true;
          else this.showBackStatus = false;
        });
      } else {
        console.log(result);
      }
    },
    goSpecial(typeId) {
      // 将所选商品id传递给详情页
      if (typeId === 2) {
        this.$router.push('/dashBoard/special');
      } else {
        this.$router.push('/dashBoard/scene');
      }
    },
    goDetail(id) {
      // 将所选商品id传递给详情页
      this.$router.push({
        path: '/dashBoard/detail',
        query: {
          id: id
        }
      });
    },
    scrollToTop() {
      let docB = document.documentElement || document.body;
      // 400ms内滚到顶部 scrollTop 顶部距离0
      animate(docB, {scrollTop: '0'}, 400, 'ease-out');
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar__text {
  color: black;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.nav-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999!important;
}
</style>