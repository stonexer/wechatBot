<template>
  <div class="text-center" id="qrcode" v-el:qr-code></div>
</template>

<script>
import service from '../service'

module.exports = {
  data() {
    return {
    }
  },
  methods: {
  	showQR() {
  		return service.getUUID().then(uuid => {
				const qrCode = 'https://login.weixin.qq.com/l/'  + uuid
				new QRCode(this.$els.qrCode, qrCode);
  		})
  	},
  	login() {
  		service.checkLogin().then(result => {
  			this.$router.go('/members');
  		}).catch(err => {
  			console.log(err)
  			alert('登陆失败')
  			this.$router.go('/login');
  		})
  	}
  },
  created() {
  	this.showQR().then(()=>{
  		this.login()
  	})
  }
}
</script>