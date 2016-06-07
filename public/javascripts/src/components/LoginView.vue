<template>
 <div class="login-content">
  <div class="scanQR">
    <div class="text-center" id="qrcode" v-el:qr-code></div>

    <div class="progress center-block">
      <progressbar :now="waitTime" :type=" waitTime > 50 ? 'success' : waitTime > 20 ? 'warning' : 'danger' " striped animated></progressbar>
    </div>
  </div>
 </div>
</template>

<style lang="less">
.login-content {
  position: relative;
  margin: 0;
  width: 100%;
  height: 400px;
}
.scanQR {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -150px 0px 0px -158px;
  
  #qrcode {
    height: 256px;
  }
  .progress {
    margin-top: 20px;
    width: 300px;
  }
}
</style>

<script>
import api from '../service/api'
import { progressbar,alert } from 'vue-strap'

module.exports = {

  name: 'LoginView',

  data() {
    return {
      waitTime: 100
    }
  },

  components: {
    progressbar,
    alert
  },

  methods: {
  	showQR() {
  		return api.getUUID().then(uuid => {
				const qrCode = 'https://login.weixin.qq.com/l/'  + uuid
        this.$els.qrCode.innerHTML = ''
				new QRCode(this.$els.qrCode, qrCode)
  		}).catch(err => {
        alert('生成二维码失败，请重试')
        this.$router.go('/login')
      })
  	},
  	login() {
  		api.loginConfirm().then(result => {
  			this.$router.go('/autoReply')
  		}).catch(err => {
        this.$dispatch('login-error', err)
        setTimeout( () => {
            this.startLogin()
          }, 2000)
  		})
  	},
    startLogin() {
      this.showQR().then(()=>{
        this.waitTime = 100
        this.login()
        
        let countdown = setInterval( () => {
            this.waitTime -= 2
            if (this.waitTime <= 0){
              clearInterval(countdown);
            }
          }, 500)
      }).catch(err => {
        this.startLogin()
      })
    }
  },
  route: {
    data () {
      api.checkLogin().then(() => {
        this.$router.go('/autoReply')
      }).catch(err => {
        console.log('startLogin')
        this.startLogin()
      })
    }
  }
}
</script>