<template>
  <div>
    <h1>联系人列表</h1>

    <nav class="navbar navbar-default navbar-fixed">
      <form class="navbar-form navbar-left" role="search">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="查找" v-model="critiria">
        </div>
      </form>
    </nav>

    <p>该版本为内部测试版本，如需退出请点击手机微信中的退出网页版</p>

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
import service from '../service'
import Member from './Member.vue'

module.exports = {

  name: 'MembersView',

  components: {
    Member
  },

  data() {
    return {
      members: {},
      critiria: ''
    }
  },

  methods: {
    getMembers() {
      return service.getMembers().then(members => {
        this.members = members
      })
    }
  },

  computed: {
    showMembers () {
      return this.members.filter((member) => {
        return member.nickname.indexOf(this.critiria) > -1
      })
    }
  },

  route: {
    data () {
      this.getMembers().catch(() => {
        this.$router.go('/login');
      })
    }
  },
}
</script>