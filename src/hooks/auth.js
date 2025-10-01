'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    // ローカルストレージにトークンがあるか確認
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null

    // token がある時だけ /api/user を叩く
    const {
        data: user,
        error,
        mutate,
    } = useSWR(
        token ? '/api/user' : null, // 👈 トークンなしなら fetch しない
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(error => {
                    if (error.response?.status === 409) {
                        router.push('/verify-email')
                    }
                    throw error
                }),
        {
            revalidateOnFocus: true, // 画面に戻った時は再検証
            shouldRetryOnError: false, // 👈 エラー時に再試行しない
        },
    )

    // const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        setErrors({})

        try {
            const res = await axios.post('/api/register', props)

            const token = res.data.token
            // localStorage に保存
            localStorage.setItem('auth_token', token)

            // axios のデフォルトヘッダーに設定
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

            // mutate で /api/user を更新
            await mutate()

            // ✅ 登録後にトップやユーザーページへ遷移
            router.push('/')
        } catch (err) {
            if (err.response?.status === 422) {
                const apiErrors = err.response.data.errors
                const newErrors = {}

                if (apiErrors.email) {
                    if (apiErrors.email[0].includes('taken')) {
                        newErrors.email = [
                            'このメールアドレスは既に登録されています。',
                        ]
                    } else {
                        newErrors.email = [
                            '正しい形式のメールアドレスを入力してください。',
                        ]
                    }
                }

                if (apiErrors.password) {
                    const msg = apiErrors.password[0]

                    if (msg.includes('confirmation')) {
                        // 確認用と不一致
                        newErrors.password = [
                            '確認用のパスワードが一致しません。',
                        ]
                    } else if (msg.includes('at least')) {
                        // 8文字未満
                        newErrors.password = [
                            'パスワードは8文字以上で入力してください。',
                        ]
                    } else {
                        // その他（必須エラーなど）
                        newErrors.password = [
                            'パスワードを正しく入力してください。',
                        ]
                    }
                }

                setErrors(newErrors)
            } else {
                console.error(err)
            }
        }

        // axios
        //     .post('/register', props)
        //     .then(() => mutate())
        //     .catch(error => {
        //         if (error.response.status !== 422) throw error

        //         setErrors(error.response.data.errors)
        //     })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        setErrors({})
        setStatus(null)

        try {
            const res = await axios.post('/api/login', {
                email: props.email,
                password: props.password,
            })

            const token = res.data.token
            localStorage.setItem('auth_token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

            await mutate()
            router.push('/')
        } catch (err) {
            if (err.response?.status === 401) {
                setErrors({
                    email: ['メールアドレスまたはパスワードが一致しません。'],
                })
            } else if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                console.error(err)
            }
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        setErrors({})
        setStatus(null)

        axios
            .post('/api/forgot-password', { email })
            .then(response => {
                const msg = response.data.status
                let jpMsg = msg

                // 成功時メッセージを日本語に変換
                if (msg.includes('We have emailed')) {
                    jpMsg = 'パスワード再設定用のリンクをメールで送信しました。'
                }

                setStatus(jpMsg)
            })
            .catch(error => {
                if (error.response?.status !== 422) throw error

                const apiErrors = error.response.data.errors
                const newErrors = {}

                // メールアドレス関連のエラーを日本語に変換
                if (apiErrors.email) {
                    if (apiErrors.email[0].includes('find')) {
                        newErrors.email = [
                            '入力されたメールアドレスのユーザーが見つかりません。',
                        ]
                    } else {
                        newErrors.email = [
                            'メールアドレスを正しく入力してください。',
                        ]
                    }
                }

                setErrors(newErrors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        setErrors({})
        setStatus(null)

        axios
            .post('/api/reset-password', { token: params.token, ...props })
            .then(() => {
                // 成功メッセージを表示
                setStatus(
                    'パスワードをリセットしました。数秒後にログイン画面に移動します。',
                )

                // 3秒後にログインページへリダイレクト
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            })
            .catch(error => {
                if (error.response?.status !== 422) throw error

                const apiErrors = error.response.data.errors
                const newErrors = {}

                if (apiErrors.email) {
                    if (apiErrors.email[0].includes('invalid')) {
                        newErrors.email = [
                            'このパスワードリセットリンクは無効です。',
                        ]
                    } else {
                        newErrors.email = [
                            'メールアドレスを正しく入力してください。',
                        ]
                    }
                }

                if (apiErrors.password) {
                    const msg = apiErrors.password[0]

                    if (msg.includes('confirmation')) {
                        newErrors.password = [
                            '確認用のパスワードが一致しません。',
                        ]
                    } else if (msg.includes('at least')) {
                        newErrors.password = [
                            'パスワードは8文字以上で入力してください。',
                        ]
                    } else {
                        newErrors.password = [
                            'パスワードを正しく入力してください。',
                        ]
                    }
                }

                setErrors(newErrors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (token) {
                await axios.post(
                    '/api/logout',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                )
            }
        } catch (err) {
            console.error('Logout API error:', err)
        } finally {
            // フロント側の状態をクリア
            localStorage.removeItem('auth_token')
            delete axios.defaults.headers.common['Authorization']
            mutate(null, false) // SWRキャッシュ削除
            router.push('/login')
        }
        // if (!error) {
        //     await axios.post('/logout').then(() => mutate())
        // }

        // window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        // if (middleware === 'auth' && (user && !user.email_verified_at))
        //     router.push('/verify-email')

        // if (
        //     window.location.pathname === '/verify-email' &&
        //     user?.email_verified_at
        // )
        // router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
