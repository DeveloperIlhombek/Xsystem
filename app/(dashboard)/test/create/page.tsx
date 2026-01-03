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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Question {
	question_type: string
	question_text: string
	points: number
	order: number
	options?: { text: string; is_correct: boolean }[]
	correct_answer?: string
}

export default function CreateTestPage() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [testData, setTestData] = useState({
		title: '',
		description: '',
		duration_minutes: 60,
		passing_score: 70,
		total_points: 0,
		randomize_questions: false,
		show_results_immediately: true,
		max_attempts: 1,
	})
	const [questions, setQuestions] = useState<Question[]>([])

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				question_type: 'mcq',
				question_text: '',
				points: 1,
				order: questions.length,
				options: [
					{ text: '', is_correct: false },
					{ text: '', is_correct: false },
				],
			},
		])
	}

	const updateQuestion = (index: number, field: string, value: any) => {
		const updated = [...questions]
		updated[index] = { ...updated[index], [field]: value }
		setQuestions(updated)
	}

	const addOption = (questionIndex: number) => {
		const updated = [...questions]
		if (!updated[questionIndex].options) {
			updated[questionIndex].options = []
		}
		updated[questionIndex].options!.push({ text: '', is_correct: false })
		setQuestions(updated)
	}

	const updateOption = (
		questionIndex: number,
		optionIndex: number,
		field: string,
		value: any
	) => {
		const updated = [...questions]
		if (updated[questionIndex].options) {
			updated[questionIndex].options![optionIndex] = {
				...updated[questionIndex].options![optionIndex],
				[field]: value,
			}
		}
		setQuestions(updated)
	}

	const removeQuestion = (index: number) => {
		setQuestions(questions.filter((_, i) => i !== index))
	}

	const removeOption = (questionIndex: number, optionIndex: number) => {
		const updated = [...questions]
		if (updated[questionIndex].options) {
			updated[questionIndex].options = updated[questionIndex].options!.filter(
				(_, i) => i !== optionIndex
			)
		}
		setQuestions(updated)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const token = localStorage.getItem('access_token')
			const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

			const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

			const response = await fetch(`${API_URL}/api/v1/test/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': 'true',
				},
				body: JSON.stringify({
					...testData,
					total_points: totalPoints,
					questions: questions,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.detail || 'Test yaratishda xatolik')
			}

			const data = await response.json()
			router.push(`/test/${data.id}/edit`)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='space-y-6 max-w-4xl mx-auto'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>
					Yangi Test Yaratish
				</h1>
				<p className='text-gray-600 mt-1'>
					Test ma&apos;lumotlari va savollarni kiriting
				</p>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Test Ma&apos;lumotlari</CardTitle>
					<CardDescription>Asosiy sozlamalar</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='title'>Test nomi *</Label>
						<Input
							id='title'
							value={testData.title}
							onChange={e =>
								setTestData({ ...testData, title: e.target.value })
							}
							placeholder='Matematika - 1-bob'
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Tavsif</Label>
						<textarea
							id='description'
							value={testData.description}
							onChange={e =>
								setTestData({ ...testData, description: e.target.value })
							}
							placeholder="Test haqida qisqacha ma'lumot"
							className='w-full p-2 border rounded-md min-h-25'
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='duration'>Vaqt (daqiqa)</Label>
							<Input
								id='duration'
								type='number'
								value={testData.duration_minutes}
								onChange={e =>
									setTestData({
										...testData,
										duration_minutes: parseInt(e.target.value),
									})
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='passing_score'>O&apos;tish bali (%)</Label>
							<Input
								id='passing_score'
								type='number'
								value={testData.passing_score}
								onChange={e =>
									setTestData({
										...testData,
										passing_score: parseInt(e.target.value),
									})
								}
								min='0'
								max='100'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='max_attempts'>Maksimal urinishlar</Label>
							<Input
								id='max_attempts'
								type='number'
								value={testData.max_attempts}
								onChange={e =>
									setTestData({
										...testData,
										max_attempts: parseInt(e.target.value),
									})
								}
								min='1'
							/>
						</div>
					</div>

					<div className='flex items-center space-x-2'>
						<input
							type='checkbox'
							id='randomize'
							checked={testData.randomize_questions}
							onChange={e =>
								setTestData({
									...testData,
									randomize_questions: e.target.checked,
								})
							}
							className='rounded'
						/>
						<Label htmlFor='randomize'>
							Savollarni aralashtirib ko&apos;rsatish
						</Label>
					</div>

					<div className='flex items-center space-x-2'>
						<input
							type='checkbox'
							id='show_results'
							checked={testData.show_results_immediately}
							onChange={e =>
								setTestData({
									...testData,
									show_results_immediately: e.target.checked,
								})
							}
							className='rounded'
						/>
						<Label htmlFor='show_results'>
							Natijalarni darhol ko&apos;rsatish
						</Label>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className='flex justify-between items-center'>
						<div>
							<CardTitle>Savollar</CardTitle>
							<CardDescription>
								Test savollari va javoblarini kiriting
							</CardDescription>
						</div>
						<Button onClick={addQuestion} size='sm'>
							<PlusIcon className='h-4 w-4 mr-2' />
							Savol qo&apos;shish
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-6'>
					{questions.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							Hozircha savollar yo&apos;q. &quot;Savol qo&apos;shish&quot;
							tugmasini bosing.
						</div>
					) : (
						questions.map((question, qIndex) => (
							<Card key={qIndex} className='border-2'>
								<CardHeader>
									<div className='flex justify-between items-start'>
										<CardTitle className='text-lg'>
											Savol {qIndex + 1}
										</CardTitle>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => removeQuestion(qIndex)}
										>
											<TrashIcon className='h-4 w-4 text-red-600' />
										</Button>
									</div>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label>Savol turi</Label>
											<select
												value={question.question_type}
												onChange={e =>
													updateQuestion(
														qIndex,
														'question_type',
														e.target.value
													)
												}
												className='w-full p-2 border rounded-md'
											>
												<option value='mcq'>Ko&apos;p tanlovli</option>
												<option value='true_false'>
													To&apos;g&apos;ri/Noto&apos;g&apos;ri
												</option>
												<option value='short_text'>Qisqa matn</option>
												<option value='essay'>Essay</option>
											</select>
										</div>

										<div className='space-y-2'>
											<Label>Ball</Label>
											<Input
												type='number'
												value={question.points}
												onChange={e =>
													updateQuestion(
														qIndex,
														'points',
														parseFloat(e.target.value)
													)
												}
												min='0'
												step='0.5'
											/>
										</div>
									</div>

									<div className='space-y-2'>
										<Label>Savol matni *</Label>
										<textarea
											value={question.question_text}
											onChange={e =>
												updateQuestion(qIndex, 'question_text', e.target.value)
											}
											placeholder='Savolni kiriting...'
											className='w-full p-2 border rounded-md min-h-20'
											required
										/>
									</div>

									{question.question_type === 'mcq' && (
										<div className='space-y-2'>
											<div className='flex justify-between items-center'>
												<Label>Javob variantlari</Label>
												<Button
													type='button'
													variant='outline'
													size='sm'
													onClick={() => addOption(qIndex)}
												>
													<PlusIcon className='h-4 w-4 mr-1' />
													Variant
												</Button>
											</div>
											{question.options?.map((option, oIndex) => (
												<div key={oIndex} className='flex gap-2 items-center'>
													<Input
														value={option.text}
														onChange={e =>
															updateOption(
																qIndex,
																oIndex,
																'text',
																e.target.value
															)
														}
														placeholder={`Variant ${oIndex + 1}`}
													/>
													<input
														type='checkbox'
														checked={option.is_correct}
														onChange={e =>
															updateOption(
																qIndex,
																oIndex,
																'is_correct',
																e.target.checked
															)
														}
														className='rounded'
														title="To'g'ri javob"
													/>
													<Button
														type='button'
														variant='ghost'
														size='sm'
														onClick={() => removeOption(qIndex, oIndex)}
													>
														<TrashIcon className='h-4 w-4 text-red-600' />
													</Button>
												</div>
											))}
										</div>
									)}

									{(question.question_type === 'true_false' ||
										question.question_type === 'short_text') && (
										<div className='space-y-2'>
											<Label>To&apos;g&apos;ri javob</Label>
											<Input
												value={question.correct_answer || ''}
												onChange={e =>
													updateQuestion(
														qIndex,
														'correct_answer',
														e.target.value
													)
												}
												placeholder={
													question.question_type === 'true_false'
														? 'true yoki false'
														: "To'g'ri javob"
												}
											/>
										</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</CardContent>
			</Card>

			<div className='flex gap-4'>
				<Button type='button' variant='outline' onClick={() => router.back()}>
					Bekor qilish
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={loading || !testData.title || questions.length === 0}
				>
					{loading ? 'Saqlanmoqda...' : 'Testni saqlash'}
				</Button>
			</div>
		</div>
	)
}
