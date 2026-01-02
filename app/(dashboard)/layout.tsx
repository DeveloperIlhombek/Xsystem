'use client'

import { Navbar } from '@/components/dashboard/Navbar'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const { user, loading } = useAuth()

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login')
		}
	}, [user, loading, router])

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Sidebar />
			<div className='lg:pl-64'>
				<Navbar />
				<main className='py-6'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}
