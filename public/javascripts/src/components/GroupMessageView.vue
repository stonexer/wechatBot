<template>
  <div class="group-message-content">
    <nav class="navbar navbar-default">
      <div class="navbar-header">
        <a class="navbar-brand">模板群发</a>
      </div>

      <form class="navbar-form navbar-left" role="search">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="查找" v-model="critiria">
        </div>
      </form>

      <p class="navbar-text navbar-left">
        该版本为内部测试版本，如需退出请点击手机微信中的退出网页版。发送群发消息 {{promptMessage}} 分别对应好友昵称和好友数量
      </p>
    </nav>
    
    <div class="row" style="margin-bottom:10px">
      <div class="col-lg-12">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="你好" v-model="template">
          <span class="input-group-btn">
            <button class="btn btn-success" type="button" v-on:click="send">发送!</button>
          </span>
        </div>
      </div>
    </div>
    
    <div class="row">
      <member
        v-for="member in showMembers"
        :member="member"
        :index="$index">
      </member>
    </div>

  </div>
</template>

<script>
import api from '../service/api'
import Member from './Member.vue'

module.exports = {

  name: 'MembersView',

  components: {
    Member
  },

  data() {
    return {
      pluginName: 'groupMessage',
      members: {},
      showMembers: {},
      critiria: '',
      template: '',
      promptMessage: '{{name}} {{count}}'
    }
  },

  methods: {
    getMembers() {
      return api.usersList(this.pluginName).then(members => {
        this.showMembers = this.members = members
      })
    },
    send() {
      return api.sendGroupMessage(this.template)
    }
  },

  watch: {
    critiria () {
      this.showMembers = this.members.filter((member) => {
        return member.nickname.indexOf(this.critiria) > -1
      })
    }
  },

  events: {
    'switch-member': function (index) {
      let member = this.showMembers.splice(index,1)[0]

      api.userSwitch(this.pluginName, member.username).then(() => {
        member.switch = !member.switch
      })

      this.showMembers.unshift(member)
    }
  },
  
  route: {
    data () {
      api.checkLogin().then(() => {
        this.getMembers()
      }).catch(err => {
        this.$dispatch('login-error', err)
        this.$router.go('/login')
      })
    }
  },
}
</script>

<style lang="less">
.group-message-content {
  background-color: #FFF;
  padding: 10px;
  border-top: 5px solid #94b18e;
  border-radius: 3px;
}
</style>