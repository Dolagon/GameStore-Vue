<template>
  <div id="cart">
    <!--头部区域-->
    <van-nav-bar
        left-text="购物车"
        :right-text="right_text"
        @click-right="controlDel"
        class="nav-title"
        :fixed=true
    >
    </van-nav-bar>

    <div class="line"></div>
    <div class="contentWrapper">
      <!--中间内容-->
      <main v-if="Object.keys(shopCart).length !== 0" class="contentWrapperList">
        <section>
          <div class="shopCartListCon" v-for="item in shopCart" :key="item.id">
            <van-checkbox checked-color="red" @click.stop="singerGoodsSelected(item.id)" style="margin: 0 0.6rem" v-model="item.checked"></van-checkbox>
            <div class="center">
              <img :src="item.small_image" alt="">
            </div>
            <div class="right">
              <a>{{ item.name }}</a>
              <div class="bottomContent">
                <p class="shopPrice">{{ item.price | moneyFormat }}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <van-empty v-else description="购物车为空" />

      <!--底部通栏-->
      <van-submit-bar
          :disabled="disabled_btn"
          style="margin-bottom: 2.2rem;"
          :button-color="button_color"
          :price="totalPrice"
          text-align="left"
          :button-text="selectedCount"
          @submit="onSubmit"
      >
        <van-checkbox checked-color="red" :style="style" @click.stop="selectedAll(isSelectedAll)" v-model="isSelectedAll"></van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import {Toast} from 'vant'
import {delAllSelectedGoods, allGoodsSelect, singerGoodsSelect} from "@/service/api";
import preventBack from "vue-prevent-browser-back";

export default {
  name: "Cart",
  mixins: [preventBack],
  data() {
    return {
      button_color: '#a163f7',
      button_text: '去结算',
      right_text: '管理',
      style: 'position: relative;left: -0.3rem;'
    }
  },
  computed: {
    // 取得购物车数据
    ...mapState(['shopCart', 'userInfo']),
    // 商品总件数
    goodsCount() {
      return Object.keys(this.shopCart).length;
    },
    // 选中个数
    selectedCount() {
      let total = 0;
      Object.values(this.shopCart).forEach(goods => {
        if (goods.checked === true) {
          total++;
        }
      });
      return `${this.button_text}(${total})`;
    },
    // 商品是否全选
    isSelectedAll() {
      let tag = this.goodsCount > 0;
      Object.values(this.shopCart).forEach(goods => {
        if (!goods.checked) {  // 有一个商品为非选中则取消全选
          tag = false;
        }
      });
      return tag;
    },
    // 是否禁用按钮
    disabled_btn() {
      let tag = true;
      if (this.isSelectedAll) tag = false;
      Object.values(this.shopCart).forEach(goods => {
        if (goods.checked) {  // 有一个商品为选中
          tag = false;
        }
      });
      return tag;
    },
    // 计算商品总价
    totalPrice() {
      let price = 0;
      Object.values(this.shopCart).forEach(goods => {
        if (goods.checked === true) {
          price += goods.price;
        }
      });
      return price * 100;
    }
  },
  methods: {
    ...mapMutations(['SELECTED_SINGER_GOODS', 'SELECTED_All_GOODS', 'REDUCE_CART']),
    // 提交订单 或 选择删除
    async onSubmit() {
      if (this.button_text === '删除') {
        let result = await delAllSelectedGoods(this.userInfo.token);
        if (result.success_code === 200) {
          // 商品本地移除购物车
          this.REDUCE_CART();
          Toast(result.message);
          this.controlDel();
        }
      } else {
        this.$router.push('/confirm');
      }
    },
    // 单个商品选中个取消选中
    async singerGoodsSelected(id) {
      let result = await singerGoodsSelect(this.userInfo.token, id);
      if (result.success_code === 200) {
        this.SELECTED_SINGER_GOODS({id});
      }
    },
    // 全选和取消全选
    async selectedAll(isSelected) {
      let result = await allGoodsSelect(this.userInfo.token, isSelected);
      if (result.success_code === 200) {
        this.SELECTED_All_GOODS({isSelected});
      }
    },
    controlDel() {
      this.selectedAll(true);
      if (this.right_text === '管理') {
        this.right_text = '完成';
        this.button_color = '#999999';
        this.button_text = '删除';
        this.price = null;
        this.style = 'position: relative;left: -0.3rem;';
      } else {
        this.right_text = '管理';
        this.button_color = '#a163f7';
        this.button_text = '去结算';
        this.price = 0;
        this.style = 'position: relative;left: -0.3rem;';
        // this.style = 'position: relative;left: -11.65rem;';
      }
    },
  }
}
</script>

<style scoped>
.van-empty {
  width: 14rem;
  position: absolute; left: 50%; top: 40%;
  transform: translate(-50%, -50%);
}
.line {
  margin-top: 2.2rem;
  background-color: #efefef;
  height: 0.5rem;
}
::v-deep .van-nav-bar__text {
  color: black;
}
::v-deep .van-nav-bar .van-icon {
  color: black;
}
#cart{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
/*列表内容*/
.contentWrapperList{
  padding-bottom: 6rem;
}

.contentWrapperList section{
  background-color: #fff;
}

.shopCartListCon{
  display: flex;
  height: 4rem;
  border-bottom:  0.01rem solid #e0e0e0;
  margin-bottom: 0.7rem;
  padding: 0.5rem 0;
}

.shopCartListCon .left{
  /*background: purple;*/
  flex: 1;
  display: flex;
  /*justify-content: center;*/
}

.shopCartListCon .left a{
  display: inline-block;
  margin-top: 0.8rem;
  margin-left: 0.5rem;
}


.shopCartListCon .center{
  /*background: blue;*/
  flex: 4;
}

.shopCartListCon .center img{
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.shopCartListCon .right{
  /*background: orangered;*/
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  position: relative;
}

.shopCartListCon .right a{
  height: 2.2rem;
  line-height: 1.2rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  color: #000;
}

.shopCartListCon .bottomContent{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.shopCartListCon .bottomContent .shopPrice{
  font-size: 0.8rem;
}

.shopCartListCon .right .shopDeal span{
  display: inline-block;
  width: 1rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  float: left;
}

.shopCartListCon .right .shopDeal input{
  float: left;
  width: 2rem;
  height: 1.2rem;
  text-align: center;
  margin: 0 0.2rem;
  font-size: 0.8rem;
}

</style>
