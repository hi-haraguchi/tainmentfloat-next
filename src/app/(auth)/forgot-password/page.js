'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import AuthCard from '@/app/(auth)/AuthCard'

const ForgotPassword = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        forgotPassword({
            email,
            setErrors,
            setStatus,
        })
    }

    return (
        <AuthCard logo={null}>
            {/* ステータスメッセージ */}
            <AuthSessionStatus className="mb-4" status={status} />

            {/* 説明 */}
            <div className="mb-4 text-sm text-gray-600">
                パスワードをお忘れですか？
                <br />
                登録しているメールアドレスを入力してください。
                <br />
                パスワード再設定用のリンクをお送りします。
            </div>

            {/* フォーム */}
            <form onSubmit={submitForm} className="bg-white">
                <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                    />
                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        ログイン画面に戻る
                    </Link>
                    <Button>送信</Button>
                </div>
            </form>
        </AuthCard>
    )
}

export default ForgotPassword
