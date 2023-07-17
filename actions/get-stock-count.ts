import prismadb from '@/lib/prismadb';

export const getStockCount = (storeId: string) =>
	prismadb.product.count({
		where: { storeId, isArchived: false },
	});
