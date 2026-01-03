/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartBarIcon,
	CheckCircleIcon,
	UserIcon,
} from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Submission {
	id: number
	student_id: number
	status: string
	score: number
	percentage: number
	passed: boolean
	time_spent_seconds: number
	submitted_at: string
	attempt_number: number
}

interface Statistics {
	test_id: number
	total_attempts: number
	average_score: number
	pass_rate: number
	highest_score: number
	lowest_score: number
}

interface Test {
	id: number
	title: string
	description: string
	total_points: number
	passing_score: number
}

export default function TestAllResultsPage() {
	const router = useRouter()
	const params = useParams()
	const testId = params?.id as string

	const [test, setTest] = useState<Test | null>(null)
	// const [submissions, setSubmissions] = useState<Submission[]>([])
	const [statistics, setStatistics] = useState<Statistics | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (testId) {
			fetchData()
		}
	}, [testId])

	const fetchData = async () => {
		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			// Fetch test
			const testRes = await fetch(`${API_URL}/api/v1/test/${testId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': 'true',
				},
			})

			if (testRes.ok) {
				const testData = await testRes.json()
				setTest(testData)
			}

			// Fetch statistics
			const statsRes = await fetch(
				`${API_URL}/api/v1/test/${testId}/statistics`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': 'true',
					},
				}
			)

			if (statsRes.ok) {
				const statsData = await statsRes.json()
				setStatistics(statsData)
			}

			// Note: Backend'da barcha submissionlarni olish endpoint'i yo'q
			// Keyinchalik qo'shish mumkin
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	if (error || !test) {
		return (
			<div className='max-w-2xl mx-auto'>
				<Alert variant='destructive'>
					<AlertDescription>{error || 'Test topilmadi'}</AlertDescription>
				</Alert>
				<Button onClick={() => router.push('/test')} className='mt-4'>
					Testlarga qaytish
				</Button>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>{test.title}</h1>
					<p className='text-gray-600 mt-1'>Test natijalari va statistika</p>
				</div>
				<Button
					variant='outline'
					onClick={() => router.push(`/test/${testId}/edit`)}
				>
					Testni tahrirlash
				</Button>
			</div>

			{/* Statistics */}
			{statistics && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<Card>
						<CardHeader className='pb-3'>
							<CardDescription>Jami urinishlar</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-2'>
								<UserIcon className='h-8 w-8 text-blue-600' />
								<span className='text-3xl font-bold'>
									{statistics.total_attempts}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='pb-3'>
							<CardDescription>O&apos;rtacha ball</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-2'>
								<ChartBarIcon className='h-8 w-8 text-green-600' />
								<span className='text-3xl font-bold'>
									{statistics.average_score.toFixed(1)}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='pb-3'>
							<CardDescription>O&apos;tish foizi</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-2'>
								<CheckCircleIcon className='h-8 w-8 text-purple-600' />
								<span className='text-3xl font-bold'>
									{statistics.pass_rate.toFixed(1)}%
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='pb-3'>
							<CardDescription>Eng yuqori ball</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-2'>
								<span className='text-3xl font-bold text-yellow-600'>
									{statistics.highest_score}
								</span>
								<span className='text-gray-500'>/ {test.total_points}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Distribution Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Ballar taqsimoti</CardTitle>
					<CardDescription>
						O&apos;quvchilarning natijalari bo&apos;yicha statistika
					</CardDescription>
				</CardHeader>
				<CardContent>
					{statistics && statistics.total_attempts > 0 ? (
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>O&apos;tganlar</span>
								<div className='flex items-center gap-2'>
									<div className='w-64 bg-gray-200 rounded-full h-4'>
										<div
											className='bg-green-600 h-4 rounded-full'
											style={{ width: `${statistics.pass_rate}%` }}
										/>
									</div>
									<span className='text-sm font-medium w-16 text-right'>
										{statistics.pass_rate.toFixed(1)}%
									</span>
								</div>
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>
									O&apos;ta olmaganlar
								</span>
								<div className='flex items-center gap-2'>
									<div className='w-64 bg-gray-200 rounded-full h-4'>
										<div
											className='bg-red-600 h-4 rounded-full'
											style={{ width: `${100 - statistics.pass_rate}%` }}
										/>
									</div>
									<span className='text-sm font-medium w-16 text-right'>
										{(100 - statistics.pass_rate).toFixed(1)}%
									</span>
								</div>
							</div>

							<div className='pt-4 border-t'>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<p className='text-gray-600'>Eng yuqori ball:</p>
										<p className='text-2xl font-bold text-green-600'>
											{statistics.highest_score}
										</p>
									</div>
									<div>
										<p className='text-gray-600'>Eng past ball:</p>
										<p className='text-2xl font-bold text-red-600'>
											{statistics.lowest_score}
										</p>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='text-center py-8 text-gray-500'>
							Hozircha natijalar yo&apos;q
						</div>
					)}
				</CardContent>
			</Card>

			{/* Recent Submissions */}
			<Card>
				<CardHeader>
					<CardTitle>So&apos;nggi topshiriqlar</CardTitle>
					<CardDescription>
						O&apos;quvchilarning oxirgi natijalari
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='text-center py-8 text-gray-500'>
						<p>Submissionlar ro&apos;yxati uchun alohida endpoint kerak</p>
						<p className='text-sm mt-2'>
							Backend: GET /api/v1/test/:id/submissions
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className='flex gap-4'>
				<Button variant='outline' onClick={() => router.push('/test')}>
					Barcha testlar
				</Button>
				<Button onClick={() => router.push(`/test/${testId}/edit`)}>
					Testni tahrirlash
				</Button>
			</div>
		</div>
	)
}
