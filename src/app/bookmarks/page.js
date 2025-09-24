'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'

export default function BookmarkPage() {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/bookmarks/mine')
            .then(res => {
                setBookmarks(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <p className="p-6">読み込み中...</p>

    return (
        <>
        <main className="p-6 max-w-4xl mx-auto mt-16">
            <h1 className="text-2xl font-bold mb-6">あとで見る（タグページでブックマークしたリスト）</h1>

            {bookmarks.length > 0 ? (
                <ul className="space-y-4">
                    {bookmarks.map((b, idx) => (
                        <li key={idx} className="border p-4 rounded bg-white">
                            <p>
                                <span className="font-semibold">{b.genre}</span> -{' '}
                                <Link
                                    href={`/titles/${b.thought_id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {b.title}
                                </Link>{' '}
                                / {b.author}
                            </p>
                            {b.part && <p>部分: {b.part}</p>}
                            <p>{b.thought}</p>
                            {b.tag && <p className="text-blue-600">#{b.tag}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">まだブックマークがありません</p>
            )}

            <div className="mt-6">
                <Link href="/" className="text-blue-600 underline">タイムラインに戻る</Link>
            </div>
        </main>

        </>
    )
}
