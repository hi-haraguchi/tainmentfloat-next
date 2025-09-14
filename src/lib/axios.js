import Axios from 'axios'
import Cookies from 'js-cookie'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // ✅ Cookie から直接読み込む
    },
})

export default axios
