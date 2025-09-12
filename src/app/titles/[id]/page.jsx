'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from '@/lib/axios'

export default function TitleDetailPage() {
    const { id } = useParams()
    const [title, setTitle] = useState(null)
    const [thoughts, setThoughts] = useState([])
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

    // Title + Thoughts 取得
    useEffect(() => {
        axios
            .get(`/api/titles/${id}`)
            .then(res => {
                setTitle(res.data)
                setThoughts(res.data.thoughts)
            })
            .catch(err => console.error(err))
    }, [id])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})

        try {
            const res = await axios.post(`/api/titles/${id}/thoughts`, form)
            // 追加した thought を一覧に反映
            setThoughts([...thoughts, res.data.data])
            setForm({
                year: '',
                month: '',
                day: '',
                part: '',
                thought: '',
                tag: '',
                link: '',
            })
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                alert('エラーが発生しました')
            }
        }
    }

    if (!title) {
        return <p className="p-6">読み込み中...</p>
    }

    return (
        <main className="p-6 max-w-3xl mx-auto">
            {/* Title情報 */}
            <h1 className="text-2xl font-bold mb-2">{title.title}</h1>
            <p className="text-gray-600 mb-4">
                作者: {title.author} / ジャンル: {title.genre}
            </p>
            <Link
                href={`/titles/${title.id}/edit`}
                className="text-blue-600 underline text-sm">
                タイトルを編集
            </Link>

            {/* Thought追加フォーム */}
            <form
                onSubmit={handleSubmit}
                className="space-y-3 mb-6 border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">感想を追加</h2>
                <div>
                    <label className="block mb-1">年 *</label>
                    <input
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    {errors.year && (
                        <p className="text-red-600">{errors.year}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <div>
                        <label className="block mb-1">月</label>
                        <input
                            type="number"
                            name="month"
                            value={form.month}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">日</label>
                        <input
                            type="number"
                            name="day"
                            value={form.day}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1">部分（巻・章など）</label>
                    <input
                        type="text"
                        name="part"
                        value={form.part}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">感想</label>
                    <textarea
                        name="thought"
                        value={form.thought}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">タグ</label>
                    <input
                        type="text"
                        name="tag"
                        value={form.tag}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block mb-1">リンク</label>
                    <input
                        type="url"
                        name="link"
                        value={form.link}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    感想を追加
                </button>
            </form>

            {/* Thought一覧 */}
            <section>
                <h2 className="text-xl font-semibold mb-3">感想一覧</h2>
                {thoughts.length > 0 ? (
                    <ul className="space-y-2">
                        {thoughts.map(t => (
                            <li key={t.id} className="border p-3 rounded">
                                <p>
                                    {t.year}
                                    {t.month && `/${t.month}`}
                                    {t.day && `/${t.day}`} ：
                                    {t.part && `[${t.part}] `}
                                    {t.thought}
                                </p>
                                {t.tag && (
                                    <p className="text-blue-600 text-sm">
                                        #{t.tag.tag}
                                    </p>
                                )}
                                {t.link && (
                                    <a
                                        href={t.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline text-sm">
                                        参考リンク
                                    </a>
                                )}

                                <Link
                                    href={`/thoughts/${t.id}/edit`}
                                    className="text-blue-600 underline text-sm ml-2">
                                    編集
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">まだ感想はありません</p>
                )}
            </section>

            {/* 一覧に戻る */}
            <div className="mt-6">
                <Link href="/" className="text-blue-600 underline">
                    一覧に戻る
                </Link>
            </div>
        </main>
    )
}
