'use client'

import React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

// アイコン
import BorderColorIcon from '@mui/icons-material/BorderColor'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import SearchIcon from '@mui/icons-material/Search'

// Next.js
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavigation0915 = () => {
    const pathname = usePathname()

    // 現在のパスに応じて value を決定
    const getValueFromPath = path => {
        if (path.startsWith('/titles/new')) return 0
        if (path === '/') return 1
        if (path.startsWith('/tags')) return 2
        return -1 // 該当しないときは未選択
    }

    const value = getValueFromPath(pathname)

    return (
        <Box sx={{ pb: 7 }}>
            <CssBaseline />

            <Paper
                sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                elevation={3}>
                <BottomNavigation showLabels value={value}>
                    {/* 左：新規入力 */}
                    <BottomNavigationAction
                        label="記録する"
                        icon={<BorderColorIcon />}
                        component={Link}
                        href="/titles/new"
                    />

                    {/* 中央：一覧 */}
                    <BottomNavigationAction
                        label="振り返る"
                        icon={<FormatAlignLeftIcon />}
                        component={Link}
                        href="/"
                    />

                    {/* 右：探す */}
                    <BottomNavigationAction
                        label="探してみる"
                        icon={<SearchIcon />}
                        component={Link}
                        href="/tags"
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    )
}

export default BottomNavigation0915
