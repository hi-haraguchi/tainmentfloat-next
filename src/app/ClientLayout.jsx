'use client'

import { usePathname } from 'next/navigation'
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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import TimelineIcon from '@mui/icons-material/Timeline'
import TagIcon from '@mui/icons-material/Tag'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'

export default function ClientLayout({ children }) {
    const pathname = usePathname()
    const isMobile = useMediaQuery('(max-width:980px)')
    const [drawerOpen, setDrawerOpen] = useState(false)

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
        '/titles/new': '新しい記録',
        '/bookmarks': 'あとで見る',
        '/reminder': 'リマインド設定',
    }

    // 動的ページ対応
    if (/^\/titles\/\d+$/.test(pathname)) pageTitles[pathname] = '記録の詳細'
    if (/^\/titles\/\d+\/edit$/.test(pathname))
        pageTitles[pathname] = 'タイトル編集'
    if (/^\/thoughts\/\d+\/edit$/.test(pathname))
        pageTitles[pathname] = '感想編集'

    // その他メニュー項目
    const otherMenuItems = [
        { text: '記録の詳細', href: '/titles/1' }, // サンプル、実際は動的ID
        { text: 'タイトル編集', href: '/titles/1/edit' },
        { text: '感想編集', href: '/thoughts/1/edit' },
        { text: 'あとで見る', href: '/bookmarks' },
        { text: 'リマインド設定', href: '/reminder' },
    ]

    return (
        <>
            {/* ---------------- PC ---------------- */}
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
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                    }}>
                                    新しいエンタメを{'\n'}記録する
                                </Typography>
                            </Link>
                            <Link href="/titles/index">
                                <Typography
                                    variant="body1"
                                    // align="center"
                                    sx={{
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
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
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
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
                                        color: 'black',
                                        whiteSpace: 'pre-line',
                                        fontSize: 14,
                                    }}>
                                    タグで{'\n'}見つける
                                </Typography>
                            </Link>

                            {/* その他のメニュー（文字クリックでドロワー） */}
                            <Typography
                                variant="body1"
                                sx={{
                                    cursor: 'pointer',
                                    color: 'black',
                                    whiteSpace: 'pre-line',
                                    fontSize: 14,
                                }}
                                onClick={toggleDrawer(true)}>
                                その他の{'\n'}メニュー
                            </Typography>

                            {/* ドロワー */}
                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}>
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
                                        gap: 8,
                                    }}>
                                    <img
                                        src="/tf-favicon.png"
                                        alt="favicon"
                                        style={{ height: 24, width: 24 }}
                                    />
                                    <img
                                        src="/images/lp/tf-font12.png"
                                        alt="ロゴ"
                                        style={{ height: 20 }}
                                    />
                                </div>
                                <IconButton
                                    color="inherit"
                                    onClick={toggleDrawer(true)}>
                                    <MenuIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    ) : pathname === '/titles/index' || pathname === '/tags' ? (
                        /* 一覧・タグ：ヘッダーなし、右上にハンバーガーだけ絶対配置 */
                        <IconButton
                            color="inherit"
                            onClick={toggleDrawer(true)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 1100,
                            }}>
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        /* ④〜⑨：戻る＋ページ名 */
                        <AppBar
                            position="static"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                borderBottom: '1px solid #ddd',
                                boxShadow: 'none',
                            }}>
                            <Toolbar sx={{ justifyContent: 'space-between' }}>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={() => history.back()}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    sx={{ textAlign: 'center', flexGrow: 1 }}>
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
                                showLabels
                                sx={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                }}>
                                <BottomNavigationAction
                                    label="記録"
                                    icon={<HomeIcon />}
                                    component={Link}
                                    href="/titles/new"
                                />
                                <BottomNavigationAction
                                    label="一覧"
                                    icon={<ListIcon />}
                                    component={Link}
                                    href="/titles/index"
                                />
                                <BottomNavigationAction
                                    label="タイムライン"
                                    icon={<TimelineIcon />}
                                    component={Link}
                                    href="/"
                                />
                                <BottomNavigationAction
                                    label="タグ"
                                    icon={<TagIcon />}
                                    component={Link}
                                    href="/tags"
                                />
                            </BottomNavigation>
                        )}

                    {/* ドロワー（スマホ共通） */}
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}>
                        <List sx={{ width: 250 }}>
                            {otherMenuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={toggleDrawer(false)}>
                                    <ListItem button>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                </Link>
                            ))}
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
