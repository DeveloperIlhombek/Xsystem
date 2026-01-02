/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import React, { useState } from 'react'

export function RegisterForm() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		full_name: '',
		role: 'student',
	})
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const { register } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)

		try {
			await register(formData)
			setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kirish mumkin.")
			setFormData({
				username: '',
				email: '',
				password: '',
				full_name: '',
				role: 'student',
			})
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{success && (
				<Alert>
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			)}

			<div className='space-y-2'>
				<Label htmlFor='full_name'>To&apos;liq ism</Label>
				<Input
					id='full_name'
					value={formData.full_name}
					onChange={e => handleChange('full_name', e.target.value)}
					placeholder='Ism Familiya'
					required
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='username'>Foydalanuvchi nomi</Label>
				<Input
					id='username'
					value={formData.username}
					onChange={e => handleChange('username', e.target.value)}
					placeholder='username'
					required
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='email'>Email</Label>
				<Input
					id='email'
					type='email'
					value={formData.email}
					onChange={e => handleChange('email', e.target.value)}
					placeholder='email@example.com'
					required
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='password'>Parol</Label>
				<Input
					id='password'
					type='password'
					value={formData.password}
					onChange={e => handleChange('password', e.target.value)}
					placeholder='********'
					required
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='role'>Rol</Label>
				<select
					id='role'
					value={formData.role}
					onChange={e => handleChange('role', e.target.value)}
					className='w-full p-2 border rounded-md'
				>
					<option value='student'>O&apos;quvchi</option>
					<option value='teacher'>O&apos;qituvchi</option>
					<option value='parent'>Ota-ona</option>
					<option value='admin'>Admin</option>
				</select>
			</div>

			<Button type='submit' disabled={loading} className='w-full'>
				{loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
			</Button>
		</form>
	)
}
