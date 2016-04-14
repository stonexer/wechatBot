'use strict'
const Wechat = require('wechat4u')
const mutend = require('mutend')
const debug = require('debug')('wxbot')

const autoReply = require('./modules/autoReply')
const supervise = require('./modules/supervise')
const groupMessage = require('./modules/groupMessage')

class WxBot extends mutend(Wechat, autoReply, supervise, groupMessage) {
  constructor () {
    super()
    this.on('error', err => debug(err))
  }
}

exports = module.exports = WxBot
