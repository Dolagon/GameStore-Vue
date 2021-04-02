import Vue from 'vue';
import {
    Search, CountDown, ShareSheet, ActionSheet, SubmitBar, Uploader,
    Checkbox, CheckboxGroup, Empty, NoticeBar,
    Button, Card, Cell,
    CellGroup,
    Col,
    Field, Form, GoodsAction, GoodsActionButton, GoodsActionIcon, Grid, GridItem,
    Icon,
    Lazyload, List, Loading,
    NavBar, Picker, Popup, PullRefresh, Row, Stepper,
    Swipe,
    SwipeItem,
    Tab,
    Tabbar,
    TabbarItem,
    Tabs
} from "vant";

Vue.use(NoticeBar);
Vue.use(Empty);
Vue.use(Button)
Vue.use(Icon)
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload, {
    lazyComponent: true,
});
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(CellGroup);
Vue.use(Field);
Vue.use(Col);
Vue.use(Row);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);
Vue.use(Loading);
Vue.use(Card);
Vue.use(Cell);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Form);
Vue.use(Stepper);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Search);
Vue.use(CountDown);
Vue.use(ShareSheet);
Vue.use(ActionSheet);
Vue.use(SubmitBar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Uploader);