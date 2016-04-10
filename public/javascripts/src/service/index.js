import axios from 'axios'
import { Promise } from 'es6-promise'

const service = {}

export default service

let uuid = localStorage.uuid || ''

service.getUUID = () => {
	return axios.get('/api/uuid').then(res => {
		return uuid = localStorage.uuid = res.data
	})
}

service.checkLogin = () => {
	return axios.get('/api/instance/' + uuid)
}

service.loginConfirm = () => {
	return axios.get('/api/login/' + uuid)
}

service.autoReplyList = () => {
	return axios.get('/api/autoReplyList/' + uuid).then(res => {
		return res.data.sort((a,b) => (a.switch > b.switch ? -1 : a.py > b.py ? 1 : -1))
	})
}

service.superviseList = () => {
	return axios.get('/api/superviseList/' + uuid).then(res => {
		return res.data.sort((a,b) => (a.switch > b.switch ? -1 : a.py > b.py ? 1 : -1))
	})
}

service.groupMessageList = () => {
	return axios.get('/api/groupMessageList/' + uuid).then(res => {
		return res.data.sort((a,b) => (a.switch > b.switch ? -1 : a.py > b.py ? 1 : -1))
	})
}

service.switchAutoReply = (memberId) => {
	return axios.get('/api/autoReply/' + uuid + '/' + memberId)
}

service.switchSupervise = (memberId) => {
	return axios.get('/api/supervise/' + uuid + '/' + memberId)
}

service.switchGroupMessage = (memberId) => {
	return axios.get('/api/groupMessage/' + uuid + '/' + memberId)
}

service.sendGroupMessage = msg => {
  return axios.post('/api/sendGroupMessage/' + uuid, {msg:msg})
}