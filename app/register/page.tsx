'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
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

export default function RegisterPage() {
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
						Ro&apos;yxatdan o&apos;tish
					</CardTitle>
					<CardDescription className='text-center'>
						Yangi hisob yaratish uchun ma&apos;lumotlaringizni kiriting
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<RegisterForm />

					<div className='text-center text-sm'>
						<span className='text-gray-600'>Hisobingiz bormi? </span>
						<Link href='/login' className='text-blue-600 hover:underline'>
							Kirish
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
