<template>
  <div>
    <van-nav-bar
        style="box-shadow: #cacaca 0 0 5px;"
        :fixed=true
        title="基本信息"
        right-text="保存"
        left-arrow
        @click-left="$router.go(-1)"
        @click-right="completed"
    ></van-nav-bar>
    <van-uploader :after-read="afterRead">
      <img :src="src" />
      <p>点击上传</p>
    </van-uploader>
    <div class="message">
      <div class="message-user">
        <span>昵称</span>
        <input v-model="real_name" type="text">
      </div>
    </div>
  </div>
</template>

<script>
import {uploadImg, userSave} from "@/service/api";
import {mapState, mapMutations} from 'vuex';
import {Notify} from 'vant';
import {imgUrl} from "@/config/port";

export default {
  name: "SetProfile",
  data() {
      return {
        real_name: '',
        icon_url: '',
        src: ''
      }
  },
  mounted() {
    this.real_name = this.userInfo.real_name;
    this.icon_url = this.userInfo.icon_url;
    this.src = imgUrl + this.userInfo.icon_url;
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['UPDATE_USERINFO']),
    // 保存信息
    async completed() {
      let result = await userSave(this.userInfo.token, this.real_name, this.icon_url);
      console.log(result);
      if (result.success_code === 200) {
        // 更新本地用户信息
        this.UPDATE_USERINFO({
          real_name: this.real_name,
          icon_url: this.icon_url
        });
        this.$router.push('/dashBoard/profile');
        Notify({ type: 'success', message: '信息已更新' });
      }
    },
    // 上传头像
    async afterRead(file) {
      file.status = "uploading"; //上传中动画
      file.message = "上传中...";
      let result = await uploadImg(
          file.content.replace(/^data:image\/\w+;base64,/, ""),
          file.file.name,
          file.file.lastmodified
      );
      console.log(file.file.name);
      if (result.success_code === 200) {
        file.status = "done";
        file.message = "上传成功";
        this.icon_url = file.file.name;
        this.src = imgUrl + this.icon_url;
      } else {
        file.status = "failed";
        file.message = "上传失败";
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar .van-icon {
  color: black;
}
::v-deep .van-nav-bar__text {
  color: black;
}
.van-uploader {
  position: relative;
  margin-top: 2.5rem;
  width: 100%;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #fff;
    font-weight: bold;
    opacity: 0.9;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
  }
}
input {
  width: 13.5rem;
  border-radius: 0.2rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1.5px solid #fff;
}
.message {
  padding-top: 1rem;
  width: 100%;
  height: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-user {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #bababa;
  }
  span {
    margin-right: 1rem;
  }
}
</style>