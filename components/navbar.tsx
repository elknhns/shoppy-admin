import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { MainNav } from '@/components/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import prismadb from '@/lib/prismadb';
import StoreSwitcher from '@/components/store-switcher';

export default async function Navbar() {
	const { userId } = auth();
	if (!userId) return redirect('/sign-in');

	const stores = await prismadb.store.findMany({ where: { userId } });

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher stores={stores} />
				<MainNav className='mx-6' />

				<div className='flex items-center gap-x-4 ml-auto'>
					<ThemeToggle />
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	);
}
