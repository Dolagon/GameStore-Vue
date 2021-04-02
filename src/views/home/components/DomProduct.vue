<template>
  <div @click="$emit('goSpecial', 5)" class="variety">
    <p class="variety-title">【推荐】剧情精选</p>
    <div class="variety-box">
      <p>剧情精选</p>
      <van-count-down style="margin-left: 0.8rem;margin-top: 1rem;" :time="time">
        <template #default="timeData">
          <span class="block">{{ timeData.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.seconds }}</span>
        </template>
      </van-count-down>
      <p>查看全部 > </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DomProduct",
  data() {
    return {
      time: 24 * 60 * 60 * 1000,
      timeData: [
        { hours: 0 },
        { minutes: 0 },
        { seconds: 0 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.colon {
  display: inline-block;
  margin: 0 0.2rem;
  color: #ee0a24;
}
.block {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  color: #fff;
  font-size: 0.4rem;
  text-align: center;
  line-height: 0.8rem;
  background-color: #ee0a24;
}
.variety {
  margin-top: 0.2rem;
  text-align: left;
  &-title {
    margin: 0.6rem 0 0.6rem 0.2rem;
  }
  &-box {
    width: 90%;
    height: 7rem;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0%);
    border-radius: 0.4rem;
    background: url("images/dyson.jpg") no-repeat;
    background-size: cover;
    color: white;
    p:nth-child(1) {
      font-weight: bold;
      margin-left: 0.8rem;
      padding-top: 1rem;
    }
    P:nth-child(3) {
      margin-left: 0.8rem;
      padding-top: 0.8rem;
      font-size: 0.5rem;
    }
  }
}
</style>