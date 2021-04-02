import {UPDATE_USERINFO, CLEAR_CART, INIT_USER_INFO, SELECTED_All_GOODS, SELECTED_SINGER_GOODS, USER_INFO, RESET_USER_INFO, ADD_GOODS, INIT_SHOP_CART, REDUCE_CART} from './mutations-type';
import { setStore, removeStore, getStore } from "@/config/global";
import Vue from "vue";

export default {
    // 添加订单号
    setOrderId(state, orderCode) {
        let orderId = state.orderId;
        orderId = orderCode;
        state.orderId = orderId;
        setStore('orderId', state.orderId);
    },
    // 1. 向购物车添加数据 (向 state 的 shopCart 添加数据)
    [ADD_GOODS](state, {goodsId, goodsName, smallImage, goodsPrice}) {
        let shopCart = state.shopCart;
        shopCart[goodsId] = {
            "id": goodsId,
            "name": goodsName,
            "small_image": smallImage,
            "price": goodsPrice,
            "checked": true
        }

        // 1.2 产生新对象
        state.shopCart = {...shopCart};

        // 1.3 存入本地
        setStore('shopCart', state.shopCart);
    },

    // 2. 获取购物车数据 本地获取
    [INIT_SHOP_CART](state) {
      let initCart = getStore('shopCart');
      if (initCart) {
          // 存入到 state shopCart
          state.shopCart = JSON.parse(initCart);
      }
    },

    // 3. 商品移除购物车
    [REDUCE_CART](state) {
        let shopCart = state.shopCart;
        Object.values(shopCart).forEach(goods => {
            if (goods.checked === true) {
                delete shopCart[goods.id];
            }
        });

        // 同步数据
        state.shopCart = {...shopCart};
        setStore('shopCart', state.shopCart);
    },

    // 4. 单个商品的选中和取消选中
    [SELECTED_SINGER_GOODS](state, {goodsId}) {
        let shopCart = state.shopCart;
        let goods = shopCart[goodsId];
        if (goods) {
            if (goods.checked) {
                goods.checked = !goods.checked;
            } else {  // 没有checked属性 进行添加
                Vue.set(goods, ['checked', true]);
            }
        }

        // 同步数据
        state.shopCart = {...shopCart};
        setStore('shopCart', state.shopCart);
    },

    // 5. 全选和取消全选
    [SELECTED_All_GOODS](state, {isSelected}) {
        let shopCart = state.shopCart;
        // 遍历对象
        Object.values(shopCart).forEach(goods => {
            if (goods.checked) {  // 存在该属性
                goods.checked = !isSelected;
            } else {  // 不存在 添加该属性
                Vue.set(goods, 'checked', !isSelected);
            }
        });

        // 同步数据
        state.shopCart = {...shopCart};
        setStore('shopCart', state.shopCart);
    },

    // 6, 清空购物车
    [CLEAR_CART](state) {
        state.shopCart = null;
        state.shopCart = {...state.shopCart};
        setStore('shopCart', state.shopCart);
    },

    // 7. 保存用户信息到本地
    [USER_INFO](state, {userInfo}){
        state.userInfo = userInfo;
        setStore('userInfo', state.userInfo);
    },

    // 8. 获取用户信息
    [INIT_USER_INFO](state) {
        // 获取用户信息
        let userInfo = getStore('userInfo');
        // 判断
        if (userInfo) {
            state.userInfo = JSON.parse(userInfo);
        }
    },

    // 9. 退出登陆
    [RESET_USER_INFO](state) {
        state.userInfo = {};
        removeStore('userInfo');
    },

    // 10. 更新用户信息
    [UPDATE_USERINFO](state, {real_name, icon_url}) {
        // 获取用户信息
        let userInfo = state.userInfo;
        userInfo.real_name = real_name;
        userInfo.icon_url = icon_url;
        // 同步数据
        state.shopCart = {...userInfo};
        setStore('userInfo', state.userInfo);
    }
};