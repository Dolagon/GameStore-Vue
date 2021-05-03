<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <van-nav-bar
        left-text="游戏"
        class="nav-title"
        :fixed=true
    >
      <van-icon @click="goSearch(true)" name="search" slot="right"></van-icon>
    </van-nav-bar>
    <div class="header">
      <div class="line"></div>
      <div class="nav">
        <ul>
          <li
              @click="selectCategory(item.typeId, index)"
              :class="{ active:active === index }"
              v-for="(item, index) in types"
              :key="index"
          >
            {{ item.typeName }}
            <span v-if="show_waves"></span>
          </li>
        </ul>
      </div>
    </div>
    <van-row v-if="showLoading">
      <!-- 商品 -->
      <div class="container">
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
                <img :src="item.img" lazy="item" />
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
        </van-pull-refresh>
      </div>
    </van-row>
    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>
    <transition leave-active-class="animated animate__bounceOut">
      <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
    </transition>

    <transition name="router-slider" mode="out-in">
      <Search v-if="showSearch" @goSearch="goSearch"></Search>
    </transition>
  </div>
</template>

<script>
import {getProductByType, getProductList} from "@/service/api";
import MarkPage from "@/views/home/components/MarkPage";
import Search from "@/views/search/Search";
import animatex from 'animate.css';
import {animate, showBack} from "@/config/global";
import preventBack from 'vue-prevent-browser-back';
import {Toast} from "vant";


export default {
  name: 'Games',
  mixins: [preventBack],
  components: {
    MarkPage,
    Search
  },
  data() {
    return {
      temp: animatex,
      show_waves: false,
      showLoading: false,
      showSearch: false,
      showBackStatus: false,  // 显示返回顶部按钮
      types: [
        {
          "typeId" : 1,
          "typeName" : "限时折扣",
        },
        {
          "typeId" : 2,
          "typeName" : "热门佳作",
        },
        {
          "typeId" : 3,
          "typeName" : "国产",
        },
        {
          "typeId" : 4,
          "typeName" : "新作",
        },
        {
          "typeId" : 5,
          "typeName" : "剧情丰富",
        }
      ],
      active: 0,
      productList: [],
      typeId: 1,  // 当前选中商品的id

      productLength: 0,  // 总商品数量
      start: 0,
      limit: 10,
      disabled: false,  // 禁用下拉刷新
      loadingData: false,  // 底部加载
      loadingRefresh: false,  // 下拉刷新
      finished: false // 数据是否加载完成
    }
  },
  activated() {
    if (window.scrollTop) {
      this.scrollToTop(0);
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'home' || from.name === 'detail') {
      window.scrollTop = true;
      window.fromDetail = true;
    } else {
      window.scrollTop = false;
      window.fromDetail = false;
    }
    next();
  },
  mounted() {
    this.getProductLength(this.typeId);
    this.getProductList();
  },
  methods: {
    changeWaves() {
      this.show_waves = true;
      setTimeout(() => {
        this.show_waves = false;
      }, 400);
    },
    // 获取总的商品数量
    async getProductLength(typeId) {
      let res = await getProductByType(typeId);
      this.productLength = res.data.length;
    },
    // 选中分类 并显示商品列表
    selectCategory(typeId, index) {
      this.scrollToTop(0);
      this.active = index;
      this.typeId = typeId;
      this.getProductLength(this.typeId);

      this.productList = [];
      this.start = 0;
      this.finished = false;
      this.loadingData = false;

      this.showLoading = false;
      this.getProductList();
      this.changeWaves();
    },
    // 获取商品列表
    async getProductList() {
      if (this.start === 1) this.start = 2;
      // 开始为数组长度
      let result = await getProductList(this.start, this.limit, this.typeId);
      if (result.success_code === 200) {
        if (result.data.length !== 0) {
          // 数组拼接添加数据
          this.productList = this.productList.concat(result.data);
        }
        this.start++;
        this.showLoading = true;
        this.loadingData = false;
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
        this.getProductLength(this.typeId);
        this.productList = [];
        this.start = 0;
        this.finished = false;
        this.loadingData = false;
        this.showLoading = false;
        this.disabled = false;
        this.getProductList();
        Toast('刷新成功');
      }, 1000);
    },
    goDetail(id) {
      // 将所选商品id传递给详情页
      this.$router.push({
        // path: '/dashboard/games/detailGames',
        path: '/dashboard/detail',
        query: {
          id: id
        }
      });
    },
    //禁止滚动
    stop(){
      let mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",mo,false); //禁止页面滑动
    },
    // 取消滑动限制
    move() {
      let mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow='';  //出现滚动条
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
    }
  },
  watch: {
    // 监视数据是否加载完
    productList(val) {
      // console.log('v-length:', val.length);
      // console.log('p-length:', this.productLength);
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
.header {
  margin-top: 2.2rem;
  position: fixed;
  width: 100%;
  z-index: 100;
  .nav {
    width: 120%;
    display: inline-block;
    background-color: #fff;
    li {
      float: left;
      height: 1rem;
      line-height: 1rem;
      border-bottom: 1px solid #ffffff;
      padding: 0.4rem 0.6rem;
      text-align: center;
    }
    .active {
      color: #a163f7;
      border-bottom: 1px solid #a163f7;
      position: relative;
      height: 100%;
    }
    .active span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-color: #c191ff;
      animation: big 0.4s;
    }
    @keyframes big{
      0%{
        width: 40%;
        height: 100%;
        opacity: 0.7;
        border-radius: 100%;
      }
      100%{
        width: 100%;
        height: 100%;
        opacity: 0;
        border-radius: 0;
      }
    }
  }
}
.line {
  background-color: #efefef;
  height: 0.5rem;
}

.container {
  margin-top: 5.2rem;
  margin-bottom: 3rem;
  .content-item {
    display: flex;
    justify-content: flex-start;
    margin: 0rem 1rem 1rem 1rem;
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
        span:nth-child(2) {
          color: #aaaaaa;
          font-size: 0.5rem;
          line-height: 1.4rem;
          margin: 0 0.5rem;
          text-decoration: line-through;
        }
        span:nth-child(3) {
          color: red;
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

</style>