import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN', // Laravelが返すクッキー名
    xsrfHeaderName: 'X-XSRF-TOKEN', // Laravelが期待するヘッダー名
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
})

export default axios
