<template>
  <div id="chat">
    <div class="sidebar">
      <card :user="user" :search.sync="search"></card>
      <list :user-list="userList" :session="session" :session-index.sync="sessionIndex" :search="search"></list>
    </div>
    <div class="main">
      <message :session="session" :user="user" :user-list="userList"></message> 
      <text :session="session"></text>
    </div>
  </div>
</template>

<script>
import store from './Chat/store.js'
import card from './Chat/card.vue'
import list from './Chat/list.vue'
import text from './Chat/text.vue'
import message from './Chat/message.vue'
import api from '../service/api'

export default {
  el: '#chat',
  components: {
    card, list, text, message
  },
  
  data () {
    let serverData = store.fetch()

    return {
      // 登录用户
      user: {},
      // 用户列表
      userList: [],
      // 会话列表
      sessionList: [],
      // 搜索key
      search: '',
      // 选中的会话Index
      sessionIndex: 0
    }
  },
  
  computed: {
    session () {
      console.log(this.sessionIndex, this.sessionList[this.sessionIndex])
      return this.sessionList[this.sessionIndex];
    }
  },
  
  watch: {
    // 每当sessionList改变时，保存到localStorage中
    sessionList: {
      deep: true,
      handler () {
        store.save({
          user: this.user,
          userList: this.userList,
          sessionList: this.sessionList
        })
      }
    }
  },
  
  created () {
    api.chatSession().then( data => {
      this.userList = data.userList
      this.user = data.user
      this.sessionList = data.sessionList
    })
  }
}
</script>

<style lang="less">
#chat {
  margin: 20px auto;
  width: 800px;
  height: 600px;
  overflow: hidden;
  border-radius: 3px;
  
  .sidebar, .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
    overflow: scroll;
    overflow-x:hidden;
    overflow-y:auto;
  }
  .main {
    position: relative;
    overflow: hidden;   
    background-color: #eee;
  }
  .m-text {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .m-message {
    height: ~'calc(100% - 160px)';
  }
}
</style>