<template>
  <div id="box" v-if="userInfo.token">
    <van-tabbar v-show="$route.meta.navShow" inactive-color="#a5a5a5" active-color="#a163f7" v-model="active">
      <van-tabbar-item ref="home" to="/" icon="wap-home">商城</van-tabbar-item>
      <van-tabbar-item to="/dashboard/games" icon="cluster">游戏</van-tabbar-item>
      <van-tabbar-item to="/dashboard/cart" icon="shopping-cart">购物车</van-tabbar-item>
      <van-tabbar-item to="/dashboard/profile" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
    <transition :name="transitionName" mode="out-in">
      <keep-alive>
        <router-view class="view" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="transitionName" mode="out-in">
      <router-view class="view" v-if="!$route.meta.keepAlive"></router-view>
    </transition>

  </div>
  <Login v-else></Login>
</template>

<script>
import Login from "@/views/login/Login";  // eslint-disable-line no-unused-vars
import {mapState, mapActions, mapMutations} from 'vuex';
import {getGoodsCart} from "@/service/api";
import {setStore} from "@/config/global";

export default {
  name: "DashBoard",
  components: {
    Login
  },
  data() {
    return {
      switch: false,
      active: Number(sessionStorage.getItem('tabBarActiveIndex')) || 0,
      transitionName: ''
    }
  },
  created() {
    // 自动登陆
    this.reqUserInfo();
    this.initShopCart();
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['reqUserInfo']),
    ...mapMutations(['INIT_SHOP_CART']),
    // 拉取购物车数据 通过 user_id
    async initShopCart() {
      if (this.userInfo.token) {  // 已登录
        // 获取当前用户购物车中的商品(服务器端)
        let result = await getGoodsCart(this.userInfo.token);
        // 获取成功
        if (result.success_code === 200) {
          let cartArr = result.data;
          let shopCart = {};
          // 遍历
          cartArr.forEach(value => {
            shopCart[value.goods_id] = {
              'id': value.goods_id,
              'name': value.goods_name,
              'small_image': value.small_image,
              'price': value.goods_price,
              'checked': value.checked
            }
          });
          // 本地数据同步
          setStore('shopCart', shopCart);
          this.INIT_SHOP_CART();
        }
      }
    }
  },
  watch: {
    active(val) {
      let tabBarActiveIndex = val > 0 ? val : 0;  // eslint-disable-line no-unused-vars
      // 下标缓存到本地
      sessionStorage.setItem('tabBarActiveIndex', val);
    },
    '$route' (to, from) {
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (toIndex - fromIndex === 0) {
        this.transitionName = '';
      } else if (toIndex > fromIndex) {
        this.transitionName = 'page-left';
      } else {
        this.transitionName = 'page-right';
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  position: absolute;
}
.page-right-enter-active,
.page-right-leave-active,
.page-left-enter-active,
.page-left-leave-active {
  will-change: transform;
  transition: all 0.5s;
  position: absolute;
}
.page-right-enter {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}
.page-right-leave-active {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.page-left-enter {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.page-left-leave-active {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}
</style>