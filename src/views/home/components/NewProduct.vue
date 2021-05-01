<template>
  <div class="variety">
    <p class="variety-title">【新作】最新佳作推荐</p>
    <ul>
      <li @click="$emit('goDetail', item._id)" class="variety-item" v-for="(item, index) in new_list" :key="index">
        <img :src="item.img" lazy="item" />
        <p style="margin-top: 0.2rem;">{{ item.title | titleFormat }}</p>
        <p>{{ item.cur_price | moneyFormat }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NewProduct",
  props: {
    new_list: Array
  }
}
</script>

<style lang="scss" scoped>
.variety {
  margin-top: 0.2rem;
  text-align: left;
  &-title {
    margin: 0.6rem 0 0 0.7rem;
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
    p:nth-child(2) {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
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