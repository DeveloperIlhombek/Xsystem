/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Test {
	id: number
	title: string
	description: string
	duration_minutes: number
	total_points: number
	passing_score: number
	questions: Question[]
}

interface Question {
	id: number
	question_type: string
	question_text: string
	points: number
	order: number
	options?: { text: string }[]
	image_url?: string
}

interface Answer {
	question_id: number
	answer_text?: string
	selected_option?: number
}

export default function TakeTestPage() {
	const router = useRouter()
	const params = useParams()
	const testId = params?.id as string

	const [test, setTest] = useState<Test | null>(null)
	const [submissionId, setSubmissionId] = useState<number | null>(null)
	const [answers, setAnswers] = useState<Record<number, Answer>>({})
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [timeLeft, setTimeLeft] = useState<number | null>(null)
	const [currentQuestion, setCurrentQuestion] = useState(0)

	useEffect(() => {
		if (testId) {
			fetchTestAndStart()
		}
	}, [testId])

	useEffect(() => {
		if (timeLeft === null || timeLeft <= 0) return

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev === null || prev <= 1) {
					handleSubmit()
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft])

	const fetchTestAndStart = async () => {
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

			if (!testRes.ok) throw new Error('Test topilmadi')

			const testData = await testRes.json()
			setTest(testData)

			// Start test
			const startRes = await fetch(`${API_URL}/api/v1/test/${testId}/start`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': 'true',
				},
			})

			if (!startRes.ok) {
				const error = await startRes.json()
				throw new Error(error.detail || 'Test boshlanmadi')
			}

			const submission = await startRes.json()
			setSubmissionId(submission.id)

			if (testData.duration_minutes) {
				setTimeLeft(testData.duration_minutes * 60)
			}
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	const saveAnswer = async (questionId: number, answer: Answer) => {
		if (!submissionId) return

		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			await fetch(`${API_URL}/api/v1/test/submissions/${submissionId}/answer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': 'true',
				},
				body: JSON.stringify(answer),
			})

			setAnswers({ ...answers, [questionId]: answer })
		} catch (err) {
			console.error('Javob saqlanmadi:', err)
		}
	}

	const handleAnswerChange = (questionId: number, value: any, type: string) => {
		const answer: Answer = { question_id: questionId }

		if (type === 'mcq') {
			answer.selected_option = value
		} else {
			answer.answer_text = value
		}

		saveAnswer(questionId, answer)
	}

	const handleSubmit = async () => {
		if (!submissionId) return

		setSubmitting(true)
		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			const response = await fetch(
				`${API_URL}/api/v1/test/submissions/${submissionId}/submit`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': 'true',
					},
				}
			)

			if (!response.ok) throw new Error('Topshirishda xatolik')

			const result = await response.json()
			router.push(`/test/${testId}/results/${submissionId}`)
		} catch (err: any) {
			setError(err.message)
			setSubmitting(false)
		}
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='max-w-2xl mx-auto'>
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
				<Button onClick={() => router.push('/tests')} className='mt-4'>
					Testlarga qaytish
				</Button>
			</div>
		)
	}

	if (!test) return null

	const currentQ = test.questions[currentQuestion]
	const progress = ((currentQuestion + 1) / test.questions.length) * 100

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
			{/* Header */}
			<div className='bg-white p-4 rounded-lg shadow'>
				<div className='flex justify-between items-center'>
					<div>
						<h1 className='text-2xl font-bold'>{test.title}</h1>
						<p className='text-sm text-gray-600'>
							Savol {currentQuestion + 1} / {test.questions.length}
						</p>
					</div>
					{timeLeft !== null && (
						<div className='flex items-center gap-2 text-lg font-semibold'>
							<ClockIcon className='h-6 w-6 text-blue-600' />
							<span
								className={timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}
							>
								{formatTime(timeLeft)}
							</span>
						</div>
					)}
				</div>
				<div className='mt-4 bg-gray-200 rounded-full h-2'>
					<div
						className='bg-blue-600 h-2 rounded-full transition-all'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Question Card */}
			<Card>
				<CardHeader>
					<div className='flex justify-between items-start'>
						<CardTitle>Savol {currentQuestion + 1}</CardTitle>
						<span className='text-sm font-medium text-blue-600'>
							{currentQ.points} ball
						</span>
					</div>
				</CardHeader>
				<CardContent className='space-y-6'>
					{currentQ.image_url && (
						<Image
							src={currentQ.image_url}
							alt='Question'
							className='max-w-full h-auto rounded-lg'
						/>
					)}

					<div className='text-lg'>{currentQ.question_text}</div>

					{/* MCQ */}
					{currentQ.question_type === 'mcq' && currentQ.options && (
						<div className='space-y-3'>
							{currentQ.options.map((option, index) => (
								<label
									key={index}
									className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
										answers[currentQ.id]?.selected_option === index
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-blue-300'
									}`}
								>
									<input
										type='radio'
										name={`question-${currentQ.id}`}
										checked={answers[currentQ.id]?.selected_option === index}
										onChange={() =>
											handleAnswerChange(currentQ.id, index, 'mcq')
										}
										className='mt-1 mr-3'
									/>
									<span>{option.text}</span>
								</label>
							))}
						</div>
					)}

					{/* True/False */}
					{currentQ.question_type === 'true_false' && (
						<div className='space-y-3'>
							{['true', 'false'].map(value => (
								<label
									key={value}
									className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
										answers[currentQ.id]?.answer_text === value
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-blue-300'
									}`}
								>
									<input
										type='radio'
										name={`question-${currentQ.id}`}
										checked={answers[currentQ.id]?.answer_text === value}
										onChange={() =>
											handleAnswerChange(currentQ.id, value, 'text')
										}
										className='mr-3'
									/>
									<span className='capitalize'>
										{value === 'true' ? "To'g'ri" : "Noto'g'ri"}
									</span>
								</label>
							))}
						</div>
					)}

					{/* Short Text */}
					{currentQ.question_type === 'short_text' && (
						<div className='space-y-2'>
							<Label>Javobingiz</Label>
							<Input
								value={answers[currentQ.id]?.answer_text || ''}
								onChange={e =>
									handleAnswerChange(currentQ.id, e.target.value, 'text')
								}
								placeholder='Javobni kiriting...'
							/>
						</div>
					)}

					{/* Essay */}
					{currentQ.question_type === 'essay' && (
						<div className='space-y-2'>
							<Label>Javobingiz</Label>
							<textarea
								value={answers[currentQ.id]?.answer_text || ''}
								onChange={e =>
									handleAnswerChange(currentQ.id, e.target.value, 'text')
								}
								placeholder='Batafsil javob yozing...'
								className='w-full p-3 border rounded-lg min-h-50'
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className='flex justify-between items-center'>
				<Button
					variant='outline'
					onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
					disabled={currentQuestion === 0}
				>
					Oldingi
				</Button>

				<div className='text-sm text-gray-600'>
					{Object.keys(answers).length} / {test.questions.length} savol
					javoblangan
				</div>

				{currentQuestion < test.questions.length - 1 ? (
					<Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
						Keyingi
					</Button>
				) : (
					<Button
						onClick={handleSubmit}
						disabled={submitting}
						className='bg-green-600 hover:bg-green-700'
					>
						<CheckCircleIcon className='h-5 w-5 mr-2' />
						{submitting ? 'Topshirilmoqda...' : 'Testni topshirish'}
					</Button>
				)}
			</div>

			{/* Question Navigator */}
			<Card>
				<CardHeader>
					<CardTitle className='text-sm'>Savollar navigatori</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-10 gap-2'>
						{test.questions.map((q, index) => (
							<button
								key={q.id}
								onClick={() => setCurrentQuestion(index)}
								className={`p-2 rounded text-sm font-medium ${
									index === currentQuestion
										? 'bg-blue-600 text-white'
										: answers[q.id]
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{index + 1}
							</button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
