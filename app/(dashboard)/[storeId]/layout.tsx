import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismadb';

type DashboardLayoutProps = {
	children: React.ReactNode;
	params: { storeId: string };
};

export default async function DashboardLayout({
	children,
	params,
}: DashboardLayoutProps) {
	const { userId } = auth();
	if (!userId) return redirect('/signin');

	const store = await prismadb.store.findFirst({
		where: { id: params.storeId, userId },
	});

	if (!store) return redirect('/');

	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
