import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { MainNav } from '@/components/main-nav';
import StoreSwitcher from './store-switcher';
import prismadb from '@/lib/prismadb';

export default async function Navbar() {
	const { userId } = auth();
	if (!userId) return redirect('/sign-in');

	const stores = await prismadb.store.findMany({ where: { userId } });

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher stores={stores} />
				<MainNav className='mx-6' />

				<div className='ml-auto'>
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	);
}
