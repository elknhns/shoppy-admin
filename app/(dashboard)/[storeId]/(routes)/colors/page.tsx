import { format } from 'date-fns';

import { ColorColumn } from './components/columns';
import { ColorClient } from './components/client';
import prismadb from '@/lib/prismadb';

type ColorsPageProps = { params: { storeId: string } };

export default async function ColorsPage({ params }: ColorsPageProps) {
	const colors = await prismadb.color.findMany({
		where: params,
		orderBy: { createdAt: 'desc' },
	});

	const formattedSizes: ColorColumn[] = colors.map((color) => ({
		...color,
		createdAt: format(color.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className='p-8 pt-6 space-y-4'>
			<ColorClient data={formattedSizes} />
		</div>
	);
}
