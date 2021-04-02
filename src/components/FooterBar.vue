<template>
  <div id="box">
    <van-tabbar v-model="active">
      <van-tabbar-item to="/" icon="wap-home">商城</van-tabbar-item>
      <van-tabbar-item to="/dashboard/games" icon="cluster">游戏</van-tabbar-item>
      <van-tabbar-item to="/dashboard/cart" icon="shopping-cart">购物车</van-tabbar-item>
      <van-tabbar-item to="/dashboard/profile" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "FooterBar",
  data() {
    return {
      active: 0,
    };
  }
}
</script>

<style scoped>

</style>