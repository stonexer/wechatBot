"use strict"
var rp = require('request-promise')
var debug = require('debug')('wechat')
var xmlPrase = require('xml2js').parseString

const _getTime = () => new Date().getTime()

exports = module.exports = class wechat {

	constructor () {
		this.uuid = ''
		this.baseURI = ''
		this.redirectURI = ''
		this.webpush = ''
		this.uin = ''
		this.sid = ''
		this.skey = ''
		this.passTicket = ''
		this.BaseRequest = {}
		this.synckey = ''
		this.SyncKey = []
		this.User = []
		this.memberList = []
		this.contactList = []
		this.groupList = []
		this.deviceId = 'e' + Math.random().toString().substring(2,17)
		this.credibleUser = new Set()

		const j = rp.jar()
		this.rp = rp.defaults({jar:j})
	}

	_checkCredible (uid) {
		return this.credibleUser.has(uid)
	}

	_getUserRemarkName (uid) {
		let name = ''

		this.memberList.forEach((member)=>{
			if(member['UserName'] == uid) {
				name = member['RemarkName'] ? member['RemarkName'] : member['NickName']
			}
		})

		return name
	}

	_tuning (word) {
		const url = encodeURI(`http://www.tuling123.com/openapi/api?key=2ba083ae9f0016664dfb7ed80ba4ffa0&info=${word}`)
		return this.rp(url).then((body)=>{
			const data = JSON.parse(body)
			if(data.code == 100000) {
				return data.text + '[微信机器人]'
			}
			return "现在思路很乱，最好联系下我哥 T_T..."
		})
	}

	_credibleHint (uid) {
		this.sendMsg('我是'+this.User['NickName']+'的机器人小助手，欢迎调戏！如有打扰请多多谅解', uid)
	}

	getMemberList () {
		let members = []

		this.memberList.forEach((member)=>{
			members.push({
				'username': member['UserName'],
				'remarkname': member['RemarkName'],
				'nickname': member['NickName']
			})
		})

		return members
	}

	switchUser (uid) {
		this.credibleUser.add(uid)
		this._credibleHint(uid)

		debug('Add', this.credibleUser)
		return 0
	}

	sendMsg (msg, to) {
		let url = this.baseURI + `/webwxsendmsg?pass_ticket=${this.passTicket}`
		let clientMsgId = _getTime() + '0' + Math.random().toString().substring(2,5)

		let params = JSON.stringify({
			'BaseRequest': this.BaseRequest,
			"Msg": {
				"Type": 1,
				"Content": msg,
				"FromUserName": this.User['UserName'],
				"ToUserName": to,
				"LocalID": clientMsgId,
				"ClientMsgId": clientMsgId
			}
		})

		this.rp({
			method: 'POST',
			uri: url,
			body: params,
			headers: {
				'ContentType': 'application/json; charset=UTF-8'
		    }
		}).then((body)=>{
			let data = JSON.parse(body)
			return data['BaseResponse']['Ret'] == 0
		})
	}
	
	getUUID () {
		let url = 'https://login.weixin.qq.com/jslogin'
		let params = {
			'appid': 'wx782c26e4c19acffb',
			'fun': 'new',
			'lang': 'zh_CN',
			'_': _getTime()
		}
		return this.rp({
			method: 'POST',
			uri: url,
			form: params
		}).then((body) => {
			let re = /window.QRLogin.code = (\d+); window.QRLogin.uuid = "(\S+?)"/
			let pm = body.match(re)
			if(!pm) {
				throw new Error("GET UUID ERROR")
			}
			let code = pm[1]
			let uuid = this.uuid = pm[2]

			if(code != 200) {
				throw new Error("GET UUID ERROR")
			}

			return uuid
		})
	}

	checkScan () {
		const url = `https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login?tip=1&uuid=${this.uuid}&_=${_getTime()}`
		return this.rp(url).then((body) => {
			let re = /window.code=(\d+);/
			let pm = body.match(re)
			let code = pm[1]

			if(code == 201 ) {
				return code
			} else if( code == 408 ) {
				throw new Error(code)
			} else {
				throw new Error(code)
			}
		})
	}

	checkLogin () {
		const url = `https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login?tip=0&uuid=${this.uuid}&_=${_getTime()}`
		return this.rp(url).then((body) => {
			let re = /window.code=(\d+);/
			let pm = body.match(re)
			let code = pm[1]

			if( code == 200 ) {
				let re = /window.redirect_uri="(\S+?)";/
				let pm = body.match(re)
				this.redirectURI = pm[1] + '&fun=new'
				this.baseURI = this.redirectURI.substring(0, this.redirectURI.lastIndexOf("/"))
				if(this.baseURI[10] == 2) {
					this.webpush = 'webpush2'
				} else {
					this.webpush = 'webpush'
				}
				return code
			} else if( code == 408 ) {
				throw new Error(code)
			} else {
				throw new Error(code)
			}
		})
	}

	login () {
		return new Promise((resolve, reject) => {
			this.rp(this.redirectURI).then((body) => {
				xmlPrase(body, (err, result) => {
					const data = result['error']

					this.skey = data['skey'][0]
					this.sid = data['wxsid'][0]
					this.uin = data['wxuin'][0]
					this.passTicket = data['pass_ticket'][0]

					this.BaseRequest = {
						'Uin': parseInt(this.uin, 10),
						'Sid': this.sid,
						'Skey': this.skey,
						'DeviceID': this.deviceId
					}

					debug('login Success')
					resolve(this.BaseRequest)
				})
			})
		})
	}

	init () {
		const url = this.baseURI + `/webwxinit?pass_ticket=${this.passTicket}&skey=${this.skey}&r=${_getTime()}`
		const params = JSON.stringify({
			BaseRequest: this.BaseRequest
		})

		return this.rp({
			method: 'POST',
			uri: url,
			body: params,
			headers: {
				'ContentType': 'application/json; charset=UTF-8'
		    }
		}).then((body) => {
			let data = JSON.parse(body)
			this.SyncKey = data['SyncKey']
			this.User = data['User']

			let synckeylist = []
			for (let e = this.SyncKey['List'], o = 0, n = e.length; n > o; o++)
				synckeylist.push(e[o]['Key'] + "_" + e[o]['Val'])
            this.synckey = synckeylist.join("|")
        	
        	debug('wechatInit Success')

        	return data['BaseResponse']['Ret'] == 0
		})
	}

	notifyMobile () {
		let url = this.baseURI + `/webwxstatusnotify?lang=zh_CN&pass_ticket=${this.passTicket}`
		let params = JSON.stringify({
			'BaseRequest': this.BaseRequest,
			"Code": 3,
			"FromUserName": this.User['UserName'],
			"ToUserName": this.User['UserName'],
			"ClientMsgId": _getTime()
		})

		return this.rp({
			method: 'POST',
			uri: url,
			body: params,
			headers: {
				'ContentType': 'application/json; charset=UTF-8'
		    }
		}).then((body) => {
			let data = JSON.parse(body)
			debug('notifyMobile Success')
        	return data['BaseResponse']['Ret'] == 0
		})
	}

	getContact () {
		let url = this.baseURI + `/webwxgetcontact?lang=zh_CN&pass_ticket=${this.passTicket}&seq=0&skey=${this.skey}&r=${_getTime()}`

		return this.rp(url).then((body) => {
			let data = JSON.parse(body)
        	this.memberList = data['MemberList']

        	debug(this.memberList.length)
		})
	}

	sync () {
		let url = this.baseURI + `/webwxsync?sid=${this.sid}&skey=${this.skey}&pass_ticket=${this.passTicket}`
		let params = JSON.stringify({
			'BaseRequest': this.BaseRequest,
			"SyncKey": this.SyncKey,
			'rr': ~_getTime()
		})

		return this.rp({
			method: 'POST',
			uri: url,
			body: params,
			headers: {
				'ContentType': 'application/json; charset=UTF-8'
		    }
		}).then((body)=>{
			let data = JSON.parse(body)
			if(data['BaseResponse']['Ret'] == 0) {
				this.SyncKey = data['SyncKey']
				let synckeylist = []
				for (let e = this.SyncKey['List'], o = 0, n = e.length; n > o; o++)
					synckeylist.push(e[o]['Key'] + "_" + e[o]['Val'])
	            this.synckey = synckeylist.join("|")
			}

			return data
		})
	}

	syncCheck () {
		let url = `https://${this.webpush}.weixin.qq.com/cgi-bin/mmwebwx-bin/synccheck`

		return this.rp({
			uri: url,
			qs: {
				'r': _getTime(),
				'sid': this.sid,
				'uin': this.uin,
				'skey': this.skey,
				'deviceid': this.deviceId,
				'synckey': this.synckey,
				'_': _getTime(),
			},
		}).then((body)=>{
			let re = /window.synccheck={retcode:"(\d+)",selector:"(\d+)"}/
			let pm = body.match(re)

			let retcode = pm[1]
			let selector = pm[2]

			return {retcode, selector}
		})
	}

	handleMsg (data) {
		if(data['AddMsgList'].length) {
			debug(data['AddMsgList'].length, 'Message')
		}
		data['AddMsgList'].forEach((msg)=>{
			let type = msg['MsgType']
			let fromUser = this._getUserRemarkName(msg['FromUserName'])
			let content = msg['Content']

			switch(type) {
				case 51:
					debug('Message: Wechat Init')
					break
				case 1:
					if(this._checkCredible(msg['FromUserName'])) {
						this._tuning(msg['Content']).then((reply)=>{
							debug(reply)
							this.sendMsg(reply, msg['FromUserName'])
						})
					}

					debug('Message: ', fromUser, ': ', content)
					break
			}
		})
	}

	syncPolling () {
		setInterval(()=>{
			this.syncCheck().then((state)=>{
				if(state.retcode == '1100') {
					debug('Logout')
				} else if(state.retcode == '0') {
					if(state.selector == '2') {
						this.sync().then((data)=>{
							let r = data
							if(r) {
								this.handleMsg(r)
							}
						})
					} else if(state.selector == '7') {
						debug('Mobile Open')
					} else if(state.selector == '0') {
						debug('Normal')
					}
				}
			})
		}, 2000)
	}	
}
