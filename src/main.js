import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 配置FastClick
import FastClick from 'fastclick';
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

// 引入全局样式
import '@/assets/js/rem';
import '@/assets/css/reset.css';

// 粒子背景
import VueParticles from 'vue-particles';
Vue.use(VueParticles);

// 拷贝插件
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// 引入全局组件库
import '@/plugins/vant';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 全局过滤器
Vue.filter('moneyFormat', value => {
  return '¥' + Number(value).toFixed(1);
});
Vue.filter('titleFormat', value => {
  return value.slice(0, 22);
});
Vue.filter('dateFormat', value => {
  const dt = new Date(value);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + 1 + '').padStart(2, '0');

  // const hh = (dt.getHours() + '').padStart(2, '0');
  // const mm = (dt.getMinutes() + '').padStart(2, '0');
  // const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d}`;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
