'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { useMediaQuery } from '@mui/material'
import Link from 'next/link'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TheatersIcon from '@mui/icons-material/Theaters'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HideSourceIcon from '@mui/icons-material/HideSource'
import LoadingWater from '@/components/LoadingWater'

// ブックマークボタン
function BookmarkButton({ thoughtId, defaultBookmarked = false }) {
    const [bookmarked, setBookmarked] = useState(defaultBookmarked)
    const [loading, setLoading] = useState(false)

    // defaultBookmarked が変わったら state を更新
    useEffect(() => {
        setBookmarked(defaultBookmarked)
    }, [defaultBookmarked])

    const toggleBookmark = async () => {
        if (loading) return
        setLoading(true)

        try {
            if (bookmarked) {
                await axios.delete(`/api/bookmarks/${thoughtId}`)
                setBookmarked(false)
            } else {
                await axios.post('/api/bookmarks', { thought_id: thoughtId })
                setBookmarked(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={toggleBookmark} disabled={loading} className="ml-2">
            {bookmarked ? (
                <BookmarkIcon className="h-6 w-6 text-green-200" />
            ) : (
                <BookmarkBorderIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            )}
        </button>
    )
}

export default function TagsPage() {
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const isMobile = useMediaQuery('(max-width:980px)')

    const kindIconMap = {
        0: MenuBookIcon, // 本
        1: DashboardIcon, // マンガ
        2: TheatersIcon, // 映画
        3: MusicNoteIcon, // 音楽
        4: PodcastsIcon, // ポッドキャスト
        5: OndemandVideoIcon, // TV・動画配信
        6: HideSourceIcon, // その他
    }

    const [minDelayDone, setMinDelayDone] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinDelayDone(true)
        }, 400)
        return () => clearTimeout(timer)
    }, [])

    const fetchTags = (q = '') => {
        axios
            .get('/api/tags', { params: { q } })
            .then(res => {
                setTags(res.data)
                // API完了時に、minDelayDoneもtrueならローディング解除
                if (minDelayDone) setLoading(false)
                else {
                    // まだ800ms経ってなければ、minDelayDoneがtrueになった時に解除される
                    const checkInterval = setInterval(() => {
                        if (minDelayDone) {
                            setLoading(false)
                            clearInterval(checkInterval)
                        }
                    }, 50)
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTags()
    }, [minDelayDone]) // ← minDelayDoneも依存に追加

    const handleSearch = e => {
        e.preventDefault()
        fetchTags(search)
    }

    if (loading) return <LoadingWater />

    return (
        <>
            <main
                className={`p-6 max-w-4xl mx-auto ${isMobile ? '' : 'mt-16'}`}>
                {/* 検索窓 */}
                <form onSubmit={handleSearch} className="mt-2 mb-2 w-4/5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="タグを検索..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-full border border-gray-300 px-4 py-1 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            {/* 検索アイコン */}
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

                {/* あとで見るリスト */}
                <div className="mt-5 mb-2 ml-4 flex justify-end">
                    <Link
                        href="/bookmarks"
                        className="text-xs text-gray-500 underline hover:text-gray-700">
                        あとで見る リストへ
                    </Link>
                </div>

                {tags && tags.length > 0 ? (
                    <ul className="space-y-6">
                        {/* 1️⃣ recordsが空でないタグだけを抽出 */}
                        {tags
                            .filter(
                                tag => tag.records && tag.records.length > 0,
                            )
                            // 2️⃣ 名前順（A→Z）に並び替え。日本語の場合もUnicode順でOK
                            .sort((a, b) => a.tag.localeCompare(b.tag, 'ja'))
                            .map(tag => (
                                <li key={tag.id} className="border-b pb-4">
                                    {/* タグ名 */}
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                                        #{tag.tag}
                                    </h2>

                                    {/* 記録 */}
                                    <ul className="space-y-4 ml-4">
                                        {tag.records.map((r, idx) => {
                                            const KindIcon =
                                                kindIconMap[Number(r.kind)] ||
                                                HideSourceIcon

                                            return (
                                                <li
                                                    key={idx}
                                                    className="text-gray-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <KindIcon className="text-gray-500 w-2 h-2" />
                                                        <span className="text-base text-gray-800">
                                                            {r.title} /{' '}
                                                            {r.author}
                                                        </span>
                                                        <BookmarkButton
                                                            thoughtId={
                                                                r.thought_id
                                                            }
                                                            defaultBookmarked={
                                                                r.bookmarked
                                                            }
                                                        />
                                                    </div>

                                                    {r.part && (
                                                        <p className="ml-10 mt-2 text-xs text-gray-500">
                                                            ({r.part})
                                                        </p>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">条件にあうタグが見つかりません</p>
                )}
            </main>
        </>
    )
}
