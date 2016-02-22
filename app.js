"use strict"
var express = require("express")
var wechat = require('./wechat')
var debug = require('debug')('app')

const app = express()
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static('public'));

let botInstanceArr = {}

app.get('/', (req, res) => {
	let bot = new wechat()
	bot.getUUID().then((uuid) => {
		res.render('login', {
			'message': uuid
		});

		botInstanceArr[uuid] = bot
		debug('New Connect', Object.getOwnPropertyNames(botInstanceArr).length)
	})
})

app.get('/:cid/members', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	if(bot) {
		res.render('members', {
			'members': bot.getMemberList()
		})
	} else {
		res.redirect('/');
	}
})

app.get('/:cid/api/checkScan', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	bot.checkScan().then((code) => {
		res.send(code)
	}).catch((err) => {
		delete botInstanceArr[req.params.cid]
		debug('Close Connect', Object.getOwnPropertyNames(botInstanceArr).length)
		res.send(err)
	})
})

app.get('/:cid/api/checkLogin', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	bot.checkLogin()
	.then(() => bot.login())
	.then(()=>bot.init())
	.then(()=>bot.notifyMobile())
	.then(()=>bot.getContact())
	.then(()=>{
		res.send('200')
		return bot.syncPolling()
	})
	.catch((err) => {
		debug(err)
		res.send(err)
	})
})

app.get('/:cid/api/member/add/:uid', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	let r = bot.switchUser(req.params.uid)
	res.send({result:r})
})

const server = app.listen(3000)
