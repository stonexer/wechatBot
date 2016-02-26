"use strict"
var express = require('express')
var wechat = require('wechat4u')
var debug = require('debug')('app')

const app = express()
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static('public'));

let botInstanceArr = {}

app.get('/', (req, res) => {
		res.render('layout')
})

app.get('/uuid', (req, res) => {
	let bot = new wechat()

	bot.getUUID().then((uuid) => {
		res.send({
			uuid: uuid
		});
		botInstanceArr[uuid] = bot
		debug('New Connect', Object.getOwnPropertyNames(botInstanceArr).length)
	})
})

app.get('/login/:uuid', (req, res) => {
	let bot = botInstanceArr[req.params.uuid]

	bot.checkScan()
	.then(()=>bot.checkLogin())
	.then(()=>bot.login())
	.then(()=>bot.init())
	.then(()=>bot.notifyMobile())
	.then(()=>bot.getContact())
	.then(()=>{
		res.send({
			code: 200
		})
		return bot.syncPolling()
	})
	.catch((err) => {
		delete botInstanceArr[req.params.uuid]
		debug('Close Connect', Object.getOwnPropertyNames(botInstanceArr).length)
		res.send({
			code: 400,
			err: err
		})
	})
})

app.get('/members/:uuid', (req, res) => {
	let bot = botInstanceArr[req.params.uuid]
	let members = bot.friendList

	if(members) {
		res.send({
			code: 200,
			members: members
		})
	} else {
		res.send({
			code: 400
		})
	}
})

app.get('/members/:uuid/:uid', (req, res) => {
	let bot = botInstanceArr[req.params.uuid]
	let r = bot.switchUser(req.params.uid)

	res.send({
		code:r
	})
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
	
	bot.start()
	.then(()=>{
		res.send('200')
	})
	.catch((err) => {
		debug(err)
		res.send(err)
	})
})

app.get('/:cid/members', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	if(bot) {
		res.render('members', {
			'members': bot.friendList
		})
	} else {
		res.redirect('/');
	}
})

app.get('/:cid/api/member/add/:uid', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	let r = bot.switchUser(req.params.uid)
	res.send({result:r})
})

const server = app.listen(3000)
