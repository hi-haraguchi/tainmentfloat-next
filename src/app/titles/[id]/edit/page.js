'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import Link from 'next/link'
import AppBarWithDrawer from '@/components/AppBarWithDrawer'

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

        <AppBarWithDrawer />

        <main className="p-6 max-w-2xl mx-auto mt-16">
            <h1 className="text-2xl font-bold mb-6">タイトル編集</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>ジャンル *</label>
                    <select
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full">
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
                </div>
                <div>
                    <label>タイトル *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>作者 *</label>
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="like"
                        checked={form.like}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label>お気に入り</label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded">
                        更新する
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded">
                        削除する
                    </button>
                    <Link
                        href={`/titles/${id}`}
                        className="text-blue-600 underline">
                        詳細に戻る
                    </Link>
                </div>
            </form>
        </main>

        </>
    )
}
