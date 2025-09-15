import Axios from 'axios'

function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
})

axios.interceptors.request.use(config => {
    const token = getCookie('XSRF-TOKEN')
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token) // ✅ デコードして送信
    }
    return config
})

export default axios
