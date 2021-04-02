<template>
  <div class="carousel">
    <swiper class="carousel-swiper" :options="swiperOption">
      <swiper-slide v-for="(item, index) in sowing_list" :key="index">
        <div class="carousel-swiper-content">
          <img @click="none" v-lazy="item.image_url" lazy="item" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper.min.css';

export default {
  name: "Swiper",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    sowing_list: Array
  },
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        pagination: {  // 配置分页
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {  // 自动循环
          delay: 2000,
          disableOnInteraction: false
        },
        speed: 500,  // 速度
        // loop: true  // 循环
      }
    }
  },
  methods: {
    none() {

    }
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  margin-top: 3rem;
  &-swiper {
    &-content {
      text-align: center;
      img {
        width: 18rem;
        height: 7rem;
        border-radius: 0.4rem;
      }
    }
  }
}
</style>