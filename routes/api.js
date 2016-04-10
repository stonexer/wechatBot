'use strict'
const express = require('express')
const WxBot = require('../lib/wxbot')
const debug = require('debug')('app')

const router = express.Router()

let botInstanceArr = {}

router.get('/uuid', (req, res) => {
  let bot = new WxBot()

  bot.getUUID()
    .then(uuid => {
      res.send(uuid)
      botInstanceArr[uuid] = bot
      
      debug('新连接', Object.getOwnPropertyNames(botInstanceArr).length)
    })
    .catch(err => {
      res.sendStatus(404)
      debug('获取UUID失败')
    })
})

router.get('/instance/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]

  debug(req.params.uuid, !!bot)
  if (bot && bot.state === WxBot.STATE.login) {
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }

})

router.get('/login/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]

  bot.start()
    .then(() => {
      res.sendStatus(200)
      bot.on('logout', () => {
          delete botInstanceArr[req.params.uuid]
          
          debug('关闭注销连接', Object.getOwnPropertyNames(botInstanceArr).length)
        })
    })
    .catch(err => {
      delete botInstanceArr[req.params.uuid]
      res.sendStatus(403)
      
      debug('关闭登陆失败连接', Object.getOwnPropertyNames(botInstanceArr).length)
    })

})

router.get('/autoReplyList/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    res.send(bot.autoReplyList())
  } else {
    res.sendStatus(404)
  }

})

router.get('/superviseList/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    res.send(bot.superviseList())
  } else {
    res.sendStatus(404)
  }

})

router.get('/groupMessageList/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    res.send(bot.groupMessageList())
  } else {
    res.sendStatus(404)
  }

})

router.get('/autoReply/:uuid/:uid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]

  if (bot.replyUsers.has(req.params.uid)) {
    bot.replyUsers.delete(req.params.uid)
    bot.sendMsg('主人关闭了我，拜拜了！', req.params.uid)
    
    debug('删除自动回复用户', req.params.uid)
  } else {
    bot.replyUsers.add(req.params.uid)
    
    debug('增加自动回复用户', req.params.uid)
  }
  res.sendStatus(200)

})

router.get('/supervise/:uuid/:uid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]

  if (bot.superviseUsers.has(req.params.uid)) {
    bot.superviseUsers.delete(req.params.uid)
    
    debug('删除监督用户', req.params.uid)
  } else {
    bot.superviseUsers.add(req.params.uid)
    
    debug('增加监督用户', req.params.uid)
  }
  res.sendStatus(200)

})

router.get('/groupMessage/:uuid/:uid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]

  if (bot.groupMessageUsers.has(req.params.uid)) {
    bot.groupMessageUsers.delete(req.params.uid)
    
    debug('删除群发用户', req.params.uid)
  } else {
    bot.groupMessageUsers.add(req.params.uid)
    
    debug('增加群发用户', req.params.uid)
  }
  res.sendStatus(200)

})

router.post('/sendGroupMessage/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  debug(req.body)
  bot.sendGroupMessage(req.body.msg)
  res.sendStatus(200)

})

module.exports = router