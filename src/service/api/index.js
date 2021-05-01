import ajax from './ajax'

const LOCAL_BASE_URL = 'http://store.kaedea.ltd/web/xlmc';
// const LOCAL_BASE_URL = 'http://localhost:3001/web/xlmc';
// const LOCAL_BASE_URL = '/api';

// 添加管理员
export const addAdmin = (user_name, user_pwd, e_mail) => ajax(LOCAL_BASE_URL + '/api/admin/add', { user_name, user_pwd, e_mail }, 'POST');
// 管理员登陆验证
export const adminLogin = (user_name, user_pwd) => ajax(LOCAL_BASE_URL + '/api/admin/login', { user_name, user_pwd }, 'POST');
// 根据id删除管理员
export const delAdmin = (admin_id, user_name) => ajax(LOCAL_BASE_URL + '/api/admin/remove/' + admin_id, { user_name }, 'POST');
// 获取所有管理员信息
export const getAdminList = () => ajax(LOCAL_BASE_URL + '/api/admin/list');

// 添加商品
export const addProduct = (title, img, ori_price, cur_price, discount, type, developers, publisher, pun_date, language, system, content) => ajax(LOCAL_BASE_URL + '/api/product/add', {title, img, ori_price, cur_price, discount, type, developers, publisher, pun_date, language, system, content}, 'POST');
// 获取商品数据 每页5条 分类可选
export const getProductList = (page, pageSize, type = '') => ajax(LOCAL_BASE_URL + '/api/product/list', { page, pageSize, type });
// 根据分类获取对应的商品总数
export const getProductByType = (type = '') => ajax(LOCAL_BASE_URL + '/api/product/total', { type });
// 获取总页数
export const getProductPage = (type = '') => ajax(LOCAL_BASE_URL + '/api/product/page', { type });
// 根据id删除商品
export const delProduct = (product_id) => ajax(LOCAL_BASE_URL + '/api/product/remove/' + product_id);
// 根据id获取单个商品信息
export const getProductById = (product_id) => ajax(LOCAL_BASE_URL + '/api/product/search/' + product_id);
// 根据id获取商品 restful
export const getProductByIdRestful = (product_id) => ajax(LOCAL_BASE_URL + '/api/product/searchItem', { product_id });
// 搜索商品
export const searchProduct = (keywords = '') => ajax(LOCAL_BASE_URL + '/api/product/searchKeywords', { keywords });
// 根据id修改商品信息
export const editProduct = (product_id, title, img, ori_price, cur_price, discount, type, developers, publisher, pun_date, language, system, content) => ajax(LOCAL_BASE_URL + '/api/product/edit', { product_id, title, img, ori_price, cur_price, discount, type, developers, publisher, pun_date, language, system, content }, 'POST');

// 添加轮播图
export const addSowing = (image_title, image_url, image_link, s_time, e_time) => ajax(LOCAL_BASE_URL + '/api/sowing/add', { image_title, image_url, image_link, s_time, e_time }, 'POST');
// 获取轮播图数据
export const getSowingList = () => ajax(LOCAL_BASE_URL + '/api/sowing/list');
// 根据id删除轮播图
export const delSowing = (sowing_id) => ajax(LOCAL_BASE_URL + '/api/sowing/remove/' + sowing_id);
// 根据id获取单个轮播图信息
export const getSowingById = (sowing_id) => ajax(LOCAL_BASE_URL + '/api/sowing/search/' + sowing_id);
// 根据id修改轮播图信息
export const editSowing = (sowing_id, image_title, image_url, image_link, s_time, e_time) => ajax(LOCAL_BASE_URL + '/api/sowing/edit', { sowing_id, image_title, image_url, image_link, s_time, e_time }, 'POST');

// 2.3 用户名密码登陆 (post)
export const pwdLogin = (user_name, user_pwd) => ajax(LOCAL_BASE_URL + '/api/login_pwd', {user_name, user_pwd}, 'POST');
// 用户注册
export const userSingUp = (user_name, user_pwd, phone) => ajax(LOCAL_BASE_URL + '/api/signup', {user_name, user_pwd, phone}, 'POST');
// 2.4 自动登陆
export const getUserInfo = () => ajax(LOCAL_BASE_URL + '/api/userinfo');
// 2.5 退出登陆
export const getLogOut = () => ajax(LOCAL_BASE_URL + '/api/logout');
// 2.6 验证用户手机号
export const verifyPhone = (user_name, phone) => ajax(LOCAL_BASE_URL + '/api/verify_phone', {user_name, phone}, 'POST');
// 2.7 获取短信验证码
export const getPhoneCode = (phone) => ajax(LOCAL_BASE_URL + '/api/send_code', {phone});
// 2.8 验证验证码
export const verifyCode = (phone, code) => ajax(LOCAL_BASE_URL + '/api/verify_code', {phone, code}, 'POST');
// 2.9 修改用户密码
export const changePwd = (user_name, password) => ajax(LOCAL_BASE_URL + '/api/change_pwd', {user_name, password}, 'POST');


