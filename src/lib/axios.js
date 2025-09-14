import Axios from 'axios'
import Cookies from 'js-cookie'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
})

// リクエストごとに XSRF-TOKEN を動的にセット
axios.interceptors.request.use(config => {
    const token = Cookies.get('XSRF-TOKEN')
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token
    }
    return config
})

export default axios
