import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,

    // withCredentials: true,
    // withXSRFToken: true, 
    // xsrfCookieName: 'XSRF-TOKEN', 
    // Laravel が発行するCookie名
    // xsrfHeaderName: 'X-XSRF-TOKEN', 
    // Laravel が期待するヘッダー名

    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
})

export default axios
