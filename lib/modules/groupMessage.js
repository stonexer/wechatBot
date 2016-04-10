'use strict'
const debug = require('debug')('groupMessage')

let groupMessage = {
  constructor() {
    this.groupMessageUsers = new Set()
  },
  
  groupMessageList() {
    let members = this.friendList

    for (let member of members) {
      member.switch = this.groupMessageUsers.has(member.username)
    }

    return members
  },
  
  sendGroupMessage(msg) {
    for(let member of this.groupMessageUsers) {
      let message = msg.replace(/\\?\{\{([^{}]+)\}\}/g, (match,name) => {
        switch(name) {
          case 'name': return this._getUserRemarkName(member)
          case 'count': return this.friendList.length
        }
      })
      this.sendMsg(message, member)
    }
  }
}

module.exports = groupMessage