'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'

export default function EditTitlePage() {
    const { id } = useParams()
    const router = useRouter()

    const [form, setForm] = useState({
        genre: '',
        title: '',
        author: '',
        like: false,
    })
    const [, setErrors] = useState({})

    useEffect(() => {
        axios
            .get(`/api/titles/${id}/edit-data`)
            .then(res => setForm(prev => ({ ...prev, ...res.data })))
            .catch(err => console.error(err))
    }, [id])

    const handleChange = e => {
        const { name, type, value, checked } = e.target
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        try {
            await axios.put(`/api/titles/${id}`, form)
            alert('タイトルを更新しました')
            router.push(`/titles/${id}`)
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
        if (!confirm('このタイトルと感想をすべて削除します。よろしいですか？'))
            return
        try {
            await axios.delete(`/api/titles/${id}`)
            alert('タイトルを削除しました')
            router.push('/') // 一覧に戻る
        } catch (err) {
            alert('削除に失敗しました')
            console.error(err)
        }
    }

    return (
        <>
            <main className="p-6 max-w-2xl mx-auto mt-16">
                <h1 className="text-2xl font-bold mb-6">タイトル編集</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ジャンル */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            ジャンル *
                        </label>
                        <select
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm bg-transparent">
                            <option value="本">本</option>
                            <option value="マンガ">マンガ</option>
                            <option value="映画">映画</option>
                            <option value="音楽">音楽</option>
                            <option value="ポッドキャスト">
                                ポッドキャスト
                            </option>
                            <option value="TV・動画配信サービス">
                                TV・動画配信サービス
                            </option>
                            <option value="その他">その他（シェアしない場合はこれを選択）</option>
                        </select>
                    </div>

                    {/* タイトル */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            タイトル *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 px-1 py-2 text-sm"
                        />
                    </div>

                    {/* 作者 */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            作者 *
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            required
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
