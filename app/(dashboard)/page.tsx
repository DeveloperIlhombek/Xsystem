import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Page() {
	return (
		<div>
			<Button className='mx-auto mt-24' variant={'secondary'}>
				<Link href={'/register'}>Register</Link>
			</Button>
			<Button className='mx-auto mt-24' variant={'secondary'}>
				<Link href={'/telegram-auth'}>Register</Link>
			</Button>
			<Button className='mx-auto mt-24' variant={'secondary'}>
				<Link href={'/login'}>Register</Link>
			</Button>
		</div>
	)
}

export default Page
