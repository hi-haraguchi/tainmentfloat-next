'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@mui/material'

import {
    Box,
    Modal,
    TextField,
    Button,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    Fade,
    Typography,
    IconButton,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import LocationPinIcon from '@mui/icons-material/LocationPin'
import ChatIcon from '@mui/icons-material/Chat'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LinkIcon from '@mui/icons-material/Link'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import CircularProgress from '@mui/material/CircularProgress'
import LoadingWater from '@/components/LoadingWater'

export default function NewTitlePage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    const [initialLoading, setInitialLoading] = useState(true)

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
    const [, setStatus] = useState(null)
    const isMobile = useMediaQuery('(max-width:980px)')

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [showNotice, setShowNotice] = useState(false)

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

    useEffect(() => {
        if (user !== undefined) {
            const timer = setTimeout(() => {
                setInitialLoading(false)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [user])

    if (initialLoading) return <LoadingWater />

    if (!user) return null

    const currentYear = new Date().getFullYear()

    return (
        <>
            <main className="px-4 w-full max-w-screen-sm mx-auto mt-16 overflow-x-hidden">
                {!isMobile && (
                    <h1 className="text-2xl font-bold mt-3 mb-6">
                        新しく触れたエンタメの記録
                    </h1>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ '& > :not(style)': { my: 1, width: '100%' } }}
                    // noValidate
                    autoComplete="off">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="text-sm text-gray-600 underline hover:text-gray-900">
                            ? 記入例など
                        </button>
                    </div>

                    {/* ジャンル */}
                    <FormControl
                        variant="standard"
                        sx={{ m: 0, minWidth: 120 }}>
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
                            <MenuItem value="その他">
                                その他（シェアしない場合はこれを選択）
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {errors.genre && (
                        <p className="text-red-600">{errors.genre}</p>
                    )}

                    {/* タイトル */}
                    <TextField
                        id="standard-basic"
                        label="エンタメのタイトル"
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
                        label="作者、アーティスト、出演者など"
                        variant="standard"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.author)}
                        helperText={errors.author}
                    />

                    <div className="pt-8 pb-2">
                        {/* 1行目 + トグルボタンを横並び */}
                        <div className="flex items-center">
                            <p className="text-xs text-gray-500 leading-tight">
                                ここからは、エンタメに触れた１回目の記録です。
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowNotice(!showNotice)}
                                className="text-gray-500 hover:text-gray-700">
                                {showNotice ? (
                                    <ExpandLessIcon fontSize="small" />
                                ) : (
                                    <ExpandMoreIcon fontSize="small" />
                                )}
                            </button>
                        </div>

                        {/* トグルで表示する部分 */}
                        {showNotice && (
                            <>
                                <p className="text-xs text-gray-500 leading-tight">
                                    まず、いつごろに触れたか入力してください。
                                </p>
                                <p className="text-xs text-gray-500 leading-tight">
                                    （昔に触れたものは年だけや、年と月だけでＯＫ）
                                </p>
                            </>
                        )}
                    </div>

                    {/* 年・月・日 横並び */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* 年 */}
                        <FormControl
                            variant="standard"
                            sx={{ flex: 1, minWidth: 0 }}>
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
                        <FormControl
                            variant="standard"
                            sx={{ flex: 1, minWidth: 0 }}>
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
                        <FormControl
                            variant="standard"
                            sx={{ flex: 1, minWidth: 0 }}>
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

                    <p className="pt-8 text-xs text-gray-500 leading-tight">
                        アイコンをタップすると入力欄が表示されます！
                    </p>

                    {/* アイコンでフォーム切り替え */}
                    <Box sx={{ display: 'flex', gap: 4, pt: 2 }}>
                        <IconButton onClick={() => setShowPart(!showPart)}>
                            <LocationPinIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => setShowThought(!showThought)}>
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
                        <Fade in={showPart} mountOnEnter unmountOnExit>
                            <TextField
                                id="standard-basic"
                                label="どの部分？（ページ数や巻数など）"
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

                        <Fade in={showThought} mountOnEnter unmountOnExit>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    id="standard-basic"
                                    label="感想"
                                    variant="standard"
                                    name="thought"
                                    value={form.thought}
                                    onChange={handleChange}
                                    fullWidth
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
                                <p className="pt-2 text-xs text-gray-500 leading-tight">
                                    ※感想はタグをつけても公開されません。
                                </p>
                            </Box>
                        </Fade>

                        <Fade in={showTag} mountOnEnter unmountOnExit>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    id="standard-basic"
                                    label="タグ（どんなときに振り返りたい？）"
                                    variant="standard"
                                    name="tag"
                                    value={form.tag}
                                    onChange={handleChange}
                                    fullWidth
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
                                <p className="pt-2 text-xs text-gray-500 leading-tight">
                                    ※右上の記入例も参考にどうぞ
                                </p>
                                {/* <p className="ml-3 text-xs text-gray-500 leading-tight">
                                    右上の記入例もチェックしてください
                                </p> */}
                            </Box>
                        </Fade>

                        <Fade in={showLink} mountOnEnter unmountOnExit>
                            <TextField
                                id="standard-basic"
                                label="リンク（URLを入力）"
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
                        disabled={loading}
                        sx={{
                            mt: 3,
                            backgroundColor: '#64748b', // slate-500（グレーに青み）
                            '&:hover': {
                                backgroundColor: '#475569', // slate-600
                            },
                            color: '#fff',
                        }}>
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            '記録する'
                        )}
                    </Button>
                </Box>

                {/* モーダル */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            width: '90%',
                            maxWidth: 400,
                        }}>
                        {/* 閉じるボタン */}
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" component="h2" gutterBottom>
                            記入例
                        </Typography>

                        {/* <p className="text-sm text-gray-900 leading-tight">
                            記録しやすいように入力してください！
                        </p> */}

                        <p className="mt-4 text-sm text-gray-900 leading-tight">
                            タイトルなどについて
                        </p>
                        <p className="mt-3 text-xs text-gray-600 leading-tight">
                            マンガだと
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            例えば『ONE PIECE』をタイトルで登録して
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ・2025/7/14 112巻 〇〇だった
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ・2025/9/29 1161話 △△だった
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            みたいに追加するのもOKですし
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            『ONE PIECE 112巻』とタイトルを登録して
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            もっと詳しく入力するのもアリです。
                        </p>

                        <p className="mt-3 text-xs text-gray-600 leading-tight">
                            音楽についても
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            タイトルに１曲を登録しても、アルバムで登録するのもアリです。
                        </p>

                        <p className="mt-4 text-sm text-gray-900 leading-tight">
                            タグについて
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ■気分
                        </p>
                        <p className="ml-4 mt-1 text-xs text-gray-600 leading-tight">
                            元気なとき、悲しいとき、…
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ■状況
                        </p>
                        <p className="ml-4 mt-1 text-xs text-gray-600 leading-tight">
                            もうひと頑張りしたいとき、緊張した場面で、…
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ■ライフステージ
                        </p>
                        <p className="ml-4 mt-1 text-xs text-gray-600 leading-tight">
                            学生のときよく聴いた、社会人１年目のとき読みたかった、…
                        </p>
                        <p className="mt-1 text-xs text-gray-600 leading-tight">
                            ■特定のエンタメ
                        </p>
                        <p className="ml-4 mt-1 text-xs text-gray-600 leading-tight">
                            私の「ジョジョ」はここから、個人的SLAMDUNK名場面、…
                        </p>

                        <p className="mt-5 text-xs text-gray-600 leading-tight">
                            ※タグをつけると、他のユーザにタイトル等がシェアされます。シェアしない場合はジャンルを「その他」にしてください。
                        </p>
                        

                        <p className="mt-6 text-xs text-gray-600 leading-tight">
                            使用テストして、わかりづらい部分は追記予定
                        </p>
                        {/* <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-line' }}>
                            🎬 映画の場合: タイトル → 「インセプション」
                            作者/出演者 → 「クリストファー・ノーラン /
                            レオナルド・ディカプリオ」 感想 →
                            「夢と現実の境界に引き込まれた」 📚 本の場合:
                            タイトル → 「ノルウェイの森」 作者 → 「村上春樹」
                            感想 → 「大学生活の孤独感に共感した」
                        </Typography> */}
                    </Box>
                </Modal>
            </main>
        </>
    )
}
