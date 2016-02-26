import axios from 'axios'
import { Promise } from 'es6-promise'

const service = {}

export default service

let uuid = localStorage.uuid || ""

service.getUUID = () => {
	return axios.get('/uuid').then(res => {
		uuid = res.data.uuid
		localStorage.uuid = uuid
		return uuid
	})
}

service.checkLogin = () => {
	return axios.get('/login/'+uuid).then(res => {
		if(res.data.code == 200) {
			return Promise.resolve(200)
		} else {
			return Promise.reject(res.data.err)
		}
	})
}

service.getMembers = () => {
	return axios.get('/members/'+uuid).then(res => {
		if(res.data.code == 200) {
			return Promise.resolve(res.data.members)
		} else {
			return Promise.reject(res.data.err)
		}
	})
}

service.switchMember = (memberId) => {
	return axios.get('/members/'+uuid+'/'+memberId).then(res => {
		if(res.data.code == 200) {
			return Promise.resolve(res.data)
		} else {
			return Promise.reject(res.data.err)
		}
	})
}