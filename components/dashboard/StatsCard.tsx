'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
	ArrowDownIcon,
	ArrowUpIcon,
	MinusIcon,
} from '@heroicons/react/24/solid'

interface StatsCardProps {
	title: string
	value: string
	description: string
	trend?: 'up' | 'down' | 'neutral'
}

export function StatsCard({
	title,
	value,
	description,
	trend = 'neutral',
}: StatsCardProps) {
	const getTrendIcon = () => {
		switch (trend) {
			case 'up':
				return <ArrowUpIcon className='h-4 w-4 text-green-600' />
			case 'down':
				return <ArrowDownIcon className='h-4 w-4 text-red-600' />
			default:
				return <MinusIcon className='h-4 w-4 text-gray-400' />
		}
	}

	const getTrendColor = () => {
		switch (trend) {
			case 'up':
				return 'text-green-600'
			case 'down':
				return 'text-red-600'
			default:
				return 'text-gray-500'
		}
	}

	return (
		<Card>
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-600'>{title}</p>
						<p className='text-3xl font-bold text-gray-900 mt-2'>{value}</p>
						<div className='flex items-center gap-1 mt-2'>
							{getTrendIcon()}
							<p className={`text-sm ${getTrendColor()}`}>{description}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
