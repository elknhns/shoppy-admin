import prismadb from '@/lib/prismadb';

export const getSalesCount = (storeId: string) =>
	prismadb.order.count({
		where: { storeId, isPaid: true },
	});
