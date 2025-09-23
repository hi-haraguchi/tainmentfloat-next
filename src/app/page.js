'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'
import BottomNavigation0915 from '@/components/BottomNavigation0915'
import ViewModeSelect from '@/components/ViewModeSelect'
import AppBarWithDrawer from '@/components/AppBarWithDrawer'
import IntroHeader from '@/components/IntroHeader'
import HomeIntro from '@/components/HomeIntro'
import LoadingWater from '@/components/LoadingWater'

export default function TimelinePage() {
    const [timeline, setTimeline] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useAuth({ middleware: 'guest' })

    useEffect(() => {
        if (user) {
            // 疑似的に 遅延を入れる
            setTimeout(() => {
                axios
                    .get('/api/timeline')
                    .then(res => {
                        setTimeline(res.data)
                        setLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setLoading(false)
                    })
            }, 3800)
        } else {
            setLoading(false) // 未ログインならすぐ解除
        }
    }, [user])

    if (loading) return <LoadingWater />

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                {/* bg-gray-50 */}
                <IntroHeader />

                <main className="pt-20 flex flex-col items-center text-center px-4">
                    <HomeIntro />
                </main>
            </div>
        )
    }

    return (
        <>
            <AppBarWithDrawer />

            <main className="p-6 max-w-4xl mx-auto mt-16">
                {/* ヘッダー */}
                <div className="flex justify-end items-center mb-6 gap-4">
                    <ViewModeSelect />
                </div>

                {/* タイムライン本体 */}
                {Object.keys(timeline)
                    .sort((a, b) => Number(b) - Number(a)) // 年を降順（新しい年が上）
                    .map(year => (
                        <div key={year} className="mb-8">
                            {/* 年見出し */}
                            <h2 className="text-xl font-bold mb-4">{year}年</h2>

                            {Object.keys(timeline[year])
                                .sort((a, b) => {
                                    if (a === '00') return -1 // 月なしは先頭
                                    if (b === '00') return 1
                                    return Number(b) - Number(a) // 12→1 の順
                                })
                                .map(month => (
                                    <div key={month} className="ml-4 mb-4">
                                        {/* 月見出し */}
                                        {month === '00' ? (
                                            <h3 className="text-lg font-semibold mb-2">
                                                -
                                            </h3>
                                        ) : (
                                            <h3 className="text-lg font-semibold mb-2">
                                                {month}月
                                            </h3>
                                        )}

                                        <ul className="ml-4 space-y-2">
                                            {timeline[year][month]
                                                .slice() // 元データを壊さないためコピー
                                                .sort((a, b) => {
                                                    const dayA = a.day ?? 0
                                                    const dayB = b.day ?? 0

                                                    if (dayA === 0) return -1 // day未入力を先頭へ
                                                    if (dayB === 0) return 1
                                                    return dayB - dayA // 数値の降順（新しい日が上）
                                                })
                                                .map((item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="border p-3 rounded bg-white">
                                                        <p>
                                                            <span className="font-semibold">
                                                                {item.genre}
                                                            </span>{' '}
                                                            -{' '}
                                                            <Link
                                                                href={`/titles/${item.id}`}
                                                                className="text-blue-600 hover:underline">
                                                                {item.title}
                                                            </Link>{' '}
                                                            / {item.author}
                                                        </p>
                                                        {item.day && (
                                                            <p>
                                                                {year}/
                                                                {month !== '00'
                                                                    ? month
                                                                    : ''}
                                                                /{item.day}
                                                            </p>
                                                        )}
                                                        <p>{item.thought}</p>
                                                        {item.tag && (
                                                            <p className="text-blue-600">
                                                                #{item.tag}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    ))}
            </main>

            <BottomNavigation0915 />
        </>
    )
}
