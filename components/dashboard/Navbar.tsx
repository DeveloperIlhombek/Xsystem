'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
	ArrowRightOnRectangleIcon,
	Bars3Icon,
	UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export function Navbar() {
	const { user, logout } = useAuth()
	const [showUserMenu, setShowUserMenu] = useState(false)

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
		<div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
			<button type='button' className='-m-2.5 p-2.5 text-gray-700 lg:hidden'>
				<span className='sr-only'>Open sidebar</span>
				<Bars3Icon className='h-6 w-6' aria-hidden='true' />
			</button>

			<div className='h-6 w-px bg-gray-200 lg:hidden' aria-hidden='true' />

			<div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
				<div className='flex flex-1 items-center'>
					{/* Search can be added here */}
				</div>

				<div className='flex items-center gap-x-4 lg:gap-x-6'>
					{/* User menu */}
					<div className='relative'>
						<button
							type='button'
							className='flex items-center gap-x-2 p-2 rounded-md hover:bg-gray-50'
							onClick={() => setShowUserMenu(!showUserMenu)}
						>
							<span className='hidden lg:flex lg:items-center'>
								<span
									className='text-sm font-semibold text-gray-900'
									aria-hidden='true'
								>
									{user?.full_name}
								</span>
								<span className='ml-2 text-xs text-gray-500'>
									{user?.role ? getRoleName(user.role) : ''}
								</span>
							</span>
							<UserCircleIcon
								className='h-8 w-8 text-gray-400'
								aria-hidden='true'
							/>
						</button>

						{showUserMenu && (
							<div className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
								<div className='p-4 border-b'>
									<p className='text-sm font-medium text-gray-900'>
										{user?.full_name}
									</p>
									<p className='text-xs text-gray-500'>{user?.email}</p>
									<p className='text-xs text-gray-400 mt-1'>
										{user?.role ? getRoleName(user.role) : ''}
									</p>
								</div>
								<div className='py-1'>
									<button
										onClick={() => {
											setShowUserMenu(false)
											logout()
										}}
										className='flex w-full items-center gap-x-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50'
									>
										<ArrowRightOnRectangleIcon className='h-5 w-5' />
										Chiqish
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Quick Logout Button */}
					<Button
						variant='outline'
						size='sm'
						onClick={logout}
						className='hidden md:flex items-center gap-2'
					>
						<ArrowRightOnRectangleIcon className='h-4 w-4' />
						Chiqish
					</Button>
				</div>
			</div>
		</div>
	)
}
