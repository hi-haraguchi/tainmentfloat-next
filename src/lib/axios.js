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


// ページ読み込み時に localStorage のトークンを再設定
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}

export default axios
