/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
	private baseURL: string

	constructor(baseURL: string) {
		this.baseURL = baseURL
	}

	private getHeaders(): HeadersInit {
		const token =
			typeof window !== 'undefined'
				? localStorage.getItem('access_token')
				: null
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'ngrok-skip-browser-warning': 'true', // Ngrok warning skip qilish
		}
		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}
		return headers
	}

	private async request<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`
		const config: RequestInit = {
			...options,
			headers: {
				...this.getHeaders(),
				...options?.headers,
			},
		}

		try {
			const response = await fetch(url, config)

			// Check if response is HTML (ngrok warning page)
			const contentType = response.headers.get('content-type')
			if (contentType && contentType.includes('text/html')) {
				throw new Error(
					'Received HTML instead of JSON - check your API URL or ngrok configuration'
				)
			}

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.detail || 'Request failed')
			}

			return await response.json()
		} catch (error) {
			throw error
		}
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' })
	}

	async post<T>(endpoint: string, data?: any): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	async put<T>(endpoint: string, data?: any): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' })
	}
}

export const api = new ApiClient(API_URL)

// Specific API methods
export const authApi = {
	login: (username: string, password: string) => {
		const formData = new URLSearchParams()
		formData.append('username', username)
		formData.append('password', password)
		return fetch(`${API_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'ngrok-skip-browser-warning': 'true',
			},
			body: formData,
		}).then(res => res.json())
	},
	register: (data: any) => api.post('/api/v1/auth/register', data),
	telegramAuth: (data: any) => api.post('/api/v1/auth/telegram', data),
	getMe: () => api.get('/api/v1/auth/me'),
}

export const usersApi = {
	getUsers: (skip = 0, limit = 100) =>
		api.get(`/api/v1/users?skip=${skip}&limit=${limit}`),
	getUser: (userId: number) => api.get(`/api/v1/users/${userId}`),
	updateUser: (userId: number, data: any) =>
		api.put(`/api/v1/users/${userId}`, data),
	deleteUser: (userId: number) => api.delete(`/api/v1/users/${userId}`),
}
