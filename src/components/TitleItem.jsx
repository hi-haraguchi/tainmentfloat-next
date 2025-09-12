'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 🔑 テキストの中で searchTerm に一致する部分をハイライト
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

export default function TitleItem({ title, defaultOpen = false, searchTerm = '' }) {
    const [open, setOpen] = useState(defaultOpen)

    useEffect(() => {
        setOpen(defaultOpen)
    }, [defaultOpen])

    return (
        <div className="border p-4 rounded bg-white mb-4">
            {/* Title + Author */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-lg">
                        <Link
                            href={`/titles/${title.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {highlight(title.title, searchTerm)}
                        </Link>
                    </h2>
                    <p className="text-sm text-gray-600">
                        作者: {highlight(title.author, searchTerm)}
                    </p>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-blue-600 text-sm underline"
                >
                    {open ? '閉じる' : '感想を見る'}
                </button>
            </div>

            {/* Thought一覧 */}
            {open && (
                <div className="mt-3">
                    {title.thoughts.length > 0 ? (
                        <ul className="pl-4 list-disc">
                            {title.thoughts.map((t) => (
                                <li key={t.id} className="mb-1">
                                    <span>
                                        {t.year}
                                        {t.month && `/${t.month}`}
                                        {t.day && `/${t.day}`}
                                    </span>
                                    ：{t.part && `[${highlight(t.part, searchTerm)}] `}
                                    {highlight(t.thought || '', searchTerm)}
                                    {t.tag && (
                                        <span className="ml-2 text-blue-600">
                                            #{highlight(t.tag.tag, searchTerm)}
                                        </span>
                                    )}
                                    {t.link && (
                                        <a
                                            href={t.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-sm text-blue-500 underline"
                                        >
                                            リンク
                                        </a>
                                    )}
                                    <Link
                                        href={`/thoughts/${t.id}/edit`}
                                        className="ml-2 text-sm text-green-600 underline"
                                    >
                                        編集
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">感想はまだありません</p>
                    )}
                </div>
            )}
        </div>
    )
}
