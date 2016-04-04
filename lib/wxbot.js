'use strict'
const Wechat = require('wechat4u')
const mutend = require('mutend')
const debug = require('debug')('wxbot')

const autoReply = require('./modules/autoReply')
const supervise = require('./modules/supervise')

class WxBot extends mutend(Wechat, autoReply, supervise) {
}

exports = module.exports = WxBot
