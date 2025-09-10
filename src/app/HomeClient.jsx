'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import LoginLinks from '@/app/LoginLinks'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'

export default function HomeClient() {
    const [titles, setTitles] = useState([])
    const { user, logout } = useAuth({ middleware: 'auth' })

    useEffect(() => {
        if (user) {
            axios.get('/api/titles').then(res => setTitles(res.data.data))
        }
    }, [user])

    if (!user) {
        return (
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <LoginLinks />
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        エンタメフロート
                    </h1>
                    <p className="text-lg">
                        社会とちょうどいい距離を保ち、必要な情報を必要なときに。
                    </p>
                    <p className="mt-2">
                        エンタメに特化したSNSで、自分の記録を残しましょう。
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{user.email} さんの記録</h1>

                <Button type="button" onClick={logout}>
                    ログアウト
                </Button>
            </div>

            {titles.length === 0 ? (
                <p>まだ記録はありません。</p>
            ) : (
                titles.map(title => (
                    <div
                        key={title.id}
                        className="border p-4 rounded bg-white mb-4">
                        <h2 className="font-semibold">
                            {title.title}（{title.genre}）
                        </h2>
                        <p className="text-sm text-gray-600">{title.author}</p>
                    </div>
                ))
            )}
        </main>
    )
}
