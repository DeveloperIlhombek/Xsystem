'use client'

import { StatsCard } from '@/components/dashboard/StatsCard'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
	const { user } = useAuth()

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
				<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
				<p className='text-gray-600 mt-1'>Xush kelibsiz, {user?.full_name}!</p>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<StatsCard
					title="Umumiy O'quvchilar"
					value='150'
					description='+12 oxirgi oyda'
					trend='up'
				/>
				<StatsCard
					title="O'qituvchilar"
					value='24'
					description='+3 oxirgi oyda'
					trend='up'
				/>
				<StatsCard
					title='Kurslar'
					value='18'
					description='Faol kurslar'
					trend='neutral'
				/>
				<StatsCard
					title='Davomat'
					value='94%'
					description='Bu oyda'
					trend='up'
				/>
			</div>

			{/* User Info Card */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Foydalanuvchi ma&apos;lumotlari</CardTitle>
						<CardDescription>
							Sizning shaxsiy ma&apos;lumotlaringiz
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-3'>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Ism:</span>
							<span className='font-medium'>{user?.full_name}</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Username:</span>
							<span className='font-medium'>{user?.username}</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Email:</span>
							<span className='font-medium'>
								{user?.email || 'Kiritilmagan'}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Rol:</span>
							<span className='font-medium'>
								{getRoleName(user?.role || '')}
							</span>
						</div>
						{user?.telegram_id && (
							<div className='flex justify-between'>
								<span className='text-gray-600'>Telegram ID:</span>
								<span className='font-medium'>{user.telegram_id}</span>
							</div>
						)}
						<div className='flex justify-between'>
							<span className='text-gray-600'>Status:</span>
							<span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
								Faol
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Oxirgi faollik</CardTitle>
						<CardDescription>Sizning oxirgi harakatlaringiz</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-start space-x-3'>
								<div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
								<div className='flex-1'>
									<p className='text-sm font-medium'>Tizimga kirish</p>
									<p className='text-xs text-gray-500'>Hozir</p>
								</div>
							</div>
							<div className='flex items-start space-x-3'>
								<div className='w-2 h-2 bg-green-600 rounded-full mt-2'></div>
								<div className='flex-1'>
									<p className='text-sm font-medium'>Profil ko&apos;rildi</p>
									<p className='text-xs text-gray-500'>5 daqiqa oldin</p>
								</div>
							</div>
							<div className='flex items-start space-x-3'>
								<div className='w-2 h-2 bg-yellow-600 rounded-full mt-2'></div>
								<div className='flex-1'>
									<p className='text-sm font-medium'>
										Ma&apos;lumotlar yangilandi
									</p>
									<p className='text-xs text-gray-500'>1 soat oldin</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Role-based content */}
			{user?.role === 'super_admin' || user?.role === 'admin' ? (
				<Card>
					<CardHeader>
						<CardTitle>Tizim statistikasi</CardTitle>
						<CardDescription>Umumiy tizim ma&apos;lumotlari</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<div className='text-center p-4 bg-blue-50 rounded-lg'>
								<p className='text-2xl font-bold text-blue-600'>150</p>
								<p className='text-sm text-gray-600'>O&apos;quvchilar</p>
							</div>
							<div className='text-center p-4 bg-green-50 rounded-lg'>
								<p className='text-2xl font-bold text-green-600'>24</p>
								<p className='text-sm text-gray-600'>O&apos;qituvchilar</p>
							</div>
							<div className='text-center p-4 bg-purple-50 rounded-lg'>
								<p className='text-2xl font-bold text-purple-600'>18</p>
								<p className='text-sm text-gray-600'>Kurslar</p>
							</div>
							<div className='text-center p-4 bg-yellow-50 rounded-lg'>
								<p className='text-2xl font-bold text-yellow-600'>42</p>
								<p className='text-sm text-gray-600'>Ota-onalar</p>
							</div>
						</div>
					</CardContent>
				</Card>
			) : null}
		</div>
	)
}
