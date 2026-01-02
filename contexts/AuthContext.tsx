'use client'

import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
	id: number
	username: string
	email?: string
	full_name: string
	role: string
	telegram_id?: string
	is_active: boolean
	created_at: string
}

interface AuthContextType {
	user: User | null
	loading: boolean
	login: (username: string, password: string) => Promise<void>
	register: (userData: RegisterData) => Promise<void>
	telegramAuth: (telegramData: TelegramAuthData) => Promise<void>
	logout: () => void
}

interface RegisterData {
	username: string
	email?: string
	password: string
	full_name: string
	role: string
	phone?: string
}

interface TelegramAuthData {
	telegram_id: string
	username: string
	full_name: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem('access_token')
			if (token) {
				try {
					const res = await fetch(`${API_URL}/api/v1/auth/me`, {
						headers: {
							Authorization: `Bearer ${token}`,
							'ngrok-skip-browser-warning': 'true', // Ngrok warning skip qilish
						},
					})

					// Check if response is HTML (ngrok warning page)
					const contentType = res.headers.get('content-type')
					if (contentType && contentType.includes('text/html')) {
						console.error(
							'Received HTML instead of JSON - likely ngrok warning'
						)
						// Don't clear tokens, just set loading false
						setLoading(false)
						return
					}

					if (res.ok) {
						const data = await res.json()
						setUser(data)
					} else {
						localStorage.removeItem('access_token')
						localStorage.removeItem('refresh_token')
					}
				} catch (err) {
					console.error('Auth check failed:', err)
				}
			}
			setLoading(false)
		}
		checkAuth()
	}, [])
	const login = async (username: string, password: string) => {
		const formData = new URLSearchParams()
		formData.append('username', username)
		formData.append('password', password)

		const res = await fetch(`${API_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'ngrok-skip-browser-warning': 'true',
			},
			body: formData,
		})

		if (!res.ok) {
			const error = await res.json()
			throw new Error(error.detail || 'Login failed')
		}

		const data = await res.json()
		localStorage.setItem('access_token', data.access_token)
		localStorage.setItem('refresh_token', data.refresh_token)

		// Manually set user after login
		const userRes = await fetch(`${API_URL}/api/v1/auth/me`, {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (userRes.ok) {
			const userData = await userRes.json()
			setUser(userData)
			router.push('/dashboard')
		} else {
			throw new Error('Failed to fetch user data')
		}
	}

	const register = async (userData: RegisterData) => {
		const res = await fetch(`${API_URL}/api/v1/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
			},
			body: JSON.stringify(userData),
		})

		if (!res.ok) {
			const error = await res.json()
			throw new Error(error.detail || 'Registration failed')
		}

		return await res.json()
	}

	const telegramAuth = async (telegramData: TelegramAuthData) => {
		const res = await fetch(`${API_URL}/api/v1/auth/telegram`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
			},
			body: JSON.stringify(telegramData),
		})

		if (!res.ok) throw new Error('Telegram auth failed')

		const data = await res.json()
		localStorage.setItem('access_token', data.access_token)
		localStorage.setItem('refresh_token', data.refresh_token)

		// Manually set user after telegram auth
		const userRes = await fetch(`${API_URL}/api/v1/auth/me`, {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (userRes.ok) {
			const userData = await userRes.json()
			setUser(userData)
			router.push('/dashboard')
		} else {
			throw new Error('Failed to fetch user data')
		}
	}

	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		setUser(null)
		router.push('/login')
	}

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, telegramAuth, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}
