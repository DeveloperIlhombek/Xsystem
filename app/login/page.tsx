'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { TelegramAuthButton } from '@/components/auth/TelegramAuthButton'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const { user, loading } = useAuth()

	useEffect(() => {
		if (!loading && user) {
			router.push('/dashboard')
		}
	}, [user, loading, router])

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	if (user) {
		return null
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>
						O&apos;quv Markazi
					</CardTitle>
					<CardDescription className='text-center'>
						Tizimga kirish uchun ma&apos;lumotlaringizni kiriting
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<LoginForm />

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-white px-2 text-gray-500'>yoki</span>
						</div>
					</div>

					<TelegramAuthButton />

					<div className='text-center text-sm'>
						<span className='text-gray-600'>Hisobingiz yo&apos;qmi? </span>
						<Link href='/register' className='text-blue-600 hover:underline'>
							Ro&apos;yxatdan o&apos;ting
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
