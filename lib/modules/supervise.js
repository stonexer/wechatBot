'use strict'
const debug = require('debug')('supervise')

let supervise = {
  constructor() {
    this.superviseUsers = new Set()
    this.openTimes = 0
    this.on('mobile-open', () => this._botSupervise())
    
    this.on('login', () => {
      this.superviseUsers.add(this.user['UserName'])
    })
  },
  
  superviseList() {
    let members = this.friendList

    for (let member of members) {
      member.switch = this.superviseUsers.has(member.username)
    }

    return members
  },
  
  _botSupervise() {
    const message = '我的主人玩微信' + ++this.openTimes + '次啦！'
    for (let user of this.superviseUsers.values()) {
      this.sendMsg(message, user)
      debug(message)
    }
  }
}

module.exports = supervise