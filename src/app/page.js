'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import Link from 'next/link'

export default function TimelinePage() {
    const [timeline, setTimeline] = useState({})
    const [loading, setLoading] = useState(true)
    const { user, logout } = useAuth({ middleware: 'auth' }) // 認証必須

    useEffect(() => {
        axios
            .get('/api/timeline')
            .then(res => {
                setTimeline(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <p className="p-6">読み込み中...</p>

    return (
        <main className="p-6 max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">{user?.email}</span>
                    <Link
                        href="/titles/new"
                        className="bg-blue-600 text-white px-3 py-1 rounded">
                        記録する
                    </Link>

                    <Link
                        href="/titles/index"
                        className="bg-green-600 text-white px-3 py-1 rounded">
                        一覧表示（検索も）
                    </Link>

                    <Link
                        href="/tags"
                        className="bg-green-600 text-white px-3 py-1 rounded">
                        みつける（タグで検索）
                    </Link>

                    <Button type="button" onClick={logout}>
                        ログアウト
                    </Button>
                </div>
            </div>

            {/* タイムライン本体 */}
            {Object.keys(timeline)
                .sort((a, b) => Number(b) - Number(a)) // 年を降順（新しい年が上）
                .map(year => (
                    <div key={year} className="mb-8">
                        {/* 年見出し */}
                        <h2 className="text-xl font-bold mb-4">{year}年</h2>

                        {Object.keys(timeline[year])
                            .sort((a, b) => {
                                if (a === '00') return -1 // 月なしは先頭
                                if (b === '00') return 1
                                return Number(b) - Number(a) // 12→1 の順
                            })
                            .map(month => (
                                <div key={month} className="ml-4 mb-4">
                                    {/* 月見出し */}
                                    {month === '00' ? (
                                        <h3 className="text-lg font-semibold mb-2">
                                            -
                                        </h3>
                                    ) : (
                                        <h3 className="text-lg font-semibold mb-2">
                                            {month}月
                                        </h3>
                                    )}

                                    <ul className="ml-4 space-y-2">
                                        {timeline[year][month].map(
                                            (item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="border p-3 rounded bg-white">
                                                    <p>
                                                        <span className="font-semibold">
                                                            {item.genre}
                                                        </span>{' '}
                                                        -{' '}
                                                        <Link
                                                            href={`/titles/${item.id}`}
                                                            className="text-blue-600 hover:underline">
                                                            {item.title}
                                                        </Link>{' '}
                                                        / {item.author}
                                                    </p>
                                                    {item.day && (
                                                        <p>
                                                            {year}/
                                                            {month !== '00'
                                                                ? month
                                                                : ''}
                                                            /{item.day}
                                                        </p>
                                                    )}
                                                    <p>{item.thought}</p>
                                                    {item.tag && (
                                                        <p className="text-blue-600">
                                                            #{item.tag}
                                                        </p>
                                                    )}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            ))}
                    </div>
                ))}
        </main>
    )
}
