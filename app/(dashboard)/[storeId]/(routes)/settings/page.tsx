import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { SettingsForm } from './components/settings-form';
import prismadb from '@/lib/prismadb';

type SettingsPageProps = { params: { storeId: string } };

export default async function SettingsPage({ params }: SettingsPageProps) {
	const { userId } = auth();
	if (!userId) return redirect('/sign-in');

	const store = await prismadb.store.findFirst({
		where: { id: params.storeId, userId },
	});

	if (!store) return redirect('/');

	return (
		<div className='p-8 pt-6 space-y-4'>
			<SettingsForm initialData={store} />
		</div>
	);
}
