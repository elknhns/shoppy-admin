import { format } from 'date-fns';

import { CategoryClient } from './components/client';
import { CategoryColumn } from './components/columns';
import prismadb from '@/lib/prismadb';

type CategoriesPageProps = { params: { storeId: string } };

export default async function CategoriesPage({ params }: CategoriesPageProps) {
	const categories = await prismadb.category.findMany({
		where: params,
		include: { billboard: true },
		orderBy: { createdAt: 'desc' },
	});

	const formattedCategories: CategoryColumn[] = categories.map(
		({ createdAt, billboard, ...rest }) => ({
			...rest,
			billboardLabel: billboard.label,
			createdAt: format(createdAt, 'MMMM do, yyyy'),
		})
	);

	return (
		<div className='p-8 pt-6 space-y-4'>
			<CategoryClient data={formattedCategories} />
		</div>
	);
}
