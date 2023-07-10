import { format } from 'date-fns';

import { OrderClient } from './components/client';
import { formatter } from '@/lib/utils';
import { OrderColumn } from './components/columns';
import prismadb from '@/lib/prismadb';

type OrdersPageProps = { params: { storeId: string } };

export default async function OrdersPage({ params }: OrdersPageProps) {
	const orders = await prismadb.order.findMany({
		where: params,
		include: { orderItems: { include: { product: true } } },
		orderBy: { createdAt: 'desc' },
	});

	const formattedOrders: OrderColumn[] = orders.map((order) => ({
		...order,
		products: order.orderItems.map((item) => item.product.name).join(', '),

		totalPrice: formatter.format(
			order.orderItems.reduce(
				(total, item) => total + Number(item.product.price),
				0
			)
		),

		createdAt: format(order.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className='p-8 pt-6 space-y-4'>
			<OrderClient data={formattedOrders} />
		</div>
	);
}
