<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <van-nav-bar style="box-shadow: #cacaca 0 0 5px;" :fixed=true title="心愿单" left-arrow @click-left="$router.go(-1)"></van-nav-bar>

    <!-- 商品 -->
    <div class="container">
      <!-- 商品列表 -->
      <van-list v-if="productList.length !== 0" class="content">
        <div class="content-item" v-for="(item, index) in productList" :key="index">
          <div @click="goDetail(item.goods_id)" class="content-item-left">
            <img :src="item.img" alt="">
          </div>
          <div class="content-item-right">
            <p @click="goDetail(item.goods_id)">{{ item.title | titleFormat }}</p>
            <p @click="goDetail(item.goods_id)">{{ item.cur_price | moneyFormat }}</p>
            <van-button @click="delCollect(item.goods_id)" id="del">删除</van-button>
            <van-button @click="addToCart(item)" id="add">加入购物车</van-button>
          </div>
      </div>
      </van-list>
      <van-empty v-else description="没有数据" />
    </div>
  </div>
</template>

<script>
import {addGoodsToCart, getCollect, delCollect} from "@/service/api";
import {Toast} from 'vant';
import {mapState, mapMutations} from 'vuex';
import animate from 'animate.css';  // eslint-disable-line no-unused-vars

export default {
  name: 'Collect',
  data() {
    return {
      productList: [],
    }
  },
  mounted() {
    this.getCollectList();
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['ADD_GOODS']),
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
    // 获取用户心愿单
    async getCollectList() {
      let result = await getCollect(this.userInfo.token);
      console.log(result);
      if (result.success_code === 200) {
        this.productList = result.data.reverse();
      } else {
        console.log(result);
      }
    },
    // 根据id删除一条商品
    async delCollect(goods_id) {
      let result = await delCollect(this.userInfo.token, goods_id);
      if (result.success_code === 200) {
        this.getCollectList();
        Toast('已删除');
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
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
.container {
  margin-top: 2.3rem;
  margin-bottom: 3rem;
  overflow-y: scroll;
  .content-item {
    padding: 0.3rem;
    border-radius: 0.2rem;
    box-shadow: #cacaca 0 0 5px;
    display: flex;
    margin: 1rem 1rem;
    height: 4.4rem;
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
#del {
  background-color: #f1f1f1;
  width: 3rem;
  height: 1.5rem;
  font-size: 0.6rem;
  border-radius: 1rem;
  float: right;
}
#add {
  color: white;
  background-color: #7232dd;
  width: 5rem;
  height: 1.5rem;
  font-size: 0.6rem;
  border-radius: 1rem;
  margin-right: 0.7rem;
  float: right;
}
</style>