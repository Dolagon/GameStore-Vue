<template>
  <div id="main">
    <form
        style="width: 100%;"
        action="/"
    >
      <van-search
          v-model="value"
          show-action
          shape="round"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="cancel"
      />
    </form>

    <!-- 搜索历史 -->
    <div v-if="showHistory" class="history">
      <div class="history-title">
        <h5>搜索历史</h5>
        <img @click="delAllKeywords" src="./images/delete.png" alt="delete">
      </div>
      <div class="history-keywords" v-for="(item, index) in keywordList" :key="index">
        <span @click="searchKeyword(index)">{{ item }}</span>
      </div>
    </div>

    <!-- 相关搜索 -->
    <div v-if="showRelevant" class="relevant">
      <div class="relevant-item" v-for="(item, index) in relevantList" :key="index">
        <p @click="byRelevant(item)">{{ item }}</p>
      </div>
    </div>

    <!-- 商品列表 -->
    <van-row v-if="showProductList">
      <!-- 商品 -->
      <div class="container" ref="container">
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
        <div class="container-bottom"></div>
      </div>
    </van-row>

  </div>
</template>

<script>
import {Toast} from 'vant';
import animatex from "animate.css";  // eslint-disable-line no-unused-vars
import {searchProduct, addKeyword, getKeywords, delKeywords} from "@/service/api";
import {animate} from "@/config/global";  // eslint-disable-line no-unused-vars
import {mapState} from 'vuex';

export default {
  name: "Search",
  data() {
    return {
      value: '',
      timer: null,
      runFunction: 1,

      showLoading: false,
      showHistory: true,
      showProductList: false,
      showRelevant: false,  // 显示相关搜索
      productList: [],
      keywordList: [],  // 用户搜索历史
      relevantList: [],  // 相关内容
      keywords: '',  // 当前选中商品的id
    };
  },
  mounted() {
    this.listeningBack();
    this.getHistoryWord();
  },
  destroyed(){
    window.onpopstate = null;
    window.scrollTopVal = null;
  },
  activated() {
    if (window.fromDetail) {
      // 定位到记录的距离
      this.$refs.container.scrollTop = window.scrollTopVal;
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 监听返回键
    listeningBack() {
      let that = this;
      window.onpopstate = function() {
        if (that.$route.path === '/dashboard/home' || that.$route.path === '/dashboard/games') {
          if (!window.fromDetail) {
            window.scrollTopVal = null;
            that.cancel();
          } else {
            if (that.runFunction === 2) {
              that.cancel();
            } else {
              that.runFunction++;
            }
          }
        }
      }
    },
    onSearch(val) {
      this.keywords = val;
      this.productList = [];
      this.getProductList();
    },
    // 获取用户搜索历史
    async getHistoryWord() {
      let result = await getKeywords(this.userInfo.token);
      if (result.success_code === 200) {
        this.keywordList = result.data;
      } else {
        console.log(result);
      }
    },
    // 删除搜索历史
    async delAllKeywords() {
      if (this.keywordList.length === 0) {
        return false;
      } else {
        let result = await delKeywords(this.userInfo.token);
        console.log(result);
        if (result.success_code === 200) {
          this.getHistoryWord();
          Toast('已删除');
        } else {
          console.log(result);
        }
      }
    },
    // 获取商品列表
    async getProductList() {
      let result = await searchProduct(this.keywords);
      if (this.keywords === '') {
        Toast('请输入关键词搜索');
      } else if (result.data.length > 0) {
        this.showHistory = false;
        this.showRelevant = false;
        this.showProductList = true;
        await addKeyword(this.userInfo.token, this.keywords);
        // console.log(resultKeyword);
        this.productList = result.data;
        this.getHistoryWord();
      } else {
        this.showRelevant = false;
        Toast('无搜索结果!');
        await addKeyword(this.userInfo.token, this.keywords);
        // console.log(resultKeyword);
        this.getHistoryWord();
      }
    },
    // 获取相关搜索
    async getRelevantList(value) {
      this.relevantList = [];
      if (value) {
        let arr = await searchProduct(value);
        // console.log(arr);
        if (arr.data.length !== 0) {
          arr.data.forEach(item => {
            this.relevantList.push(item.title);
          });
        } else {
          this.relevantList = [];
        }
      } else {
        this.relevantList = [];
      }
    },
    // 返回
    cancel() {
      this.productList = [];
      this.$emit('goSearch', false);
    },
    // 通过搜索历史
    searchKeyword(index) {
      this.value = this.keywordList[index];
      this.onSearch(this.keywordList[index]);
    },
    // 通过相关内容搜索
    byRelevant(val) {
      this.value = val;
      this.onSearch(val);
    },
    goDetail(id) {
      this.runFunction = 1;
      // 将当前滚动距离记录下
      window.scrollTopVal = this.$refs.container.scrollTop;
      this.$router.push({
        path: '/dashBoard/detail',
        query: {
          id: id
        }
      });
    }
  },
  watch: {
    value(val) {  // 监听输入框的值
      if (!val) {  // 输入框没有值
        this.showHistory = true;  // 显示搜索历史
        this.showProductList = false;
        this.showRelevant = false;
      } else {  // 输入框有值
        this.showProductList = false;
        this.showHistory = false;
        this.showRelevant = true;  // 显示相关内容
        // 防抖处理
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getRelevantList(val);
          this.timer = null;
        }, 500);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 200;
}
.van-row {
  width: 100%;
  height: 100%;
}
.relevant {
  width: 100%;
  height: 40%;
  overflow: auto;
  p {
    font-family:"Microsoft YaHei";
    font-size: 0.7rem;
    margin-left: 1rem;
    margin-top: 0.7rem;
  }
}
.history {
  &-title {
    display: flex;
    justify-content: space-between;
    h5 {
      font-weight: bold;
      margin: 0.5rem 0 0 0.5rem;
    }
    img {
      width: 1rem;
      height: 1rem;
      right: 0;
      margin: 0.5rem 0.5rem 0 0;
    }
  }
  &-keywords {
    float: left;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    span {
      margin-right: 0.1rem;
      font-size: 0.3rem;
      color: #8a8a8a;
      background-color: #ececec;
      padding: 0.3rem;
      border-radius: 0.1rem;
    }
  }
}

.container {
  width: 100%;
  height: 100%;
  overflow: auto;
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
  &-bottom {
    width: 100%;
    height: 4rem;
  }
}
</style>