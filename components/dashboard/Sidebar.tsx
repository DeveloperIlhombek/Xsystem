'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
	AcademicCapIcon,
	BookOpenIcon,
	ClipboardDocumentCheckIcon,
	Cog6ToothIcon,
	HomeIcon,
	UserCircleIcon,
	UsersIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: HomeIcon,
		roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'],
	},
	{
		name: 'Testlar',
		href: '/test',
		icon: ClipboardDocumentCheckIcon,
		roles: ['super_admin', 'admin', 'teacher', 'student'],
	},
	{
		name: "O'quvchilar",
		href: '/students',
		icon: UsersIcon,
		roles: ['super_admin', 'admin', 'teacher'],
	},
	{
		name: "O'qituvchilar",
		href: '/teachers',
		icon: AcademicCapIcon,
		roles: ['super_admin', 'admin'],
	},
	{
		name: 'Kurslar',
		href: '/courses',
		icon: BookOpenIcon,
		roles: ['super_admin', 'admin', 'teacher', 'student'],
	},
	{
		name: 'Profil',
		href: '/profile',
		icon: UserCircleIcon,
		roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'],
	},
	{
		name: 'Sozlamalar',
		href: '/settings',
		icon: Cog6ToothIcon,
		roles: ['super_admin', 'admin'],
	},
]

export function Sidebar() {
	const pathname = usePathname()
	const { user } = useAuth()

	const filteredNavigation = navigation.filter(
		item => user?.role && item.roles.includes(user.role)
	)

	return (
		<div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col'>
			<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4'>
				<div className='flex h-16 shrink-0 items-center'>
					<h1 className='text-xl font-bold text-blue-600'>
						O&apos;quv Markazi
					</h1>
				</div>
				<nav className='flex flex-1 flex-col'>
					<ul role='list' className='flex flex-1 flex-col gap-y-7'>
						<li>
							<ul role='list' className='-mx-2 space-y-1'>
								{filteredNavigation.map(item => {
									const isActive =
										pathname === item.href ||
										pathname?.startsWith(item.href + '/')
									return (
										<li key={item.name}>
											<Link
												href={item.href}
												className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${
														isActive
															? 'bg-blue-50 text-blue-600'
															: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
													}
                        `}
											>
												<item.icon
													className={`h-6 w-6 shrink-0 ${
														isActive
															? 'text-blue-600'
															: 'text-gray-400 group-hover:text-blue-600'
													}`}
													aria-hidden='true'
												/>
												{item.name}
											</Link>
										</li>
									)
								})}
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	)
}
