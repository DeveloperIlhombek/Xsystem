/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export function TelegramAuthButton() {
	const { telegramAuth } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleTelegramAuth = async () => {
		setError('')
		setLoading(true)

		// Demo: Telegram auth simulation
		// Real production da Telegram Login Widget ishlatiladi
		const mockTelegramData = {
			telegram_id: Math.random().toString(36).substring(7),
			username: 'telegram_user_' + Math.random().toString(36).substring(7),
			full_name: 'Telegram User',
		}

		try {
			await telegramAuth(mockTelegramData)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='space-y-2'>
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Button
				type='button'
				onClick={handleTelegramAuth}
				disabled={loading}
				variant='outline'
				className='w-full bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
			>
				<svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 24 24'>
					<path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z' />
				</svg>
				{loading ? 'Yuklanmoqda...' : 'Telegram orqali kirish'}
			</Button>
			<p className='text-xs text-gray-500 text-center'>
				(Demo: Avtomatik Telegram foydalanuvchisi yaratadi)
			</p>
		</div>
	)
}
