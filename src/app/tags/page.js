'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { Link, useMediaQuery } from '@mui/material'

// ブックマークボタン
function BookmarkButton({ thoughtId, defaultBookmarked = false }) {
    const [bookmarked, setBookmarked] = useState(defaultBookmarked)
    const [loading, setLoading] = useState(false)

    // defaultBookmarked が変わったら state を更新
    useEffect(() => {
        setBookmarked(defaultBookmarked)
    }, [defaultBookmarked])

    const toggleBookmark = async () => {
        if (loading) return
        setLoading(true)

        try {
            if (bookmarked) {
                await axios.delete(`/api/bookmarks/${thoughtId}`)
                setBookmarked(false)
            } else {
                await axios.post('/api/bookmarks', { thought_id: thoughtId })
                setBookmarked(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={toggleBookmark} disabled={loading} className="ml-2">
            {bookmarked ? (
                <BookmarkIcon className="h-6 w-6 text-yellow-500" />
            ) : (
                <BookmarkBorderIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            )}
        </button>
    )
}

export default function TagsPage() {
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const isMobile = useMediaQuery('(max-width:980px)')

    const fetchTags = (q = '') => {
        setLoading(true)
        axios
            .get('/api/tags', { params: { q } })
            .then(res => {
                setTags(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTags()
    }, [])

    const handleSearch = e => {
        e.preventDefault()
        fetchTags(search)
    }

    if (loading) {
        return <p className="p-6">読み込み中...</p>
    }

    return (
        <>
            <main
                className={`p-6 max-w-4xl mx-auto ${isMobile ? '' : 'mt-16'}`}>
                {/* 検索窓 */}
                <form onSubmit={handleSearch} className="mb-6 flex gap-2 w-4/5">
                    <input
                        type="text"
                        placeholder="タグを検索..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border p-2 flex-1"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded">
                        検索
                    </button>
                </form>

                {/* あとで見るリストへ */}
                <div className="mt-6 mb-6">
                    <Link href="/bookmarks" className="text-blue-600 underline">
                        あとで見るリストへ
                    </Link>
                </div>

            

                {tags.length > 0 ? (
                    <ul className="space-y-6">
                        {tags.map(tag => (
                            <li
                                key={tag.id}
                                className="border p-4 rounded bg-white">
                                <h2 className="text-xl font-semibold mb-2">
                                    #{tag.tag}
                                </h2>
                                {tag.records.length > 0 ? (
                                    <ul className="pl-4 list-disc">
                                        {tag.records.map((r, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center">
                                                <span>
                                                    {r.genre} - {r.title} /{' '}
                                                    {r.author}{' '}
                                                    {r.part && `(${r.part})`}
                                                </span>
                                                <BookmarkButton
                                                    thoughtId={r.thought_id}
                                                    defaultBookmarked={
                                                        r.bookmarked
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        公開されている記録はありません
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">タグが見つかりません</p>
                )}
            </main>
        </>
    )
}
