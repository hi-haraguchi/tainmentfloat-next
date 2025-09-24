'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import TitleItem from '@/components/TitleItem'
import { useMediaQuery } from '@mui/material'

export default function HomeClient() {
    const [titles, setTitles] = useState([])
    const [search, setSearch] = useState('')
    const { user } = useAuth({ middleware: 'auth' })
    const isMobile = useMediaQuery('(max-width:980px)')

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
            <main
                className={`p-6 max-w-4xl mx-auto ${isMobile ? '' : 'mt-16'}`}>
                {/* ヘッダー */}

                {/* 検索フォーム */}
                <form onSubmit={handleSearch} className="mb-6 flex gap-2 w-4/5">
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
            </main>
        </>
    )
}
