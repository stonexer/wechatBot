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

  debug('wxbot 实例 state：', req.params.uuid, bot ? bot.state : undefined)
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

router.get('/usersList/:pluginName/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    res.send(bot.plugins[req.params.pluginName].usersList())
  } else {
    res.sendStatus(404)
  }
})

router.get('/userSwitch/:pluginName/:uuid/:uid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  debug(req.params.pluginName, '开关', req.params.uid)

  if (bot.plugins[req.params.pluginName].users.has(req.params.uid)) {
    bot.plugins[req.params.pluginName].users.delete(req.params.uid)
  } else {
    bot.plugins[req.params.pluginName].users.add(req.params.uid)
  }
  res.sendStatus(200)
})

router.post('/sendGroupMessage/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  debug(req.body)
  bot.plugins['groupMessage'].send(req.body.msg)
  res.sendStatus(200)

})

router.get('/friendList/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    res.send(bot.friendList)
  } else {
    res.sendStatus(404)
  }
})

router.get('/chatSession/:uuid', (req, res) => {
  let bot = botInstanceArr[req.params.uuid]
  
  if (bot && bot.state === WxBot.STATE.login) {
    let now = new Date()
    let user = {
      username: bot.user['UserName'],
      nickname: bot.user['NickName'],
      img: 'static/images/logo.png'
    }
    let userList = bot.friendList.sort((a,b) => ( a.py > b.py ? 1 : -1)).map(friend => {
      friend.img = 'static/images/logo.png'
      return friend
    })
    let sessionList = [
      {
          username: bot.user['UserName'],
          messages: [
              {
                  text: 'Hello，这是一个基于Vue + Webpack构建的简单chat示例。',
                  date: now
              }, 
              {
                  text: '项目地址: https://github.com/coffcer/vue-chat',
                  date: now
              }
          ]
      },
    ]
    res.send({
      user, userList, sessionList
    })
  } else {
    res.sendStatus(404)
  }
})

module.exports = router