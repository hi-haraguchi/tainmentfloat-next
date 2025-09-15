'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import Link from 'next/link'
import TitleItem from '@/components/TitleItem'
import BottomNavigation0915 from '@/components/BottomNavigation0915'
import ViewModeSelect from '@/components/ViewModeSelect'
import AppBarWithDrawer from '@/components/AppBarWithDrawer'

export default function HomeClient() {
    const [titles, setTitles] = useState([])
    const [search, setSearch] = useState('')
    const { user, logout } = useAuth({ middleware: 'auth' })

    // 初期ロード
    useEffect(() => {
        if (user) {
            axios.get('/api/titles').then(res => {
                const sorted = [...res.data.data].sort(
                    (a, b) => Number(b.like) - Number(a.like),
                )
                setTitles(sorted)
            })
        }
    }, [user])

    // 検索処理
    const handleSearch = async e => {
        e.preventDefault()
        if (!search.trim()) {
            axios.get('/api/titles').then(res => {
                const sorted = [...res.data.data].sort(
                    (a, b) => Number(b.like) - Number(a.like),
                )
                setTitles(sorted)
            })
            return
        }
        try {
            const res = await axios.get('/api/titles/search', {
                params: { q: search },
            })
            const sorted = [...res.data.data].sort(
                (a, b) => Number(b.like) - Number(a.like),
            )
            setTitles(sorted)
        } catch (err) {
            console.error(err)
        }
    }

    // 👇 like=true と false で分割
    const likedTitles = titles.filter(t => t.like)
    const otherTitles = titles.filter(t => !t.like)

    return (
        <>
            <AppBarWithDrawer />

            <main className="p-6 max-w-4xl mx-auto mt-16">
                {/* ヘッダー */}
                <div className="flex justify-end items-center mb-6 gap-4">
                    <ViewModeSelect />
                </div>

                {/* 検索フォーム */}
                <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="タイトル・作者・感想・タグを検索..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border p-2 flex-1"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded">
                        検索
                    </button>
                </form>

                {/* 一覧 */}
                {titles.length === 0 ? (
                    <p>まだ記録はありません。</p>
                ) : (
                    <>
                        {likedTitles.length > 0 && (
                            <>
                                <h2 className="text-xl font-semibold mb-2">
                                    ⭐
                                    （各詳細画面でつけたものを表示しています）
                                </h2>
                                {likedTitles.map(title => (
                                    <TitleItem
                                        key={title.id}
                                        title={title}
                                        defaultOpen={search !== ''}
                                        searchTerm={search}
                                    />
                                ))}
                                <hr className="my-6 border-gray-400" />
                            </>
                        )}

                        {otherTitles.map(title => (
                            <TitleItem
                                key={title.id}
                                title={title}
                                defaultOpen={search !== ''}
                                searchTerm={search}
                            />
                        ))}
                    </>
                )}

                {/* 下部リンク */}
                <div className="mt-6 flex gap-4">
                    <Link
                        href="/titles/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded">
                        新しい記録を追加
                    </Link>

                    <Link
                        href="/"
                        className="bg-blue-600 text-white px-4 py-2 rounded">
                        タイムライン表示へ
                    </Link>

                    <Link
                        href="/tags"
                        className="bg-green-600 text-white px-4 py-2 rounded">
                        みつける（タグで共有ページ）
                    </Link>
                </div>
            </main>

            <BottomNavigation0915 />
        </>
    )
}
