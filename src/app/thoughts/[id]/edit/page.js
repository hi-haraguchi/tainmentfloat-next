'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'

export default function EditThoughtPage() {
    const { id } = useParams()
    const router = useRouter()

    const [form, setForm] = useState({
        year: '',
        month: '',
        day: '',
        part: '',
        thought: '',
        tag: '',
        link: '',
        title_id: '', // 戻る用
    })
    const [, setErrors] = useState({})

    useEffect(() => {
        axios
            .get(`/api/thoughts/${id}/edit-data`)
            .then(res => setForm(prev => ({ ...prev, ...res.data })))
            .catch(err => console.error(err))
    }, [id])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        try {
            await axios.put(`/api/thoughts/${id}`, form)
            alert('感想を更新しました')
            router.push(`/titles/${form.title_id}`)
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                alert('エラーが発生しました')
            }
        }
    }

    // 👇 削除処理
    const handleDelete = async () => {
        if (!confirm('この感想を削除します。よろしいですか？')) return
        try {
            await axios.delete(`/api/thoughts/${id}`)
            alert('感想を削除しました')
            router.push(`/titles/${form.title_id}`)
        } catch (err) {
            alert('削除に失敗しました')
            console.error(err)
        }
    }

    return (
        <>
            <main className="p-6 max-w-2xl mx-auto mt-16">
                <h1 className="text-2xl font-bold mb-6">感想の編集</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 年 */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            年 *
                        </label>
                        <input
                            type="number"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
                        />
                    </div>

                    {/* 月・日 */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                月
                            </label>
                            <input
                                type="number"
                                name="month"
                                value={form.month}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                                日
                            </label>
                            <input
                                type="number"
                                name="day"
                                value={form.day}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
                            />
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
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
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
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
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
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
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
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
                            更新する
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-rose-500 text-white px-4 py-2 rounded text-sm hover:bg-rose-600">
                            削除する
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}
