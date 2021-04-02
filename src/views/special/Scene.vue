<template>
  <div class="main">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <div v-if="showLoading">
      <transition enter-active-class="animated animate__bounceIn" leave-active-class="animated animate__bounceOut">
        <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
      </transition>
      <van-nav-bar style="box-shadow: #cacaca 0 0 5px;" :fixed=true title="剧情精选" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
      <img id="banner" :src="productList[3].img">
      <!-- 商品 -->
      <div class="container">
        <!-- 商品列表 -->
        <van-list class="content">
          <div @click="goDetail(item._id)" class="content-item" v-for="(item, index) in productList" :key="index">
            <div class="content-item-left">
              <img :src="item.img" alt="">
            </div>
            <div class="content-item-right">
              <p>{{ item.title | titleFormat }}</p>
              <p>国际站</p>
              <div class="content-item-right-price">
                <span>{{ item.ori_price | moneyFormat }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>
  </div>
</template>

<script>
import MarkPage from "@/views/home/components/MarkPage";
import animatex from 'animate.css';
import {getProductByType} from "@/service/api";
import {animate, showBack} from "@/config/global";

export default {
  name: 'Scene',
  components: {
    MarkPage
  },
  data() {
    return {
      temp: animatex,
      showLoading: false,
      showBackStatus: false,  // 显示返回顶部按钮
      productList: [],
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'home') window.scrollTop = true;
    else window.scrollTop = false;
    next();
  },
  activated() {
    if (window.scrollTop) {
      animate(document.documentElement || document.body, {scrollTop: '0'}, 0, 'ease-out');
    }
  },
  created() {
    this.getProductList();
    animate(document.documentElement || document.body, {scrollTop: '0'}, 0, 'ease-out');
  },
  methods: {
    // 获取商品列表
    async getProductList() {
      let result = await getProductByType(5);
      if (result.success_code === 200) {
        this.productList = result.data;
        this.showLoading = true;
        showBack(status => {
          if (status) this.showBackStatus = true;
          else this.showBackStatus = false;
        });
      } else {
        console.log(result);
      }
    },
    // 跳转商品详情页
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
      let docB = document.documentElement || document.body
      // 400ms内滚到顶部 scrollTop 顶部距离0
      animate(docB, {scrollTop: '0'}, 400, 'ease-out');
    }
  }
};
</script>


<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
#banner {
  margin-top: 2rem;
  width: 100%;
  height: 8rem;
}

.container {
  .content-item {
    display: flex;
    justify-content: flex-start;
    margin: 1rem 1rem;
    &-left {
      width: 9rem;
      height: 5rem;
      img {
        border-radius: 0.3rem;
        width: 100%;
        height: 100%;
        background-image: url('./../../assets/loading.gif');
        background-repeat: no-repeat;
        background-position:center center;
      }
    }
    &-right {
      margin-left: 0.8rem;
      margin-top: 0.2rem;
      &-price {
        display: flex;
        justify-content: flex-start;
        span:nth-child(1) {
          font-weight: bold;
        }
      }
      p:nth-child(2) {
        text-align: center;
        background-color: #eeeeee;
        border-radius: 0.2rem;
        color: #626262;
        padding: 0.2rem;
        font-size: 0.4rem;
        margin: 0.6rem 0;
        width: 3rem;
      }

    }
  }
}
</style>