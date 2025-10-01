'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from '@/lib/axios'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import AddIcon from '@mui/icons-material/Add'

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TheatersIcon from '@mui/icons-material/Theaters'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import HideSourceIcon from '@mui/icons-material/HideSource'
import { Button } from '@mui/material'
import LoadingWater from '@/components/LoadingWater'

// ⭐ モーダルコンポーネント
function ThoughtFormModal({ form, errors, handleChange, handleSubmit }) {
    const [open, setOpen] = useState(false)

    const currentYear = new Date().getFullYear()
    // 100年前までの配列
    const years = Array.from({ length: 101 }, (_, i) => currentYear - i)
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    const handleSave = async e => {
        e.preventDefault()
        try {
            const result = await handleSubmit(e)
            if (result !== false) {
                setOpen(false) // 保存成功時に閉じる
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="mb-10">
            <Button
                onClick={() => setOpen(true)}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                    mt: 2,
                    backgroundColor: '#94a3b8', // slate-400
                    '&:hover': {
                        backgroundColor: '#64748b', // slate-500 に濃くなる
                    },
                    color: '#fff',
                    borderRadius: 2,
                    px: 2, // 横幅を抑える
                    py: 0.6, // 高さも少し控えめ
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    minWidth: 'auto', // 内容に合わせて幅が決まる
                    boxShadow: 1, // 影も軽めに
                }}>
                感想追加はこちら
            </Button>

            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => setOpen(false)}>
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
                        onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-medium text-gray-800 mb-4">
                            感想を追加
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            {/* 年月日 */}
                            <div className="flex gap-2">
                                {/* 年 */}
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">
                                        年 *
                                    </label>
                                    <select
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm bg-transparent">
                                        <option value="">-</option>
                                        {years.map(y => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.year && (
                                        <p className="text-red-600 text-xs">
                                            {errors.year}
                                        </p>
                                    )}
                                </div>

                                {/* 月 */}
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">
                                        月
                                    </label>
                                    <select
                                        name="month"
                                        value={form.month}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm bg-transparent">
                                        <option value="">-</option>
                                        {months.map(m => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 日 */}
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">
                                        日
                                    </label>
                                    <select
                                        name="day"
                                        value={form.day}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm bg-transparent">
                                        <option value="">-</option>
                                        {days.map(d => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 部分 */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    部分（巻・章など）
                                </label>
                                <input
                                    type="text"
                                    name="part"
                                    value={form.part}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm"
                                />
                            </div>

                            {/* 感想 */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    感想
                                </label>
                                <textarea
                                    name="thought"
                                    value={form.thought}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm"
                                />
                            </div>

                            {/* タグ */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    タグ
                                </label>
                                <input
                                    type="text"
                                    name="tag"
                                    value={form.tag}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm"
                                />
                            </div>

                            {/* リンク */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    リンク
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={form.link}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-1 text-sm"
                                />
                            </div>

                            {/* ボタン */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="text-xs text-gray-500 hover:text-gray-700">
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-800">
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function TitleDetailPage() {
    const { id } = useParams()
    const [title, setTitle] = useState(null)
    const [form, setForm] = useState({
        year: '',
        month: '',
        day: '',
        part: '',
        thought: '',
        tag: '',
        link: '',
    })
    const [errors, setErrors] = useState({})

    const [initialLoading, setInitialLoading] = useState(true)

    const kindIconMap = {
        0: MenuBookIcon,
        1: DashboardIcon,
        2: TheatersIcon,
        3: MusicNoteIcon,
        4: PodcastsIcon,
        5: OndemandVideoIcon,
        6: HideSourceIcon,
    }

    // データ取得
    useEffect(() => {
        // データ取得
        axios
            .get(`/api/titles/${id}`)
            .then(res => setTitle(res.data))
            .catch(err => console.error(err))

        // 疑似的に600ms待つ
        const timer = setTimeout(() => {
            setInitialLoading(false)
        }, 400)

        return () => clearTimeout(timer)
    }, [id])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        try {
            const res = await axios.post(`/api/titles/${id}/thoughts`, form)
            setTitle({
                ...title,
                thoughts: [...title.thoughts, res.data.data],
            })
            setForm({
                year: '',
                month: '',
                day: '',
                part: '',
                thought: '',
                tag: '',
                link: '',
            })
            return true // ✅ 成功を返す
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                alert('エラーが発生しました')
            }
            return false
        }
    }

    // like トグル
    const toggleLike = async () => {
        if (!title) return
        try {
            const res = await axios.put(`/api/titles/${id}`, {
                ...title,
                like: !title.like,
            })
            setTitle({
                ...res.data.data, // APIからの新しいtitle
                thoughts: title.thoughts, // 今のstateのthoughtsを保持
            })
        } catch (err) {
            console.error(err)
            alert('お気に入りの更新に失敗しました')
        }
    }

    if (!title || initialLoading) return <LoadingWater />

    const KindIcon = kindIconMap[title.kind] || HideSourceIcon

    return (
        <main className="p-6 max-w-3xl mx-auto mt-16">
            {/* Title情報 */}
            <div className="mb-1">
                <div className="flex items-center gap-2 mb-2">
                    <KindIcon className="text-gray-500 w-5 h-5" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        {title.title}
                    </h1>
                    <button onClick={toggleLike}>
                        {title.like ? (
                            <StarIcon className="text-yellow-500" />
                        ) : (
                            <StarBorderIcon className="text-gray-400" />
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                    <SupervisorAccountIcon
                        fontSize="small"
                        className="text-gray-500"
                    />
                    <span className="text-sm">{title.author}</span>
                </div>
            </div>

            <Link
                href={`/titles/${title.id}/edit`}
                className="text-xs text-gray-500 underline hover:text-gray-700 flex justify-end mb-6">
                タイトル部分の編集
            </Link>

            {/* 感想追加（モーダル） */}
            <ThoughtFormModal
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            {/* 感想一覧 */}
            <section>
                <h2 className="text-xl font-semibold mb-3">感想一覧</h2>
                {title.thoughts?.length > 0 ? (
                    title.thoughts.map(t => (
                        <div key={t.id} className="border-b pb-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span>
                                    {t.year}
                                    {t.month && `/${t.month}`}
                                    {t.day && `/${t.day}`}
                                </span>
                                {t.part && <span>{t.part}</span>}
                                <Link
                                    href={`/thoughts/${t.id}/edit`}
                                    className="ml-auto text-xs text-gray-500 underline hover:text-gray-700">
                                    編集
                                </Link>
                            </div>
                            {t.thought && (
                                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                                    {t.thought}
                                </p>
                            )}
                            {t.tag && (
                                <p className="mt-1 text-xs text-gray-500">
                                    #{t.tag.tag}
                                </p>
                            )}
                            {t.link && (
                                <a
                                    href={t.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 text-xs text-gray-500 underline">
                                    リンク
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        感想はまだありません
                    </p>
                )}
            </section>
        </main>
    )
}
