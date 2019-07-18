import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';

import 'common/styles/index.less';

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
});

Vue.config.devtools = true;
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
Vue.config.productionTip = false;

fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

