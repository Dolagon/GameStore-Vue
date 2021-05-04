<template>
  <div>
    <van-nav-bar
        style="box-shadow: #cacaca 0 0 5px;"
        :fixed=true
        title="订单支付成功"
        left-arrow
        @click-left="backHome"
    ></van-nav-bar>
    <div class="content">
      <img src="./images/completed.png" alt="">
      <div class="content-btn">
        <van-button @click="goOrder" id="add">查看订单</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {orderPaySuccess} from "@/service/api";
import {getStore} from "@/config/global";
import {mapActions, mapState} from 'vuex';

export default {
  name: "Completed",
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    this.reqUserInfo();
    console.log('userInfo', this.userInfo.token);
    this.successPay();
  },
  methods: {
    ...mapActions(['reqUserInfo']),
    // 修改订单状态
    async successPay() {
      console.log('orderId:', getStore('orderId'));
      let result = await orderPaySuccess(this.userInfo.token, getStore('orderId'));
      console.log(result);
    },
    backHome() {
      this.$router.push('/');
      sessionStorage.setItem('tabBarActiveIndex', 0);
    },
    goOrder() {
      this.$router.push({
        path: '/order',
        query: {
          completed: true
        }
      });
      sessionStorage.setItem('tabBarActiveIndex', 3);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.content {
  width: 100%;
  height: 13rem;
  margin-top: 2rem;
  position: relative;
  img {
    width: 5rem;
    height: 5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &-btn {
    width: 90%;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-around;
  }
}
#add {
  color: white;
  background-color: black;
  width: 5rem;
  height: 2rem;
  font-size: 0.6rem;
  border-radius: 1rem;
  margin-right: 0.7rem;
}
</style>