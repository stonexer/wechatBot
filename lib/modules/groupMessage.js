'use strict'
const debug = require('debug')('groupMessage')

class groupMessage {
  constructor(wxbot) {
    this.wxbot = wxbot
    
    this.users = new Set()
  }
  
  usersList() {
    let members = this.wxbot.friendList

    for (let member of members) {
      member.switch = this.users.has(member.username)
    }

    return members
  }
  
  send(msg) {
    for(let member of this.users) {
      let message = msg.replace(/\\?\{\{([^{}]+)\}\}/g, (match,name) => {
        switch(name) {
          case 'name': return this._getUserRemarkName(member)
          case 'count': return this.friendList.length
        }
      })
      this.wxbot.sendMsg(message, member)
    }
  }
}

module.exports = groupMessage