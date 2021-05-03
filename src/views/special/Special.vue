<template>
  <div id="main">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <div v-if="showLoading" style="height: 100%;">
      <van-nav-bar style="box-shadow: #cacaca 0 0 5px;" :fixed=true title="热门佳作" left-arrow @click-left="backHome"></van-nav-bar>
      <!-- 商品 -->
      <div ref="container" class="container">
        <img id="banner" src="https://media.st.dl.pinyuncloud.com/steam/apps/323190/header.jpg?t=1614243890">
        <van-pull-refresh :disabled="disabled"  v-model="loadingRefresh" @refresh="onRefresh">
            <!-- 商品列表 -->
          <van-list
              class="content"
              v-model="loadingData"
              @load="onload"
              :finished="finished"
              finished-text="没有更多了"
          >
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
        </van-pull-refresh>
      </div>

    </div>
    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>

    <transition leave-active-class="animated animate__bounceOut">
      <img v-if="showBackStatus" @click="backup" id="backup" src="./images/up.png" alt="up">
    </transition>
  </div>
</template>

<script>
import animatex from 'animate.css';  // eslint-disable-line no-unused-vars
import {getProductByType, getProductList} from "@/service/api";  // eslint-disable-line no-unused-vars
import {animate} from "@/config/global";  // eslint-disable-line no-unused-vars
import {Toast} from 'vant';

export default {
  name: 'Special',
  data() {
    return {
      showLoading: false,
      showBackStatus: false,  // 显示返回顶部按钮
      scrollTop: null,  // 解决滚动问题
      runFunction: 1,

      productList: [],
      productLength: 0,  // 总商品数量
      start: 0,
      limit: 10,
      disabled: false,  // 禁用下拉刷新
      loadingData: false,  // 底部加载
      loadingRefresh: false,  // 下拉刷新
      finished: false // 数据是否加载完成 完成不再触发加载
    }
  },
  mounted() {
    this.listeningBack();
    this.getProductLength();
    this.getProductList();
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  activated() {
    if (window.fromDetail) {
      // 定位到记录的距离
      this.$refs.container.scrollTop = window.scrollTopVal;
    }
  },
  destroyed(){
    window.onpopstate = null;
    window.scrollTopVal = null;
  },
  methods: {
    // 监听返回键
    listeningBack() {
      let that = this;
      window.onpopstate = function() {
        // console.log(that.$route.path);
        if (that.$route.path === '/dashboard/home') {
          if (!window.fromDetail) {
            that.$emit('goSpecial', false);
          } else {
            if (that.runFunction === 2) {
              that.$emit('goSpecial', false);
            } else {
              that.runFunction++;
            }
          }
        }
      }
    },
    // 监听滚动到指定位置
    handleScroll(e) {
      if (e.target.scrollTop > 200) {
        this.showBackStatus = true;
      } else {
        this.showBackStatus = false;
      }
    },
    // 返回顶部
    backup() {
      // this.$refs.container.scrollTop = 0;
      animate(this.$refs.container, {scrollTop: '0'}, 400, 'ease-out');
    },
    // 获取总的商品数量
    async getProductLength() {
      let res = await getProductByType(2);
      this.productLength = res.data.length;
    },
    // 获取商品列表
    async getProductList() {
      if (this.start === 1) this.start = 2;
      let result = await getProductList(this.start, this.limit, 2);
      // console.log(result);
      if (result.success_code === 200) {
        if (result.data.length !== 0) {
          // 数组拼接添加数据
          this.productList = this.productList.concat(result.data);
        }
        this.start++;
        this.showLoading = true;
        this.loadingData = false;
      } else {
        console.log(result);
      }
    },
    // 继续加载商品数据
    onload() {
      setTimeout(() => {
        this.getProductList();
      }, 1000);
    },
    // 重新加载数据
    onRefresh() {
      setTimeout(() => {
        this.productList = [];
        this.start = 0;
        this.finished = false;
        this.loadingData = false;
        this.loadingRefresh = false;
        this.disabled = false;
        this.getProductList();
        Toast('刷新成功');
      }, 1000);
    },
    // 跳转商品详情页
    goDetail(id) {
      this.runFunction = 1;
      // 将当前滚动距离记录下
      window.scrollTopVal = this.$refs.container.scrollTop;
      this.$router.push({
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
        animate(docB, {scrollTop: '0'}, ms, 'ease-out');
      } else if (document.body.scrollTop) {
        docB = document.body;
        animate(docB, {scrollTop: '0'}, ms, 'ease-out');
      }
    },
    backHome() {
      this.$emit('goSpecial', false)
    }
  },
  watch: {
    // 监视数据是否加载完
    productList(val) {
      if (val.length === this.productLength) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
#main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 200;
  height: 100%;
}
#banner {
  margin-top: 2rem;
  width: 100%;
  height: 8rem;
}
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 3rem;
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
        background-position: center center;
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
      p:nth-child(1) {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
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
#backup {
  width: 0.8rem;
  height: 0.8rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, .15), 1px 2px 3px 1px rgba(0, 0, 0, .15);
  position: absolute;
  z-index: 210;
  right: 2rem;
  bottom: 3rem;
}
</style>