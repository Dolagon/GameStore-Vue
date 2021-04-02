<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <van-nav-bar
        left-text="游戏"
        class="nav-title"
        :fixed=true
    >
      <van-icon @click="$router.push('/search')" name="search" slot="right"></van-icon>
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
    <van-row>
      <!-- 商品 -->
      <div class="container">
        <!-- 商品列表 -->
        <van-list v-if="showLoading" class="content">
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
        <van-loading
            v-else
            type="spinner"
            style="position:absolute;left: 50%;top: 350%;transform: translate(-50%)"
        >
          正在加载数据...
        </van-loading>
      </div>
    </van-row>
    <transition enter-active-class="animated animate__bounceIn" leave-active-class="animated animate__bounceOut">
      <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"></MarkPage>
    </transition>
</div>
</template>

<script>
import {getProductByType} from "@/service/api";
import MarkPage from "@/views/home/components/MarkPage";
import animatex from 'animate.css';
import {animate, showBack} from "@/config/global";
import preventBack from 'vue-prevent-browser-back';


export default {
  name: 'Game',
  mixins: [preventBack],
  components: {
    MarkPage
  },
  data() {
    return {
      temp: animatex,
      show_waves: false,
      showLoading: false,
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
    }
  },
  activated() {
    if (window.scrollTop) {
      animate(document.documentElement || document.body, {scrollTop: '0'}, 0, 'ease-out');
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'home') window.scrollTop = true;
    else window.scrollTop = false;
    next();
  },
  created() {
    this.getProductList();
  },
  methods: {
    changeWaves() {
      this.show_waves = true;
      setTimeout(() => {
        this.show_waves = false;
      }, 400);
    },
    // 选中分类 并显示商品列表
    selectCategory(typeId, index) {
      this.scrollToTop();
      this.active = index;
      this.typeId = typeId;
      this.productList = [];
      this.showLoading = false;
      this.getProductList();
      this.changeWaves();
    },
    // 获取商品列表
    async getProductList() {
      let result = await getProductByType(this.typeId);
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
::v-deep .van-nav-bar__text {
  color: black;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.header {
  margin-top: 2.2rem;
  position: fixed;
  width: 100%;
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