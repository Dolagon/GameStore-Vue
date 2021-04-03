<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <remote-css href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.css" />
    <input type="checkbox" id="check">
    <label for="check">
      <!-- <i class="fas fa-bars" id="btn"></i> -->
      <!-- <i class="fas fa-times" id="cancel"></i> -->
      <i class="el-icon-s-operation" id="btn"></i>
      <i class="el-icon-arrow-left" id="cancel"></i>
    </label>
    <div class="sidebar">
      <header style="margin-right: 30px;">Game Store</header>
      <ul style="border-top: 1px solid black;">
        <li><a @click="userCenter" href="javascript:void(0);"><i class="fas fa-user"></i>用户中心</a></li>
        <li><a @click="sowingControl" href="javascript:void(0);"><i class="fas fa-image"></i>轮播图管理</a></li>
        <li><a @click="productControl" href="javascript:void(0);"><i class="fas fa-stream"></i>商品管理</a></li>
<!--        <li><a @click="dataStatistics" href="javascript:void(0);"><i class="fas fa-database"></i>数据统计</a></li>-->
      </ul>
    </div>
    <section>
<!--      <div class="section-header"></div>-->
      <i @click="exit" ref="exit" class="el-icon-switch-button" id="btnLeave"></i>
      <div class="exit"></div>
      <transition v-if="showPage" name="custom-classes-transition" enter-active-class="animated animate__fadeIn" >
        <UserCenter v-if="showUserCenter" :admin_data="admin_data"></UserCenter>
        <SowingControl v-if="showSowingControl"></SowingControl>
        <ProductControl v-if="showProductControl"></ProductControl>
        <DataStatistics v-if="showData"></DataStatistics>
      </transition>
    </section>
  </div>
</template>

<script>
import UserCenter from "@/views/admin/AdminDashBoard/UserCenter";
import SowingControl from "@/views/admin/AdminDashBoard/SowingControl";
import ProductControl from "@/views/admin/AdminDashBoard/ProductControl";
import DataStatistics from "@/views/admin/AdminDashBoard/DataStatistics";

import animate from 'animate.css';  // eslint-disable-line no-unused-vars

export default {
  name: "AdminDashBoard",
  components: {
    'remote-css': {
      render(createElement) {
        return createElement('link', { attrs: { rel: 'stylesheet', href: this.href }});
      },
      props: {
        href: { type: String, required: true },
      }
    },
    UserCenter,
    SowingControl,
    ProductControl,
    DataStatistics,
  },
  data() {
    return {
      admin_data: this.$route.query.data,
      showUserCenter: true,
      showSowingControl: false,
      showProductControl: false,
      showData: false,
      showPage: true
    }
  },
  // 后台路由前置守卫
  beforeRouteEnter(to, from, next) {
    if (to.path !== '/adminLogin') {
      if (window.adminLogin) {
        next();
      } else {
        next('/adminLogin?redirect=' + to.path);
      }
    } else {
      next();
    }
  },
  methods: {
    exit() {
      this.$confirm('是否退出到登陆界面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.push('/adminLogin');
        this.$message({
          type: 'success',
          message: '已退出登陆!'
        });
      });
      // this.$refs.exit.style.pointerEvents = 'none';
    },
    userCenter() {
      this.showUserCenter = true;
      if (this.showUserCenter) this.showAddUser = this.showSowingControl = this.showProductControl = this.showData = false;
    },
    sowingControl() {
      this.showSowingControl = true;
      if (this.showSowingControl) this.showAddUser = this.showUserCenter = this.showProductControl = this.showData = false;
    },
    productControl() {
      this.showProductControl = true;
      if (this.showProductControl) this.showAddUser = this.showUserCenter = this.showSowingControl = this.showData = false;
    },
    dataStatistics() {
      this.showData = true;
      if (this.showData) this.showAddUser = this.showUserCenter = this.showSowingControl = this.showProductControl = false;
    }
  }
}
</script>

<style scoped>
.sidebar{
  position: fixed;
  left: -250px;
  width: 250px;
  height: 100%;
  background: white;
  transition: all .5s ease;
  box-shadow: #7c7c7c 0 0 10px;
}

.sidebar header{
  font-size: 22px;
  color: #063146;
  text-align: center;
  line-height: 70px;
  /*background: #063146;*/
  background: white;
  user-select: none;
}

.sidebar ul a{
  display: block;
  height: 100%;
  width: 100%;
  line-height: 65px;
  font-size: 20px;
  color: #063146;
  padding-left: 40px;
  box-sizing: border-box;
  border-top: 1px solid rgba(255,255,255,.1);
  translation: .4s;
}

ul li:hover a{
  background-color: #e7e7e7;
}

.sidebar ul a i{
  margin-right: 16px;
}


#check{
  display: none;
}

label #btn,label #cancel{
  position: absolute;
  cursor: pointer;
  background: #fff;
  border: 1px solid #0a5275;
  border-radius: 3px;
}

#btnLeave {
  position: absolute;
  cursor: pointer;
  background: #fff;
  border: 1px solid #0a5275;
  border-radius: 3px;
}

label #btn{
  left: 40px;
  top: 25px;
  font-size: 35px;
  color: #0a5275;
  padding: 6px 12px;
  transition: all .5s;
}

#btnLeave {
  right: 40px;
  top: 25px;
  font-size: 35px;
  color: #0a5275;
  padding: 6px 12px;
}

label #cancel{
  z-index: 1111;
  left: -195px;
  top: 17px;
  font-size:30px;
  color: #0a5275;
  padding: 4px 9px;
  transition: all .5s ease;
}

#check:checked ~ .sidebar{
  left: 0;
}

#check:checked ~ label #btn{
  left: 250px;
  opacity: 0;
  pointer-events: none;
}

#check:checked ~ label #cancel{
  left: 195px;
}

#check:checked ~ section{
  margin-left: 250px;
}

section{
  background-color: #f8f9fe;
  background-position: center;
  background-size: cover;
  height: 100vh;
  transition: all .5s;
}

.section-header {
  width: 100%;
  height: 2.5rem;
  background-color: #b8dcff;
  background-image: linear-gradient(62deg, #b8dcff 0%, #00ffff 100%);


  box-shadow: #7c7c7c 0 0 5px;
}
</style>