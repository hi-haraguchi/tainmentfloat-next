'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import TitleItem from '@/components/TitleItem'
import { useMediaQuery } from '@mui/material'
import LoadingWater from '@/components/LoadingWater'

export default function HomeClient() {
    const [titles, setTitles] = useState([])
    const [search, setSearch] = useState('')
    const { user } = useAuth({ middleware: 'auth' })
    const isMobile = useMediaQuery('(max-width:980px)')
    const [initialLoading, setInitialLoading] = useState(true)

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

    useEffect(() => {
        if (user !== undefined) {
            const timer = setTimeout(() => {
                setInitialLoading(false)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [user])

    if (initialLoading) return <LoadingWater />

    if (!user) return null

    return (
        <>
            <main
                className={`p-6 max-w-4xl mx-auto ${isMobile ? '' : 'mt-16'}`}>
                {/* ヘッダー */}

                {/* 検索フォーム */}
                <form onSubmit={handleSearch} className="mt-2 mb-6 w-4/5">
                    <div className="relative">
                        {/* 検索窓 */}
                        <input
                            type="text"
                            placeholder="記録した文字を検索..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-full border border-gray-300 px-4 py-1 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500"
                        />

                        {/* アイコン（右端配置） */}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z"
                                />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* 一覧 */}
                {titles.length === 0 ? (
                    <p>
                        まだ記録がありません。
                        <br />
                        「新しいエンタメ記録」から入力ができます。
                    </p>
                ) : (
                    <>
                        {likedTitles.length > 0 && (
                            <>
                                {likedTitles.map(title => (
                                    <TitleItem
                                        key={title.id}
                                        title={title}
                                        defaultOpen={search !== ''}
                                        searchTerm={search}
                                    />
                                ))}

                                <p className="text-xs text-gray-500 mb-8 text-right">
                                    ↑ 各詳細画面で☆つけたものを表示します
                                </p>
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
            </main>
        </>
    )
}
