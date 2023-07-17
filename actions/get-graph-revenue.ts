import { GraphData } from '@/types/common';
import prismadb from '@/lib/prismadb';

export const getGraphRevenue = async (storeId: string) => {
	const paidOrders = await prismadb.order.findMany({
		where: { storeId, isPaid: true },
		include: { orderItems: { include: { product: true } } },
	});

	const monthlyRevenue = paidOrders.reduce<Record<number, number>>(
		(revenue, order) => {
			const month = order.createdAt.getMonth();
			const revenueForOrder = order.orderItems.reduce(
				(total, item) => total + item.product.price.toNumber(),
				0
			);

			revenue[month] = (revenue[month] ?? 0) + revenueForOrder;
			return revenue;
		},
		{}
	);

	const graphData: GraphData[] = [
		{ name: 'Jan', total: 0 },
		{ name: 'Feb', total: 0 },
		{ name: 'Mar', total: 0 },
		{ name: 'Apr', total: 0 },
		{ name: 'May', total: 0 },
		{ name: 'Jun', total: 0 },
		{ name: 'Jul', total: 0 },
		{ name: 'Aug', total: 0 },
		{ name: 'Sep', total: 0 },
		{ name: 'Oct', total: 0 },
		{ name: 'Nov', total: 0 },
		{ name: 'Dec', total: 0 },
	];

	for (const month in monthlyRevenue) {
		graphData[Number(month)].total = monthlyRevenue[Number(month)];
	}

	return graphData;
};
