"use strict"
var path = require('path');
var express = require('express')
var wechat = require('./wechat')
var debug = require('debug')('app')

const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/static', express.static('public'));

let botInstanceArr = {}

app.get('/', (req, res) => {
	let bot = new wechat()
	bot.getUUID().then((uuid) => {
		res.render('error', {
			'message': uuid
		});

		botInstanceArr[uuid] = bot
	})
})

app.get('/:cid/members', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	res.render('members', {
		'members': bot.getMemberList()
	})
})

app.get('/:cid/api/checkScan', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	bot.checkScan().then((code) => {
		debug(code)
		res.send(code)
	}).catch((err) => {
		debug(err)
		res.send(err)
	})
})

app.get('/:cid/api/checkLogin', (req, res) => {
	let bot = botInstanceArr[req.params.cid]
	bot.checkLogin().then((code) => {
		return bot.login()
	}).then(()=>{
		return bot.init()
	}).then(()=>{
		return bot.notifyMobile()
	}).then(()=>{
		return bot.getContact()
	}).then(()=>{
		res.send(200)
		return bot.syncPolling()
	}).catch((err) => {
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
