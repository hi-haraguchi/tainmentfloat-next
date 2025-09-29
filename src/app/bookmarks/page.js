'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TheatersIcon from '@mui/icons-material/Theaters'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HideSourceIcon from '@mui/icons-material/HideSource'
import LoadingWater from '@/components/LoadingWater'

export default function BookmarkPage() {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)

    const kindIconMap = {
        0: MenuBookIcon,
        1: DashboardIcon,
        2: TheatersIcon,
        3: MusicNoteIcon,
        4: PodcastsIcon,
        5: OndemandVideoIcon,
        6: HideSourceIcon,
    }

    useEffect(() => {
        axios
            .get('/api/bookmarks/mine')
            .then(res => {
                setBookmarks(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <LoadingWater />

    return (
        <main className="p-6 max-w-4xl mx-auto mt-16">
            <h1 className="text-xl font-medium text-gray-800 mb-6">
                あとで見るリスト
            </h1>

            {bookmarks.length > 0 ? (
                <ul className="space-y-6">
                    {bookmarks.map((b, idx) => {
                        const KindIcon = kindIconMap[Number(b.kind)] || HideSourceIcon
                        return (
                            <li key={idx} className="border-b pb-4">
                                {/* タグ（上部に表示） */}
                                {b.tag && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        #{b.tag}
                                    </p>
                                )}

                                {/* 1行目：ジャンルアイコン + タイトル/作者 */}
                                <div className="flex items-center gap-2 text-sm">
                                    <KindIcon className="text-gray-500 w-4 h-4" />
                                    <span className="text-base text-gray-800">
                                        {b.title}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        / {b.author}
                                    </span>
                                </div>

                                {/* 2行目：part（小さめ、少しマージン） */}
                                {b.part && (
                                    <p className="ml-6 mt-2 text-xs text-gray-500">
                                        ({b.part})
                                    </p>
                                )}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">まだブックマークがありません</p>
            )}
        </main>
    )
}
