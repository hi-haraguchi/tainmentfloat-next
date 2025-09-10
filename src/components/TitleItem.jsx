'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TitleItem({ title }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border p-4 rounded bg-white mb-4">
            {/* タイトル + 作者 */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-lg">
                        <Link
                            href={`/titles/${title.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {title.title}
                        </Link>
                    </h2>
                    <p className="text-sm text-gray-600">
                        作者: {title.author}
                    </p>
                </div>

                {/* アコーディオン開閉ボタン */}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-blue-600 text-sm underline"
                >
                    {open ? '閉じる' : '感想を見る'}
                </button>
            </div>

            {/* アコーディオン部分 */}
            {open && (
                <div className="mt-3">
                    {title.thoughts.length > 0 ? (
                        <ul className="pl-4 list-disc">
                            {title.thoughts.map(thought => (
                                <li key={thought.id} className="mb-1">
                                    <span>
                                        {thought.year}
                                        {thought.month && `/${thought.month}`}
                                        {thought.day && `/${thought.day}`}
                                    </span>
                                    ：{thought.part && `[${thought.part}] `}
                                    {thought.thought}
                                    {thought.tag && (
                                        <span className="ml-2 text-blue-600">
                                            #{thought.tag.tag}
                                        </span>
                                    )}
                                    {thought.link && (
                                        <a
                                            href={thought.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-sm text-blue-500 underline"
                                        >
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
