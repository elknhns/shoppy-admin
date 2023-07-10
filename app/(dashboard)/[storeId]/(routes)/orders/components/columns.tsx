'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@prisma/client';

export type OrderColumn = Pick<Order, 'phone' | 'address'> & {
	totalPrice: string;
	createdAt: string;
	products: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{ accessorKey: 'products', header: 'Products' },
	{ accessorKey: 'phone', header: 'Phone' },
	{ accessorKey: 'address', header: 'Address' },
	{ accessorKey: 'totalPrice', header: 'Total price' },
	{ accessorKey: 'isPaid', header: 'Paid' },
];
