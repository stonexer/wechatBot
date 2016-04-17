import axios from 'axios'
import { Promise } from 'es6-promise'

const api = {}

export default api

let uuid = localStorage.uuid || ''

api.getUUID = () => {
	return axios.get('/api/uuid').then(res => {
		return uuid = localStorage.uuid = res.data
	})
}

api.checkLogin = () => {
	return axios.get('/api/instance/' + uuid)
}

api.loginConfirm = () => {
	return axios.get('/api/login/' + uuid)
}

api.usersList = pluginName => {
	return axios.get(`/api/usersList/${pluginName}/${uuid}`).then(res => {
		return res.data.sort((a,b) => (a.switch > b.switch ? -1 : a.py > b.py ? 1 : -1))
	})
}

api.userSwitch = (pluginName, username) => {
	return axios.get(`/api/userSwitch/${pluginName}/${uuid}/${username}`)
}

api.sendGroupMessage = msg => {
  return axios.post('/api/sendGroupMessage/' + uuid, {msg:msg})
}