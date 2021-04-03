<template>
  <div id="mine">
    <van-cell-group>
      <!-- #3bba63 -->
      <van-cell class="person">
        <template #title>
          <p class="person-title">Profile</p>
          <div class="person-msg">
            <img :src="src" />
            <p>{{ userInfo.real_name }}</p>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-cell to="/order" title="订单" >
        <template #right-icon>
          <van-icon name="orders-o" class="orders-o" />
        </template>
      </van-cell>
      <van-cell to="/collect" title="心愿单">
        <template #right-icon>
          <van-icon name="like-o" class="like-o" />
        </template>
      </van-cell>
      <van-cell @click="showShare = true" title="设置">
        <template #right-icon>
          <van-icon name="setting-o" class="setting-o" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-action-sheet
        v-model="showShare"
        :actions="actions"
        cancel-text="取消"
        description="设置"
        close-on-click-action
        @select="onSelect"
    />
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import {getLogOut} from "@/service/api";
import { Notify } from 'vant';
import {imgUrl} from '@/config/port'
import preventBack from "vue-prevent-browser-back";

export default {
  name: "Profile",
  mixins: [preventBack],
  data() {
    return {
      showShare: false,
      src: '',
      actions: [
        { name: '基本信息' },
        { name: '退出登陆', color: '#ee0a24' }
      ]
    }
  },
  mounted() {
    this.src = imgUrl + this.userInfo.icon_url;
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['RESET_USER_INFO', 'CLEAR_CART']),
    async onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false;
      if (item.name === '退出登陆') {
        let result = await getLogOut();
        console.log('退出登陆 API:', result);
        if (result.success_code === 200) {
          // 清空本地数据
          this.RESET_USER_INFO();
          // 清空本地购物车
          this.CLEAR_CART();
          Notify({ type: 'success', message: '已退出登陆' });
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/setProfile');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#mine {
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;
}

::v-deep .van-nav-bar__title {
  color: #fff;
}

.person {
  background-image: url(images/violet.jpg) ;
  background-attachment:fixed;
  background-repeat:no-repeat;
  background-size:cover;
  -moz-background-size:cover;
  -webkit-background-size:cover;
  color: white;
  height: 20rem;
  position: relative;
  &-title {
    font-size: 1.5rem;
    margin-top: 1rem;
    margin-left: 0.6rem;
  }
  &-msg {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 1rem;
    line-height: 3rem;
  }
  img {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    padding: 0.1rem;
    border: 0.1rem solid #fff;
    background-color: #fff;
    background-image: url('./../../assets/loading.gif');
    background-repeat: no-repeat;
    background-position:center center;
  }
  #loading {
    position: absolute;
  }
}
</style>