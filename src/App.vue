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
      // console.log('toIndex', toIndex);
      // console.log('fromIndex', fromIndex);
      if (!to.meta.admin && !from.meta.admin) {
        if (to.name === 'login' || from.name === 'login') {
          // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
          if (toIndex > fromIndex) {
            this.transitionName = 'logout-left';
          } else {
            this.transitionName = 'logout-right';
          }
        } else if (toIndex > fromIndex) {
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
.logout-right-enter-active,
.logout-right-leave-active,
.logout-left-enter-active,
.logout-left-leave-active {
  will-change: transform;
  transition: all 0.4s;
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
.logout-right-enter {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}
.logout-right-leave-active {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.logout-left-enter {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}
.logout-left-leave-active {
  opacity: 0;
  transform: translate3d(0, -2rem, 0);
}

.router-right-enter {
  opacity: 0;
  transform: translate3d(-2rem, 0, 0);
}
.router-right-leave-active {
  opacity: 0;
  transform: translate3d(2rem, 0, 0);
}
.router-left-enter {
  opacity: 0;
  transform: translate3d(2rem, 0, 0);
}
.router-left-leave-active {
  opacity: 0;
  transform: translate3d(-2rem, 0, 0);
}
</style>
