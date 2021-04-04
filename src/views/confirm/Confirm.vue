<template>
  <div class="container">
    <van-nav-bar style="box-shadow: #cacaca 0 0 5px;" :fixed=true title="订单确认" left-arrow @click-left="$router.go(-1)"></van-nav-bar>

    <!-- 商品 -->
    <div class="container">
      <!-- 商品列表 -->
      <van-list class="content">
        <div>
          <div class="content-item" v-for="(item, index) in productList" :key="index">
            <div class="content-item-left">
              <img :src="item.small_image" alt="">
            </div>
            <div class="content-item-right">
              <p>{{ item.name | titleFormat }}</p>
              <p>{{ item.price | moneyFormat }}</p>
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <p>共 {{ goodsCount }} 个商品</p>
          <p>总计: <span>{{ totalPrice | moneyFormat }}</span></p>
        </div>
      </van-list>
    </div>

    <van-submit-bar
        style="border-top: 1px solid #dedede"
        button-color="#a163f7"
        :price="totalPrice * 100"
        label="实付 "
        text-align="left"
        button-text="提交订单"
        @submit="onSubmit(orderCode, totalPrice, goodsCount)"
    >
    </van-submit-bar>
  </div>
</template>

<script>
import {getAllSelectedGoods, postOrder, delAllSelectedGoods} from "@/service/api";  // eslint-disable-line no-unused-vars
import {mapState} from 'vuex';

export default {
  name: 'Confirm',
  data() {
    return {
      productList: [],
      productListServer: [],
      price: 0
    }
  },
  mounted() {
    this.getCheckedGoods();
  },
  computed: {
    // 取得购物车数据
    ...mapState(['shopCart', 'userInfo']),
    // 商品总件数
    goodsCount() {
      return this.productList.length;
    },
    totalPrice() {
      let result = 0;
      this.productList.forEach(goods => {
        result += goods.price;
      });
      return result;
    },
    // 随机生成订单号
    orderCode() {
      let num = '';
      for (let i = 0; i < 5; i++) {
        num += Math.ceil(Math.random()*10);
      }
      return num + new Date().getTime();
    }
  },
  methods: {
    // 取得选中的商品
    async getCheckedGoods() {
      let result = await getAllSelectedGoods(this.userInfo.token);
      if (result.success_code === 200) {
        this.productListServer = result.data;
      } else {
        console.log(result);
      }
      Object.values(this.shopCart).forEach(goods => {
        if (goods.checked === true) {
          this.productList.push(goods);
        }
      });
    },
    // 提交订单并跳转支付页面
    async onSubmit(order_code, total_price, goodsCount) {
      let result = await postOrder(
          this.userInfo.token,
          this.productListServer,
          this.totalPrice,
          this.orderCode,
          new Date(Date.now()).toLocaleString()
      );
      console.log(result);
      if (result.success_code === 200) {
        // 订单创建成功后删除 已经生成订单的商品
        await delAllSelectedGoods(this.userInfo.token);
        this.$router.push({
          path: '/completeOrder',
          query: {
            order_code: order_code,
            total_price: total_price,
            goodsCount: goodsCount
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.container {
  .content-item {
    position: relative;
    top: 2.4rem;
    display: flex;
    margin: 1rem 1rem;
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
      display: flex;
      justify-content: space-between;
    }
  }
  .content-bottom {
    margin: 4rem 0.4rem;
    display: flex;
    justify-content: space-between;
    span {
      font-weight: bold;
    }
  }
}
</style>