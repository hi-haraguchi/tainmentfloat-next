'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'

// 共通のハイライト関数
function highlight(text, searchTerm) {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 font-bold">
                {part}
            </mark>
        ) : (
            part
        )
    )
}

export default function TagsPage() {
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchTags = (q = '') => {
        setLoading(true)
        axios
            .get('/api/tags', { params: { q } })
            .then(res => {
                setTags(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTags()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        fetchTags(search)
    }

    if (loading) {
        return <p className="p-6">読み込み中...</p>
    }

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">タグ一覧</h1>

            {/* 検索窓 */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="タグを検索..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 flex-1"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    検索
                </button>
            </form>

            {tags.length > 0 ? (
                <ul className="space-y-6">
                    {tags.map(tag => (
                        <li key={tag.id} className="border p-4 rounded bg-white">
                            <h2 className="text-xl font-semibold mb-2">
                                #{highlight(tag.tag, search)}
                            </h2>
                            {tag.records.length > 0 ? (
                                <ul className="pl-4 list-disc">
                                    {tag.records.map((r, idx) => (
                                        <li key={idx}>
                                            {highlight(r.genre, search)} - {highlight(r.title, search)} /{' '}
                                            {highlight(r.author, search)}{' '}
                                            {r.part && `(${highlight(r.part, search)})`}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">公開されている記録はありません</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">タグが見つかりません</p>
            )}

            {/* ルートに戻る */}
            <div className="mt-6">
                <Link href="/" className="text-blue-600 underline">
                    一覧に戻る
                </Link>
            </div>
        </main>
    )
}
