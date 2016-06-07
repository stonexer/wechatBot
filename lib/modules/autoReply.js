'use strict'
const debug = require('debug')('autoReply')

const MSGTEMP = {
  'suffix': '[微信机器人]',
  'master': '主人好，我是微信机器人小M，欢迎调戏。嫌烦的话请回复‘拜拜’关闭我。',
  'hello': '你好，我是微信机器人小M，欢迎调戏。嫌烦的话请回复‘拜拜’关闭我。',
  'bye': '对不起打扰了了，拜拜咯',
  'error': '现在思路很乱，让我理一下头绪'
}

class autoReply {
  constructor (wxbot) {
    this.wxbot = wxbot

    this.users = new Set()
    this.chatted = new Set()

    this.wxbot.on('text-message', msg => this._botReply(msg))
    this.wxbot.on('login', () => {
      this.users.add(this.wxbot.user['UserName'])
      this.wxbot.sendMsg(MSGTEMP.master, this.wxbot.user['UserName'])
      this.chatted.add(this.wxbot.user['UserName'])
    })
  }

  usersList () {
    let members = this.wxbot.friendList

    for (let member of members) {
      member.switch = this.users.has(member.username)
    }

    return members
  }

  _tuning (word) {
    let params = {
      'key': '2ba083ae9f0016664dfb7ed80ba4ffa0',
      'info': word
    }
    return this.wxbot.request({
      method: 'GET',
      url: 'http://www.tuling123.com/openapi/api',
      params: params
    }).then(res => {
      const data = res.data
      if (data.code == 100000) {
        return data.text + MSGTEMP.suffix
      }
      throw new Error('tuning返回值code错误' + data)
    }).catch(err => {
      debug(err)
      return MSGTEMP.error
    })
  }

  _botReply (msg) {
    if (this.users.has(msg['FromUserName'])) {
      if (msg['FromUserName'].substr(0, 2) === '@@') {
        msg['Content'] == msg['Content'].split(':<br/>')[1]
        debug('群消息', msg['Content'])
      }

      if (msg['Content'] === '拜拜') {
        this.wxbot.sendMsg(MSGTEMP.bye, msg['FromUserName'])
        this.users.delete(msg['FromUserName'])
      } else {
        if (!this.chatted.has(msg['FromUserName'])) {
          this.wxbot.sendMsg(MSGTEMP.hello, msg['FromUserName'])
          this.chatted.add(msg['FromUserName'])
        }
        this._tuning(msg['Content']).then((reply) => {
          this.wxbot.sendMsg(reply, msg['FromUserName'])
          debug('自动回复:', reply)
        })
      }
    }
  }
}

module.exports = autoReply
