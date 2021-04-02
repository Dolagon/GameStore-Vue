import Vue from "vue";
import Router from 'vue-router';

const DashBoard = () => import("@/views/DashBoard");
const Home = () => import('@/views/home/Home');
const Games = () => import('@/views/games/Games');
const Cart = () => import('@/views/cart/Cart');
const CartIn = () => import('@/views/cart/CartIn');
const Profile = () => import('@/views/profile/Profile');
const Detail = () => import('@/views/detail/Detail');
const Special = () => import('@/views/special/Special');
const Scene = () => import('@/views/special/Scene');
const Search = () => import('@/views/search/Search');
const Confirm = () => import('@/views/confirm/Confirm');
const Collect = () => import('@/views/collect/Collect');
const Order = () => import('@/views/order/Order');
const OrderDetail = () => import('@/views/orderDetail/OrderDetail');
const SetProfile = () => import('@/views/setProfile/SetProfile');
const CompleteOrder = () => import('@/views/confirm/CompleteOrder');
const Completed = () => import('@/views/confirm/Completed');
const Login = () => import('@/views/login/Login');

const Admin = () => import('@/views/admin/AdminDashBoard');
const AdminLogin = () => import('@/views/admin/AdminLogin');

Vue.use(Router);

const router =  new Router({
    // mode: 'history',
    routes: [
        { path: '/', redirect: 'dashboard' },  // 重定向
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashBoard,
            children: [
                { path: '/dashboard', redirect: '/dashboard/home' },
                { path: 'home', name: 'home', components: { default: Home, 'dashBoard': DashBoard}, meta: { inSide: true, navShow: true, keepAlive: true, index: 1 }, },
                { path: 'games', name: 'games', components: { default: Games, 'dashBoard': DashBoard }, meta: { inSide: true,  navShow: true, keepAlive: true, index: 1 } },
                { path: 'cart', name: 'cart', components: { default: Cart, 'dashBoard': DashBoard }, meta: { inSide: true,  navShow: true, index: 1 } },
                { path: 'cartIn', name: 'cartIn', components: { default: CartIn, 'dashBoard': DashBoard }, meta: { inSide: false,  navShow: false, index: 4 } },
                { path: 'profile', name: 'profile', components: { default: Profile, 'dashBoard': DashBoard }, meta: { inSide: true,  navShow: true, index: 1 },},

                { path: 'detail', name: 'detail', component: Detail, meta: { inSide: true,  navShow: false, index: 3 } },
                { path: 'special', name: 'special', component: Special, meta: { inSide: true,  navShow: false, keepAlive: true, index: 2 } },
                { path: 'scene', name: 'scene', component: Scene, meta: { inSide: true,  navShow: false, keepAlive: true, index: 2 } }
            ]
        },
        // { path: '/special', name: 'special', component: Special, meta: { index: 2 } },
        { path: '/search', name: 'search', component: Search, meta: { index: 2 } },
        { path: '/confirm', name: 'confirm', component: Confirm, meta: { index: 4 } },
        { path: '/collect', name: 'collect', component: Collect, meta: { index: 2 } },
        { path: '/order', name: 'order', component: Order, meta: { index: 2 } },
        { path: '/setProfile', name: 'setProfile', component: SetProfile, meta: { index: 2 } },
        { path: '/orderDetail', name: 'orderDetail', component: OrderDetail, meta: { index: 3 } },
        { path: '/completeOrder', name: 'completeOrder', component: CompleteOrder, meta: { index: 5 } },
        { path: '/completed', name: 'completed', component: Completed, meta: { index: 6 } },
        { path: '/login', name: 'login', component: Login, meta: { index: 4 } },

        // -----------------------------------------------------------------------

        { path: '/admin', name: 'admin', component: Admin },
        { path: '/adminLogin', name: 'adminLogin', component: AdminLogin },
    ]
});

export default router;
