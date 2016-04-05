'use strict'
const debug = require('debug')('templateMessage')

let templateMessage = {
  sendTemplateMessage(group, template) {
    for(member of group) {
      let message = template.replace(/\\?\{\{([^{}]+)\}\}/g, (match,name) => {
        switch(name) {
          case 'name': return this._getUserRemarkName(member)
          case 'count': return this.friendList.length
        }
      })
      this.sendMsg(message, member)
    }
  }
}

module.exports = templateMessage