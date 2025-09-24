'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios' // axios インスタンスを利用
import Link from 'next/link'

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

    if (loading) return <p>Loading...</p>

    return (
        <>

        <div style={{ padding: '1rem' }} className="p-6 max-w-4xl mx-auto mt-16">
            <h1>リマインド設定</h1>

            <div>
                <label>
                    <input
                        type="radio"
                        name="remindMode"
                        value={0}
                        checked={remindMode === 0}
                        onChange={() => setRemindMode(0)}
                    />
                    デフォルト（記録から2週間ごと）
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="radio"
                        name="remindMode"
                        value={1}
                        checked={remindMode === 1}
                        onChange={() => setRemindMode(1)}
                    />
                    自分で設定する（各ジャンル）
                </label>
            </div>

            {remindMode === 1 && (
                <div style={{ marginLeft: '1rem' }}>
                    {Object.entries({
                        0: '本',
                        1: 'マンガ',
                        2: '映画',
                        3: '音楽',
                        4: 'Podcast',
                        5: 'TV・配信サービス',
                    }).map(([kind, label]) => (
                        <div key={kind}>
                            <label>{label}</label>
                            <select
                                value={intervals[kind] ?? ''}
                                onChange={e =>
                                    setIntervals({
                                        ...intervals,
                                        [kind]: e.target.value || null,
                                    })
                                }>
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

            <div>
                <label>
                    <input
                        type="radio"
                        name="remindMode"
                        value={2}
                        checked={remindMode === 2}
                        onChange={() => setRemindMode(2)}
                    />
                    リマインドをしない
                </label>
            </div>

            <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
                更新
            </button>

            <div className="mt-6">
                <Link href="/" className="text-blue-600 underline">
                    タイムラインに戻る
                </Link>
            </div>
        </div>

        </>
    )
}
