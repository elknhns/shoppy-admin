import { format } from 'date-fns';

import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';
import prismadb from '@/lib/prismadb';

type BillboardsPageProps = { params: { storeId: string } };

export default async function BillboardsPage({ params }: BillboardsPageProps) {
	const billboards = await prismadb.billboard.findMany({
		where: params,
		orderBy: { createdAt: 'desc' },
	});

	const formattedBillboards: BillboardColumn[] = billboards.map(
		(billboard) => ({
			...billboard,
			createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
		})
	);

	return (
		<div className='p-8 pt-6 space-y-4'>
			<BillboardClient data={formattedBillboards} />
		</div>
	);
}
