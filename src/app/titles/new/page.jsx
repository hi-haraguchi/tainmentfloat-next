'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
// import BottomNavigation0915 from '@/components/BottomNavigation0915'
// import AppBarWithDrawer from '@/components/AppBarWithDrawer'
import {
    Box,
    TextField,
    Button,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    Fade,
    IconButton,
} from '@mui/material'

import LocationPinIcon from '@mui/icons-material/LocationPin'
import ChatIcon from '@mui/icons-material/Chat'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LinkIcon from '@mui/icons-material/Link'

import CircularProgress from '@mui/material/CircularProgress'

export default function NewTitlePage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

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

    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState(null)

    // それぞれのフォーム表示状態
    const [showPart, setShowPart] = useState(false)
    const [showThought, setShowThought] = useState(false)
    const [showTag, setShowTag] = useState(false)
    const [showLink, setShowLink] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        setStatus(null)
        setLoading(true)

        try {
            await axios.post('/api/titles', form)
            setStatus('success')
            alert('記録を追加しました！')
            router.push('/') // 一覧へ戻る
        } catch (err) {
            if (err.response?.status === 422) {
                // バリデーションエラー
                setErrors(err.response.data.errors)
            } else {
                alert('エラーが発生しました')
            }
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    const currentYear = new Date().getFullYear()

    return (
        <>
            {/* <AppBarWithDrawer /> */}

            <main className="p-6 max-w-2xl mx-auto mt-16">
                <h1 className="text-2xl font-bold mb-6">
                    新しく触れたエンタメの記録
                </h1>

                {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off">
                    {/* ジャンル */}
                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="genre-label">ジャンル *</InputLabel>
                        <Select
                            labelId="genre-label"
                            id="standard-basic"
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            required
                            error={Boolean(errors.genre)}>
                            <MenuItem value="">
                                <em>選択してください</em>
                            </MenuItem>
                            <MenuItem value="本">本</MenuItem>
                            <MenuItem value="マンガ">マンガ</MenuItem>
                            <MenuItem value="映画">映画</MenuItem>
                            <MenuItem value="音楽">音楽</MenuItem>
                            <MenuItem value="ポッドキャスト">
                                ポッドキャスト
                            </MenuItem>
                            <MenuItem value="TV・動画配信サービス">
                                TV・動画配信サービス
                            </MenuItem>
                            <MenuItem value="その他">その他</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.genre && (
                        <p className="text-red-600">{errors.genre}</p>
                    )}

                    {/* タイトル */}
                    <TextField
                        id="standard-basic"
                        label="タイトル *"
                        variant="standard"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                    />

                    {/* 作者 */}
                    <TextField
                        id="standard-basic"
                        label="作者 *"
                        variant="standard"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.author)}
                        helperText={errors.author}
                    />
                

                {/* 年・月・日 横並び */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* 年 */}
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <InputLabel id="year-label">年 *</InputLabel>
                        <Select
                            labelId="year-label"
                            id="standard-basic"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            required>
                            <MenuItem value="">
                                <em>選択してください</em>
                            </MenuItem>
                            {Array.from({ length: 100 }, (_, i) => (
                                <MenuItem key={i} value={currentYear - i}>
                                    {currentYear - i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 月 */}
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <InputLabel id="month-label">月</InputLabel>
                        <Select
                            labelId="month-label"
                            id="standard-basic"
                            name="month"
                            value={form.month}
                            onChange={handleChange}>
                            <MenuItem value="">
                                <em>選択してください</em>
                            </MenuItem>
                            {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 日 */}
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <InputLabel id="day-label">日</InputLabel>
                        <Select
                            labelId="day-label"
                            id="standard-basic"
                            name="day"
                            value={form.day}
                            onChange={handleChange}>
                            <MenuItem value="">
                                <em>選択してください</em>
                            </MenuItem>
                            {Array.from({ length: 31 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* アイコンでフォーム切り替え */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <IconButton onClick={() => setShowPart(!showPart)}>
                        <LocationPinIcon />
                    </IconButton>
                    <IconButton onClick={() => setShowThought(!showThought)}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={() => setShowTag(!showTag)}>
                        <LocalOfferIcon />
                    </IconButton>
                    <IconButton onClick={() => setShowLink(!showLink)}>
                        <LinkIcon />
                    </IconButton>
                </Box>

                {/* Fadeで表示されるフォーム */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        mt: 2,
                    }}>
                    <Fade in={showPart}>
                        <TextField
                            id="standard-basic"
                            label="どの部分"
                            variant="standard"
                            name="part"
                            value={form.part}
                            onChange={handleChange}
                            sx={{
                                mt: 1,
                                '& .MuiInputBase-input': {
                                    outline: 'none', // ← デフォルトの青枠を削除
                                },
                                '& .Mui-focused .MuiInputBase-input': {
                                    outline: 'none !important', // ← フォーカス時も強制的に消す
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottom: '1px solid #888',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                            }}
                        />
                    </Fade>

                    <Fade in={showThought}>
                        <TextField
                            id="standard-basic"
                            label="感想"
                            variant="standard"
                            name="thought"
                            value={form.thought}
                            onChange={handleChange}
                            multiline
                            sx={{
                                mt: 1,
                                '& .MuiInputBase-input': {
                                    outline: 'none', // ← デフォルトの青枠を削除
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottom: '1px solid #888',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                            }}
                        />
                    </Fade>

                    <Fade in={showTag}>
                        <TextField
                            id="standard-basic"
                            label="タグ"
                            variant="standard"
                            name="tag"
                            value={form.tag}
                            onChange={handleChange}
                            sx={{
                                mt: 1,
                                '& .MuiInputBase-input': {
                                    outline: 'none', // ← デフォルトの青枠を削除
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottom: '1px solid #888',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                            }}
                        />
                    </Fade>

                    <Fade in={showLink}>
                        <TextField
                            id="standard-basic"
                            label="リンク"
                            variant="standard"
                            name="link"
                            value={form.link}
                            onChange={handleChange}
                            sx={{
                                mt: 1,
                                '& .MuiInputBase-input': {
                                    outline: 'none', // ← デフォルトの青枠を削除
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: '1px solid #ccc',
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottom: '1px solid #888',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                            }}
                        />
                    </Fade>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    disabled={loading}>
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        '記録する'
                    )}
                </Button>

                </Box>
            </main>

            {/* <BottomNavigation0915 /> */}
        </>
    )
}
