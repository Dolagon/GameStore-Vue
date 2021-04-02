<template>
  <div>
    <form
        style="box-shadow: #cacaca 0 0 5px;position: fixed;width: 100%;"
        action="/"
    >
      <van-search
          v-model="value"
          show-action
          shape="round"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="$router.go(-1)"
      />
    </form>
    <transition enter-active-class="animated animate__bounceIn" leave-active-class="animated animate__bounceOut">
      <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
    </transition>
    <van-row>
      <!-- 商品 -->
      <div class="container">
        <!-- 商品列表 -->
        <van-list v-if="!showLoading" class="content">
          <div @click="goDetail(item._id)" class="content-item" v-for="(item, index) in productList" :key="index">
            <div class="content-item-left">
              <img :src="item.img" alt="">
            </div>
            <div class="content-item-right">
              <p>{{ item.title | titleFormat }}</p>
              <p>国际站</p>
              <div class="content-item-right-price">
                <span>{{ item.cur_price | moneyFormat }}</span>
                <span v-if="item.discount">{{ item.ori_price | moneyFormat }}</span>
                <span v-if="item.discount">-{{ item.discount * 100 }}%</span>
              </div>
            </div>
          </div>
        </van-list>
        <van-loading
            v-else
            type="spinner"
            style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)"
        >
          正在加载数据...
        </van-loading>
      </div>
    </van-row>

  </div>
</template>

<script>
import {Toast} from 'vant';
import MarkPage from "@/views/home/components/MarkPage";
import animatex from "animate.css";  // eslint-disable-line no-unused-vars
import {searchProduct} from "@/service/api";
import {animate} from "@/config/global";

export default {
  name: "Search",
  components: {
    MarkPage
  },
  data() {
    return {
      value: '',

      showLoading: false,
      showBackStatus: false,  // 显示返回顶部按钮
      productList: [],
      keywords: '',  // 当前选中商品的id
    };
  },
  methods: {
    onSearch(val) {
      this.keywords = val;
      this.productList = [];
      this.getProductList();
    },
    // 获取商品列表
    async getProductList() {
      let result = await searchProduct(this.keywords);
      if (this.keywords === '') {
        Toast('请输入关键词搜索');
      }
      if (result.data.length > 0) {
        this.productList = result.data;
      } else {
        Toast('无搜索结果!');
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
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 4.2rem;
  .content-item {
    display: flex;
    justify-content: flex-start;
    margin: 0 1rem 1rem 1rem;
    &-left {
      width: 9rem;
      height: 5rem;
      img {
        border-radius: 0.3rem;
        width: 100%;
        height: 100%;
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
        span:nth-child(2) {
          color: #aaaaaa;
          font-size: 0.5rem;
          line-height: 1.4rem;
          margin: 0 0.5rem;
          text-decoration: line-through;
        }
        span:nth-child(3) {
          color: orangered;
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