// 3. 购物车接口
// 3.1 添加商品购物车
export const addGoodsToCart = (user_id, goods_id, goods_name, goods_price, small_image) => ajax(LOCAL_BASE_URL + '/api/cart/add', {user_id, goods_id, goods_name, goods_price, small_image}, 'POST');
// 3.2 获取当前用户购物车中商品 (get)
export const getGoodsCart = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/search/' + user_id);
// 3.5 单个商品的选中和取消选中
export const singerGoodsSelect = (user_id, goods_id) => ajax(LOCAL_BASE_URL + '/api/cart/singer_select', {user_id, goods_id}, 'POST');
// 3.6 所有商品的选中和取消
export const allGoodsSelect = (user_id, flag) => ajax(LOCAL_BASE_URL + '/api/cart/all_select', {user_id, flag}, 'POST');
// 3.7 查询所有已经被选中的商品
export const getAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/selected/' + user_id);
// 3.8 删除已经选中的商品
export const delAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/del_checked/' + user_id);

// 5. 订单接口
// 5.1 提交订单
export const postOrder = (user_id, cart_shop, shop_price, order_code, ctime) => ajax(LOCAL_BASE_URL + '/api/order/post', {user_id, cart_shop, shop_price, order_code, ctime}, 'POST');
// 5.2 订单支付成功
export const orderPaySuccess = (user_id, order_code) => ajax(LOCAL_BASE_URL + '/api/order/change_status', {user_id, order_code}, 'POST');
// 5.3 查询订单
export const getOrder = (user_id, status) => ajax(LOCAL_BASE_URL + '/api/order/get', {user_id, status}, 'POST'); // pay will
// 支付宝支付接口
export const aliPay = (order_code, price, local_url) => ajax(LOCAL_BASE_URL + '/api/order/alipay', {order_code, price, local_url}, 'POST');
// 根据订单号查询订单
export const getOrderId = (user_id, order_code) => ajax(LOCAL_BASE_URL + '/api/order/getById', {user_id, order_code}, 'POST');
// 根据订单号删除订单
export const delOrder = (user_id, order_code) => ajax(LOCAL_BASE_URL + '/api/order/remove', {user_id, order_code}, 'POST');


// 添加商品到愿望单
export const addCollect = (user_id, goods_id, title, img, cur_price) => ajax(LOCAL_BASE_URL + '/api/collect/add', {user_id, goods_id, title, img, cur_price}, 'POST');
// 获取用户愿望单商品列表
export const getCollect = (user_id) => ajax(LOCAL_BASE_URL + '/api/collect/get/' + user_id);
// 删除心愿单
export const delCollect = (user_id, goods_id) => ajax(LOCAL_BASE_URL + '/api/collect/remove', {user_id, goods_id}, 'POST');
// 查询心愿单是否存在该商品
export const inCollect = (user_id, goods_id) => ajax(LOCAL_BASE_URL + '/api/collect/inList', {user_id, goods_id}, 'POST');
// 用戶圖像上傳
export const uploadImg = (imgData, imgName, lastmodified) => ajax(LOCAL_BASE_URL + '/api/user_img', {imgData, imgName, lastmodified},  'POST');
// 保存用户修改的信息
export const userSave = (user_id, real_name, icon_url) => ajax(LOCAL_BASE_URL + '/api/user_set', {user_id, real_name, icon_url}, 'POST');

// 添加关键词
export const addKeyword = (user_id, keyword) => ajax(LOCAL_BASE_URL + '/api/history_word', {user_id, keyword}, 'POST');
// 获取用户搜索历史
export const getKeywords = (user_id) => ajax(LOCAL_BASE_URL + '/api/get_keyword/' + user_id);
// 删除搜索历史
export const delKeywords = (user_id) => ajax(LOCAL_BASE_URL + '/api/del_keyword/' + user_id);