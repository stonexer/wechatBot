import Vue from 'vue'
import Router from 'vue-router'

import App from './components/App.vue'
import LoginView from './components/LoginView.vue'
import AutoReplyView from './components/AutoReplyView.vue'
import SuperviseView from './components/SuperviseView.vue'
import GroupMessageView from './components/GroupMessageView.vue'

// install router & resource
Vue.use(Router)

// routing
var router = new Router()
router.map({
  '/login': {
    component: LoginView
  },
  '/autoReply': {
  	component: AutoReplyView
  },
  '/supervise': {
  	component: SuperviseView
  },
  '/groupMessage': {
  	component: GroupMessageView
  }
})

router.beforeEach(function() {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/login'
})

router.start(App, 'app')