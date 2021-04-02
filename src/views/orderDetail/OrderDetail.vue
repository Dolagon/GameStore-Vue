<template>
  <div>
    <van-popup v-model="show_popup">{{ code }}</van-popup>
    <van-nav-bar style="box-shadow: #cacaca 0 0 1px;" :fixed=true title="订单详情" left-arrow @click-left="$router.go(-1)"></van-nav-bar>

    <!-- 订单列表 -->
    <div class="container">
      <!-- 详情信息 -->
      <van-list class="content">
        <div class="content-item">
          <div class="content-item-header">
            <p>订单号: {{ order_msg.order_code }}</p>
            <van-button id="del" @click="cancel" v-if="$route.query.order_status === 'will'">取消</van-button>
          </div>
          <div class="content-item-main">
            <p>
              <span>商品总额</span>
              <span>{{ order_msg.shop_price | moneyFormat }}</span>
            </p>
            <p>
              <span>优惠券抵扣</span>
              <span>-￥0.00</span>
            </p>
            <p>
              <span>实际支付</span>
              <span>{{ order_msg.shop_price | moneyFormat }}</span>
            </p>
          </div>
          <div class="content-item-footer">
            <p>下单时间 {{ $route.query.time }}</p>
          </div>
        </div>
      </van-list>

      <van-list class="list">
        <div class="list-item" v-for="(item, index) in productList" :key="index">
          <div class="list-item-left">
            <img :src="item.small_image" alt="">
          </div>
          <div class="list-item-right">
            <p>{{ item.goods_name | titleFormat }}</p>
            <span>{{ item.goods_price | moneyFormat }}</span>
            <van-button v-if="$route.query.order_status !== 'will'" @click="showCode" id="get">领取激活码</van-button>
          </div>
        </div>
      </van-list>
    </div>
    <van-submit-bar
        v-if="$route.query.order_status === 'will'"
        style="border-top: 1px solid #dedede"
        button-color="#a163f7"
        :price="order_msg.shop_price * 100"
        label="实付"
        text-align="left"
        button-text="立即支付"
        @submit="onSubmit"
    >
    </van-submit-bar>
  </div>
</template>

<script>
import {getOrderId, delOrder} from "@/service/api";
import {mapState} from 'vuex';
import {Toast} from 'vant';

export default {
  name: "OrderDetail",
  data() {
    return {
      active: 0,
      productList: [],
      order_msg: {},
      show_popup: false,
      user_id: this.$route.query.user_id,
      order_code: this.$route.query.order_code,
      code: ''
    }
  },
  mounted() {
    this.getOrderProduct();
  },
  computed: {
    ...mapState(['userInfo']),
    randomCode() {
      return this.generateRdStr() + '-' + this.generateRdStr() + '-' + this.generateRdStr();
    }
  },
  methods: {
    // 生成随机激活码
    generateRdStr() {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
    showCode() {
      this.show_popup = true;
      this.code = this.generateRdStr() + '-' + this.generateRdStr() + '-' + this.generateRdStr();
    },
    // 获取商品列表
    async getOrderProduct() {
      let result = await getOrderId(this.userInfo.token, this.order_code);
      if (result.success_code === 200) {
        this.order_msg = result.data;
        this.productList = result.data.cart_shop;
      }
      console.log(result);
    },
    // 跳转支付页面
    onSubmit() {
      this.$router.push({
        path: '/completeOrder',
        query: {
          order_code: this.order_msg.order_code,
          total_price: this.order_msg.shop_price,
          goodsCount: this.productList.length
        }
      });
    },
    // 订单取消
    async cancel() {
      let result = await delOrder(this.userInfo.token, this.order_code);
      if (result.status === 200) {
        Toast('订单已取消');
        this.$router.push('/order');
      }
      console.log(result);
    }
  }

}
</script>

<style lang="scss" scoped>
.van-popup {
  padding: 2rem 0.85rem;
}
.van-tabs {
  margin-top: 2.2rem;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.container {
  margin-top: 2.4rem;
  margin-bottom: 3rem;
  overflow-y: scroll;
  .content-item {
    padding: 0.9rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    margin: 1rem 1rem;
    height: 6.5rem;
    font-size: 0.65rem;
    &-header {
      display: flex;
      justify-content: space-between;
      p:nth-child(2) {
        color: #cacaca;
        font-size: 0.6rem;
        margin-right: 0.4rem;
      }
    }
    &-main {
      margin: 0.6rem 0;
      img {
        width: 6rem;
        height: 3rem;
        border-radius: 0.4rem;
      }
      p {
        display: flex;
        justify-content: space-between;
        span:nth-child(2) {
          font-weight: bold;
        }
      }
    }
    &-footer {
      font-size: 0.5rem;
    }
  }

  .list-item {
    padding: 0.3rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    display: flex;
    margin: 1rem 1rem;
    height: 3rem;
    &-left {
      width: 8rem;
      height: 3rem;
      img {
        border-radius: 0.3rem;
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      width: 100%;
      margin-left: 0.8rem;
    }
  }

}
#get {
  background-color: #f1f1f1;
  width: 5rem;
  height: 1.5rem;
  font-size: 0.6rem;
  border-radius: 1rem;
  float: right;
}
#del {
  background-color: #f1f1f1;
  width: 3rem;
  height: 1.5rem;
  font-size: 0.6rem;
  border-radius: 1rem;
  float: right;
  border: 1px solid #9b9b9b;
  margin-right: -0.4rem;
}
</style>