<template>
  <div>
    <van-nav-bar
        style="box-shadow: #cacaca 0 0 5px;"
        :fixed=true
        title="订单"
        left-arrow
        @click-left="$router.push('/dashBoard/profile')"
    ></van-nav-bar>

    <van-tabs
        v-model="active"
        color="#a163f7"
        title-active-color="#a163f7"
        title-inactive-color="black"
    >
      <!-- 全部 -->
      <van-tab title="全部">
        <!-- 商品 -->
        <div v-if="orderList.length !== 0" class="container">
          <!-- 商品列表 -->
          <van-list class="content">
            <div class="content-item" v-for="(item, index) in orderList" :key="index" @click="goDetail(userInfo.token, item.order_code, item.ctime.slice(0, 22), item.order_status)">
              <div class="content-item-header">
                <p>{{ item.ctime.slice(0, 22) }} 订单</p>
                <p>{{ item.order_status === 'pay' ? '已完成' : '未付款' }} ></p>
              </div>
              <div class="content-item-main">
                <img :src="item.cart_shop[0].small_image" alt="">
                <p>{{ item.cart_shop[0].goods_name | titleFormat }}</p>
              </div>
              <div class="content-item-footer">
                <p>共 {{ item.cart_shop.length }} 个商品</p>
                <p>总价: <span>{{ item.shop_price }}</span></p>
              </div>
            </div>
          </van-list>
        </div>
        <van-empty v-else description="暂无订单" />
      </van-tab>

      <!-- 已完成 -->
      <van-tab title="已完成">
        <div v-if="completed.length !== 0" class="container">
          <!-- 商品列表 -->
          <van-list class="content">
            <div class="content-item" v-for="(item, index) in completed" :key="index" @click="goDetail(userInfo.token, item.order_code, item.ctime.slice(0, 22), item.order_status)">
              <div class="content-item-header">
                <p>{{ item.ctime.slice(0, 22) }} 订单</p>
                <p>{{ item.order_status === 'pay' ? '已完成' : '未付款' }} ></p>
              </div>
              <div class="content-item-main">
                <img :src="item.cart_shop[0].small_image" alt="">
                <p>{{ item.cart_shop[0].goods_name | titleFormat }}</p>
              </div>
              <div class="content-item-footer">
                <p>共 {{ item.cart_shop.length }} 个商品</p>
                <p>总价: <span>{{ item.shop_price }}</span></p>
              </div>
            </div>
          </van-list>
        </div>
        <van-empty v-else description="暂无订单" />
      </van-tab>

      <!-- 未付款 -->
      <van-tab title="未付款">
        <div v-if="undone.length !== 0" class="container">
          <!-- 商品列表 -->
          <van-list class="content">
            <div class="content-item" v-for="(item, index) in undone" :key="index" @click="goDetail(userInfo.token, item.order_code, item.ctime.slice(0, 22), item.order_status)">
              <div class="content-item-header">
                <p>{{ item.ctime.slice(0, 22) }} 订单</p>
                <p>{{ item.order_status === 'pay' ? '已完成' : '未付款' }} ></p>
              </div>
              <div class="content-item-main">
                <img :src="item.cart_shop[0].small_image" alt="">
                <p>{{ item.cart_shop[0].goods_name | titleFormat }}</p>
              </div>
              <div class="content-item-footer">
                <p>共 {{ item.cart_shop.length }} 个商品</p>
                <p>总价: <span>{{ item.shop_price }}</span></p>
              </div>
            </div>
          </van-list>
        </div>
        <van-empty v-else description="暂无订单" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {getOrder} from "@/service/api";
import {mapState} from 'vuex';

export default {
  name: "Order",
  data() {
    return {
      active: 0,
      orderList: [],  // 全部订单
      completed: [],
      undone: []
    }
  },
  mounted() {
    console.log('userInfo:', this.userInfo.token);
    this.getOrder();
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 获取订单
    async getOrder() {
      let result = await getOrder(this.userInfo.token);
      console.log('all', result);
      if (result.success_code === 200) {
        this.orderList = result.data.reverse();
      }

      let willRes = await getOrder(this.userInfo.token, 'will');
      console.log('willRes', willRes);
      if (willRes.success_code === 200) {
        this.undone = willRes.data.reverse();
      }

      let payRes = await getOrder(this.userInfo.token, 'pay');
      console.log('payRes', payRes);
      if (result.success_code === 200) {
        this.completed = payRes.data.reverse();
      }
    },
    goDetail(user_id, order_code, time, order_status) {
      // 将所选商品id传递给详情页
      this.$router.push({
        path: '/orderDetail',
        query: {
          user_id: user_id,
          order_code: order_code,
          time: time,
          order_status: order_status
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.van-tabs {
  margin-top: 2.2rem;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.container {
  margin-bottom: 3rem;
  overflow-y: scroll;
  .content-item {
    padding: 0.6rem;
    font-size: 0.7rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    margin: 1rem 1rem;
    height: 7rem;

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
      display: flex;
      margin: 0.6rem 0;
      img {
        width: 6rem;
        height: 3rem;
        border-radius: 0.4rem;
      }
      p {
        margin-left: 0.6rem;
      }
    }
    &-footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>