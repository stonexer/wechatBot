'use strict'
const debug = require('debug')('supervise')

const MSGTEMP = {
  'warn': ''
}

class supervise {
  constructor(wxbot) {
    this.wxbot = wxbot
    
    this.users = new Set()
    this.openTimes = 0
    
    this.wxbot.on('init-message', () => this._botSupervise())
    
    this.wxbot.on('login', () => {
      this.users.add(this.wxbot.user['UserName'])
    })
  }
  
  usersList() {
    let members = this.wxbot.friendList

    for (let member of members) {
      member.switch = this.users.has(member.username)
    }

    return members
  }
  
  _botSupervise() {
    const message = `我的主人玩微信${ ++this.openTimes }次啦！`
    for (let member of this.users) {
      this.wxbot.sendMsg(message, member)
    }
  }
}

module.exports = supervise