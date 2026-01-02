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
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function ProfilePage() {
	const { user } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		full_name: user?.full_name || '',
		email: user?.email || '',
		phone: '',
	})
	const [message, setMessage] = useState('')

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setMessage('')

		try {
			// API call to update profile
			setMessage('Profil muvaffaqiyatli yangilandi!')
			setIsEditing(false)
		} catch (error) {
			setMessage(`Xatolik yuz berdi. Qaytadan urinib ko'ring.${error}`)
		}
	}

	const getRoleName = (role: string) => {
		const roles: Record<string, string> = {
			super_admin: 'Super Admin',
			admin: 'Admin',
			teacher: "O'qituvchi",
			student: "O'quvchi",
			parent: 'Ota-ona',
		}
		return roles[role] || role
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-gray-900'>Profil</h1>
				<p className='text-gray-600 mt-1'>
					Shaxsiy ma&apos;lumotlaringizni boshqaring
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Profile Card */}
				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
						<CardDescription>
							Ma&apos;lumotlaringizni ko&apos;rish va tahrirlash
						</CardDescription>
					</CardHeader>
					<CardContent>
						{message && (
							<Alert className='mb-4'>
								<AlertDescription>{message}</AlertDescription>
							</Alert>
						)}

						{isEditing ? (
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='full_name'>To&apos;liq ism</Label>
									<Input
										id='full_name'
										value={formData.full_name}
										onChange={e => handleChange('full_name', e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										value={formData.email}
										onChange={e => handleChange('email', e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Telefon</Label>
									<Input
										id='phone'
										value={formData.phone}
										onChange={e => handleChange('phone', e.target.value)}
										placeholder='+998 90 123 45 67'
									/>
								</div>
								<div className='flex gap-2'>
									<Button type='submit'>Saqlash</Button>
									<Button
										type='button'
										variant='outline'
										onClick={() => setIsEditing(false)}
									>
										Bekor qilish
									</Button>
								</div>
							</form>
						) : (
							<div className='space-y-4'>
								<div className='flex justify-between py-3 border-b'>
									<span className='text-gray-600'>To&apos;liq ism:</span>
									<span className='font-medium'>{user?.full_name}</span>
								</div>
								<div className='flex justify-between py-3 border-b'>
									<span className='text-gray-600'>Username:</span>
									<span className='font-medium'>{user?.username}</span>
								</div>
								<div className='flex justify-between py-3 border-b'>
									<span className='text-gray-600'>Email:</span>
									<span className='font-medium'>
										{user?.email || 'Kiritilmagan'}
									</span>
								</div>
								<div className='flex justify-between py-3 border-b'>
									<span className='text-gray-600'>Rol:</span>
									<span className='font-medium'>
										{getRoleName(user?.role || '')}
									</span>
								</div>
								{user?.telegram_id && (
									<div className='flex justify-between py-3 border-b'>
										<span className='text-gray-600'>Telegram ID:</span>
										<span className='font-medium'>{user.telegram_id}</span>
									</div>
								)}
								<div className='flex justify-between py-3 border-b'>
									<span className='text-gray-600'>
										Ro&apos;yxatdan o&apos;tgan:
									</span>
									<span className='font-medium'>
										{user?.created_at
											? new Date(user.created_at).toLocaleDateString('uz-UZ')
											: '-'}
									</span>
								</div>
								<Button onClick={() => setIsEditing(true)}>Tahrirlash</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Security Card */}
				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Xavfsizlik</CardTitle>
							<CardDescription>Parol va xavfsizlik sozlamalari</CardDescription>
						</CardHeader>
						<CardContent className='space-y-3'>
							<Button variant='outline' className='w-full'>
								Parolni o&apos;zgartirish
							</Button>
							<Button variant='outline' className='w-full'>
								2FA yoqish
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Hisob holati</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-600'>Status:</span>
									<span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs'>
										{user?.is_active ? 'Faol' : 'Nofaol'}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-600'>Tasdiqlangan:</span>
									<span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
										{user?.is_active ? 'Ha' : "Yo'q"}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
