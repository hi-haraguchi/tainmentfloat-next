'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'
import IntroHeader from '@/components/IntroHeader'
import HomeIntro from '@/components/HomeIntro'
import LoadingWater from '@/components/LoadingWater'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TheatersIcon from '@mui/icons-material/Theaters'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HideSourceIcon from '@mui/icons-material/HideSource'

import { useMediaQuery } from '@mui/material'

export default function TimelinePage() {
    const [timeline, setTimeline] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useAuth({ middleware: 'guest' })
    const isMobile = useMediaQuery('(max-width:980px)')

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
            }, 800)
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
            <main
                className={`p-6 max-w-4xl mx-auto ${isMobile ? '' : 'mt-16'}`}>
                {Object.keys(timeline)
                    .sort((a, b) => Number(b) - Number(a))
                    .map(year => (
                        <div key={year} className="mb-8">
                            {/* 年見出し */}
                            <h2 className="text-xl font-medium text-gray-800 mb-4">
                                {year}年
                            </h2>

                            {Object.keys(timeline[year])
                                .sort((a, b) => {
                                    if (a === '00') return -1
                                    if (b === '00') return 1
                                    return Number(b) - Number(a)
                                })
                                .map(month => (
                                    <div key={month} className="ml-4 mb-4">
                                        {/* 月見出し */}
                                        {month === '00' ? (
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                                -
                                            </h3>
                                        ) : (
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                                {month}月
                                            </h3>
                                        )}

                                        <ul className="ml-4 space-y-4">
                                            {timeline[year][month]
                                                .slice()
                                                .sort((a, b) => {
                                                    const dayA = a.day ?? 0
                                                    const dayB = b.day ?? 0
                                                    if (dayA === 0) return -1
                                                    if (dayB === 0) return 1
                                                    return dayB - dayA
                                                })
                                                .map((item, idx) => {
                                                    const KindIcon =
                                                        kindIconMap[
                                                            Number(item.kind)
                                                        ] || HideSourceIcon

                                                    return (
                                                        <li
                                                            key={idx}
                                                            className="border-b pb-3">
                                                            {/* 1行目：ジャンルアイコン + タイトルリンク + 作者 */}
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <KindIcon className="text-gray-500 w-4 h-4" />
                                                                <Link
                                                                    href={`/titles/${item.id}`}
                                                                    onClick={() => sessionStorage.setItem('returnTo', location.pathname)}
                                                                    className="text-base text-gray-700 underline hover:text-gray-900">
                                                                    {item.title}
                                                                </Link>
                                                                <span className="text-xs text-gray-600">
                                                                    /{' '}
                                                                    {
                                                                        item.author
                                                                    }
                                                                </span>
                                                            </div>

                                                            {/* 2行目：日付 */}
                                                            {item.day && (
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    {year}/
                                                                    {month !==
                                                                    '00'
                                                                        ? month
                                                                        : ''}
                                                                    /{item.day}
                                                                </p>
                                                            )}

                                                            {/* 3行目：感想 */}
                                                            {item.thought && (
                                                                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                                                                    {
                                                                        item.thought
                                                                    }
                                                                </p>
                                                            )}

                                                            {/* 4行目：タグ */}
                                                            {item.tag && (
                                                                <p className="mt-1 text-xs text-gray-600">
                                                                    #{item.tag}
                                                                </p>
                                                            )}
                                                        </li>
                                                    )
                                                })}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    ))}
            </main>
        </>
    )
}
