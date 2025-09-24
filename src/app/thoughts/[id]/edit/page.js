'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import Link from 'next/link'

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
        {/* <AppBarWithDrawer /> */}
        <main className="p-6 max-w-2xl mx-auto mt-16">
            <h1 className="text-2xl font-bold mb-6">感想の編集</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>年 *</label>
                    <input
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <div>
                        <label>月</label>
                        <input
                            type="number"
                            name="month"
                            value={form.month}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>日</label>
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
                    <label>部分</label>
                    <input
                        type="text"
                        name="part"
                        value={form.part}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>感想</label>
                    <textarea
                        name="thought"
                        value={form.thought}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>タグ</label>
                    <input
                        type="text"
                        name="tag"
                        value={form.tag}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>リンク</label>
                    <input
                        type="url"
                        name="link"
                        value={form.link}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
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
                        href={`/titles/${form.title_id}`}
                        className="text-blue-600 underline">
                        詳細に戻る
                    </Link>
                </div>
            </form>
        </main>

        </>
    )
}
