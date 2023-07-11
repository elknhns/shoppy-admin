'use client';

import { Color } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ColorColumn = Pick<Color, 'id' | 'name' | 'value'> & {
	createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
	{ accessorKey: 'name', header: 'Name' },

	{
		accessorKey: 'value',
		header: 'Value',

		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.value}

				<div
					style={{ backgroundColor: row.original.value }}
					className='h-6 w-6 rounded-full border'
				/>
			</div>
		),
	},

	{ accessorKey: 'createdAt', header: 'Date' },
	{ id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> },
];
