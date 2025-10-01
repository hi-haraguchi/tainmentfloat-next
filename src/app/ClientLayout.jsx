'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    BottomNavigation,
    BottomNavigationAction,
    useMediaQuery,
    Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import ListIcon from '@mui/icons-material/List'
import TimelineIcon from '@mui/icons-material/Timeline'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'

export default function ClientLayout({ children }) {
    const pathname = usePathname()
    const isMobile = useMediaQuery('(max-width:980px)')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const router = useRouter()

    const getValueFromPath = path => {
        if (path.startsWith('/titles/new')) return 0
        if (path.startsWith('/titles/index')) return 1
        if (path === '/') return 2
        if (path.startsWith('/tags')) return 3
        return -1 // 該当なし
    }

    const { user, logout } = useAuth()

    // ナビやヘッダーを出さないページ
    const noLayoutPages = ['/', '/login', '/register', '/forgot-password']

    if (!user && noLayoutPages.includes(pathname)) {
        return <>{children}</>
    }
    const hideBottomNav =
        pathname.startsWith('/titles/new') ||
        /^\/titles\/\d+$/.test(pathname) ||
        /^\/titles\/\d+\/edit$/.test(pathname) ||
        /^\/thoughts\/\d+\/edit$/.test(pathname)

    // ドロワー開閉

    const toggleDrawer = open => () => setDrawerOpen(open)

    // BottomNavigation を表示するページ（スマホのみ）
    const showBottomNav =
        isMobile &&
        (pathname === '/' ||
            pathname.startsWith('/titles/index') ||
            pathname === '/tags')

    // ページ名マップ（スマホ用ヘッダー）
    const pageTitles = {
        '/titles/new': '新しいエンタメの記録',
        '/bookmarks': 'あとで見るリスト',
        '/reminder': 'リマインドの設定',
    }

    // 動的ページ対応
    if (/^\/titles\/\d+$/.test(pathname))
        pageTitles[pathname] = 'エンタメの詳細'
    if (/^\/titles\/\d+\/edit$/.test(pathname))
        pageTitles[pathname] = 'エンタメの編集'
    if (/^\/thoughts\/\d+\/edit$/.test(pathname))
        pageTitles[pathname] = '感想の編集'

    // 戻るボタンの挙動を分岐
    const handleBack = () => {
        // 編集ページなら → 履歴で戻る（詳細に戻す想定）
        if (
            /^\/titles\/\d+\/edit$/.test(pathname) ||
            /^\/thoughts\/\d+\/edit$/.test(pathname)
        ) {
            history.back()
            return
        }

        // 詳細ページなら → 一覧に戻る（sessionStorage 参照）
        if (/^\/titles\/\d+$/.test(pathname)) {
            const returnTo = sessionStorage.getItem('returnTo')

            if (returnTo === '/' || returnTo === '/titles/index') {
                router.push(returnTo)
                sessionStorage.removeItem('returnTo') // 1回使ったら消す
            } else {
                router.push('/') // fallback（安全策）
            }
            return
        }

        // それ以外のページは通常の戻る
        history.back()
    }

    return (
        <>
            {/* ---------------- PC ---------------- */}
            {!isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        borderBottom: '1px solid #ddd',
                        boxShadow: 'none',
                    }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* 左：ロゴ（高さいっぱい） */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '64px',
                            }}>
                            <img
                                src="/tf-favicon.png"
                                alt="ロゴ"
                                style={{ height: '75%', objectFit: 'contain' }}
                            />
                            <img
                                src="/images/lp/tf-font12.png"
                                alt="ロゴ"
                                style={{ height: '100%', objectFit: 'contain' }}
                            />
                        </div>

                        {/* 右：メニュー */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 40,
                            }}>
                            <Link href="/titles/new">
                                <Typography
                                    variant="body1"
                                    // align="center"
                                    sx={{
                                        display: 'inline-block', 
                                        position: 'relative',
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -2,
                                            width: pathname === '/titles/new' ? '100%' : '0%',
                                            height: '1.5px',
                                            backgroundColor: '#A9CF8A',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}>
                                    新しいエンタメを{'\n'}記録する
                                </Typography>
                            </Link>
                            <Link href="/titles/index">
                                <Typography
                                    variant="body1"
                                    // align="center"
                                    sx={{
                                        display: 'inline-block', 
                                        position: 'relative',
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -2,
                                            width: pathname === '/titles/index' ? '100%' : '0%',
                                            height: '1.5px',
                                            backgroundColor: '#A9CF8A',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}>
                                    <span style={{ fontSize: '12px' }}>
                                        記録リスト
                                    </span>
                                    {'\n'} ー 追記と検索
                                </Typography>
                            </Link>
                            <Link href="/">
                                <Typography
                                    variant="body1"
                                    // align="center"
                                    sx={{
                                        display: 'inline-block', 
                                        position: 'relative',
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -2,
                                            width: pathname === '/' ? '100%' : '0%',
                                            height: '1.5px',
                                            backgroundColor: '#A9CF8A',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}>
                                    <span style={{ fontSize: '12px' }}>
                                        記録リスト
                                    </span>
                                    {'\n'} ー タイムライン
                                </Typography>
                            </Link>
                            <Link href="/tags">
                                <Typography
                                    variant="body1"
                                    // align="center"
                                    sx={{
                                        display: 'inline-block', 
                                        position: 'relative',
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -2,
                                            width: pathname === '/tags' ? '100%' : '0%',
                                            height: '1.5px',
                                            backgroundColor: '#A9CF8A',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}>
                                    タグで{'\n'}見つける
                                </Typography>
                            </Link>

                            {/* その他のメニュー（文字クリックでドロワー） */}
                            <Typography
                                variant="body1"
                                sx={{
                                        display: 'inline-block', 
                                        position: 'relative',
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -2,
                                            width: '0%',
                                            height: '1.5px',
                                            backgroundColor: '#A9CF8A',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}
                                onClick={toggleDrawer(true)}>
                                その他の{'\n'}メニュー
                            </Typography>

                            {/* ドロワー */}
                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                ModalProps={{ keepMounted: true }} // 体感速度UP
                                slotProps={{
                                    // 背景（Backdrop）を白ぼかしに
                                    backdrop: {
                                        sx: {
                                            backgroundColor:
                                                'rgba(255,255,255,0.6)',
                                            backdropFilter: 'blur(6px)',
                                            WebkitBackdropFilter: 'blur(6px)',
                                        },
                                    },
                                    // ← これが PaperProps の後継
                                    paper: {
                                        sx: {
                                            width: {
                                                xs: 300,
                                                sm: 360,
                                                md: 400,
                                            },
                                            borderTopLeftRadius: 16,
                                            borderBottomLeftRadius: 16,
                                            background:
                                                'linear-gradient(to bottom, #fff, #f9f9f9)',
                                            boxShadow:
                                                '0 10px 30px rgba(0,0,0,0.12)',
                                        },
                                    },
                                }}>
                                <List sx={{ width: 400 }}>
                                    {/* ログインユーザーのメールアドレス */}
                                    <ListItem>
                                        <ListItemText
                                            primary={user?.email || 'ゲスト'}
                                            slotProps={{
                                                primary: {
                                                    sx: { fontWeight: 'bold' }, // ここに Typography の props を指定
                                                },
                                            }}
                                        />
                                    </ListItem>

                                    {/* メイン項目 */}
                                    <Link
                                        href="/reminder"
                                        onClick={toggleDrawer(false)}>
                                        <ListItem button>
                                            <ListItemText primary="リマインド設定" />
                                        </ListItem>
                                    </Link>
                                    <Link
                                        href="/bookmarks"
                                        onClick={toggleDrawer(false)}>
                                        <ListItem button>
                                            <ListItemText primary="あとで見るリスト" />
                                        </ListItem>
                                    </Link>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            toggleDrawer(false)()
                                            logout()
                                            window.location.href = '/login' // ← ログアウト後の遷移先
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}>
                                        <ListItemText primary="ログアウト" />
                                    </ListItem>

                                    <Divider sx={{ my: 2 }} />

                                    {/* 後日作成ページ */}
                                    <ListItem>
                                        <ListItemText primary="コンセプト（準備中）" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="使い方（準備中）" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="お問合せやご意見（準備中）" />
                                    </ListItem>
                                </List>
                            </Drawer>
                        </div>
                    </Toolbar>
                </AppBar>
            )}

            {/* ---------------- スマホ ---------------- */}
            {isMobile && (
                <>
                    {pathname === '/' ? (
                        /* タイムライン：ロゴ＋ハンバーガー */
                        <AppBar
                            position="static"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                borderBottom: '1px solid #ddd',
                                boxShadow: 'none',
                            }}>
                            <Toolbar sx={{ justifyContent: 'space-between' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                    <img
                                        src="/tf-favicon.png"
                                        alt="favicon"
                                        style={{ height: 32, width: 32 }}
                                    />
                                    <img
                                        src="/images/lp/tf-font12.png"
                                        alt="ロゴ"
                                        style={{ height: 40 }}
                                    />
                                </div>
                                <IconButton
                                    color="inherit"
                                    onClick={toggleDrawer(true)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}>
                                    <MenuIcon />
                                    <Typography
                                        variant="caption"
                                        sx={{ fontSize: 8, color: 'black' }}>
                                        メニュー
                                    </Typography>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    ) : pathname === '/titles/index' || pathname === '/tags' ? (
                        /* 一覧・タグ：ヘッダーなし、右上にハンバーガーだけ絶対配置 */
                        <>
                            {/* ハンバーガーメニューを右上に絶対配置 */}
                            <IconButton
                                color="inherit"
                                onClick={toggleDrawer(true)}
                                sx={{
                                    position: 'fixed', // 画面右上に張り付け
                                    top: 24,
                                    right: 12,
                                    zIndex: 1100, // 検索フォームより前面に
                                    backgroundColor: 'white', // 背景を白く
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 1, // ← padding 調整（お好みで）
                                }}>
                                <MenuIcon />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: 8,
                                        color: 'black',
                                        lineHeight: 1,
                                        mt: 0.5,
                                    }}>
                                    メニュー
                                </Typography>
                            </IconButton>
                        </>
                    ) : (
                        /* ④〜⑨：戻る＋ページ名 */
                        <AppBar
                            position="fixed"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                borderBottom: '1px solid #ddd',
                                boxShadow: 'none',
                            }}>
                            <Toolbar
                                sx={{
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                }}>
                                {/* 戻るボタン */}
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleBack}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 1,
                                    }}>
                                    <ArrowBackIcon />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: 8,
                                            color: 'black',
                                            lineHeight: 1,
                                            mt: 0.5,
                                        }}>
                                        戻る
                                    </Typography>
                                </IconButton>

                                {/* タイトル（中央固定配置・細字） */}
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: 16, // 小さめ
                                        fontWeight: 400, // 細字
                                        color: 'black',
                                    }}>
                                    {pageTitles[pathname] || ''}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    )}

                    {/* BottomNavigation：/ /titles/index /tags のとき表示 */}
                    {(pathname === '/' ||
                        pathname === '/titles/index' ||
                        pathname === '/tags') &&
                        !hideBottomNav && (
                            <BottomNavigation
                                value={getValueFromPath(pathname)}
                                showLabels
                                sx={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 72,
                                    '& .MuiBottomNavigationAction-root.Mui-selected':
                                        {
                                            color: '#006400',
                                            // color: '#013220',
                                            // color: '#004d40',
                                            backgroundColor: '#eaf6ea',
                                            borderRadius: '6px',
                                        },
                                }}>
                                <BottomNavigationAction
                                    label={
                                        <span
                                            style={{
                                                whiteSpace: 'pre-line',
                                                fontSize: 10,
                                                textAlign: 'center', // ← テキスト中央揃え
                                                display: 'block',
                                            }}>
                                            新しい{'\n'}エンタメ記録
                                        </span>
                                    }
                                    icon={<BorderColorIcon />}
                                    component={Link}
                                    href="/titles/new"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // アイコン＋文字を中央寄せ
                                        justifyContent: 'flex-start', // アイコンを上部にそろえる
                                        gap: '6px', // アイコンと文字のすき間
                                        pt: 0.5, // 上の余白を少し追加（お好みで）
                                    }}
                                />
                                <BottomNavigationAction
                                    label={
                                        <span
                                            style={{
                                                whiteSpace: 'pre-line',
                                                fontSize: 10,
                                                textAlign: 'center', // ← テキスト中央揃え
                                                display: 'block',
                                            }}>
                                            記録リスト{'\n'}（追記と検索）
                                        </span>
                                    }
                                    icon={<ListIcon />}
                                    component={Link}
                                    href="/titles/index"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // アイコン＋文字を中央寄せ
                                        justifyContent: 'flex-start', // アイコンを上部にそろえる
                                        gap: '6px', // アイコンと文字のすき間
                                        pt: 0.5, // 上の余白を少し追加（お好みで）
                                    }}
                                />
                                <BottomNavigationAction
                                    label={
                                        <span
                                            style={{
                                                whiteSpace: 'pre-line',
                                                fontSize: 10,
                                                textAlign: 'center', // ← テキスト中央揃え
                                                display: 'block',
                                            }}>
                                            タイムライン
                                        </span>
                                    }
                                    icon={<TimelineIcon />}
                                    component={Link}
                                    href="/"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // アイコン＋文字を中央寄せ
                                        justifyContent: 'flex-start', // アイコンを上部にそろえる
                                        gap: '6px', // アイコンと文字のすき間
                                        pt: 0.5, // 上の余白を少し追加（お好みで）
                                    }}
                                />

                                <BottomNavigationAction
                                    label={
                                        <span
                                            style={{
                                                whiteSpace: 'pre-line',
                                                fontSize: 10,
                                                textAlign: 'center', // ← テキスト中央揃え
                                                display: 'block',
                                            }}>
                                            タグで{'\n'}見つける
                                        </span>
                                    }
                                    icon={<SearchIcon />}
                                    component={Link}
                                    href="/tags"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // アイコン＋文字を中央寄せ
                                        justifyContent: 'flex-start', // アイコンを上部にそろえる
                                        gap: '6px', // アイコンと文字のすき間
                                        pt: 0.5, // 上の余白を少し追加（お好みで）
                                    }}
                                />
                            </BottomNavigation>
                        )}

                    {/* ドロワー（スマホ共通） */}
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        slotProps={{
                            // 背景の白ぼかし
                            backdrop: {
                                sx: {
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    backdropFilter: 'blur(6px)',
                                    WebkitBackdropFilter: 'blur(6px)', // Safari対応
                                },
                            },
                            // ドロワー本体
                            paper: {
                                sx: {
                                    width: 280, // ← スマホ用に調整
                                    borderTopLeftRadius: 16,
                                    borderBottomLeftRadius: 16,
                                    background:
                                        'linear-gradient(to bottom, #ffffff, #f9f9f9)',
                                    boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
                                },
                            },
                        }}>
                        <List sx={{ width: 280 }}>
                            {/* ログインユーザーのメールアドレス */}
                            <ListItem>
                                <ListItemText
                                    primary={user?.email || 'ゲスト'}
                                    slotProps={{
                                        primary: {
                                            sx: { fontWeight: 'bold' }, // ここに Typography の props を指定
                                        },
                                    }}
                                />
                            </ListItem>

                            {/* メイン項目 */}
                            <Link
                                href="/reminder"
                                onClick={toggleDrawer(false)}>
                                <ListItem button>
                                    <ListItemText primary="リマインド設定" />
                                </ListItem>
                            </Link>
                            <Link
                                href="/bookmarks"
                                onClick={toggleDrawer(false)}>
                                <ListItem button>
                                    <ListItemText primary="あとで見るリスト" />
                                </ListItem>
                            </Link>
                            <ListItem
                                button
                                onClick={() => {
                                    toggleDrawer(false)()
                                    logout()
                                    window.location.href = '/login' // ← ログアウト後の遷移先
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}>
                                <ListItemText primary="ログアウト" />
                            </ListItem>

                            <hr style={{ margin: '12px 0' }} />

                            {/* 後日作成ページ */}
                            <ListItem>
                                <ListItemText primary="コンセプト（準備中）" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="使い方（準備中）" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="お問合せやご意見（準備中）" />
                            </ListItem>
                        </List>
                    </Drawer>
                </>
            )}

            {/* ---------------- コンテンツ ---------------- */}
            <main style={{ paddingBottom: showBottomNav ? 56 : 0 }}>
                {children}
            </main>
        </>
    )
}
