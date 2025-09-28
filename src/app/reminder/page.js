'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios' // axios インスタンスを利用
import LoadingWater from '@/components/LoadingWater'

export default function ReminderPage() {
    const [loading, setLoading] = useState(true)
    const [remindMode, setRemindMode] = useState(0) // 0=default, 1=custom, 2=off
    const [intervals, setIntervals] = useState({
        0: null, // 本
        1: null, // マンガ
        2: null, // 映画
        3: null, // 音楽
        4: null, // Podcast
        5: null, // TV
    })

    const options = [
        { value: null, label: '登録なし' },
        { value: 5, label: '5日' },
        { value: 7, label: '1週間' },
        { value: 14, label: '2週間' },
        { value: 21, label: '3週間' },
        { value: 30, label: '1か月' },
        { value: 60, label: '2か月' },
    ]

    // 初期データをAPIから取得
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/api/remind-setting')
                setRemindMode(res.data.mode)

                const resIntervals = await api.get('/api/intervals')
                const mapped = {}
                resIntervals.data.forEach(i => {
                    mapped[i.kind] = i.interval_days
                })
                setIntervals(mapped)

                setLoading(false)
            } catch (error) {
                console.error('Fetch error:', error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async () => {
        try {
            // モード更新
            await api.put('/api/remind-setting', { mode: remindMode })

            // カスタム時は intervals も更新
            if (remindMode === 1) {
                await api.put('/api/intervals', { intervals })
            }

            alert('リマインド設定を更新しました')
        } catch (error) {
            console.error('Update error:', error)
            alert('更新に失敗しました')
        }
    }

    if (loading) return <LoadingWater />

    return (
        <main className="p-6 max-w-4xl mx-auto mt-16 text-sm">
            <h1 className="text-lg font-semibold mb-6">リマインド設定</h1>

            {/* デフォルト */}
            <div className="mb-3">
                <label className="flex items-center text-gray-700">
                    <input
                        type="radio"
                        name="remindMode"
                        value={0}
                        checked={remindMode === 0}
                        onChange={() => setRemindMode(0)}
                        className="mr-2 accent-gray-600"
                    />
                    デフォルト（記録から2週間ごと）
                </label>
            </div>

            {/* 自分で設定 */}
            <div className="mb-3">
                <label className="flex items-center text-gray-700">
                    <input
                        type="radio"
                        name="remindMode"
                        value={1}
                        checked={remindMode === 1}
                        onChange={() => setRemindMode(1)}
                        className="mr-2 accent-gray-600"
                    />
                    自分で設定する（各ジャンル）
                </label>

                {remindMode === 1 && (
                    <div className="ml-6 mt-2 space-y-3">
                        {Object.entries({
                            0: '本',
                            1: 'マンガ',
                            2: '映画',
                            3: '音楽',
                            4: 'ポッドキャスト',
                            5: 'TV・動画配信サービス',
                        }).map(([kind, label]) => (
                            <div key={kind}>
                                <label className="block text-xs text-gray-600 mb-1">
                                    {label}
                                </label>
                                <select
                                    value={intervals[kind] ?? ''}
                                    onChange={e =>
                                        setIntervals({
                                            ...intervals,
                                            [kind]: e.target.value || null,
                                        })
                                    }
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-xs bg-transparent">
                                    {options.map(o => (
                                        <option
                                            key={o.value ?? 'null'}
                                            value={o.value ?? ''}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* リマインドしない */}
            <div className="mb-6">
                <label className="flex items-center text-gray-700">
                    <input
                        type="radio"
                        name="remindMode"
                        value={2}
                        checked={remindMode === 2}
                        onChange={() => setRemindMode(2)}
                        className="mr-2 accent-gray-600"
                    />
                    リマインドをしない
                </label>
            </div>

            {/* 更新ボタン */}
            <button
                onClick={handleSubmit}
                className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-800">
                更新する
            </button>
        </main>
    )
}
