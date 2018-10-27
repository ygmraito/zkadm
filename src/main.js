import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import { Message } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
//import './permission' // permission control
//import './mock' // simulation data
import * as filters from './filters' // global filters
//z_样式
import '@/styles/z_base.scss' //基础样式
import '@/styles/z_iconfont.scss' //字体图标
import Cookies from 'js-cookie'
import $ from 'jquery'
Vue.prototype.$cookie = Cookies
Vue.use(Element, {
	size: Cookies.get('size') || 'medium', // set element-ui default size
	i18n: (key, value) => i18n.t(key, value)
})
Vue.use(require('vue-moment'))
//axios
import axios from '@/utils/http'
Vue.prototype.HOST = '/api'
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
//全局变量
import Global from './global.vue'
Vue.prototype.Global = Global
// register global utility filters.
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	render: h => h(App)
})