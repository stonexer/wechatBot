<template>
	<nav role="navigation" class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<a href="/" class="navbar-brand">{{name}}</a>
			</div>
			<div class="nav nav-justified">
				<ul class="nav navbar-nav">
					<li><a href="#!/autoReply">自动回复</a></li>
				</ul>
				<ul class="nav navbar-nav">
					<li><a href="#!/supervise">监督</a></li>
				</ul>
        <ul class="nav navbar-nav">
					<li><a href="#!/groupMessage">模板群发</a></li>
				</ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href="https://github.com/stonexer/wechatBot" >Project @ Github</a><li>
        </ul>
			</div>
		</div>
	</nav>
  
  <div class="container">
    <alert
      :show.sync="loginError"
      type="danger"
      dismissable>
      <span class="icon-info-circled alert-icon-float-left"></span>
      <strong>对不起</strong>
      <p>您的登陆已过期，请重新登陆</p>
    </alert>
  </div>

	<div class="container">
    <router-view>
    </router-view>
  </div>

</template>

<script>
import { alert } from 'vue-strap'

module.exports = {
  
  components: {
    alert
  },

	data: function () {
		return {
			name: '微信机器人',
			cid: '',
      loginError: false
		}
	},
  
  events: {
    'login-error': function (index) {
      this.loginError = true
      setTimeout( () => {
        this.loginError = false
      }, 3000)
    }
  },
}

</script>