import { format } from 'date-fns';

import { SizeClient } from './components/client';
import { SizeColumn } from './components/columns';
import prismadb from '@/lib/prismadb';

type SizesPageProps = { params: { storeId: string } };

export default async function SizesPage({ params }: SizesPageProps) {
	const sizes = await prismadb.size.findMany({
		where: params,
		orderBy: { createdAt: 'desc' },
	});

	const formattedSizes: SizeColumn[] = sizes.map((size) => ({
		...size,
		createdAt: format(size.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className='p-8 pt-6 space-y-4'>
			<SizeClient data={formattedSizes} />
		</div>
	);
}
