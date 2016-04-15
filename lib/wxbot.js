'use strict'
const Wechat = require('wechat4u')
const debug = require('debug')('wxbot')

const autoReply = require('./modules/autoReply')
const supervise = require('./modules/supervise')
const groupMessage = require('./modules/groupMessage')

class WxBot extends Wechat {
  constructor () {
    super()
    
    this.on('error', err => debug(err))
    
    this.plugins = {
      autoReply: new autoReply(this),
      supervise: new supervise(this),
      groupMessage: new groupMessage(this)
    }
  }
}

exports = module.exports = WxBot
