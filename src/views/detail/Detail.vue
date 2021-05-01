<template>
  <div class="detail">
    <div v-if="showLoading">
      <van-nav-bar style="box-shadow: #cacaca 0 0 5px;"  :fixed=true title="详情" left-arrow @click-left="back"></van-nav-bar>
      <div class="detail-item">
        <img :src="product.img" class="detail-item-img">
        <div class="detail-item-price">
          <span>{{ product.cur_price | moneyFormat }}</span>
          <span v-if="product.discount">{{ product.ori_price | moneyFormat }}</span>
          <span v-if="product.discount">-{{ product.discount * 100 }}%</span>
        </div>
        <p class="detail-item-title">{{ product.title }}</p>
        <div class="detail-item-tag">
          <span>休闲</span><span>角色扮演</span><span>独立</span><span>剧情</span>
        </div>
        <p class="detail-item-active">激活方式 : Steam平台安装激活</p>
        <div style="width: 100%;height: 0.3rem;background-color: #ececec;margin: 0.5rem 0"></div>
        <div class="detail-item-message">
          <p>开发商: {{ product.developers }}</p>
          <p>发行商: {{ product.publisher }}</p>
          <p>发行日期: {{ product.pun_date | dateFormat }}</p>
          <p>游戏语言: {{ product.language }}</p>
          <p>支持系统: {{ product.system }}</p>
        </div>
        <div class="detail-item-content">
          <p>游戏介绍</p>
          <p>{{ product.content }}</p>
        </div>
      </div>

      <div>
        <van-goods-action>
          <van-goods-action-icon @click="goCart(2)" icon="cart-o" text="购物车" />
          <van-goods-action-icon v-if="!collected" @click="addCollect(product)" icon="like-o" text="心愿单" />
          <van-goods-action-icon v-else @click="delCollect" icon="like" color="red" text="心愿单" />
          <van-goods-action-button color="#be99ff" type="warning" text="加入购物车" @click="addToCart(product)" />
          <van-goods-action-button color="#7232dd" type="danger" text="立即购买" @click="goConfirm(product)" />
        </van-goods-action>
      </div>
    </div>

    <van-loading v-else type="spinner" style="position:absolute;left: 50%;top: 40%;transform: translate(-50%)">
      正在加载数据...
    </van-loading>
  </div>
</template>

<script>
import {getProductByIdRestful, getProductById, addGoodsToCart, addCollect, inCollect, delCollect} from "@/service/api";  // eslint-disable-line no-unused-vars
import {Toast} from 'vant';
import {mapState, mapMutations} from 'vuex';

export default {
  name: "Detail",
  data() {
    return {
      product: [],
      collected: false,
      showLoading: false
    }
  },
  mounted() {
    this.loadData();
    this.searchCollect();
  },
  computed: {
    ...mapState(['userInfo', 'shopCart'])
  },
  methods: {
    ...mapMutations(['ADD_GOODS', 'CANCEL_SINGER_GOODS']),
    back() {
      this.$router.back();
    },
    async loadData() {
      // let result = await getProductById(this.$route.query.id);
      let result = await getProductByIdRestful(this.$route.query.id);
      if (result.status === 200) {
        this.product = result.result;
        this.showLoading = true;
      } else {
        console.log(result);
      }
    },
    async addToCart(goods) {
      if (this.userInfo.token) {  // 已处于登陆状态
        let result = await addGoodsToCart(this.userInfo.token, goods._id, goods.title, goods.cur_price, goods.img);
        if (result.success_code === 200) {
          this.ADD_GOODS({
            goodsId: goods._id,
            goodsName: goods.title,
            smallImage: goods.img,
            goodsPrice: goods.cur_price
          });
          // 提示用户
          Toast({
            message: '已添加到购物车',
            duration: 1000
          });
        } else {
          this.$router.push('/login');
        }
      }
    },
    goCart() {
      this.$router.push({
        path: '/dashboard/cartIn',
        query: {
          cart: true
        }
      });
    },
    async goConfirm(goods) {
      // 先添加到购物车
      let result = await addGoodsToCart(this.userInfo.token, goods._id, goods.title, goods.cur_price, goods.img);
      if (result.success_code === 200) {
        this.ADD_GOODS({
          goodsId: goods._id,
          goodsName: goods.title,
          smallImage: goods.img,
          goodsPrice: goods.cur_price
        });
        // 直接跳转确认订单页面
        this.$router.push('/dashboard/confirm');
      }
    },
    // 添加商品到愿望单
    async addCollect(goods) {
      if (this.userInfo.token) {
        let result = await addCollect(this.userInfo.token, goods._id, goods.title, goods.img, goods.cur_price);
        if (result.success_code === 200) {
          Toast('已添加');
          this.collected = true;
        } else {
          Toast(result.message);
        }
      }
    },
    // 查询心愿单
    async searchCollect() {
      let result = await inCollect(this.userInfo.token, this.$route.query.id);
      if (result.message === '心愿单已存在改商品') {
        this.collected = true;
      } else if (result.message === '未收藏改商品') {
        this.collected = false;
      }
    },
    // 根据id取消心愿单
    async delCollect() {
      let result = await delCollect(this.userInfo.token, this.$route.query.id);
      if (result.success_code === 200) {
        Toast('已取消');
        this.collected = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: auto;
  &-item {
    &-img {
      margin-top: 2.2rem;
      width: 100%;
      height: 10rem;
    }
    &-price {
      background-color: #ececec;
      height: 1.5rem;
      display: flex;
      justify-content: flex-start;
      line-height: 0.6rem;
      span {
        font-size: 1rem;
        line-height: 1.5rem;
      }
      span:nth-child(1) {
        font-weight: bold;
        margin-left: 0.6rem;
      }
      span:nth-child(2) {
        font-size: 0.7rem;
        color: #aaaaaa;
        line-height: 1.7rem;
        margin: 0 0.5rem;
        text-decoration: line-through;
      }
      span:nth-child(3) {
        color: orangered;
        font-size: 0.8rem;
      }
    }
    &-title {
      margin-top: 0.1rem;
      margin-left: 0.6rem;
      font-size: 1rem;
    }
    &-tag {
      margin-left: 0.6rem;
      span {
        margin-right: 0.3rem;
        font-size: 0.3rem;
        color: #8a8a8a;
        background-color: #ececec;
        padding: 0.3rem;
        border-radius: 0.1rem;
      }
    }
    &-active {
      margin-top: 0.5rem;
      margin-left: 0.6rem;
      font-weight: bold;
      font-size: 0.4rem;
    }
    &-message {
      font-size: 0.5rem;
      margin-left: 0.6rem;
      p {
        margin-bottom: 0.3rem;
      }
    }
    &-content {
      margin: 0.2rem 0 3rem 0.6rem;
      p:nth-child(1) {
        font-weight: bold;
        margin-bottom: 0.2rem;
      }
      p:nth-child(2) {
        font-size: 0.6rem;
      }
    }
  }
}
</style>