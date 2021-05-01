import Vue from "vue";
import Router from 'vue-router';

const DashBoard = () => import("@/views/DashBoard");
const Home = () => import('@/views/home/Home');
const Games = () => import('@/views/games/Games');
const Cart = () => import('@/views/cart/Cart');
const CartIn = () => import('@/views/cart/CartIn');
const Profile = () => import('@/views/profile/Profile');

const Detail = () => import('@/views/detail/Detail');

const Confirm = () => import('@/views/confirm/Confirm');
const Collect = () => import('@/views/collect/Collect');
const Order = () => import('@/views/order/Order');
const OrderDetail = () => import('@/views/orderDetail/OrderDetail');
const SetProfile = () => import('@/views/setProfile/SetProfile');
const CompleteOrder = () => import('@/views/confirm/CompleteOrder');
const Completed = () => import('@/views/confirm/Completed');
const Login = () => import('@/views/login/Login');
const Reset = () => import('@/views/login/Reset');
const ResetPwd = () => import('@/views/login/ResetPwd');

const Admin = () => import('@/views/admin/AdminDashBoard');
const AdminLogin = () => import('@/views/admin/AdminLogin');

Vue.use(Router);

const router =  new Router({
    routes: [
        { path: '/', redirect: 'dashboard' },  // 重定向
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashBoard,
            children: [
                { path: '/dashboard', redirect: '/dashboard/home' },
                { path: 'home', name: 'home', component: Home, meta: { inSide: true, navShow: true, keepAlive: true, index: 1 },},
                { path: 'games', name: 'games', component: Games, meta: { inSide: true,  navShow: true, keepAlive: true, index: 1 },},
                { path: 'cart', name: 'cart', component: Cart, meta: { inSide: true,  navShow: true, keepAlive: false, index: 1 } },
                { path: 'profile', name: 'profile', component: Profile, meta: { inSide: true, navShow: true, keepAlive: false, index: 1 },},

                { path: 'detail', name: 'detail', component: Detail, meta: { navShow: false, keepAlive: false, index: 3 } },
                { path: 'cartIn', name: 'cartIn', component: CartIn, meta: { navShow: false, keepAlive: false, index: 4 } },
                { path: 'confirm', name: 'confirm', component: Confirm, meta: { navShow: false, keepAlive: false, index: 5 } },
                { path: 'completeOrder', name: 'completeOrder', component: CompleteOrder, meta: { index: 6 } },
            ]
        },
        { path: '/collect', name: 'collect', component: Collect, meta: { index: 2 } },
        { path: '/order', name: 'order', component: Order, meta: { index: 2 } },
        { path: '/setProfile', name: 'setProfile', component: SetProfile, meta: { index: 2 } },
        { path: '/orderDetail', name: 'orderDetail', component: OrderDetail, meta: { index: 3 } },
        { path: '/completed', name: 'completed', component: Completed, meta: { index: 1 } },
        { path: '/login', name: 'login', component: Login, meta: { index: 4 } },
        { path: '/reset', name: 'reset', component: Reset, meta: { index: 5 } },
        { path: '/resetPwd', name: 'resetPwd', component: ResetPwd, meta: { index: 6 } },

        // -----------------------------------------------------------------------

        { path: '/admin', name: 'admin', component: Admin, meta: { admin: true } },
        { path: '/adminLogin', name: 'adminLogin', component: AdminLogin, meta: { admin: true } },
    ]
});

export default router;
