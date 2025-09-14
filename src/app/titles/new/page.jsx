'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useRouter } from "next/navigation"; 

export default function NewTitlePage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    if (!user) return null

    const [form, setForm] = useState({
        genre: '',
        title: '',
        author: '',
        year: '',
        month: '',
        day: '',
        part: '',
        thought: '',
        tag: '',
        link: '',
    })

    // const [errors, setErrors] = useState({})
    const [status, setStatus] = useState(null)

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        setStatus(null)

        try {
            const res = await axios.post('/api/titles', form)
            setStatus('success')
            alert('記録を追加しました！')
            router.push('/')// 一覧へ戻る
        } catch (err) {
            if (err.response?.status === 422) {
                // バリデーションエラー
                setErrors(err.response.data.errors)
            } else {
                alert('エラーが発生しました')
            }
        }
    }

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {user?.email} さんの新しい記録
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">ジャンル *</label>
                    <select
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full">
                        <option value="">選択してください</option>
                        <option value="本">本</option>
                        <option value="マンガ">マンガ</option>
                        <option value="映画">映画</option>
                        <option value="音楽">音楽</option>
                        <option value="ポッドキャスト">ポッドキャスト</option>
                        <option value="TV・動画配信サービス">
                            TV・動画配信サービス
                        </option>
                        <option value="その他">その他</option>
                    </select>
                    {errors.genre && (
                        <p className="text-red-600">{errors.genre}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1">タイトル *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    {errors.title && (
                        <p className="text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1">作者 *</label>
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    {errors.author && (
                        <p className="text-red-600">{errors.author}</p>
                    )}
                </div>

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
                    記録する
                </button>

                <Link href="/" className="ml-4 text-blue-600 underline">
                    タイムラインに戻る
                </Link>

                {status === 'success' && (
                    <p className="text-green-600 mt-2">保存しました！</p>
                )}
            </form>
        </main>
    )
}
