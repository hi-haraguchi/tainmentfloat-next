'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// アイコン
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TheatersIcon from '@mui/icons-material/Theaters'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HideSourceIcon from '@mui/icons-material/HideSource'

// kind → アイコンの対応
const kindIconMap = {
    0: MenuBookIcon, // 本
    1: DashboardIcon, // マンガ
    2: TheatersIcon, // 映画
    3: MusicNoteIcon, // 音楽
    4: PodcastsIcon, // ポッドキャスト
    5: OndemandVideoIcon, // TV・動画配信サービス
    6: HideSourceIcon, // その他
}

// 🔑 テキスト中の searchTerm に一致する部分をハイライト
function highlight(text, searchTerm) {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-lime-100 font-bold">
                {part}
            </mark>
        ) : (
            part
        ),
    )
}

export default function TitleItem({
    title,
    defaultOpen = false,
    searchTerm = '',
}) {
    const [open, setOpen] = useState(defaultOpen)

    useEffect(() => {
        setOpen(defaultOpen)
    }, [defaultOpen])

    // kind に基づいてアイコン選択
    const KindIcon = kindIconMap[title.kind] || HideSourceIcon

    return (
        <div className="border-b pb-4 mb-4">
            {/* Title + Author */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-base text-gray-700 flex items-center gap-2">
                        {/* ジャンルアイコン */}
                        <KindIcon className="text-gray-500" />

                        {/* タイトルリンク */}
                        <Link
                            href={`/titles/${title.id}`}
                            className="text-gray-700 underline hover:text-gray-900">
                            {highlight(title.title, searchTerm)}
                        </Link>
                    </h2>

                    {/* 作者 */}
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <SupervisorAccountIcon
                            fontSize="small"
                            className="text-gray-500"
                        />
                        {highlight(title.author, searchTerm)}
                    </p>
                </div>

                {/* 開閉ボタン */}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-gray-600 text-sm">
                    {open ? '✕' : '▽'}
                </button>
            </div>

            {/* Thought一覧 */}
            {open && (
                <div className="mt-3 space-y-4">
                    {title.thoughts.length > 0 ? (
                        <ul className="space-y-4">
                            {title.thoughts.map(t => (
                                <li key={t.id} className="text-gray-700">
                                    {/* 日付 + Part を横並び */}
                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <span>
                                            {t.year}
                                            {t.month && `/${t.month}`}
                                            {t.day && `/${t.day}`}
                                        </span>
                                        {t.part && (
                                            <span>
                                                {highlight(t.part, searchTerm)}
                                            </span>
                                        )}
                                    </div>

                                    {/* 感想 */}
                                    {t.thought && (
                                        <p className="mt-1 text-base text-gray-700 leading-relaxed">
                                            {highlight(t.thought, searchTerm)}
                                        </p>
                                    )}

                                    {/* タグ */}
                                    {t.tag && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            #{highlight(t.tag.tag, searchTerm)}
                                        </p>
                                    )}

                                    {/* リンク */}
                                    {t.link && (
                                        <a
                                            href={t.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-500 underline">
                                            リンク
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">
                            感想はまだありません
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
