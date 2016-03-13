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
        <ul class="nav navbar-nav navbar-right">
          <li><a href="https://github.com/stonexer/wechatBot" >Project @ Github</a><li>
        </ul>
			</div>
		</div>
	</nav>

	<div class="container">
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>

</template>

<script>

module.exports = {
	data: function () {
		return {
			name: '微信机器人',
			cid: ''
		}
	}
}

</script>