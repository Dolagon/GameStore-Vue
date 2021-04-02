<template>
  <div>
    <van-nav-bar
        style="box-shadow: #cacaca 0 0 5px;"
        :fixed=true
        title="订单支付"
        left-arrow
        @click-left="$router.go(-2)"
    ></van-nav-bar>
    <van-notice-bar
        style="margin-top: 2.4rem;"
        left-icon="volume-o"
        speed="100"
        text="沙箱支付宝，每周日中午12点至每周一中午12点沙箱环境进行维护，期间可能出现不可用，敬请谅解。"
    />
    <div class="container">
      <!-- 商品列表 -->
      <van-list class="content">
        <div class="content-msg">
          <p>
            <span>订单{{ order_code }}</span>
            <span>共{{ goods_count }}个商品</span>
          </p>
          <p>总计:{{ shop_price | moneyFormat }}</p>
        </div>

        <div class="content-pay">
          <p>请选择支付方式</p>
          <div class="content-pay-ali">
            <img src="./images/支付宝.png" alt="支付宝">
            <span>支付宝</span>
            <van-checkbox checked-color="red" v-model="checked" />
          </div>
          <div class="content-pay-we">
            <img src="./images/微信支付.png" alt="支付宝">
            <span>微信支付暂未开通</span>
            <van-checkbox checked-color="red" :v-model="false" />
          </div>
        </div>
      </van-list>
    </div>
    <van-submit-bar
        :disabled="!checked"
        style="border-top: 1px solid #dedede"
        button-color="#a163f7"
        :price="shop_price * 100"
        label="实付"
        text-align="left"
        button-text="立即支付"
        @submit="onSubmit"
    >
    </van-submit-bar>
  </div>
</template>

<script>
import {aliPay, orderPaySuccess} from "@/service/api";  // eslint-disable-line no-unused-vars
import {mapState, mapMutations} from 'vuex';

export default {
  name: "CompleteOrder",
  data() {
    return {
      alipayWap: '',
      checked: true,
      shop_price: this.$route.query.total_price,
      order_code: this.$route.query.order_code,
      goods_count: this.$route.query.goodsCount,
      cart_shop: this.$route.query.cart_shop
    }
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['setOrderId']),
    async onSubmit() {
      let str = window.location.href;
      str = str.match(/(\S*)#/)[0];
      console.log(str);
      // 发起支付交易
      let payRes = await aliPay(this.order_code, this.shop_price, str);
      console.log(payRes);
      window.location.href = payRes.url;
      console.log(this.order_code);
      // 存入订单号
      this.setOrderId(this.order_code);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.container {
  margin-bottom: 3rem;
  overflow-y: scroll;
  .content-msg {
    padding: 0.3rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    margin: 1rem 1rem;
    height: 3.6rem;
    font-size: 0.7rem;
    p {
      margin-left: 0.4rem;
      display: flex;
      justify-content: space-between;
      span:nth-child(2) {
        color: #aaaaaa;
        margin-right: 0.4rem;
      }
    }
    p:nth-child(2) {
      margin-top: 1rem;
    }
  }

  .content-pay {
    padding: 0.3rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    margin: 1rem 1rem;
    height: 7rem;
    font-size: 0.7rem;
    p {
      margin-left: 0.4rem;
    }
    &-ali {
      width: 100%;
      height: 3rem;
      span {
        line-height: 3rem;
      }
      img {
        width: 3rem;
        height: 3rem;
      }
    }
    &-we {
      width: 100%;
      height: 3rem;
      opacity: 0.4;
      span {
        line-height: 3rem;
      }
      img {
        width: 2.8rem;
        height: 2.8rem;
        margin-left: 0.1rem;
      }
    }
  }
}
.van-checkbox {
  display: inline-block;
  float: right;
  margin-top: 1rem;
  margin-right: 0.6rem;
}
</style>