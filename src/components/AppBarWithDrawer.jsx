'use client'

import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export default function AppBarWithDrawer() {
    const [open, setOpen] = React.useState(false)
    const { user, logout } = useAuth({ middleware: 'auth' })

    const toggleDrawer = newOpen => () => {
        setOpen(newOpen)
    }

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/howto">
                        <ListItemText primary="使い方のページ（後日作成）" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/concept">
                        <ListItemText primary="コンセプト（後日作成）" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/contact">
                        <ListItemText primary="お問合せやご意見（後日作成）" />
                    </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/bookmarks">
                        <ListItemText primary="あとで見る リスト" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/reminder">
                        <ListItemText primary="リマインド設定" />
                    </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem disablePadding>
                    <ListItemButton onClick={logout}>
                        <ListItemText primary="ログアウト" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    {/* 左端：メニューアイコン */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>

                    {/* 中央：アプリタイトル */}
                    <Typography
                        variant="h6"
                        component={Link} // ← Link を使う
                        href="/"
                        sx={{
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}>
                        エンタメフロート
                    </Typography>

                    {/* 右端：ログインユーザの email */}
                    {user && (
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {user.email}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </Box>
    )
}
