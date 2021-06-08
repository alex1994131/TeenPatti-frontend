import axios from "axios"
import config from "../../../configs/config"

export const Axios = axios.create({
    baseURL: config.base_url,
    timeout: 15000,
    headers: {
      	"Content-Type": "application/json",
    },
})

export const Request = async (type, url, body) => {
	return new Promise((resolve, reject) => {
	_Request(type, url, body)
		.then((response)=>{
			resolve(response.data)
		})
		.catch((error)=>{
			localStorage.removeItem([config.token])
			localStorage.removeItem([config.userinfo])
			reject(error)
		})
	})
}
  
export const _Request = async (type, uri, params) => {
	const _axios = axios.create({
	baseURL: config.base_url,
	headers: {
		"Content-Type": "application/json",
		"authToken" : localStorage[config.token]
	},
	})
	return _axios[type](uri, params)
}