<template>
  <div class="variety">
    <p class="variety-title">【史低】限时折扣</p>
    <ul>
      <li @click="$emit('goDetail', item._id)" class="variety-item" v-for="(item, index) in discount_list" :key="index">
        <img :src="item.img" lazy="item" />
        <p>{{ item.title | titleFormat }}</p>
        <div class="variety-item-price">
          <span>{{ item.cur_price | moneyFormat }}</span>
          <span>{{ item.ori_price | moneyFormat }}</span>
          <span>-{{ item.discount * 100 }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Discount",
  props: {
    discount_list: Array
  },
  methods: {
    goDetail(id) {
      // 将所选商品id传递给详情页
      this.$router.push({
        path: '/detail',
        query: {
          id: id
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.variety {
    margin-top: 0.2rem;
    text-align: left;
  &-title {
    margin: 0.6rem 0 0 0.2rem;
  }
  //父元素
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  //子元素
    &-item {
      flex-basis: 45%;
      margin-top: 0.5rem;
      p {
        margin-top: 0.3rem;
      }
      &-price {
        display: flex;
        justify-content: flex-start;
        span:nth-child(1) {
          font-weight: bold;
        }
        span:nth-child(2) {
          color: #aaaaaa;
          text-decoration: line-through;
          margin: 0 0.6rem;
        }
        span:nth-child(3) {
          color: red;
          width: 0.7rem;
          text-align: center;
          //background-color: orangered;
          border-radius: 0.1rem;
        }
      }
    }
  img {
    width: 9rem;
    height: 5rem;
    border-radius: 0.4rem;
    background-image: url('./../../../assets/loading.gif');
    background-repeat: no-repeat;
    background-position:center center;
  }
}
</style>