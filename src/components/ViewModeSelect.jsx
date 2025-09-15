'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default function ViewModeSelect() {
    const router = useRouter()
    const pathname = usePathname()

    // 現在のパスに応じて初期値を設定
    const [viewMode, setViewMode] = useState(
        pathname === '/titles/index' ? 'titles' : 'timeline',
    )

    return (
        <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
                value={viewMode}
                onChange={e => {
                    const value = e.target.value
                    setViewMode(value)
                    if (value === 'timeline') {
                        router.push('/')
                    } else if (value === 'titles') {
                        router.push('/titles/index')
                    }
                }}>
                <MenuItem value="timeline">時系列で表示</MenuItem>
                <MenuItem value="titles">タイトルごとに表示</MenuItem>
            </Select>
        </FormControl>
    )
}
