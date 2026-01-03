/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	CheckCircleIcon,
	ClockIcon,
	TrophyIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Submission {
	id: number
	test_id: number
	student_id: number
	status: string
	score: number
	percentage: number
	passed: boolean
	time_spent_seconds: number
	attempt_number: number
	submitted_at: string
	test: {
		title: string
		description: string
		total_points: number
		passing_score: number
	}
	answers: Answer[]
}

interface Answer {
	id: number
	question_id: number
	answer_text?: string
	selected_option?: number
	is_correct?: boolean
	points_earned: number
	feedback?: string
}

export default function TestResultsPage() {
	const router = useRouter()
	const params = useParams()
	const submissionId = params?.submissionId as string

	const [submission, setSubmission] = useState<Submission | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (submissionId) {
			fetchResults()
		}
	}, [submissionId])

	const fetchResults = async () => {
		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			const response = await fetch(
				`${API_URL}/api/v1/test/submissions/${submissionId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': 'true',
					},
				}
			)

			if (!response.ok) throw new Error('Natijalar topilmadi')

			const data = await response.json()
			setSubmission(data)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins} daqiqa ${secs} soniya`
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	if (error || !submission) {
		return (
			<div className='max-w-2xl mx-auto'>
				<Alert variant='destructive'>
					<AlertDescription>{error || 'Natijalar topilmadi'}</AlertDescription>
				</Alert>
				<Button onClick={() => router.push('/test')} className='mt-4'>
					Testlarga qaytish
				</Button>
			</div>
		)
	}

	const correctAnswers = submission.answers.filter(a => a.is_correct).length
	const totalQuestions = submission.answers.length

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
			{/* Result Header */}
			<Card
				className={submission.passed ? 'border-green-500' : 'border-red-500'}
			>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							{submission.passed ? (
								<CheckCircleIcon className='h-12 w-12 text-green-600' />
							) : (
								<XCircleIcon className='h-12 w-12 text-red-600' />
							)}
							<div>
								<CardTitle className='text-2xl'>
									{submission.passed
										? "Tabriklaymiz! O'tdingiz!"
										: "Afsuski, o'ta olmadingiz"}
								</CardTitle>
								<CardDescription>{submission.test.title}</CardDescription>
							</div>
						</div>
						<TrophyIcon className='h-16 w-16 text-yellow-500' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
						<div className='p-4 bg-blue-50 rounded-lg'>
							<p className='text-3xl font-bold text-blue-600'>
								{submission.percentage.toFixed(1)}%
							</p>
							<p className='text-sm text-gray-600'>Natija</p>
						</div>
						<div className='p-4 bg-green-50 rounded-lg'>
							<p className='text-3xl font-bold text-green-600'>
								{submission.score} / {submission.test.total_points}
							</p>
							<p className='text-sm text-gray-600'>Ball</p>
						</div>
						<div className='p-4 bg-purple-50 rounded-lg'>
							<p className='text-3xl font-bold text-purple-600'>
								{correctAnswers} / {totalQuestions}
							</p>
							<p className='text-sm text-gray-600'>
								To&apos;g&apos;ri javoblar
							</p>
						</div>
						<div className='p-4 bg-yellow-50 rounded-lg'>
							<p className='text-2xl font-bold text-yellow-600'>
								<ClockIcon className='h-6 w-6 inline mr-1' />
								{Math.floor(submission.time_spent_seconds / 60)}m
							</p>
							<p className='text-sm text-gray-600'>Vaqt</p>
						</div>
					</div>

					<div className='mt-4 flex justify-between items-center text-sm text-gray-600'>
						<span>Urinish: {submission.attempt_number}</span>
						<span>O&apos;tish bali: {submission.test.passing_score}%</span>
						<span>
							Topshirilgan:{' '}
							{new Date(submission.submitted_at).toLocaleString('uz-UZ')}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Detailed Answers */}
			<Card>
				<CardHeader>
					<CardTitle>Batafsil natijalar</CardTitle>
					<CardDescription>
						Har bir savol bo&apos;yicha natijalar
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{submission.answers.map((answer, index) => (
						<div
							key={answer.id}
							className={`p-4 rounded-lg border-2 ${
								answer.is_correct === true
									? 'border-green-200 bg-green-50'
									: answer.is_correct === false
									? 'border-red-200 bg-red-50'
									: 'border-gray-200 bg-gray-50'
							}`}
						>
							<div className='flex justify-between items-start mb-2'>
								<span className='font-semibold'>Savol {index + 1}</span>
								<div className='flex items-center gap-2'>
									{answer.is_correct === true && (
										<Badge className='bg-green-600'>
											<CheckCircleIcon className='h-4 w-4 mr-1' />
											To&apos;g&apos;ri
										</Badge>
									)}
									{answer.is_correct === false && (
										<Badge className='bg-red-600'>
											<XCircleIcon className='h-4 w-4 mr-1' />
											Noto&apos;g&apos;ri
										</Badge>
									)}
									{answer.is_correct === null && (
										<Badge className='bg-yellow-600'>Baholanmoqda</Badge>
									)}
									<span className='text-sm font-medium'>
										{answer.points_earned} ball
									</span>
								</div>
							</div>

							{answer.answer_text && (
								<div className='mt-2'>
									<p className='text-sm text-gray-600'>Sizning javobingiz:</p>
									<p className='mt-1 p-2 bg-white rounded'>
										{answer.answer_text}
									</p>
								</div>
							)}

							{answer.selected_option !== null &&
								answer.selected_option !== undefined && (
									<div className='mt-2'>
										<p className='text-sm text-gray-600'>Tanlangan variant:</p>
										<p className='mt-1 p-2 bg-white rounded'>
											Variant {answer.selected_option + 1}
										</p>
									</div>
								)}

							{answer.feedback && (
								<div className='mt-2 p-2 bg-blue-50 rounded'>
									<p className='text-sm font-medium text-blue-900'>
										O&apos;qituvchi izohi:
									</p>
									<p className='text-sm text-blue-800 mt-1'>
										{answer.feedback}
									</p>
								</div>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{/* Actions */}
			<div className='flex gap-4'>
				<Button variant='outline' onClick={() => router.push('/test')}>
					Testlarga qaytish
				</Button>
				{!submission.passed && submission.attempt_number < 3 && (
					<Button
						onClick={() => router.push(`/test/${submission.test_id}/take`)}
					>
						Qayta urinib ko&apos;rish
					</Button>
				)}
			</div>
		</div>
	)
}
