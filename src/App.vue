<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    '$route' (to, from) {
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (!to.meta.inSide || !from.meta.inSide) {
        if (toIndex > fromIndex) {
          this.transitionName = 'router-left';
        } else {
          this.transitionName = 'router-right';
        }
      }
    }
  }
}
</script>

<style lang="scss">
.view {
  width: 100%;
  height: 100%;
  position: absolute;
}
.router-right-enter-active,
.router-right-leave-active,
.router-left-enter-active,
.router-left-leave-active {
  will-change: transform;
  transition: all 0.4s;
  position: absolute;
}
.router-right-enter {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}
.router-right-leave-active {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.router-left-enter {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.router-left-leave-active {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}

//.router-right-enter {
//  opacity: 0;
//  transform: translate3d(-2rem, 0, 0);
//}
//.router-right-leave-active {
//  opacity: 0;
//  transform: translate3d(2rem, 0, 0);
//}
//.router-left-enter {
//  opacity: 0;
//  transform: translate3d(2rem, 0, 0);
//}
//.router-left-leave-active {
//  opacity: 0;
//  transform: translate3d(-2rem, 0, 0);
//}

</style>
