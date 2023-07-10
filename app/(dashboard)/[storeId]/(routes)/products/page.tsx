import { format } from 'date-fns';

import { formatter } from '@/lib/utils';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import prismadb from '@/lib/prismadb';

type ProductsPageProps = { params: { storeId: string } };

export default async function ProductsPage({ params }: ProductsPageProps) {
	const products = await prismadb.product.findMany({
		where: params,
		include: { category: true, size: true, color: true },
		orderBy: { createdAt: 'desc' },
	});

	const formattedProducts: ProductColumn[] = products.map(
		({ category, size, color, createdAt, price, ...rest }) => ({
			...rest,
			price: formatter.format(price.toNumber()),
			category: category.name,
			size: size.name,
			color: color.value,
			createdAt: format(createdAt, 'MMMM do, yyyy'),
		})
	);

	return (
		<div className='p-8 pt-6 space-y-4'>
			<ProductClient data={formattedProducts} />
		</div>
	);
}
