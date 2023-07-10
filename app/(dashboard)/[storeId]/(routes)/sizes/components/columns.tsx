'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Size } from '@prisma/client';

export type SizeColumn = Pick<Size, 'name' | 'value'> & { createdAt: string };

export const columns: ColumnDef<SizeColumn>[] = [
	{ accessorKey: 'name', header: 'Name' },
	{ accessorKey: 'value', header: 'Value' },
	{ accessorKey: 'createdAt', header: 'Date' },
	{ id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> },
];
