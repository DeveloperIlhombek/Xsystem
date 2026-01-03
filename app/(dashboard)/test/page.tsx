'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
	CheckCircleIcon,
	ClockIcon,
	PlusIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Test {
	id: number
	title: string
	description: string
	teacher_id: number
	duration_minutes: number
	total_points: number
	passing_score: number
	status: string
	created_at: string
}

export default function TestsPage() {
	const router = useRouter()
	const { user } = useAuth()
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchTests()
	}, [])

	const fetchTests = async () => {
		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			const response = await fetch(`${API_URL}/api/v1/test/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': 'true',
				},
			})

			if (response.ok) {
				const data = await response.json()
				setTests(data)
			}
		} catch (error) {
			console.error('Failed to fetch tests:', error)
		} finally {
			setLoading(false)
		}
	}

	const getStatusBadge = (status: string) => {
		const variants: Record<string, string> = {
			draft: 'bg-gray-100 text-gray-800',
			published: 'bg-green-100 text-green-800',
			archived: 'bg-red-100 text-red-800',
		}

		const labels: Record<string, string> = {
			draft: 'Qoralama',
			published: 'Nashr qilingan',
			archived: 'Arxivlangan',
		}

		return (
			<Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
				{labels[status] || status}
			</Badge>
		)
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	const isTeacher =
		user?.role === 'teacher' ||
		user?.role === 'admin' ||
		user?.role === 'super_admin'

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Testlar</h1>
					<p className='text-gray-600 mt-1'>
						{isTeacher ? 'Testlarni boshqaring' : 'Mavjud testlar'}
					</p>
				</div>

				{isTeacher && (
					<Button onClick={() => router.push('/test/create')}>
						<PlusIcon className='h-5 w-5 mr-2' />
						Yangi test
					</Button>
				)}
			</div>

			{tests.length === 0 ? (
				<Card>
					<CardContent className='text-center py-12'>
						<p className='text-gray-500'>Hozircha testlar yo&apos;q</p>
						{isTeacher && (
							<Button
								onClick={() => router.push('/test/create')}
								className='mt-4'
							>
								Birinchi testni yaratish
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{tests.map(test => (
						<Card key={test.id} className='hover:shadow-lg transition-shadow'>
							<CardHeader>
								<div className='flex justify-between items-start'>
									<CardTitle className='text-lg'>{test.title}</CardTitle>
									{getStatusBadge(test.status)}
								</div>
								<CardDescription className='line-clamp-2'>
									{test.description || "Tavsif yo'q"}
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2 text-sm'>
									<div className='flex items-center text-gray-600'>
										<ClockIcon className='h-4 w-4 mr-2' />
										<span>{test.duration_minutes || 'Cheksiz'} daqiqa</span>
									</div>
									<div className='flex items-center text-gray-600'>
										<CheckCircleIcon className='h-4 w-4 mr-2' />
										<span>{test.total_points} ball</span>
									</div>
									<div className='flex items-center text-gray-600'>
										<XCircleIcon className='h-4 w-4 mr-2' />
										<span>O&apos;tish: {test.passing_score}%</span>
									</div>
								</div>

								<div className='flex gap-2'>
									{isTeacher ? (
										<>
											<Button
												variant='outline'
												size='sm'
												className='flex-1'
												onClick={() => router.push(`/test/${test.id}/edit`)}
											>
												Tahrirlash
											</Button>
											<Button
												variant='outline'
												size='sm'
												className='flex-1'
												onClick={() => router.push(`/test/${test.id}/results`)}
											>
												Natijalar
											</Button>
										</>
									) : (
										<Button
											className='w-full'
											onClick={() => router.push(`/test/${test.id}/take`)}
											disabled={test.status !== 'published'}
										>
											{test.status === 'published' ? 'Boshlash' : 'Mavjud emas'}
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
